// import React from 'react';

// const patients = [
//   { name: "John Doe", age: 70, testStatus: "Completed", result: "Positive" },
//   { name: "Jane Smith", age: 65, testStatus: "Pending", result: "N/A" },
//   { name: "Michael Lee", age: 72, testStatus: "Completed", result: "Negative" },
// ];

// function DoctorDashboard() {
//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Patient List</h2>
//       <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//         <thead>
//           <tr>
//             <th style={tableHeader}>Name</th>
//             <th style={tableHeader}>Age</th>
//             <th style={tableHeader}>Test Status</th>
//             <th style={tableHeader}>Result</th>
//           </tr>
//         </thead>
//         <tbody>
//           {patients.map((pat, idx) => (
//             <tr key={idx}>
//               <td style={tableCell}>{pat.name}</td>
//               <td style={tableCell}>{pat.age}</td>
//               <td style={tableCell}>{pat.testStatus}</td>
//               <td style={tableCell}>{pat.result}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// const tableHeader = { borderBottom: '2px solid #2563eb', padding: '10px', backgroundColor: '#dbeafe' };
// const tableCell = { borderBottom: '1px solid #ddd', padding: '10px' };

// export default DoctorDashboard;



// import React, { useState, useEffect } from "react";
// import api from "../api";

// function DoctorDashboard() {
//   const [patients, setPatients] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchPatients = async () => {
//       const data = await api.getPatients();
//       setPatients(data);
//       setIsLoading(false);
//     }
//     fetchPatients();
//   }, []);

//   const tableHeader = { borderBottom: '2px solid #2563eb', padding: '12px', backgroundColor: '#dbeafe', textAlign: 'left' };
//   const tableCell = { borderBottom: '1px solid #7e2222ff', padding: '12px' };

//   return (
//     <div className="card">
//       <h2>Patient List</h2>
//       {isLoading ? <p>Loading patients...</p> : (
//         <table style={{width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
//           <thead>
//             <tr style={{backgroundColor: 'red'}  }>
//               <th style={{tableHeader,backgroundColor: 'red'}}>Name</th>
//               <th style={{tableHeader,backgroundColor: 'red'}}>Age</th>
//               <th style={{tableHeader,backgroundColor: 'red'}}>Test Status</th>
//               <th style={{tableHeader,backgroundColor: 'red'}}>Result</th>
//             </tr>
//           </thead>
//           <tbody>
//             {patients.map((pat, idx) => (
//               <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? 'green' : '#1c5288ff' }}>
//                 <td style={tableCell}>{pat.name}</td>
//                 <td style={tableCell}>{pat.age}</td>
//                 <td style={tableCell}>{pat.testStatus}</td>
//                 <td style={tableCell}>{pat.result}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }

// export default DoctorDashboard;



// import React, { useState, useEffect } from 'react';
// import api from '../api';

// function DoctorDashboard({ setRoute }) {
//   const [patients, setPatients] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [selectedPatient, setSelectedPatient] = useState(null);

//   useEffect(() => {
//     fetchPatients();
//   }, []);

//   const fetchPatients = async () => {
//     try {
//       setLoading(true);
//       setError('');
//       console.log('Fetching patients...');
      
//       const response = await api.getDoctorPatients();
//       console.log('Patients response:', response.data);
      
//       setPatients(response.data || []);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching patients:', error);
//       setError('Failed to load patients. ' + (error.response?.data?.error || error.message));
//       setLoading(false);
//     }
//   };

//   const handleViewPatient = async (patientId) => {
//     try {
//       const response = await api.getPatientDetails(patientId);
//       setSelectedPatient(response.data);
//     } catch (error) {
//       setError('Failed to load patient details');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="card" style={{ textAlign: 'center' }}>
//         <h2>Doctor Dashboard</h2>
//         <p>Loading patients...</p>
//         <div style={{ fontSize: '2rem' }}>⏳</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="card" style={{ textAlign: 'center', color: 'red' }}>
//         <h2>Doctor Dashboard</h2>
//         <p>⚠️ {error}</p>
//         <button onClick={fetchPatients}>Retry</button>
//         <button onClick={() => setRoute('login')} style={{ marginLeft: '1rem' }}>Back to Login</button>
//       </div>
//     );
//   }

//   if (selectedPatient) {
//     return (
//       <div className="card">
//         <h2>Patient Details</h2>
//         <button onClick={() => setSelectedPatient(null)}>← Back to List</button>
        
