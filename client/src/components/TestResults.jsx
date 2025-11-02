// import React, { useState, useEffect } from 'react';
// import api from '../api';
// import jsPDF from 'jspdf';

// function TestResults({ setRoute }) {
//   const [testResults, setTestResults] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [modelProbability, setModelProbability] = useState('');
//   const [allTests, setAllTests] = useState([]);

//   useEffect(() => {
//     fetchTestResults();
//   }, []);

//   const fetchTestResults = async () => {
//     try {
//       setLoading(true);
//       const patientId = localStorage.getItem('patientId');
//       const token = localStorage.getItem('token');

//       if (!patientId || !token) {
//         setError('Session expired. Please log in again.');
//         setLoading(false);
//         return;
//       }

//       const response = await api.getTestResults(patientId);
//       console.log('Test results:', response.data);

//       if (response.data && response.data.length > 0) {
//         // Get the latest test
//         const latestTest = response.data[0];
//         setTestResults(latestTest);
//         setAllTests(response.data);
        
//         // Initialize probability from model prediction
//         if (latestTest.prediction?.probability) {
//           setModelProbability((latestTest.prediction.probability * 100).toFixed(2));
//         }
//       } else {
//         setError('No test results found');
//       }
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching test results:', error);
//       setError('Failed to load test results');
//       setLoading(false);
//     }
//   };

//   const calculateMarks = (testData) => {
//     const marks = {};

//     // Memory Encoding/Recall
//     if (testData.memory_recall) {
//       let memoryScore = 0;
//       const words = ['Banana', 'Sunrise', 'Chair'];
//       if (testData.memory_recall.word1?.toLowerCase().includes(words[0].toLowerCase())) memoryScore += 33;
//       if (testData.memory_recall.word2?.toLowerCase().includes(words[1].toLowerCase())) memoryScore += 33;
//       if (testData.memory_recall.word3?.toLowerCase().includes(words[2].toLowerCase())) memoryScore += 34;
//       marks.memoryRecall = memoryScore;
//     }

//     // Trail Making
//     if (testData.trail_making) {
//       marks.trailMaking = testData.trail_making.errors === 0 ? 100 : Math.max(0, 100 - (testData.trail_making.errors * 10));
//     }

//     // Image Naming
//     if (testData.image_naming_0 || testData.image_naming_1 || testData.image_naming_2) {
//       let imageScore = 0;
//       const expectedAnswers = ['lion', 'rhino', 'camel'];
//       if (testData.image_naming_0?.toLowerCase().includes(expectedAnswers[0])) imageScore += 33;
//       if (testData.image_naming_1?.toLowerCase().includes(expectedAnswers[1])) imageScore += 33;
//       if (testData.image_naming_2?.toLowerCase().includes(expectedAnswers[2])) imageScore += 34;
//       marks.imageNaming = imageScore;
//     }

//     // Letter Tap
//     if (testData.letter_tap) {
//       const accuracy = (testData.letter_tap.correctTaps / testData.letter_tap.totalTargets) * 100;
//       marks.letterTap = accuracy;
//     }

//     // Serial Subtraction
//     if (testData.serial_subtraction && testData.serial_subtraction.length > 0) {
//       let correct = 0;
//       testData.serial_subtraction.forEach(item => {
//         if (item.expected === item.userAnswer) correct++;
//       });
//       marks.serialSubtraction = (correct / testData.serial_subtraction.length) * 100;
//     }

//     // Clock Drawing (manual scoring needed)
//     marks.clockDrawing = 50; // Placeholder - adjust based on your scoring

//     // Orientation
//     marks.orientation = 60; // Placeholder - calculate from orient1-6

//     return marks;
//   };

//   const downloadReport = async () => {
//     if (!testResults) return;

//     try {
//       const doc = new jsPDF();
//       const pageWidth = doc.internal.pageSize.getWidth();
//       const pageHeight = doc.internal.pageSize.getHeight();
//       let yPosition = 20;

//       // Title
//       doc.setFontSize(18);
//       doc.text('Cognitive Assessment Report', pageWidth / 2, yPosition, { align: 'center' });
//       yPosition += 15;

//       // Patient Details Section
//       doc.setFontSize(12);
//       doc.setFont(undefined, 'bold');
//       doc.text('Patient Information', 20, yPosition);
//       yPosition += 8;

