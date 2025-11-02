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
      // Load model
      this.model = await tf.loadLayersModel('file://models/alzheimers_model.h5');
      
      // Load scaler stats (mean and std)
      const scalerPath = path.join(__dirname, '../models/scaler_stats.json');
      const scalerData = JSON.parse(fs.readFileSync(scalerPath, 'utf8'));
      this.scaler = scalerData;
      
      // Load feature mapping
      const featurePath = path.join(__dirname, '../data/features_mapping.json');
      this.featureMapping = JSON.parse(fs.readFileSync(featurePath, 'utf8'));
      
      console.log('✓ Model and preprocessing loaded');
    } catch (error) {
      console.error('Error initializing model:', error);
    }
  }
  
  normalizeFeatures(features) {
    return features.map((feature, idx) => {
      const mean = this.scaler.mean[idx];
      const std = this.scaler.std[idx];
      return (feature - mean) / (std + 1e-7);
    });
  }
  
  async predictADRisk(cognitiveTestData) {
    if (!this.model) await this.initialize();
    
    try {
      // Extract features from test data
      const features = this.extractFeaturesFromTest(cognitiveTestData);
      
      // Normalize
      const normalized = this.normalizeFeatures(features);
      
      // Create tensor
      const input = tf.tensor2d([normalized], [1, normalized.length]);
      
      // Predict
      const prediction = this.model.predict(input);
      const probAD = await prediction.data();
      const probability = probAD;
      
      // Determine risk level
      let riskLevel = 'LOW';
      if (probability > 0.75) riskLevel = 'HIGH';
      else if (probability > 0.50) riskLevel = 'MEDIUM';
      
      // Cleanup
      input.dispose();
      prediction.dispose();
      
      return {
        probabilityAD: Math.round(probability * 10000) / 10000,
        riskLevel,
        hasAD: probability > 0.5,
        timestamp: new Date(),
        modelVersion: 'v1.0'
      };
    } catch (error) {
      console.error('Prediction error:', error);
      throw error;
    }
  }
  
  extractFeaturesFromTest(testData) {
    // Map test responses to model features
    // This should align with how the model was trained
    
    const features = [];
    
    // Example feature mappings
    features.push(testData.scores?.memory || 0);           // Memory score
    features.push(testData.scores?.attention || 0);        // Attention score
    features.push(testData.scores?.orientation || 0);      // Orientation score
    features.push(testData.scores?.visuospatial || 0);     // Visuospatial score
    features.push(testData.scores?.language || 0);         // Language score
    
    // Add more cognitive metrics
    features.push(testData.memory_recall?.correctCount || 0);
    features.push(testData.trail_making?.errors || 0);
    features.push(testData.letter_tap?.accuracy || 0);
    
    // Pad with zeros if needed
    while (features.length < 32) {
      features.push(0);
    }
    
    return features.slice(0, 32);
  }
}

module.exports = new ModelService();