//         <div style={{ marginTop: '2rem', textAlign: 'left' }}>
//           <h3>{selectedPatient.patientInfo.personal_information.name}</h3>
//           <p><strong>Patient ID:</strong> {selectedPatient.patientInfo.patientId}</p>
//           <p><strong>Gender:</strong> {selectedPatient.patientInfo.personal_information.gender}</p>
//           <p><strong>DOB:</strong> {selectedPatient.patientInfo.personal_information.date_of_birth}</p>
//           <p><strong>Education:</strong> {selectedPatient.patientInfo.personal_information.education_level}</p>

//           <h4>Medical History</h4>
//           <p><strong>Memory Issues:</strong> {selectedPatient.patientInfo.medical_history.memory_or_thinking_problems.response}</p>
//           <p><strong>Balance Problems:</strong> {selectedPatient.patientInfo.medical_history.balance_problems.response}</p>
//           <p><strong>Mood Status:</strong> {selectedPatient.patientInfo.medical_history.mood_status.sad_or_depressed}</p>

//           <h4>Test Results ({selectedPatient.testCount} tests)</h4>
//           {selectedPatient.latestTest ? (
//             <div style={{ backgroundColor: '#f0f9ff', padding: '1rem', borderRadius: '8px' }}>
//               <p><strong>Latest Test Score:</strong> {selectedPatient.latestTest.totalScore}/100</p>
//               <p><strong>Risk Level:</strong> {selectedPatient.latestTest.prediction?.riskLevel || 'N/A'}</p>
//               <p><strong>Date:</strong> {new Date(selectedPatient.latestTest.createdAt).toLocaleDateString()}</p>
//               <p><strong>Memory:</strong> {selectedPatient.latestTest.scores?.memory?.toFixed(1) || 'N/A'}</p>
//               <p><strong>Attention:</strong> {selectedPatient.latestTest.scores?.attention?.toFixed(1) || 'N/A'}</p>
//               <p><strong>Orientation:</strong> {selectedPatient.latestTest.scores?.orientation?.toFixed(1) || 'N/A'}</p>
//             </div>
//           ) : (
//             <p>No test results yet</p>
//           )}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="card">
//       <h2>Doctor Dashboard</h2>
//       <p>Total Patients: {patients.length}</p>

//       {patients.length === 0 ? (
//         <div style={{ textAlign: 'center', padding: '2rem' }}>
//           <p>No patients found</p>
//         </div>
//       ) : (
//         <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '2rem' }}>
//           <thead style={{ backgroundColor: '#f3f4f6', borderBottom: '2px solid #d1d5db' }}>
//             <tr>
//               <th style={{ padding: '1rem', textAlign: 'left' }}>Patient Name</th>
//               <th style={{ padding: '1rem', textAlign: 'left' }}>Gender</th>
//               <th style={{ padding: '1rem', textAlign: 'left' }}>Latest Score</th>
//               <th style={{ padding: '1rem', textAlign: 'left' }}>Risk Level</th>
//               <th style={{ padding: '1rem', textAlign: 'center' }}>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {patients.map((patient) => (
//               <tr key={patient.patientId} style={{ borderBottom: '1px solid #e5e7eb' }}>
//                 <td style={{ padding: '1rem' }}>{patient.name}</td>
//                 <td style={{ padding: '1rem' }}>{patient.gender}</td>
//                 <td style={{ padding: '1rem' }}>
//                   {patient.latestTest ? `${patient.latestTest.totalScore}/100` : 'N/A'}
//                 </td>
//                 <td style={{ padding: '1rem' }}>
//                   <span style={{
//                     padding: '0.25rem 0.75rem',
//                     borderRadius: '4px',
//                     backgroundColor: 
//                       patient.latestTest?.riskLevel === 'high' ? '#fee2e2' :
//                       patient.latestTest?.riskLevel === 'medium' ? '#fef3c7' :
//                       '#dbeafe',
//                     color:
//                       patient.latestTest?.riskLevel === 'high' ? '#991b1b' :
//                       patient.latestTest?.riskLevel === 'medium' ? '#92400e' :
//                       '#1e40af'
//                   }}>
//                     {patient.latestTest?.riskLevel || 'N/A'}
//                   </span>
//                 </td>
//                 <td style={{ padding: '1rem', textAlign: 'center' }}>
//                   <button 
//                     onClick={() => handleViewPatient(patient.patientId)}
//                     style={{ padding: '0.5rem 1rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
//                   >
//                     View Details
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       <button 
//         onClick={() => setRoute('dashboard')}
//         style={{ marginTop: '2rem', padding: '0.75rem 1.5rem', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
//       >
//         Back to Dashboard
//       </button>
//     </div>
//   );
// }

// export default DoctorDashboard;



// import React, { useState, useEffect } from 'react';
// import api from '../api';