//       doc.setFont(undefined, 'normal');
//       doc.setFontSize(10);
//       const patientId = localStorage.getItem('patientId');
//       doc.text(`Patient ID: ${patientId}`, 20, yPosition);
//       yPosition += 5;
//       doc.text(`Test Date: ${new Date(testResults.createdAt).toLocaleDateString()}`, 20, yPosition);
//       yPosition += 5;
//       doc.text(`Test ID: ${testResults.testId}`, 20, yPosition);
//       yPosition += 10;

//       // Overall Score Section
//       doc.setFont(undefined, 'bold');
//       doc.setFontSize(12);
//       doc.text('Overall Assessment', 20, yPosition);
//       yPosition += 8;

//       doc.setFont(undefined, 'normal');
//       doc.setFontSize(10);
//       doc.text(`Total Score: ${testResults.totalScore}/100`, 20, yPosition);
//       yPosition += 5;
//       doc.text(`Risk Level: ${testResults.prediction?.riskLevel || 'Unknown'}`, 20, yPosition);
//       yPosition += 5;
//       doc.text(`Model Probability: ${modelProbability}%`, 20, yPosition);
//       yPosition += 10;

//       // Detailed Scores Section
//       doc.setFont(undefined, 'bold');
//       doc.setFontSize(12);
//       doc.text('Cognitive Component Scores', 20, yPosition);
//       yPosition += 8;

//       doc.setFont(undefined, 'normal');
//       doc.setFontSize(10);
//       if (testResults.scores) {
//         Object.entries(testResults.scores).forEach(([category, score]) => {
//           const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
//           doc.text(`${categoryName}: ${score.toFixed(1)}/100`, 20, yPosition);
//           yPosition += 5;
          
//           if (yPosition > pageHeight - 20) {
//             doc.addPage();
//             yPosition = 20;
//           }
//         });
//       }

//       yPosition += 5;

//       // Test Answers Section
//       doc.setFont(undefined, 'bold');
//       doc.setFontSize(12);
//       doc.text('Detailed Test Responses', 20, yPosition);
//       yPosition += 8;

//       doc.setFont(undefined, 'normal');
//       doc.setFontSize(9);
//       const marks = calculateMarks(testResults);

//       // Memory Recall
//       if (testResults.memory_recall) {
//         doc.text(`Memory Recall:`, 20, yPosition);
//         yPosition += 5;
//         doc.text(`  Word 1: ${testResults.memory_recall.word1}`, 25, yPosition);
//         yPosition += 4;
//         doc.text(`  Word 2: ${testResults.memory_recall.word2}`, 25, yPosition);
//         yPosition += 4;
//         doc.text(`  Word 3: ${testResults.memory_recall.word3}`, 25, yPosition);
//         yPosition += 4;
//         doc.text(`  Score: ${marks.memoryRecall?.toFixed(0) || 0}/100`, 25, yPosition);
//         yPosition += 8;
//       }

//       // Trail Making
//       if (testResults.trail_making) {
//         doc.text(`Trail Making Test:`, 20, yPosition);
//         yPosition += 5;
//         doc.text(`  Time: ${testResults.trail_making.time}s`, 25, yPosition);
//         yPosition += 4;
//         doc.text(`  Errors: ${testResults.trail_making.errors}`, 25, yPosition);
//         yPosition += 4;
//         doc.text(`  Connections: ${testResults.trail_making.connections}`, 25, yPosition);
//         yPosition += 4;
//         doc.text(`  Score: ${marks.trailMaking?.toFixed(0) || 0}/100`, 25, yPosition);
//         yPosition += 8;
//       }

//       // Image Naming
//       if (testResults.image_naming_0) {
//         doc.text(`Image Naming:`, 20, yPosition);
//         yPosition += 5;
//         doc.text(`  Image 1: ${testResults.image_naming_0}`, 25, yPosition);
//         yPosition += 4;
//         doc.text(`  Image 2: ${testResults.image_naming_1}`, 25, yPosition);
//         yPosition += 4;
//         doc.text(`  Image 3: ${testResults.image_naming_2}`, 25, yPosition);
//         yPosition += 4;
//         doc.text(`  Score: ${marks.imageNaming?.toFixed(0) || 0}/100`, 25, yPosition);
//         yPosition += 8;
//       }

//       // Letter Tap
//       if (testResults.letter_tap) {
//         doc.text(`Letter Tap Test:`, 20, yPosition);
//         yPosition += 5;
//         doc.text(`  Correct Taps: ${testResults.letter_tap.correctTaps}/${testResults.letter_tap.totalTargets}`, 25, yPosition);
//         yPosition += 4;
//         doc.text(`  Incorrect Taps: ${testResults.letter_tap.incorrectTaps}`, 25, yPosition);
//         yPosition += 4;
//         doc.text(`  Score: ${marks.letterTap?.toFixed(0) || 0}/100`, 25, yPosition);
//         yPosition += 8;
//       }

