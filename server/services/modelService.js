// services/modelService.js
const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
const path = require('path');

class ModelService {
  constructor() {
    this.model = null;
    this.scaler = null;
    this.featureMapping = null;
  }

  async initialize() {
    try {
      const modelJsonPath = path.join(__dirname, '../models/model/model.json');
      this.model = await tf.loadLayersModel(`file://${modelJsonPath}`);

      const scalerPath = path.join(__dirname, '../models/scaler_stats.json');
      this.scaler = JSON.parse(fs.readFileSync(scalerPath, 'utf8'));

      const featurePath = path.join(__dirname, '../models/features_mapping.json');
      this.featureMapping = JSON.parse(fs.readFileSync(featurePath, 'utf8'));

      console.log('✓ Model and preprocessing loaded');
    } catch (error) {
      console.error('Error initializing model:', error);
      this.model = null;
    }
  }

  normalize(features) {
    if (!this.scaler) return features;
    const mins = this.scaler.min || [];
    const maxs = this.scaler.max || [];
    return features.map((feature, idx) => {
      const min = mins[idx] ?? 0;
      const max = maxs[idx] ?? 1;
      const range = (max - min);
      return (feature - min) / (range > 1e-7 ? range : 1e-7);
    });
  }

  // Encode a patient info object using the same feature order and encoders as training
  encodePatientInfo(patientInfo) {
    const featureOrder = this.featureMapping.featureOrder; // array of columns excluding target & dropped
    const encoders = this.featureMapping.encoders;         // { col: [cat1, cat2, ...] }

    const toYesNo01 = (v) => {
      const s = (v ?? '').toString().trim().toLowerCase();
      if (['yes', 'y', 'true', '1', 'present', 'positive'].includes(s)) return '1';
      if (['no', 'n', 'false', '0', 'absent', 'negative'].includes(s)) return '0';
      return '0';
    };

    const normalizeGender01 = (g) => {
      const s = (g ?? '').toString().trim().toLowerCase();
      if (['male', 'm'].includes(s)) return '1';
      if (['female', 'f'].includes(s)) return '0';
      return '0';
    };

    const normalizeFromCategories = (value, categories) => {
      // If categories look like ['0','1'] -> use yes/no mapping
      if (categories.length === 2 && categories.includes('0') && categories.includes('1')) {
        const bin = toYesNo01(value);
        return bin;
      }
      // If categories look like ['0','1','2','3'] map from known strings
      const fourCat = ['0','1','2','3'];
      if (categories.length === 4 && fourCat.every(c => categories.includes(c))) {
        const s = (value ?? '').toString().trim().toLowerCase();
        // Education mapping example
        if (['none', 'primary', 'elementary'].includes(s)) return '0';
        if (['secondary', 'highschool', 'high school'].includes(s)) return '1';
        if (['graduate', 'bachelor', 'college', 'ug'].includes(s)) return '2';
        if (['postgraduate', 'masters', 'phd', 'pg'].includes(s)) return '3';
        // Ethnicity simple fallback buckets
        if (['asian'].includes(s)) return '0';
        if (['black', 'african', 'african american'].includes(s)) return '1';
        if (['hispanic', 'latino', 'latina'].includes(s)) return '2';
        if (['white', 'caucasian'].includes(s)) return '3';
        return '0';
      }
      // Otherwise return raw string
      return (value ?? '').toString().trim();
    };

    const computeAgeYears = (dob) => {
      if (!dob) return null;
      const d = new Date(dob);
      if (isNaN(d.getTime())) return null;
      const now = new Date();
      let age = now.getFullYear() - d.getFullYear();
      const m = now.getMonth() - d.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
      return age;
    };

    const getRaw = (col) => {
      const pi = patientInfo?.personal_information || {};
      const mh = patientInfo?.medical_history || {};
      const map = {
        Gender: normalizeGender01(pi.gender),
        Ethnicity: pi.ethnicity,
        EducationLevel: pi.education_level,
        FamilyHistoryAlzheimers: toYesNo01(mh.family_memory_problems),
        Depression: toYesNo01(mh.mood_status?.sad_or_depressed),
        FunctionalAssessment: mh.daily_activity_difficulty_due_to_thinking,
        MemoryComplaints: toYesNo01(mh.memory_or_thinking_problems?.response),
        PersonalityChanges: toYesNo01(mh.personality_change?.response),
        Forgetfulness: toYesNo01(mh.memory_or_thinking_problems?.response),
        HeadInjury: toYesNo01(mh.balance_problems?.known_cause?.response),
        MMSE: pi.mmse || patientInfo?.mmse,
        Age: computeAgeYears(pi.date_of_birth)
      };
      return map[col];
    };

    const features = [];
    for (const f of featureOrder) {
      // Numeric paths: explicit MMSE or when no encoder is defined (numeric feature like Age if added later)
      if (f === 'MMSE' || !encoders[f]) {
        const raw = getRaw(f);
        const v = parseFloat(raw ?? '0');
        features.push(Number.isFinite(v) ? v : 0);
      } else {
        // Ordinal scalar in [0,1): idx / len based on training categories
        const cats = encoders[f] || [];
        const val = normalizeFromCategories(getRaw(f), cats);
        const idx = Math.max(0, cats.indexOf(val));
        const denom = Math.max(1, cats.length);
        const scalar = idx / denom;
        features.push(scalar);
      }
    }
    return features;
  }

  async predictFromPatientInfo(patientInfo) {
    if (!this.model || !this.featureMapping || !this.scaler) {
      await this.initialize();
    }
    if (!this.model) throw new Error('Model not loaded');

    const features = this.encodePatientInfo(patientInfo);
    const normalized = this.normalize(features);

    const input = tf.tensor2d([normalized], [1, normalized.length]);
    const pred = this.model.predict(input);
    const data = await pred.data();
    let probability;
    if (data.length === 1) {
      probability = data[0];
    } else {
      // If multi-class, probability of AD-like class assumed to be index of label 'AD' if present, else max
      const labels = this.featureMapping.labels || [];
      const idx = labels.indexOf('AD') >= 0 ? labels.indexOf('AD') : data.indexOf(Math.max(...data));
      probability = data[idx];
    }

    let riskLevel = 'low';
    if (probability > 0.75) riskLevel = 'high';
    else if (probability > 0.5) riskLevel = 'medium';

    input.dispose();
    pred.dispose();

    return {
      isAD: probability > 0.5,
      probability: Math.round(probability * 10000) / 10000,
      riskLevel,
      modelVersion: 'nn_v1',
      predictedAt: new Date()
    };
  }
}

module.exports = new ModelService();