// function DoctorDashboard({ setRoute }) {
//   const [patients, setPatients] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [selectedPatient, setSelectedPatient] = useState(null);

//   useEffect(() => {
//     fetchPatients();
//   }, []);

//   const fetchPatients = async () => {
//     try {
//       setLoading(true);
//       setError('');
//       const response = await api.getDoctorPatients();
//       setPatients(response.data || []);
//     } catch (error) {
//       setError('Failed to load patients. ' + (error.response?.data?.error || error.message));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleViewPatient = async (patientId) => {
//     try {
//       const response = await api.getPatientDetails(patientId);
//       setSelectedPatient(response.data);
//     } catch (error) {
//       setError('Failed to load patient details');
//     }
//   };

//   // // 🔹 Reusable table styles
//   // const styles = {
//   //   table: {
//   //     width: '100%',
//   //     borderCollapse: 'collapse',
//   //     marginTop: '1.5rem',
//   //     fontFamily: 'Arial, sans-serif',
//   //     color: '#e2e4ebff', // blackish text
//   //   },
//   //   thead: {
//   //     backgroundColor: '#1e3a8a', // deep blue
//   //     color: 'white',
//   //     borderBottom: '2px solid #1d4ed8',
//   //   },
//   //   th: {
//   //     padding: '12px',
//   //     textAlign: 'left',
//   //     fontWeight: '600',
//   //     fontSize: '15px',
//   //   },
//   //   tr: {
//   //     backgroundColor: '#966060ff',
//   //     transition: 'background 0.2s ease',
//   //   },
//   //   trAlt: {
//   //     backgroundColor: '#455f7aff',
//   //   },
//   //   trHover: {
//   //     backgroundColor: '#3f7497ff',
//   //   },
//   //   td: {
//   //     padding: '12px',
//   //     borderBottom: '1px solid #4f6d9bff',
//   //   },
//   //   riskTag: (level) => ({
//   //     padding: '0.3rem 0.7rem',
//   //     borderRadius: '6px',
//   //     textTransform: 'capitalize',
//   //     fontWeight: '500',
//   //     backgroundColor:
//   //       level === 'high' ? '#fee2e2' :
//   //       level === 'medium' ? '#fef3c7' :
//   //       level === 'low' ? '#dbeafe' :
//   //       '#f3f4f6',
//   //     color:
//   //       level === 'high' ? '#b91c1c' :
//   //       level === 'medium' ? '#92400e' :
//   //       level === 'low' ? '#1e40af' :
//   //       '#374151',
//   //   }),
//   //   button: {
//   //     padding: '8px 16px',
//   //     backgroundColor: '#2563eb',
//   //     color: 'white',
//   //     border: 'none',
//   //     borderRadius: '6px',
//   //     cursor: 'pointer',
//   //     fontWeight: '500',
//   //   },
//   //   backButton: {
//   //     marginTop: '1.5rem',
//   //     padding: '10px 18px',
//   //     backgroundColor: '#6b7280',
//   //     color: 'white',
//   //     border: 'none',
//   //     borderRadius: '6px',
//   //     cursor: 'pointer',
//   //   }
//   // };


//   // 🔹 Reusable table styles
// // const styles = {
// //   table: {
// //     width: '100%',
// //     borderCollapse: 'collapse',
// //     marginTop: '1.5rem',
// //     fontFamily: 'Arial, sans-serif',
// //     color: '#000000', // black text
// //     backgroundColor: '#ffffff', // light background
// //     boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
// //     borderRadius: '10px',
// //     overflow: 'hidden',
// //   },
// //   thead: {
// //     backgroundColor: '#e6e8eb', // light gray header
// //     color: '#000', // black text
// //     borderBottom: '2px solid #d1d5db',
// //   },
// //   th: {
// //     padding: '12px 16px',
// //     textAlign: 'left',
// //     fontWeight: '600',
// //     fontSize: '15px',
// //   },
// //   tr: {
// //     backgroundColor: '#f8f9fa', // light gray row
// //     transition: 'background 0.2s ease',
// //   },
// //   trAlt: {
// //     backgroundColor: '#f1f3f5', // alternate lighter gray
// //   },
// //   trHover: {
// //     backgroundColor: '#e8f0ff', // light blue hover
// //   },
// //   td: {
// //     padding: '12px 16px',
// //     borderBottom: '1px solid #e0e0e0',
// //     color: '#000000',
// //   },
// //   riskTag: (level) => ({
// //     padding: '0.3rem 0.7rem',
// //     borderRadius: '6px',
// //     textTransform: 'capitalize',
// //     fontWeight: '500',
// //     backgroundColor:
// //       level === 'high'
// //         ? '#fee2e2'
// //         : level === 'medium'
// //         ? '#fef3c7'
// //         : level === 'low'
// //         ? '#dbeafe'
// //         : '#f3f4f6',
// //     color:
// //       level === 'high'
// //         ? '#b91c1c'
// //         : level === 'medium'
// //         ? '#92400e'
// //         : level === 'low'
// //         ? '#1e40af'
// //         : '#374151',
// //   }),
// //   button: {
// //     padding: '8px 16px',
// //     backgroundColor: '#2563eb',
// //     color: 'white',
// //     border: 'none',
// //     borderRadius: '6px',
// //     cursor: 'pointer',
// //     fontWeight: '500',
// //     transition: 'background 0.2s ease',
// //   },
// //   backButton: {
// //     marginTop: '1.5rem',
// //     padding: '10px 18px',
// //     backgroundColor: '#6b7280',
// //     color: 'white',
// //     border: 'none',
// //     borderRadius: '6px',
// //     cursor: 'pointer',
// //     transition: 'background 0.2s ease',
// //   },
// // };
  