//       // Serial Subtraction
//       if (testResults.serial_subtraction && testResults.serial_subtraction.length > 0) {
//         doc.text(`Serial Subtraction:`, 20, yPosition);
//         yPosition += 5;
//         testResults.serial_subtraction.forEach((item, index) => {
//           const status = item.expected === item.userAnswer ? '✓' : '✗';
//           doc.text(`  Q${index + 1}: ${item.expected} (Expected) vs ${item.userAnswer} (Your Answer) ${status}`, 25, yPosition);
//           yPosition += 4;
//           if (yPosition > pageHeight - 20) {
//             doc.addPage();
//             yPosition = 20;
//           }
//         });
//         doc.text(`  Score: ${marks.serialSubtraction?.toFixed(0) || 0}/100`, 25, yPosition);
//         yPosition += 8;
//       }

//       // Orientation
//       if (testResults.orient1) {
//         doc.text(`Orientation Questions:`, 20, yPosition);
//         yPosition += 5;
//         doc.text(`  Date: ${testResults.orient1}`, 25, yPosition);
//         yPosition += 4;
//         doc.text(`  Month: ${testResults.orient2}`, 25, yPosition);
//         yPosition += 4;
//         doc.text(`  Year: ${testResults.orient3}`, 25, yPosition);
//         yPosition += 4;
//         doc.text(`  Day: ${testResults.orient4}`, 25, yPosition);
//         yPosition += 4;
//         doc.text(`  Season: ${testResults.orient5}`, 25, yPosition);
//         yPosition += 4;
//         doc.text(`  Location: ${testResults.orient6}`, 25, yPosition);
//         yPosition += 8;
//       }

//       // Similarity
//       if (testResults.sim1) {
//         doc.text(`Similarity Questions:`, 20, yPosition);
//         yPosition += 5;
//         doc.text(`  Q1: ${testResults.sim1}`, 25, yPosition);
//         yPosition += 4;
//         doc.text(`  Q2: ${testResults.sim2}`, 25, yPosition);
//         yPosition += 8;
//       }

//       // Model Prediction
//       doc.setFont(undefined, 'bold');
//       doc.setFontSize(12);
//       if (yPosition > pageHeight - 30) {
//         doc.addPage();
//         yPosition = 20;
//       }
//       doc.text('AI Model Prediction', 20, yPosition);
//       yPosition += 8;

//       doc.setFont(undefined, 'normal');
//       doc.setFontSize(10);
//       doc.text(`Alzheimer's Risk Prediction: ${modelProbability}%`, 20, yPosition);
//       yPosition += 5;
//       doc.text(`Risk Classification: ${testResults.prediction?.riskLevel || 'Unknown'}`, 20, yPosition);
//       yPosition += 5;
//       doc.text(`Model Version: ${testResults.prediction?.modelVersion || 'v1.0'}`, 20, yPosition);

//       // Footer
//       doc.setFontSize(8);
//       doc.text('This report is a screening tool and not a medical diagnosis. Consult a healthcare professional for interpretation.', 20, pageHeight - 10);

//       // Save PDF
//       doc.save(`Cognitive_Assessment_Report_${patientId}_${new Date().getTime()}.pdf`);
//     } catch (error) {
//       console.error('Error generating PDF:', error);
//       alert('Failed to generate report');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="card" style={{ textAlign: 'center' }}>
//         <h2>Test Results</h2>
//         <p>Loading results...</p>
//         <div style={{ fontSize: '2rem' }}>⏳</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="card" style={{ textAlign: 'center', color: 'red' }}>
//         <h2>Test Results</h2>
//         <p>⚠️ {error}</p>
//         <button onClick={() => setRoute('dashboard')}>Back to Dashboard</button>
//       </div>
//     );
//   }

//   if (!testResults) {
//     return (
//       <div className="card" style={{ textAlign: 'center' }}>
//         <h2>Test Results</h2>
//         <p>No results available</p>
//         <button onClick={() => setRoute('dashboard')}>Back to Dashboard</button>
//       </div>
//     );
//   }

//   const marks = calculateMarks(testResults);

//   return (
//     <div className="card" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
//       <h2>Cognitive Assessment Results</h2>
      
//       <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
//         <button onClick={downloadReport} style={{ flex: 1 }}>
//           📥 Download Report as PDF
//         </button>
//         <button onClick={() => setRoute('dashboard')} style={{ flex: 1, backgroundColor: '#6b7280' }}>
//           Back to Dashboard
//         </button>
//       </div>

