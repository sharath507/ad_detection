// // import './App.css';
// // import AlzheimerAssessment from './AlzheimerAssessment.jsx';

// // function App() {
// //   return (
// //     <div>
// //       <AlzheimerAssessment />
// //     </div>
// //   );
// // }

// // export default App;


// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import SignupForm from './components/SignupForm';
// import LoginForm from './components/LoginForm';
// import Dashboard from './components/Dashboard';
// import CognitiveTest from './components/CognitiveTest';
// import AboutUs from './components/AboutUs';
// // import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import DoctorDashboard from './components/DoctorDashboard';
// import DoctorProfile from './components/DoctorProfile';

// function App() {
//   return (
//     <BrowserRouter>
//       <Navbar />
//       <Routes>
//         <Route path="/" element={<AboutUs />} />
//         <Route path="/consult" element={<div>Consult Doctor coming soon</div>} />
//         <Route path="/test" element={<CognitiveTest />} />
//         <Route path="/login" element={<LoginForm />} />
//         <Route path="/signup" element={<SignupForm />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
//         <Route path="/doctor-profile" element={<DoctorProfile />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;


// import React, { useState } from 'react';
// import Navbar from './components/Navbar';
// import AboutUs from './components/AboutUs';
// import SignupForm from './components/SignupForm';
// import LoginForm from './components/LoginForm';
// import PatientDashboard from './components/PatientDashboard';
// import CognitiveTest from './components/CognitiveTest';
// import DoctorDashboard from './components/DoctorDashboard';
// import DoctorProfile from './components/DoctorProfile';

// function App() {
//   const [route, setRoute] = useState('about');
//   const [loggedInUser, setLoggedInUser] = useState(null);

//   const renderContent = () => {
//     if (!loggedInUser && ['dashboard', 'doctor-dashboard', 'doctor-profile', 'test'].includes(route)) {
//       return <LoginForm setRoute={setRoute} setLoggedInUser={setLoggedInUser} />;
//     }
//     switch (route) {
//       case 'about':
//         return <AboutUs />;
//       case 'consult':
//         return <div className="card"><h2>Consult a Doctor</h2><p>This feature is coming soon. Please check back later.</p></div>;
//       case 'test':
//         return <CognitiveTest setRoute={setRoute} />;
//       case 'login':
//         return <LoginForm setRoute={setRoute} setLoggedInUser={setLoggedInUser} />;
//       case 'signup':
//         return <SignupForm setRoute={setRoute} />;
//       case 'dashboard':
//         return <PatientDashboard setRoute={setRoute} />;
//       case 'doctor-dashboard':
//         return <DoctorDashboard />;
//       case 'doctor-profile':
//         return <DoctorProfile />;
//       default:
//         return <AboutUs />;
//     }
//   };

//   return (
//     <>
//       <Navbar setRoute={setRoute} loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
//       <main>
//         {renderContent()}
//       </main>
//     </>
//   );
// }

// export default App;



// import React, { useState } from 'react';
// import Navbar from './components/Navbar';
// import AboutUs from './components/AboutUs';
// import SignupForm from './components/SignupForm';
// import LoginForm from './components/LoginForm';
// import PatientDashboard from './components/PatientDashboard';
// import CognitiveTest from './components/CognitiveTest';
// import DoctorDashboard from './components/DoctorDashboard';
// import DoctorProfile from './components/DoctorProfile';
// import TestResults from './components/TestResults';

// function App() {
//   const [route, setRoute] = useState('about');
//   const [loggedInUser, setLoggedInUser] = useState(null);

//   const renderContent = () => {
//     // Check if user is logged in (except for public routes)
//     if (!loggedInUser && ['dashboard', 'doctor-dashboard', 'doctor-profile', 'test', 'test-results'].includes(route)) {
//       return <LoginForm setRoute={setRoute} setLoggedInUser={setLoggedInUser} />;
//     }

//     switch (route) {
//       case 'about':
//         return <AboutUs />;
      
//       case 'consult':
//         return <div className="card"><h2>Consult a Doctor</h2><p>This feature is coming soon. Please check back later.</p></div>;
      
//       case 'test':
//         return <CognitiveTest setRoute={setRoute} />;
      
//       case 'login':
//         return <LoginForm setRoute={setRoute} setLoggedInUser={setLoggedInUser} />;
      
//       case 'signup':
//         return <SignupForm setRoute={setRoute} />;
      
//       case 'dashboard':
//         return <PatientDashboard setRoute={setRoute} />;
      
//       case 'test-results':
//         return <TestResults setRoute={setRoute} />;
      
//       case 'doctor-dashboard':
//         return <DoctorDashboard setRoute={setRoute} />;
      
//       case 'doctor-profile':
//         return <DoctorProfile />;
      
//       default:
//         return <AboutUs />;
//     }
//   };

//   return (
//     <>
//       <Navbar setRoute={setRoute} loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
//       <main>
//         {renderContent()}
//       </main>
//     </>
//   );
// }

// export default App;



import React, { useState } from 'react';
import Navbar from './components/Navbar';
import AboutUs from './components/AboutUs';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import PatientDashboard from './components/PatientDashboard';
import CognitiveTest from './components/CognitiveTest';
import DoctorDashboard from './components/DoctorDashboard';
import DoctorProfile from './components/DoctorProfile';
import TestResults from './components/TestResults';

function App() {
  const [route, setRoute] = useState('about');
  const [loggedInUser, setLoggedInUser] = useState(null);

  const renderContent = () => {
    // Check if user is logged in (except for public routes)
    if (!loggedInUser && ['dashboard', 'doctor-dashboard', 'doctor-profile', 'test', 'test-results'].includes(route)) {
      return <LoginForm setRoute={setRoute} setLoggedInUser={setLoggedInUser} />;
    }

    switch (route) {
      case 'about':
        return <AboutUs />;
      
      case 'consult':
        return (
          <div className="card">
            <h2>Consult a Doctor</h2>
            <p>This feature is coming soon. Please check back later.</p>
          </div>
        );
      
      case 'test':
        return <CognitiveTest setRoute={setRoute} />;
      
      case 'login':
        return <LoginForm setRoute={setRoute} setLoggedInUser={setLoggedInUser} />;
      
      case 'signup':
        return <SignupForm setRoute={setRoute} />;
      
      case 'dashboard':
        return <PatientDashboard setRoute={setRoute} />;
      
      case 'test-results':
        console.log('Rendering TestResults component'); // Debug log
        return <TestResults setRoute={setRoute} />;
      
      case 'doctor-dashboard':
        return <DoctorDashboard setRoute={setRoute} />;
      
      case 'doctor-profile':
        return <DoctorProfile />;
      
      default:
        return <AboutUs />;
    }
  };

  return (
    <>
      <Navbar setRoute={setRoute} loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} currentRoute={route} />
      <main>
        {renderContent()}
      </main>
    </>
  );
}

export default App;