//   // 🔹 Reusable light-mode table styles (dark mode–proof)
// const styles = {
//   wrapper: {
//     backgroundColor: '#9ba1a7ff',
//     colorScheme: 'light', // 🧠 forces light color scheme
//     color: '#ebe0e0ff',
//     padding: '2rem',
//     borderRadius: '12px',
//   },
//   table: {
//     width: '100%',
//     borderCollapse: 'collapse',
//     marginTop: '1.5rem',
//     fontFamily: 'Arial, sans-serif',
//     color: '#d1c9c9ff',
//     backgroundColor: '#ffffff',
//     boxShadow: '0 2px 6px rgba(243, 238, 238, 0.56)',
//     borderRadius: '10px',
//     overflow: 'hidden',
//     filter: 'invert(0)', // ✅ ensures dark mode doesn’t invert colors
//   },
//   thead: {
//     backgroundColor: '#e6e8eb',
//     color: '#ddc9c9ff',
//     borderBottom: '2px solid #d1d5db',
//   },
//   th: {
//     padding: '12px 16px',
//     textAlign: 'left',
//     fontWeight: '600',
//     fontSize: '15px',
//   },
//   tr: {
//     backgroundColor: '#f8f9fa',
//     transition: 'background 0.2s ease',
//   },
//   trAlt: {
//     backgroundColor: '#f1f3f5',
//   },
//   trHover: {
//     backgroundColor: '#e8f0ff',
//   },
//   td: {
//     padding: '12px 16px',
//     borderBottom: '1px solid #e0e0e0',
//     color: '#e9dcdcff',
//   },
//   riskTag: (level) => ({
//     padding: '0.3rem 0.7rem',
//     borderRadius: '6px',
//     textTransform: 'capitalize',
//     fontWeight: '500',
//     backgroundColor:
//       level === 'high'
//         ? '#fee2e2'
//         : level === 'medium'
//         ? '#fef3c7'
//         : level === 'low'
//         ? '#dbeafe'
//         : '#f3f4f6',
//     color:
//       level === 'high'
//         ? '#b91c1c'
//         : level === 'medium'
//         ? '#92400e'
//         : level === 'low'
//         ? '#1e40af'
//         : '#374151',
//   }),
//   button: {
//     padding: '8px 16px',
//     backgroundColor: '#1d53c0ff',
//     color: 'white',
//     border: 'none',
//     borderRadius: '6px',
//     cursor: 'pointer',
//     fontWeight: '500',
//     transition: 'background 0.2s ease',
//   },
//   backButton: {
//     marginTop: '1.5rem',
//     padding: '10px 18px',
//     backgroundColor: '#6b7280',
//     color: 'white',
//     border: 'none',
//     borderRadius: '6px',
//     cursor: 'pointer',
//     transition: 'background 0.2s ease',
//   },
// };


//   if (loading)
//     return (
//       <div className="card" style={{ textAlign: 'center' }}>
//         <h2>Doctor Dashboard</h2>
//         <p>Loading patients...</p>
//       </div>
//     );

//   if (error)
//     return (
//       <div className="card" style={{ textAlign: 'center', color: 'red' }}>
//         <h2>Doctor Dashboard</h2>
//         <p>⚠️ {error}</p>
//         <button onClick={fetchPatients} style={styles.button}>Retry</button>
//         <button onClick={() => setRoute('login')} style={{ ...styles.button, backgroundColor: '#4b5563', marginLeft: '1rem' }}>Back to Login</button>
//       </div>
//     );

