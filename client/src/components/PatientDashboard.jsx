// import React from 'react';

// function PatientDashboard({ setRoute }) {
//   return (
//     <div className="card">
//       <h2>Patient Dashboard</h2>
//       <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
//         <button onClick={() => setRoute('test')}>Take Cognitive Test</button>
//         <button onClick={() => alert('Feature coming soon!')}>Test Result</button>
//         <button onClick={() => alert('Feature coming soon!')}>Download Report</button>
//         <button onClick={() => alert('Feature coming soon!')}>Statistical Methods Used</button>
//         <button onClick={() => setRoute('consult')}>Consult Doctor</button>
//       </div>
//     </div>
//   );
// }

// export default PatientDashboard;



import React from 'react';

function PatientDashboard({ setRoute }) {
  return (
    <div className="card" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
      <h2>Patient Dashboard</h2>
      <p style={{ marginBottom: '2rem', color: '#666' }}>Welcome! Choose an option below to get started.</p>
      
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '2rem' }}>
        <button 
          onClick={() => {
            console.log('Navigating to test');
            setRoute('test');
          }}
          style={{ 
            flex: 1, 
            minWidth: '150px',
            padding: '1rem',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600'
          }}
        >
          📝 Take Cognitive Test
        </button>
        
        <button 
          onClick={() => {
            console.log('Navigating to test-results');
            setRoute('test-results');
          }}
          style={{ 
            flex: 1, 
            minWidth: '150px',
            padding: '1rem',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600'
          }}
        >
          📊 View Test Results
        </button>
        
        <button 
          onClick={() => {
            console.log('Navigating to test-results for download');
            setRoute('test-results');
          }}
          style={{ 
            flex: 1, 
            minWidth: '150px',
            padding: '1rem',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600'
          }}
        >
          📥 Download Report
        </button>
        
        <button 
          onClick={() => alert('Statistical Methods Used:\n\n1. Cognitive Component Scoring\n2. Risk Probability Model (ML)\n3. Machine Learning Classification\n4. Feature Extraction from Test Responses\n5. Mini-Cog Framework\n6. MoCA Assessment Protocol')}
          style={{ 
            flex: 1, 
            minWidth: '150px',
            padding: '1rem',
            backgroundColor: '#7c3aed',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600'
          }}
        >
          📚 Statistical Methods
        </button>
        
        <button 
          onClick={() => {
            console.log('Navigating to consult');
            setRoute('consult');
          }}
          style={{ 
            flex: 1, 
            minWidth: '150px',
            padding: '1rem',
            backgroundColor: '#059669',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600'
          }}
        >
          👨‍⚕️ Consult Doctor
        </button>
      </div>
    </div>
  );
}

export default PatientDashboard;