//       {/* Overall Score Section */}
//       <div style={{ backgroundColor: '#f0f9ff', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
//         <h3 style={{ color: '#1e40af' }}>Overall Assessment</h3>
//         <p><strong>Total Score:</strong> {testResults.totalScore}/100</p>
//         <p><strong>Risk Level:</strong> <span style={{
//           padding: '0.5rem 1rem',
//           borderRadius: '4px',
//           backgroundColor:
//             testResults.prediction?.riskLevel === 'high' ? '#fee2e2' :
//             testResults.prediction?.riskLevel === 'medium' ? '#fef3c7' :
//             '#dbeafe',
//           color:
//             testResults.prediction?.riskLevel === 'high' ? '#991b1b' :
//             testResults.prediction?.riskLevel === 'medium' ? '#92400e' :
//             '#1e40af'
//         }}>
//           {testResults.prediction?.riskLevel || 'Unknown'}
//         </span></p>
//         <p><strong>Test Date:</strong> {new Date(testResults.createdAt).toLocaleDateString()}</p>
//       </div>

//       {/* Component Scores */}
//       <div style={{ marginBottom: '2rem' }}>
//         <h3>Cognitive Component Scores</h3>
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
//           {testResults.scores && Object.entries(testResults.scores).map(([category, score]) => (
//             <div key={category} style={{
//               backgroundColor: '#f3f4f6',
//               padding: '1rem',
//               borderRadius: '8px',
//               borderLeft: '4px solid #2563eb'
//             }}>
//               <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>
//                 {category.charAt(0).toUpperCase() + category.slice(1)}
//               </p>
//               <p style={{ margin: 0, fontSize: '1.5rem', color: '#2563eb' }}>
//                 {score.toFixed(1)}/100
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* AI Model Prediction Section */}
//       <div style={{ backgroundColor: '#fef2f2', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', border: '2px solid #fca5a5' }}>
//         <h3 style={{ color: '#991b1b' }}>🤖 AI Model Prediction</h3>
//         <div style={{ marginBottom: '1rem' }}>
//           <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
//             Alzheimer's Risk Probability (%):
//           </label>
//           <input
//             type="number"
//             value={modelProbability}
//             onChange={(e) => setModelProbability(e.target.value)}
//             min="0"
//             max="100"
//             step="0.1"
//             style={{
//               width: '100%',
//               padding: '0.75rem',
//               borderRadius: '4px',
//               border: '2px solid #fca5a5',
//               fontSize: '1rem',
//               backgroundColor: '#ffffff'
//             }}
//           />
//         </div>
//         <p><strong>Interpretation:</strong></p>
//         <ul>
//           <li>0-30%: Low Risk</li>
//           <li>30-70%: Medium Risk</li>
//           <li>70-100%: High Risk</li>
//         </ul>
//         <p style={{ fontSize: '0.9rem', color: '#991b1b', marginTop: '1rem' }}>
//           <strong>⚠️ Disclaimer:</strong> This is a screening tool based on statistical models and should not be used as a medical diagnosis. Please consult with a healthcare professional for proper evaluation.
//         </p>
//       </div>

//       {/* Detailed Test Answers */}
//       <div style={{ marginBottom: '2rem' }}>
//         <h3>Detailed Test Responses</h3>

//         {testResults.memory_recall && (
//           <div style={{ marginBottom: '1.5rem', borderLeft: '4px solid #2563eb', paddingLeft: '1rem' }}>
//             <h4>Memory Recall Test</h4>
//             <p><strong>Word 1:</strong> {testResults.memory_recall.word1}</p>
//             <p><strong>Word 2:</strong> {testResults.memory_recall.word2}</p>
//             <p><strong>Word 3:</strong> {testResults.memory_recall.word3}</p>
//             <p><strong>Score:</strong> {marks.memoryRecall?.toFixed(0) || 0}/100</p>
//           </div>
//         )}

//         {testResults.trail_making && (
//           <div style={{ marginBottom: '1.5rem', borderLeft: '4px solid #2563eb', paddingLeft: '1rem' }}>
//             <h4>Trail Making Test</h4>
//             <p><strong>Time:</strong> {testResults.trail_making.time}s</p>
//             <p><strong>Errors:</strong> {testResults.trail_making.errors}</p>
//             <p><strong>Connections:</strong> {testResults.trail_making.connections}</p>
//             <p><strong>Score:</strong> {marks.trailMaking?.toFixed(0) || 0}/100</p>
//           </div>
//         )}