//   if (selectedPatient)
//     return (
//       <div className="card">
//         <h2>Patient Details</h2>
//         <button onClick={() => setSelectedPatient(null)} style={styles.button}>← Back</button>
//         <div style={{ marginTop: '1.5rem' }}>
//           <h3 style={{ color: '#1e3a8a' }}>{selectedPatient.patientInfo.personal_information.name}</h3>
//           <p><strong>Patient ID:</strong> {selectedPatient.patientInfo.patientId}</p>
//           <p><strong>Gender:</strong> {selectedPatient.patientInfo.personal_information.gender}</p>
//           <p><strong>DOB:</strong> {selectedPatient.patientInfo.personal_information.date_of_birth}</p>
//           <p><strong>Education:</strong> {selectedPatient.patientInfo.personal_information.education_level}</p>

//           <h4 style={{ marginTop: '1rem', color: '#374151' }}>Medical History</h4>
//           <p><strong>Memory Issues:</strong> {selectedPatient.patientInfo.medical_history.memory_or_thinking_problems.response}</p>
//           <p><strong>Balance Problems:</strong> {selectedPatient.patientInfo.medical_history.balance_problems.response}</p>
//           <p><strong>Mood Status:</strong> {selectedPatient.patientInfo.medical_history.mood_status.sad_or_depressed}</p>

//           <h4 style={{ marginTop: '1rem', color: '#374151' }}>Test Results ({selectedPatient.testCount} tests)</h4>
//           {selectedPatient.latestTest ? (
//             <div style={{ backgroundColor: '#f0f9ff', padding: '1rem', borderRadius: '8px', marginTop: '0.5rem' }}>
//               <p><strong>Latest Test Score:</strong> {selectedPatient.latestTest.totalScore}/100</p>
//               <p><strong>Risk Level:</strong> {selectedPatient.latestTest.prediction?.riskLevel || 'N/A'}</p>
//               <p><strong>Date:</strong> {new Date(selectedPatient.latestTest.createdAt).toLocaleDateString()}</p>
//             </div>
//           ) : (
//             <p>No test results yet</p>
//           )}
//         </div>
//       </div>
//     );

//   return (
//     <div className="card">
//       <h2>Doctor Dashboard</h2>
//       <p>Total Patients: {patients.length}</p>

//       <table style={styles.table}>
//         <thead style={styles.thead}>
//           <tr>
//             <th style={styles.th}>Name</th>
//             <th style={styles.th}>Gender</th>
//             <th style={styles.th}>Latest Score</th>
//             <th style={styles.th}>Risk Level</th>
//             <th style={{ ...styles.th, textAlign: 'center' }}>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {patients.map((p, idx) => (
//             <tr
//               key={p.patientId}
//               style={{
//                 ...styles.tr,
//                 ...(idx % 2 !== 0 ? styles.trAlt : {}),
//               }}
//               onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.trHover.backgroundColor)}
//               onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = idx % 2 !== 0 ? styles.trAlt.backgroundColor : styles.tr.backgroundColor)}
//             >
//               <td style={styles.td}>{p.name}</td>
//               <td style={styles.td}>{p.gender}</td>
//               <td style={styles.td}>{p.latestTest ? `${p.latestTest.totalScore}/100` : 'N/A'}</td>
//               <td style={styles.td}>
//                 <span style={styles.riskTag(p.latestTest?.riskLevel)}>
//                   {p.latestTest?.riskLevel || 'N/A'}
//                 </span>
//               </td>
//               <td style={{ ...styles.td, textAlign: 'center' }}>
//                 <button style={styles.button} onClick={() => handleViewPatient(p.patientId)}>
//                   View Details
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <button onClick={() => setRoute('dashboard')} style={styles.backButton}>
//         Back to Dashboard
//       </button>
//     </div>
//   );
// }

// export default DoctorDashboard;



// import React, { useState, useEffect } from 'react';
// import api from '../api';

// function DoctorDashboard({ setRoute }) {
//   const [patients, setPatients] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [selectedPatient, setSelectedPatient] = useState(null);

//   useEffect(() => {
//     fetchPatients();
//   }, []);

//   const fetchPatients = async () => {
//     try {
//       setLoading(true);
//       setError('');
//       console.log('Fetching patients...');
      
//       const response = await api.getDoctorPatients();
//       console.log('Patients response:', response.data);
      
//       setPatients(response.data || []);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching patients:', error);
//       setError('Failed to load patients. ' + (error.response?.data?.error || error.message));
//       setLoading(false);
//     }
//   };

