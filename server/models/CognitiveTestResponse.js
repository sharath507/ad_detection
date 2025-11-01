// // models/CognitiveTestResponse.js
// const cognitiveTestResponseSchema = new Schema({
//   testId: { type: String, unique: true, required: true },
//   patientId: { type: String, ref: 'PatientInfo', required: true },
//   userId: { type: String, ref: 'User', required: true },
  
//   // Memory Encoding
//   memory_encoding: {
//     words: [String],
//     displayedAt: Date,
//     duration: Number
//   },
  
//   // Trail Making Test
//   trail_making: {
//     time: Number,
//     errors: Number,
//     connections: Number,
//     success: Boolean
//   },
  
//   // Image Naming
//   image_naming: [{
//     imageId: String,
//     userAnswer: String,
//     correctAnswer: String,
//     isCorrect: Boolean,
//     score: Number
//   }],
  
//   // Letter Tap Test
//   letter_tap: {
//     correctTaps: Number,
//     incorrectTaps: Number,
//     missedTaps: Number,
//     totalTargets: Number,
//     accuracy: Number
//   },
  
//   // Serial Subtraction
//   serial_subtraction: [{
//     expected: Number,
//     userAnswer: Number,
//     isCorrect: Boolean
//   }],
  
//   // Clock Drawing
//   clock_drawing: {
//     imageData: String, // base64 encoded canvas image
//     submittedAt: Date,
//     score: Number
//   },
  
//   // Sentence Repetition
//   sentence_repeat: [{
//     sentenceId: String,
//     sentence: String,
//     userTranscript: String,
//     audioFile: String, // path to stored audio
//     recordedAt: Date
//   }],
  
//   // Memory Recall
//   memory_recall: {
//     word1: String,
//     word2: String,
//     word3: String,
//     correctCount: Number
//   },
  
//   // Questions (Orientation, Similarity, etc.)
//   questions: [{
//     questionId: String,
//     question: String,
//     questionType: String,
//     userAnswer: String,
//     correctAnswer: String,
//     isCorrect: Boolean,
//     score: Number,
//     category: String // 'orientation', 'similarity', etc.
//   }],
  
//   // Test Metadata
//   testStartTime: Date,
//   testEndTime: Date,
//   totalDuration: Number,
//   testStatus: { type: String, enum: ['completed', 'incomplete', 'abandoned'] },
  
//   // Calculated Scores
//   totalScore: Number,
//   scores: {
//     memory: Number,
//     attention: Number,
//     orientation: Number,
//     visuospatial: Number,
//     language: Number,
//     similarity: Number
//   },
  
//   // Prediction Result
//   prediction: {
//     isAD: Boolean,
//     probability: Number,
//     riskLevel: { type: String, enum: ['low', 'medium', 'high'] },
//     modelVersion: String,
//     predictedAt: Date
//   },
  
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now }
// });


// models/CognitiveTestResponse.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cognitiveTestResponseSchema = new Schema({
  testId: { type: String, unique: true, required: true },
  patientId: { type: String, ref: 'PatientInfo', required: true },
  userId: { type: String, ref: 'User', required: true },
  
  memory_encoding: {
    words: [String],
    displayedAt: Date,
    duration: Number
  },
  
  trail_making: {
    time: Number,
    errors: Number,
    connections: Number,
    success: Boolean
  },
  
  image_naming: [{
    imageId: String,
    userAnswer: String,
    correctAnswer: String,
    isCorrect: Boolean,
    score: Number
  }],
  
  letter_tap: {
    correctTaps: Number,
    incorrectTaps: Number,
    missedTaps: Number,
    totalTargets: Number,
    accuracy: Number
  },
  
  serial_subtraction: [{
    expected: Number,
    userAnswer: Number,
    isCorrect: Boolean
  }],
  
  clock_drawing: {
    imageData: String,
    submittedAt: Date,
    score: Number
  },
  
  sentence_repeat: [{
    sentenceId: String,
    sentence: String,
    userTranscript: String,
    audioFile: String,
    recordedAt: Date
  }],
  
  memory_recall: {
    word1: String,
    word2: String,
    word3: String,
    correctCount: Number
  },
  
  questions: [{
    questionId: String,
    question: String,
    questionType: String,
    userAnswer: String,
    correctAnswer: String,
    isCorrect: Boolean,
    score: Number,
    category: String
  }],
  
  testStartTime: Date,
  testEndTime: Date,
  totalDuration: Number,
  testStatus: { type: String, enum: ['completed', 'incomplete', 'abandoned'] },
  
  totalScore: Number,
  scores: {
    memory: Number,
    attention: Number,
    orientation: Number,
    visuospatial: Number,
    language: Number,
    similarity: Number
  },
  
  prediction: {
    isAD: Boolean,
    probability: Number,
    riskLevel: { type: String, enum: ['low', 'medium', 'high'] },
    modelVersion: String,
    predictedAt: Date
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CognitiveTestResponse', cognitiveTestResponseSchema);
