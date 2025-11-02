/*
Train a neural network on the CSV dataset and save:
- TFJS model to server/models/model.json (+weights)
- scaler stats (mean,std per feature) to server/models/scaler_stats.json
- feature mapping (one-hot categories and feature order) to server/models/features_mapping.json

Usage (from repository root):
  node server/scripts/train_model.js \
    --csv /home/sharath/Desktop/7th_sem_AIML/ad_detection/alzheimers_disease_data.csv
*/

const fs = require('fs');
const path = require('path');
const tf = require('@tensorflow/tfjs-node');
const { parse } = require('csv-parse/sync');

const args = process.argv.slice(2);
function getArg(name, def) {
  const idx = args.indexOf(name);
  if (idx !== -1 && args[idx + 1]) return args[idx + 1];
  return def;
}

const CSV_PATH = getArg('--csv', '/home/sharath/Desktop/7th_sem_AIML/ad_detection/alzheimers_disease_data.csv');

const SIMILAR_ATTRIBUTES = [
  'PatientID',
  'Gender',
  'Ethnicity',
  'EducationLevel',
  'FamilyHistoryAlzheimers',
  'Depression',
  'FunctionalAssessment',
  'MemoryComplaints',
  'PersonalityChanges',
  'Forgetfulness',
  'HeadInjury',
  'Diagnosis',
  'MMSE'
];

const TARGET = 'Diagnosis';
const NUMERIC_COLS = new Set(['MMSE']);
const DROP_COLS = new Set(['PatientID']);

function readCSV(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const records = parse(raw, { columns: true, skip_empty_lines: true });
  return records;
}

function buildEncoders(rows, cols, targetName) {
  // For categorical columns (non-numeric and not target), collect categories
  const encoders = {};
  cols.forEach((col) => {
    if (col === targetName) return;
    if (DROP_COLS.has(col)) return;
    if (!NUMERIC_COLS.has(col)) {
      const set = new Set();
      rows.forEach((r) => {
        const v = (r[col] ?? '').toString().trim();
        if (v.length > 0) set.add(v);
      });
      encoders[col] = Array.from(set).sort();
    }
  });
  return encoders;
}

function encodeRow(row, encoders, featureOrder) {
  const features = [];
  for (const f of featureOrder) {
    if (NUMERIC_COLS.has(f)) {
      const v = parseFloat(row[f] ?? '0');
      features.push(Number.isFinite(v) ? v : 0);
    } else {
      // ordinal scalar in [0,1): index / length
      const cats = encoders[f] || [];
      const val = (row[f] ?? '').toString().trim();
      const idx = Math.max(0, cats.indexOf(val));
      const denom = Math.max(1, cats.length);
      const scalar = idx / denom; // matches [1000]->0, [0100]->0.25 when length=4
      features.push(scalar);
    }
  }
  return features;
}

function minmaxScale(X) {
  const n = X.length;
  const d = X[0].length;
  const min = Array(d).fill(Number.POSITIVE_INFINITY);
  const max = Array(d).fill(Number.NEGATIVE_INFINITY);

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < d; j++) {
      const v = X[i][j];
      if (v < min[j]) min[j] = v;
      if (v > max[j]) max[j] = v;
    }
  }

  const Xn = X.map((row) => row.map((v, j) => (v - min[j]) / (Math.max(1e-7, max[j] - min[j]))));
  return { Xn, min, max };
}

function labelEncode(yArr) {
  const labels = Array.from(new Set(yArr));
  const map = new Map(labels.map((l, i) => [l, i]));
  const yIdx = yArr.map((y) => map.get(y));
  return { yIdx, labels };
}

async function main() {
  console.log('Reading CSV:', CSV_PATH);
  const rows = readCSV(CSV_PATH);

  // Filter to specified attributes only
  const cols = SIMILAR_ATTRIBUTES.filter((c) => rows[0].hasOwnProperty(c));

  if (!cols.includes(TARGET)) {
    throw new Error(`Target column ${TARGET} not found in CSV`);
  }

  // Build encoders and feature order (categoricals expanded to one-hot at encode time)
  const encoders = buildEncoders(rows, cols, TARGET);
  const featureOrder = cols.filter((c) => c !== TARGET && !DROP_COLS.has(c));

  // Encode all rows
  const Xraw = rows.map((r) => encodeRow(r, encoders, featureOrder));
  const yRaw = rows.map((r) => (r[TARGET] ?? '').toString().trim());

  // Min-Max scale to [0,1]
  const { Xn, min, max } = minmaxScale(Xraw);

  // Label encode target
  const { yIdx, labels } = labelEncode(yRaw);
  const numClasses = labels.length;
  const yTensor = numClasses > 2
    ? tf.oneHot(tf.tensor1d(yIdx, 'int32'), numClasses)
    : tf.tensor2d(yIdx.map((v) => [v]));

  const Xtensor = tf.tensor2d(Xn);

  // Split train/val
  const n = Xn.length;
  const idx = tf.util.createShuffledIndices(n);
  const trainCount = Math.floor(n * 0.8);
  const trainIdx = idx.slice(0, trainCount);
  const valIdx = idx.slice(trainCount);

  function subset(t, indices) {
    // Ensure indices are a plain flat int32 array for tf.tensor1d
    const flat = Array.from(indices, (v) => Number(v));
    const idxTensor = tf.tensor1d(flat, 'int32');
    const out = tf.gather(t, idxTensor);
    idxTensor.dispose();
    return out;
  }

  const Xtrain = subset(Xtensor, trainIdx);
  const yTrain = subset(yTensor, trainIdx);
  const Xval = subset(Xtensor, valIdx);
  const yVal = subset(yTensor, valIdx);

  // Build model
  const inputDim = Xtensor.shape[1];
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 64, activation: 'relu', inputShape: [inputDim] }));
  model.add(tf.layers.dropout({ rate: 0.2 }));
  model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
  if (numClasses > 2) {
    model.add(tf.layers.dense({ units: numClasses, activation: 'softmax' }));
    model.compile({ optimizer: tf.train.adam(0.001), loss: 'categoricalCrossentropy', metrics: ['accuracy'] });
  } else {
    model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));
    model.compile({ optimizer: tf.train.adam(0.001), loss: 'binaryCrossentropy', metrics: ['accuracy'] });
  }

  console.log('Training...');
  await model.fit(Xtrain, yTrain, {
    epochs: 30,
    batchSize: 32,
    validationData: [Xval, yVal],
    verbose: 1,
  });

  // Save model and artifacts
  const modelsDir = path.join(__dirname, '..', 'models');
  if (!fs.existsSync(modelsDir)) fs.mkdirSync(modelsDir, { recursive: true });

  const savePath = `file://${path.join(modelsDir, 'model')}`; // will create model.json + weights
  await model.save(savePath);

  const scalerStats = { min, max };
  fs.writeFileSync(path.join(modelsDir, 'scaler_stats.json'), JSON.stringify(scalerStats, null, 2));

  const featuresMapping = {
    featureOrder, // columns before one-hot expansion
    encoders,     // category lists per categorical feature
    labels        // target labels in order used by the model
  };
  fs.writeFileSync(path.join(modelsDir, 'features_mapping.json'), JSON.stringify(featuresMapping, null, 2));

  console.log('Saved model to', savePath);
  console.log('Saved scaler_stats.json and features_mapping.json');

  // cleanup
  tf.dispose([Xtensor, yTensor, Xtrain, yTrain, Xval, yVal]);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
