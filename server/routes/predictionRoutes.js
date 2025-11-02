// routes/predictionRoutes.js
const express = require('express');
const modelService = require('../services/modelService');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

// Get AD Risk Prediction
router.post('/predict-ad-risk', authenticate, async (req, res) => {
  try {
    const { testId, cognitiveTestData } = req.body;
    
    if (!cognitiveTestData) {
      return res.status(400).json({ error: 'Test data required' });
    }
    
    // Get prediction
    const prediction = await modelService.predictADRisk(cognitiveTestData);
    
    // Log prediction
    console.log(`Prediction for test ${testId}:`, prediction);
    
    res.json({
      success: true,
      testId,
      prediction,
      recommendations: generateRecommendations(prediction.riskLevel)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function generateRecommendations(riskLevel) {
  const recommendations = {
    LOW: [
      'Continue regular cognitive activities and mental exercises',
      'Maintain a healthy lifestyle with regular physical activity',
      'Schedule follow-up assessment in 1-2 years'
    ],
    MEDIUM: [
      'Consult with a neurologist for further evaluation',
      'Begin cognitive training exercises',
      'Schedule follow-up assessment in 6-12 months',
      'Consider lifestyle modifications'
    ],
    HIGH: [
      'Urgent neurological consultation recommended',
      'Consider advanced diagnostic imaging (MRI, PET scan)',
      'Comprehensive geriatric assessment needed',
      'Schedule immediate follow-up assessment'
    ]
  };
  
  return recommendations[riskLevel] || [];
}

module.exports = router;