//   const handleViewPatient = async (patientId) => {
//     try {
//       const response = await api.getPatientDetails(patientId);
//       setSelectedPatient(response.data);
//     } catch (error) {
//       setError('Failed to load patient details');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="card" style={{ textAlign: 'center' }}>
//         <h2>Doctor Dashboard</h2>
//         <p>Loading patients...</p>
//         <div style={{ fontSize: '2rem' }}>⏳</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="card" style={{ textAlign: 'center', color: 'red' }}>
//         <h2>Doctor Dashboard</h2>
//         <p>⚠️ {error}</p>
//         <button onClick={fetchPatients}>Retry</button>
//         <button onClick={() => setRoute('login')} style={{ marginLeft: '1rem' }}>Back to Login</button>
//       </div>
//     );
//   }

//   if (selectedPatient) {
//     return (
//       <div className="card" style={{ backgroundColor: '#ffffff' }}>
//         <h2>Patient Details</h2>
//         <button onClick={() => setSelectedPatient(null)} style={{ marginBottom: '1rem' }}>← Back to List</button>
        
//         <div style={{ marginTop: '2rem', textAlign: 'left', color: '#000000' }}>
//           <h3>{selectedPatient.patientInfo.personal_information.name}</h3>
//           <p><strong>Patient ID:</strong> {selectedPatient.patientInfo.patientId}</p>
//           <p><strong>Gender:</strong> {selectedPatient.patientInfo.personal_information.gender}</p>
//           <p><strong>DOB:</strong> {selectedPatient.patientInfo.personal_information.date_of_birth}</p>
//           <p><strong>Education:</strong> {selectedPatient.patientInfo.personal_information.education_level}</p>

//           <h4>Medical History</h4>
//           <p><strong>Memory Issues:</strong> {selectedPatient.patientInfo.medical_history.memory_or_thinking_problems.response}</p>
//           <p><strong>Balance Problems:</strong> {selectedPatient.patientInfo.medical_history.balance_problems.response}</p>
//           <p><strong>Mood Status:</strong> {selectedPatient.patientInfo.medical_history.mood_status.sad_or_depressed}</p>

//           <h4>Test Results ({selectedPatient.testCount} tests)</h4>
//           {selectedPatient.latestTest ? (
//             <div style={{ backgroundColor: '#f0f9ff', padding: '1rem', borderRadius: '8px', color: '#000000' }}>
//               <p><strong>Latest Test Score:</strong> {selectedPatient.latestTest.totalScore}/100</p>
//               <p><strong>Risk Level:</strong> {selectedPatient.latestTest.prediction?.riskLevel || 'N/A'}</p>
//               <p><strong>Date:</strong> {new Date(selectedPatient.latestTest.createdAt).toLocaleDateString()}</p>
//               <p><strong>Memory:</strong> {selectedPatient.latestTest.scores?.memory?.toFixed(1) || 'N/A'}</p>
//               <p><strong>Attention:</strong> {selectedPatient.latestTest.scores?.attention?.toFixed(1) || 'N/A'}</p>
//               <p><strong>Orientation:</strong> {selectedPatient.latestTest.scores?.orientation?.toFixed(1) || 'N/A'}</p>
//             </div>
//           ) : (
//             <p>No test results yet</p>
//           )}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="card" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
//       <h2 style={{ color: '#000000' }}>Doctor Dashboard</h2>
//       <p style={{ color: '#000000' }}>Total Patients: {patients.length}</p>

