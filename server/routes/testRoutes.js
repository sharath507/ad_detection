// // routes/testRoutes.js
// const express = require('express');
// const CognitiveTestResponse = require('../models/CognitiveTestResponse');
// const PatientInfo = require('../models/PatientInfo');
// const cognitiveScoring = require('../services/cognitiveScoring');
// const predictionService = require('../services/predictionService');
// const authenticate = require('../middleware/authenticate');

// const router = express.Router();

// // Save Patient Info
// router.post('/patient-info', authenticate, async (req, res) => {
//   try {
//     const { personal_information, medical_history } = req.body;
//     const { userId } = req.user;
//     const patientId = `patient_${userId}_${Date.now()}`;
    
//     const patientInfo = new PatientInfo({
//       patientId,
//       userId,
//       personal_information,
//       medical_history,
//       createdAt: new Date()
//     });
    
//     await patientInfo.save();
//     res.status(201).json({ patientId, patientInfo });
//   try {
//     const { personal_information, medical_history } = req.body;
//     const { userId } = req.user;
//     const patientId = `patient_${userId}_${Date.now()}`;
    
//     const patientInfo = new PatientInfo({
//       patientId,
//       userId,
//       personal_information,
//       medical_history,
//       createdAt: new Date()
//     });
    
//     await patientInfo.save();
//     console.log('Patient info saved:', patientId);
//     res.status(201).json({ patientId, patientInfo });
//   } catch (error) {
// routes/testRoutes.js
const express = require('express');
const CognitiveTestResponse = require('../models/CognitiveTestResponse');
const PatientInfo = require('../models/PatientInfo');
const cognitiveScoring = require('../services/cognitiveScoring');
const modelService = require('../services/modelService');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

// Save Patient Info
router.post('/patient-info', authenticate, async (req, res) => {
  try {
    const { personal_information, medical_history } = req.body;
    const { userId } = req.user;
    
    if (!personal_information || !medical_history) {
      return res.status(400).json({ error: 'Patient information is required' });
    }

    const patientId = `patient_${userId}_${Date.now()}`;
    
    console.log('Creating patient record:', patientId);
    console.log('Personal info:', personal_information);
    console.log('Medical history:', medical_history);

    const patientInfo = new PatientInfo({
      patientId,
      userId,
      personal_information,
      medical_history,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    const savedPatientInfo = await patientInfo.save();
    
    console.log('Patient info saved successfully:', savedPatientInfo);
    
    res.status(201).json({ 
      success: true,
      patientId, 
      patientInfo: savedPatientInfo 
    });
  } catch (error) {
    console.error('Patient info save error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Submit Test Responses
router.post('/submit-test', authenticate, async (req, res) => {
  try {
    const { patientId, testData } = req.body;
    const { userId } = req.user;
    const testId = `test_${patientId}_${Date.now()}`;
    
    console.log('Submitting test:', testId);
    console.log('Test data received:', testData);

    // Score the test
    const scoring = await cognitiveScoring.scoreCompleteTest(testData);
    console.log('Test scored:', scoring);

    // Fetch patient info and run ML prediction
    let prediction = null;
    try {
      const patientInfo = await PatientInfo.findOne({ patientId });
      if (patientInfo) {
        // Map cognitive totalScore (0-100) to MMSE scale (0-30)
        const derivedMMSE = Math.max(0, Math.min(30, Math.round((scoring.totalScore || 0) * 0.3)));

        // Inject derived MMSE into a copy of patient info so model uses current test performance
        const enrichedPatientInfo = {
          ...patientInfo.toObject(),
          mmse: derivedMMSE,
          personal_information: {
            ...(patientInfo.toObject().personal_information || {}),
            mmse: derivedMMSE
          }
        };

        prediction = await modelService.predictFromPatientInfo(enrichedPatientInfo);
      }
    } catch (e) {
      console.warn('Prediction failed; proceeding without ML prediction:', e.message);
    }

    // Save response
    const testResponse = new CognitiveTestResponse({
      testId,
      patientId,
      userId,
      ...testData,
      testStatus: 'completed',
      totalScore: scoring.totalScore,
      scores: scoring.scores,
      prediction: prediction || {
        isAD: false,
        probability: 0.0,
        riskLevel: 'unknown',
        modelVersion: 'unavailable'
      }
    });
    
    const savedTest = await testResponse.save();
    console.log('Test response saved');
    
    res.status(201).json({
      success: true,
      testId,
      scores: scoring.scores,
      totalScore: scoring.totalScore,
      riskLevel: scoring.riskLevel,
      prediction: testResponse.prediction
    });
  } catch (error) {
    console.error('Test submission error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get Test Results
router.get('/test-results/:patientId', authenticate, async (req, res) => {
  try {
    const { patientId } = req.params;
    const results = await CognitiveTestResponse.find({ patientId }).sort({ createdAt: -1 });
    res.json(results);
  } catch (error) {
    console.error('Get results error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all patients and their test results
router.get('/doctor/patients', authenticate, async (req, res) => {
  try {
    const { userId } = req.user;
    
    // Get all patient info records
    const patients = await PatientInfo.find().sort({ createdAt: -1 });
    
    if (patients.length === 0) {
      return res.json([]);
    }

    // For each patient, get their latest test results
    const patientsWithResults = await Promise.all(
      patients.map(async (patient) => {
        const testResults = await CognitiveTestResponse.find({ 
          patientId: patient.patientId 
        }).sort({ createdAt: -1 }).limit(1);

        return {
          patientId: patient.patientId,
          name: patient.personal_information.name,
          age: patient.personal_information.age,
          gender: patient.personal_information.gender,
          dateOfBirth: patient.personal_information.date_of_birth,
          educationLevel: patient.personal_information.education_level,
          medicalHistory: patient.medical_history,
          latestTest: testResults.length > 0 ? {
            testId: testResults[0].testId,
            totalScore: testResults[0].totalScore,
            riskLevel: testResults[0].prediction?.riskLevel || 'unknown',
            testDate: testResults[0].createdAt,
            scores: testResults[0].scores
          } : null,
          createdAt: patient.createdAt
        };
      })
    );

    res.json(patientsWithResults);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get specific patient details and all their tests
router.get('/doctor/patient/:patientId', authenticate, async (req, res) => {
  try {
    const { patientId } = req.params;

    const patientInfo = await PatientInfo.findOne({ patientId });
    if (!patientInfo) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const testResults = await CognitiveTestResponse.find({ patientId }).sort({ createdAt: -1 });

    res.json({
      patientInfo,
      testResults,
      testCount: testResults.length,
      latestTest: testResults.length > 0 ? testResults[0] : null
    });
  } catch (error) {
    console.error('Error fetching patient details:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get test results for a specific patient
router.get('/test-results/:patientId', authenticate, async (req, res) => {
  try {
    const { patientId } = req.params;
    
    console.log('Fetching test results for patient:', patientId);
    
    // Get patient info
    const patientInfo = await PatientInfo.findOne({ patientId });
    
    if (!patientInfo) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Get all test results for this patient, sorted by newest first
    const testResults = await CognitiveTestResponse.find({ patientId })
      .sort({ createdAt: -1 });

    console.log('Found tests:', testResults.length);

    res.json(testResults);
  } catch (error) {
    console.error('Error fetching test results:', error);
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;
