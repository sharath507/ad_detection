// // client/src/api.js
// const api = {
//   login: async (credentials) => {
//     await new Promise(resolve => setTimeout(resolve, 500));
//     if (credentials.username === "patient" && credentials.password === "test") {
//       return { success: true, user: { username: 'patient', role: 'patient' } };
//     }
//     if (credentials.username === "doctor" && credentials.password === "test") {
//       return { success: true, user: { username: 'doctor', role: 'doctor' } };
//     }
//     return { success: false, message: "Invalid credentials. Use 'patient'/'test' or 'doctor'/'test'." };
//   },
//   signup: async (formData) => {
//     await new Promise(resolve => setTimeout(resolve, 800));
//     if (formData.username === 'testuser') {
//       return { success: false, message: 'This username is already taken.' };
//     }
//     return { success: true, user: { username: formData.username } };
//   },
//   getPatients: async () => {
//     await new Promise(resolve => setTimeout(resolve, 600));
//     return [
//       { name: "John Doe", age: 70, testStatus: "Completed", result: "Positive" },
//       { name: "Jane Smith", age: 65, testStatus: "Pending", result: "N/A" },
//       { name: "Michael Lee", age: 72, testStatus: "Completed", result: "Negative" },
//       { name: "Sarah Brown", age: 75, testStatus: "Completed", result: "Positive" },
//     ];
//   },
//   submitCognitiveTest: async (answers) => {
//     await new Promise(resolve => setTimeout(resolve, 1000));
//     return { success: true, message: 'Assessment submitted successfully.' };
//   }
// };

// export default api;


// src/api.js (Updated)
// import axios from 'axios';

// const API_URL = 'http://localhost:5000/api';

// const api = {
//   // Auth
//   signup: (data) => axios.post(`${API_URL}/auth/signup`, data),
//   login: (data) => axios.post(`${API_URL}/auth/login`, data),
  
//   // Patient Info
//   savePatientInfo: (data) => axios.post(`${API_URL}/test/patient-info`, data, {
//     headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//   }),
  
//   // Test Submission
//   submitCognitiveTest: (testData) => axios.post(`${API_URL}/test/submit-test`, testData, {
//     headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//   }),
  
//   // Results
//   getTestResults: (patientId) => axios.get(`${API_URL}/test/test-results/${patientId}`, {
//     headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//   })
// };

// export default api;


import axios from 'axios';

const API_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL)
  ? import.meta.env.VITE_API_URL
  : '/api';

const api = {
  // Auth
  signup: (data) => {
    return axios.post(`${API_URL}/auth/signup`, {
      email: data.email,
      password: data.password,
      fullName: data.fullName,
      role: data.role
    });
  },
  
  login: (data) => {
    return axios.post(`${API_URL}/auth/login`, {
      email: data.email,
      password: data.password
    });
  },
  
  // Patient Info
  savePatientInfo: (data) => axios.post(`${API_URL}/test/patient-info`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }),
  
  // Test Submission
  submitCognitiveTest: (testData) => axios.post(`${API_URL}/test/submit-test`, testData, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }),
  
  // Results
  // getTestResults: (patientId) => axios.get(`${API_URL}/test/test-results/${patientId}`, {
  //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  // }),

  // Get test results for specific patient
getTestResults: (patientId) => {
  return axios.get(`${API_URL}/test/test-results/${patientId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
},


  // Doctor endpoints
  getDoctorPatients: () => axios.get(`${API_URL}/test/doctor/patients`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }),

  getPatientDetails: (patientId) => axios.get(`${API_URL}/test/doctor/patient/${patientId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  })
};

export default api;