//       {patients.length === 0 ? (
//         <div style={{ textAlign: 'center', padding: '2rem', color: '#000000' }}>
//           <p>No patients found</p>
//         </div>
//       ) : (
//         <table style={{ 
//           width: '100%', 
//           borderCollapse: 'collapse', 
//           marginTop: '2rem',
//           backgroundColor: '#ffffff',
//           boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
//           borderRadius: '8px',
//           overflow: 'hidden'
//         }}>
//           <thead style={{ 
//             backgroundColor: '#f3f4f6', 
//             borderBottom: '2px solid #d1d5db'
//           }}>
//             <tr>
//               <th style={{ 
//                 padding: '1rem', 
//                 textAlign: 'left',
//                 color: '#1f2937',
//                 fontWeight: '600'
//               }}>Patient Name</th>
//               <th style={{ 
//                 padding: '1rem', 
//                 textAlign: 'left',
//                 color: '#1f2937',
//                 fontWeight: '600'
//               }}>Gender</th>
//               <th style={{ 
//                 padding: '1rem', 
//                 textAlign: 'left',
//                 color: '#1f2937',
//                 fontWeight: '600'
//               }}>Latest Score</th>
//               <th style={{ 
//                 padding: '1rem', 
//                 textAlign: 'left',
//                 color: '#1f2937',
//                 fontWeight: '600'
//               }}>Risk Level</th>
//               <th style={{ 
//                 padding: '1rem', 
//                 textAlign: 'center',
//                 color: '#1f2937',
//                 fontWeight: '600'
//               }}>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {patients.map((patient, index) => (
//               <tr 
//                 key={patient.patientId} 
//                 style={{ 
//                   borderBottom: '1px solid #e5e7eb',
//                   backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb',
//                   color: '#000000'
//                 }}
//               >
//                 <td style={{ 
//                   padding: '1rem',
//                   color: '#000000'
//                 }}>{patient.name || 'N/A'}</td>
//                 <td style={{ 
//                   padding: '1rem',
//                   color: '#000000'
//                 }}>{patient.gender || 'N/A'}</td>
//                 <td style={{ 
//                   padding: '1rem',
//                   color: '#000000',
//                   fontWeight: '500'
//                 }}>
//                   {patient.latestTest ? `${patient.latestTest.totalScore}/100` : 'N/A'}
//                 </td>
//                 <td style={{ padding: '1rem' }}>
//                   <span style={{
//                     padding: '0.35rem 0.75rem',
//                     borderRadius: '4px',
//                     fontSize: '0.85rem',
//                     fontWeight: '500',
//                     backgroundColor: 
//                       patient.latestTest?.riskLevel === 'high' ? '#fee2e2' :
//                       patient.latestTest?.riskLevel === 'medium' ? '#fef3c7' :
//                       patient.latestTest?.riskLevel === 'low' ? '#dbeafe' :
//                       '#e5e7eb',
//                     color:
//                       patient.latestTest?.riskLevel === 'high' ? '#991b1b' :
//                       patient.latestTest?.riskLevel === 'medium' ? '#92400e' :
//                       patient.latestTest?.riskLevel === 'low' ? '#1e40af' :
//                       '#374151'
//                   }}>
//                     {patient.latestTest?.riskLevel || 'N/A'}
//                   </span>
//                 </td>
//                 <td style={{ 
//                   padding: '1rem', 
//                   textAlign: 'center'
//                 }}>
//                   <button 
//                     onClick={() => handleViewPatient(patient.patientId)}
//                     style={{ 
//                       padding: '0.5rem 1rem', 
//                       backgroundColor: '#2563eb', 
//                       color: 'white', 
//                       border: 'none', 
//                       borderRadius: '4px', 
//                       cursor: 'pointer',
//                       fontSize: '0.9rem',
//                       fontWeight: '500',
//                       transition: 'background-color 0.2s'
//                     }}
//                     onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
//                     onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
//                   >
//                     View Details
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       <button 
//         onClick={() => setRoute('dashboard')}
//         style={{ 
//           marginTop: '2rem', 
//           padding: '0.75rem 1.5rem', 
//           backgroundColor: '#6b7280', 
//           color: 'white', 
//           border: 'none', 
//           borderRadius: '4px', 
//           cursor: 'pointer',
//           fontWeight: '500',
//           transition: 'background-color 0.2s'
//         }}
//         onMouseOver={(e) => e.target.style.backgroundColor = '#4b5563'}
//         onMouseOut={(e) => e.target.style.backgroundColor = '#6b7280'}
//       >
//         Back to Dashboard
//       </button>
//     </div>
//   );
// }

// export default DoctorDashboard;




import React, { useState, useEffect } from 'react';
import api from '../api';
import '../App.css'; // Make sure CSS is imported

