// import { Link } from "react-router-dom";

// function Dashboard() {
//   return (
//     <div>
//       <h2>Patient Dashboard</h2>
//       <Link to="/test"><button>Take Cognitive Test</button></Link>
//       <button>Test Result</button>
//       <button>Download Report</button>
//       <button>Statistical Methods Used</button>
//       <Link to="/consult"><button>Consult Doctor</button></Link>
//     </div>
//   );
// }

// export default Dashboard;



import { Link } from "react-router-dom";

function Dashboard({ setRoute }) {
  return (
    <div className="card" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
      <h2>Patient Dashboard</h2>
      
      <div className="dashboard-buttons">
        <button onClick={() => setRoute('test')} style={{ padding: '1rem 2rem' }}>
          📝 Take Cognitive Test
        </button>
        
        <button onClick={() => setRoute('test-results')} style={{ padding: '1rem 2rem' }}>
          📊 View My Results
        </button>
        
        <button style={{ padding: '1rem 2rem' }}>
          📥 Download Report
        </button>
        
        <button style={{ padding: '1rem 2rem' }}>
          📚 Statistical Methods Used
        </button>
        
        <button onClick={() => setRoute('consult')} style={{ padding: '1rem 2rem' }}>
          👨‍⚕️ Consult Doctor
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
