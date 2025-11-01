// // services/predictionService.js
// const tf = require('@tensorflow/tfjs-node');
// const path = require('path');

// class PredictionService {
//   constructor() {
//     this.model = null;
//     this.features = null;
//     this.scaler = null;
//   }
  
//   async initialize() {
//     try {
//       this.model = await tf.loadLayersModel('file://models/alzheimers_model.h5');
//       console.log('Model loaded successfully');
//     } catch (error) {
//       console.error('Error loading model:', error);
//     }
//   }
  
//   async predictAD(testData) {
//     if (!this.model) await this.initialize();
    
//     // Convert test data to tensor
//     const input = tf.tensor2d([testData], [1, testData.length]);
    
//     // Make prediction
//     const prediction = this.model.predict(input);
//     const probabilityAD = await prediction.data();
    
//     const probability = probabilityAD;
//     const isAD = probability > 0.5;
//     const riskLevel = this.determineRiskLevel(probability);
    
//     // Cleanup
//     input.dispose();
//     prediction.dispose();
    
//     return {
//       isAD,
//       probability: Math.round(probability * 100) / 100,
//       riskLevel,
//       modelVersion: 'v1.0'
//     };
//   }
  
//   determineRiskLevel(probability) {
//     if (probability > 0.75) return 'high';
//     if (probability > 0.50) return 'medium';
//     return 'low';
//   }
// }

// module.exports = new PredictionService();



// services/predictionService.js
class PredictionService {
  async initialize() {
    console.log('Prediction service initialized (TensorFlow disabled)');
  }
  
  async predictADRisk(testData) {
    // Return mock prediction for now
    return {
      isAD: false,
      probability: 0.35,
      riskLevel: 'low',
      modelVersion: 'v1.0-mock'
    };
  }
}

module.exports = new PredictionService();