function DoctorDashboard({ setRoute }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Fetching patients...');
      
      const response = await api.getDoctorPatients();
      console.log('Patients response:', response.data);
      
      setPatients(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching patients:', error);
      setError('Failed to load patients. ' + (error.response?.data?.error || error.message));
      setLoading(false);
    }
  };

  const handleViewPatient = async (patientId) => {
    try {
      const response = await api.getPatientDetails(patientId);
      setSelectedPatient(response.data);
    } catch (error) {
      setError('Failed to load patient details');
    }
  };

  if (loading) {
    return (
      <div className="doctor-dashboard-container" style={{ padding: '2rem' }}>
        <h2>Doctor Dashboard</h2>
        <p>Loading patients...</p>
        <div style={{ fontSize: '2rem' }}>⏳</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="doctor-dashboard-container" style={{ padding: '2rem' }}>
        <h2>Doctor Dashboard</h2>
        <p style={{ color: 'red' }}>⚠️ {error}</p>
        <button onClick={fetchPatients} style={{ marginRight: '1rem', padding: '0.5rem 1rem' }}>
          Retry
        </button>
        <button onClick={() => setRoute('login')} style={{ padding: '0.5rem 1rem' }}>
          Back to Login
        </button>
      </div>
    );
  }

  if (selectedPatient) {
    return (
      <div className="doctor-dashboard-container" style={{ padding: '2rem' }}>
        <h2>Patient Details</h2>
        <button 
          onClick={() => setSelectedPatient(null)} 
          style={{ marginBottom: '1rem', padding: '0.5rem 1rem' }}
        >
          ← Back to List
        </button>
        
        <div style={{ marginTop: '2rem', textAlign: 'left' }}>
          <h3>{selectedPatient.patientInfo.personal_information.name}</h3>
          <p><strong>Patient ID:</strong> {selectedPatient.patientInfo.patientId}</p>
          <p><strong>Gender:</strong> {selectedPatient.patientInfo.personal_information.gender}</p>
          <p><strong>DOB:</strong> {selectedPatient.patientInfo.personal_information.date_of_birth}</p>
          <p><strong>Education:</strong> {selectedPatient.patientInfo.personal_information.education_level}</p>

          <h4>Medical History</h4>
          <p><strong>Memory Issues:</strong> {selectedPatient.patientInfo.medical_history.memory_or_thinking_problems.response}</p>
          <p><strong>Balance Problems:</strong> {selectedPatient.patientInfo.medical_history.balance_problems.response}</p>
          <p><strong>Mood Status:</strong> {selectedPatient.patientInfo.medical_history.mood_status.sad_or_depressed}</p>

          <h4>Test Results ({selectedPatient.testCount} tests)</h4>
          {selectedPatient.latestTest ? (
            <div style={{ backgroundColor: '#f0f9ff', padding: '1rem', borderRadius: '8px' }}>
              <p><strong>Latest Test Score:</strong> {selectedPatient.latestTest.totalScore}/100</p>
              <p><strong>Risk Level:</strong> {selectedPatient.latestTest.prediction?.riskLevel || 'N/A'}</p>
              <p><strong>Date:</strong> {new Date(selectedPatient.latestTest.createdAt).toLocaleDateString()}</p>
              <p><strong>Memory:</strong> {selectedPatient.latestTest.scores?.memory?.toFixed(1) || 'N/A'}</p>
              <p><strong>Attention:</strong> {selectedPatient.latestTest.scores?.attention?.toFixed(1) || 'N/A'}</p>
              <p><strong>Orientation:</strong> {selectedPatient.latestTest.scores?.orientation?.toFixed(1) || 'N/A'}</p>
            </div>
          ) : (
            <p>No test results yet</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="doctor-dashboard-container" style={{ padding: '2rem' }}>
      <h2>Doctor Dashboard</h2>
      <p><strong>Total Patients: {patients.length}</strong></p>

      {patients.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>No patients found</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto', marginTop: '2rem' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px'
          }}>
            <thead>
              <tr>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #d1d5db' }}>
                  Patient Name
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #d1d5db' }}>
                  Gender
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #d1d5db' }}>
                  Latest Score
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #d1d5db' }}>
                  Risk Level
                </th>
                <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #d1d5db' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient, index) => {
                const riskLevel = patient.latestTest?.riskLevel;
                let badgeClass = 'risk-badge-na';
                if (riskLevel === 'high') badgeClass = 'risk-badge-high';
                else if (riskLevel === 'medium') badgeClass = 'risk-badge-medium';
                else if (riskLevel === 'low') badgeClass = 'risk-badge-low';

                return (
                  <tr key={patient.patientId} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '1rem' }}>
                      {patient.name || 'N/A'}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {patient.gender || 'N/A'}
                    </td>
                    <td style={{ padding: '1rem', fontWeight: '500' }}>
                      {patient.latestTest ? `${patient.latestTest.totalScore}/100` : 'N/A'}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span className={badgeClass} style={{
                        padding: '0.35rem 0.75rem',
                        borderRadius: '4px',
                        fontSize: '0.85rem',
                        fontWeight: '500',
                        display: 'inline-block'
                      }}>
                        {riskLevel || 'N/A'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <button 
                        onClick={() => handleViewPatient(patient.patientId)}
                        style={{ 
                          padding: '0.5rem 1rem',
                          backgroundColor: '#2563eb',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          fontWeight: '500'
                        }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <button 
        onClick={() => setRoute('dashboard')}
        style={{ 
          marginTop: '2rem',
          padding: '0.75rem 1.5rem',
          backgroundColor: '#6b7280',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: '500'
        }}
      >
        Back to Dashboard
      </button>
    </div>
  );
}

export default DoctorDashboard;