//         {testResults.image_naming_0 && (
//           <div style={{ marginBottom: '1.5rem', borderLeft: '4px solid #2563eb', paddingLeft: '1rem' }}>
//             <h4>Image Naming Test</h4>
//             <p><strong>Image 1:</strong> {testResults.image_naming_0}</p>
//             <p><strong>Image 2:</strong> {testResults.image_naming_1}</p>
//             <p><strong>Image 3:</strong> {testResults.image_naming_2}</p>
//             <p><strong>Score:</strong> {marks.imageNaming?.toFixed(0) || 0}/100</p>
//           </div>
//         )}

//         {testResults.letter_tap && (
//           <div style={{ marginBottom: '1.5rem', borderLeft: '4px solid #2563eb', paddingLeft: '1rem' }}>
//             <h4>Letter Tap Test</h4>
//             <p><strong>Correct Taps:</strong> {testResults.letter_tap.correctTaps}/{testResults.letter_tap.totalTargets}</p>
//             <p><strong>Incorrect Taps:</strong> {testResults.letter_tap.incorrectTaps}</p>
//             <p><strong>Score:</strong> {marks.letterTap?.toFixed(0) || 0}/100</p>
//           </div>
//         )}

//         {testResults.serial_subtraction && testResults.serial_subtraction.length > 0 && (
//           <div style={{ marginBottom: '1.5rem', borderLeft: '4px solid #2563eb', paddingLeft: '1rem' }}>
//             <h4>Serial Subtraction Test</h4>
//             {testResults.serial_subtraction.map((item, index) => (
//               <p key={index}>
//                 <strong>Q{index + 1}:</strong> Expected: {item.expected} | Your Answer: {item.userAnswer}{' '}
//                 <span style={{ color: item.expected === item.userAnswer ? '#10b981' : '#ef4444' }}>
//                   {item.expected === item.userAnswer ? '✓' : '✗'}
//                 </span>
//               </p>
//             ))}
//             <p><strong>Score:</strong> {marks.serialSubtraction?.toFixed(0) || 0}/100</p>
//           </div>
//         )}

//         {(testResults.orient1 || testResults.sim1) && (
//           <div style={{ marginBottom: '1.5rem', borderLeft: '4px solid #2563eb', paddingLeft: '1rem' }}>
//             <h4>Other Questions</h4>
//             {testResults.orient1 && <p><strong>Date:</strong> {testResults.orient1}</p>}
//             {testResults.orient2 && <p><strong>Month:</strong> {testResults.orient2}</p>}
//             {testResults.orient3 && <p><strong>Year:</strong> {testResults.orient3}</p>}
//             {testResults.orient4 && <p><strong>Day:</strong> {testResults.orient4}</p>}
//             {testResults.orient5 && <p><strong>Season:</strong> {testResults.orient5}</p>}
//             {testResults.orient6 && <p><strong>Location:</strong> {testResults.orient6}</p>}
//             {testResults.sim1 && <p><strong>Similarity Q1:</strong> {testResults.sim1}</p>}
//             {testResults.sim2 && <p><strong>Similarity Q2:</strong> {testResults.sim2}</p>}
//           </div>
//         )}
//       </div>

//       {/* Previous Tests */}
//       {allTests.length > 1 && (
//         <div style={{ marginBottom: '2rem', backgroundColor: '#f0f9ff', padding: '1rem', borderRadius: '8px' }}>
//           <h3>Previous Tests</h3>
//           <p><strong>Total Tests Taken:</strong> {allTests.length}</p>
//           <ul>
//             {allTests.slice(1).map((test, index) => (
//               <li key={test.testId}>
//                 Test {index + 2}: Score {test.totalScore}/100 - {new Date(test.createdAt).toLocaleDateString()}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       <button onClick={downloadReport} style={{ width: '100%', marginTop: '1rem' }}>
//         📥 Download Full Report as PDF
//       </button>
//     </div>
//   );
// }

// export default TestResults;




import React, { useState, useEffect } from 'react';
import api from '../api';
import jsPDF from 'jspdf';

function TestResults({ setRoute }) {
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modelProbability, setModelProbability] = useState('');
  const [allTests, setAllTests] = useState([]);

  useEffect(() => {
    fetchTestResults();
  }, []);

  const fetchTestResults = async () => {
    try {
      setLoading(true);
      setError('');
      const patientId = localStorage.getItem('patientId');
      const token = localStorage.getItem('token');

      console.log('Fetching results for patient:', patientId);

      if (!patientId || !token) {
        setError('Session expired. Please log in again.');
        setLoading(false);
        return;
      }

      const response = await api.getTestResults(patientId);
      console.log('Test results response:', response.data);

      if (response.data && response.data.length > 0) {
        const latestTest = response.data[0];
        setTestResults(latestTest);
        setAllTests(response.data);
        
        if (latestTest.prediction?.probability) {
          setModelProbability((latestTest.prediction.probability * 100).toFixed(2));
        } else {
          setModelProbability('50.00');
        }
      } else {
        setError('No test results found. Please complete a test first.');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching test results:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Failed to load test results';
      setError(errorMsg);
      setLoading(false);
    }
  };

  // Function to get question and answer pairs
  const getTestQuestionsAndAnswers = (testData) => {
    const qa = [];

    // Memory Recall
    if (testData.memory_recall) {
      qa.push({
        section: 'Memory Recall',
        type: 'recall',
        questions: [
          { q: 'Word 1 (Recall from beginning)', a: testData.memory_recall.word1 || 'Not answered' },
          { q: 'Word 2 (Recall from beginning)', a: testData.memory_recall.word2 || 'Not answered' },
          { q: 'Word 3 (Recall from beginning)', a: testData.memory_recall.word3 || 'Not answered' }
        ]
      });
    }

    // Trail Making
    if (testData.trail_making) {
      qa.push({
        section: 'Trail Making Test',
        type: 'performance',
        data: testData.trail_making
      });
    }

    // Image Naming
    if (testData.image_naming_0) {
      qa.push({
        section: 'Image Naming',
        type: 'naming',
        questions: [
          { q: 'Image 1 (Lion)', a: testData.image_naming_0 || 'Not answered' },
          { q: 'Image 2 (Rhinoceros)', a: testData.image_naming_1 || 'Not answered' },
          { q: 'Image 3 (Camel)', a: testData.image_naming_2 || 'Not answered' }
        ]
      });
    }

    // Letter Tap
    if (testData.letter_tap) {
      qa.push({
        section: 'Letter Tap Test',
        type: 'performance',
        data: testData.letter_tap
      });
    }

    // Serial Subtraction
    if (testData.serial_subtraction && testData.serial_subtraction.length > 0) {
      qa.push({
        section: 'Serial Subtraction',
        type: 'series',
        questions: testData.serial_subtraction.map((item, idx) => ({
          q: `Question ${idx + 1}`,
          a: `Your answer: ${item.userAnswer} (Expected: ${item.expected})`,
          correct: item.userAnswer === item.expected
        }))
      });
    }

    // Orientation Questions
    const orientationQs = [];
    if (testData.orient1) orientationQs.push({ q: 'What is today\'s date?', a: testData.orient1 });
    if (testData.orient2) orientationQs.push({ q: 'What is the current month?', a: testData.orient2 });
    if (testData.orient3) orientationQs.push({ q: 'What is the current year?', a: testData.orient3 });
    if (testData.orient4) orientationQs.push({ q: 'What day of the week is it?', a: testData.orient4 });
    if (testData.orient5) orientationQs.push({ q: 'What is the current season?', a: testData.orient5 });
    if (testData.orient6) orientationQs.push({ q: 'What city are we in?', a: testData.orient6 });

    if (orientationQs.length > 0) {
      qa.push({
        section: 'Orientation Questions',
        type: 'questions',
        questions: orientationQs
      });
    }

    // Similarity Questions
    const similarityQs = [];
    if (testData.sim1) similarityQs.push({ q: 'How are banana and orange similar?', a: testData.sim1 });
    if (testData.sim2) similarityQs.push({ q: 'How are watch and ruler similar?', a: testData.sim2 });

    if (similarityQs.length > 0) {
      qa.push({
        section: 'Similarity Questions',
        type: 'questions',
        questions: similarityQs
      });
    }

    return qa;
  };

  const calculateMarks = (testData) => {
    const marks = {};

    if (testData.memory_recall) {
      let score = 0;
      const words = ['banana', 'sunrise', 'chair'];
      if (testData.memory_recall.word1?.toLowerCase().includes(words[0])) score += 33;
      if (testData.memory_recall.word2?.toLowerCase().includes(words[1])) score += 33;
      if (testData.memory_recall.word3?.toLowerCase().includes(words[2])) score += 34;
      marks.memoryRecall = score;
    }

    if (testData.trail_making) {
      marks.trailMaking = testData.trail_making.errors === 0 ? 100 : Math.max(0, 100 - (testData.trail_making.errors * 10));
    }

    if (testData.image_naming_0) {
      let score = 0;
      if (testData.image_naming_0?.toLowerCase().includes('lion')) score += 33;
      if (testData.image_naming_1?.toLowerCase().includes('rhino')) score += 33;
      if (testData.image_naming_2?.toLowerCase().includes('camel')) score += 34;
      marks.imageNaming = score;
    }

    if (testData.letter_tap) {
      marks.letterTap = (testData.letter_tap.correctTaps / testData.letter_tap.totalTargets) * 100;
    }

    if (testData.serial_subtraction && testData.serial_subtraction.length > 0) {
      let correct = 0;
      testData.serial_subtraction.forEach(item => {
        if (item.expected === item.userAnswer) correct++;
      });
      marks.serialSubtraction = (correct / testData.serial_subtraction.length) * 100;
    }

    return marks;
  };

  const downloadReport = () => {
    if (!testResults) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;

    doc.setFontSize(18);
    doc.text('Cognitive Assessment Report', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Patient Information', 20, yPosition);
    yPosition += 8;

    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    const patientId = localStorage.getItem('patientId');
    doc.text(`Patient ID: ${patientId}`, 20, yPosition);
    yPosition += 5;
    doc.text(`Test Date: ${new Date(testResults.createdAt).toLocaleDateString()}`, 20, yPosition);
    yPosition += 10;

    doc.setFont(undefined, 'bold');
    doc.setFontSize(12);
    doc.text('Overall Assessment', 20, yPosition);
    yPosition += 8;

    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    doc.text(`Total Score: ${testResults.totalScore}/100`, 20, yPosition);
    yPosition += 5;
    doc.text(`Risk Level: ${testResults.prediction?.riskLevel || 'Unknown'}`, 20, yPosition);
    yPosition += 5;
    doc.text(`AI Probability: ${modelProbability}%`, 20, yPosition);
    yPosition += 10;

    const marks = calculateMarks(testResults);
    doc.setFont(undefined, 'bold');
    doc.text('Component Scores', 20, yPosition);
    yPosition += 8;

    doc.setFont(undefined, 'normal');
    if (testResults.scores) {
      Object.entries(testResults.scores).forEach(([category, score]) => {
        doc.text(`${category.charAt(0).toUpperCase() + category.slice(1)}: ${score.toFixed(1)}/100`, 20, yPosition);
        yPosition += 5;
      });
    }

    doc.save(`Cognitive_Assessment_Report_${patientId}_${new Date().getTime()}.pdf`);
  };

  if (loading) {
    return (
      <div className="card" style={{ textAlign: 'center' }}>
        <h2>Test Results</h2>
        <p>Loading results...</p>
        <div style={{ fontSize: '2rem' }}>⏳</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card" style={{ textAlign: 'center', color: 'red' }}>
        <h2>Test Results</h2>
        <p>⚠️ {error}</p>
        <button onClick={() => setRoute('dashboard')}>Back to Dashboard</button>
      </div>
    );
  }

  if (!testResults) {
    return (
      <div className="card" style={{ textAlign: 'center' }}>
        <h2>Test Results</h2>
        <p>No results available</p>
        <button onClick={() => setRoute('dashboard')}>Back to Dashboard</button>
      </div>
    );
  }

  const questionsAndAnswers = getTestQuestionsAndAnswers(testResults);
  const marks = calculateMarks(testResults);

  return (
    <div className="card" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
      <h2>Your Cognitive Assessment Results</h2>
      
      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
        <button onClick={downloadReport} style={{ flex: 1 }}>
          📥 Download Report as PDF
        </button>
        <button onClick={() => setRoute('dashboard')} style={{ flex: 1, backgroundColor: '#6b7280' }}>
          Back to Dashboard
        </button>
      </div>

      {/* Overall Score */}
      <div style={{ backgroundColor: '#f0f9ff', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <h3 style={{ color: '#1e40af', marginTop: 0 }}>Overall Assessment</h3>
        <p><strong>Total Score:</strong> {testResults.totalScore}/100</p>
        <p><strong>Risk Level:</strong> <span style={{
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          backgroundColor:
            testResults.prediction?.riskLevel === 'high' ? '#fee2e2' :
            testResults.prediction?.riskLevel === 'medium' ? '#fef3c7' :
            '#dbeafe',
          color:
            testResults.prediction?.riskLevel === 'high' ? '#991b1b' :
            testResults.prediction?.riskLevel === 'medium' ? '#92400e' :
            '#1e40af'
        }}>
          {testResults.prediction?.riskLevel || 'Unknown'}
        </span></p>
      </div>

      {/* Component Scores */}
      <div style={{ marginBottom: '2rem' }}>
        <h3>Cognitive Component Scores</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          {testResults.scores && Object.entries(testResults.scores).map(([category, score]) => (
            <div key={category} style={{
              backgroundColor: '#f3f4f6',
              padding: '1rem',
              borderRadius: '8px',
              borderLeft: '4px solid #2563eb'
            }}>
              <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </p>
              <p style={{ margin: 0, fontSize: '1.5rem', color: '#2563eb' }}>
                {score.toFixed(1)}/100
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Questions and Answers */}
      <div style={{ marginBottom: '2rem' }}>
        <h3>Detailed Test Responses - Questions & Your Answers</h3>
        {questionsAndAnswers.map((section, idx) => (
          <div key={idx} style={{
            marginBottom: '2rem',
            borderLeft: '4px solid #2563eb',
            paddingLeft: '1rem',
            backgroundColor: '#f9fafb',
            padding: '1rem',
            borderRadius: '8px'
          }}>
            <h4 style={{ marginTop: 0, color: '#1f2937' }}>{section.section}</h4>
            
            {section.type === 'questions' && (
              <div>
                {section.questions.map((qa, qIdx) => (
                  <div key={qIdx} style={{ marginBottom: '1rem', backgroundColor: '#ffffff', padding: '0.75rem', borderRadius: '4px' }}>
                    <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', color: '#1e40af' }}>
                      Q{qIdx + 1}: {qa.q}
                    </p>
                    <p style={{ margin: 0, color: '#374151' }}>
                      <strong>Your Answer:</strong> {qa.a}
                    </p>
                    {qa.correct !== undefined && (
                      <p style={{ margin: '0.25rem 0 0 0', color: qa.correct ? '#10b981' : '#ef4444' }}>
                        {qa.correct ? '✓ Correct' : '✗ Incorrect'}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {section.type === 'recall' && (
              <div>
                {section.questions.map((qa, qIdx) => (
                  <div key={qIdx} style={{ marginBottom: '0.75rem', backgroundColor: '#ffffff', padding: '0.75rem', borderRadius: '4px' }}>
                    <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', color: '#1e40af' }}>
                      {qa.q}
                    </p>
                    <p style={{ margin: 0, color: '#374151' }}>
                      <strong>Your Answer:</strong> {qa.a}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'naming' && (
              <div>
                {section.questions.map((qa, qIdx) => (
                  <div key={qIdx} style={{ marginBottom: '0.75rem', backgroundColor: '#ffffff', padding: '0.75rem', borderRadius: '4px' }}>
                    <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', color: '#1e40af' }}>
                      {qa.q}
                    </p>
                    <p style={{ margin: 0, color: '#374151' }}>
                      <strong>Your Answer:</strong> {qa.a}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'series' && (
              <div>
                {section.questions.map((qa, qIdx) => (
                  <div key={qIdx} style={{ marginBottom: '0.75rem', backgroundColor: '#ffffff', padding: '0.75rem', borderRadius: '4px' }}>
                    <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', color: '#1e40af' }}>
                      {qa.q}
                    </p>
                    <p style={{ margin: 0, color: '#374151' }}>
                      {qa.a}
                    </p>
                    <p style={{ margin: '0.25rem 0 0 0', color: qa.correct ? '#10b981' : '#ef4444' }}>
                      {qa.correct ? '✓ Correct' : '✗ Incorrect'}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'performance' && (
              <div>
                {section.data && Object.entries(section.data).map(([key, value], dIdx) => (
                  <p key={dIdx} style={{ margin: '0.5rem 0', color: '#374151' }}>
                    <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {typeof value === 'object' ? JSON.stringify(value) : value}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* AI Model Prediction */}
      <div style={{ backgroundColor: '#fef2f2', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', border: '2px solid #fca5a5' }}>
        <h3 style={{ color: '#991b1b', marginTop: 0 }}>🤖 AI Model Prediction</h3>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Alzheimer's Risk Probability (%):
          </label>
          <input
            type="number"
            value={modelProbability}
            onChange={(e) => setModelProbability(e.target.value)}
            min="0"
            max="100"
            step="0.1"
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '4px',
              border: '2px solid #fca5a5',
              fontSize: '1rem',
              backgroundColor: '#ffffff'
            }}
          />
        </div>
        <p style={{ fontSize: '0.9rem', color: '#991b1b' }}>
          <strong>⚠️ Disclaimer:</strong> This is a screening tool and should not be used as a medical diagnosis.
        </p>
      </div>

      <button onClick={downloadReport} style={{ width: '100%' }}>
        📥 Download Full Report as PDF
      </button>
    </div>
  );
}

export default TestResults;

