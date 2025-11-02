// // import { Link } from "react-router-dom";

// // function Navbar() {
// //   return (
// //     <nav>
// //       <Link to="/">About Us</Link>
// //       <Link to="/consult">Consult Doctor</Link>
// //       <Link to="/test">Take Cognitive Test</Link>
// //       <Link to="/login">Login</Link>
// //       <Link to="/signup">Signup</Link>
// //     </nav>
// //   );
// // }

// // export default Navbar;



// import { Link } from "react-router-dom";

// function Navbar() {
//   return (
//     <nav style={{ backgroundColor: '#1d4ed8', padding: '18px 32px', display: 'flex', gap: '24px' }}>
//       <Link to="/" style={linkStyle}>About Us</Link>
//       <Link to="/consult" style={linkStyle}>Consult Doctor</Link>
//       <Link to="/test" style={linkStyle}>Take Cognitive Test</Link>
//       <Link to="/login" style={linkStyle}>Login</Link>
//       <Link to="/signup" style={linkStyle}>Signup</Link>
//       <Link to="/dashboard" style={linkStyle}>Patient Dashboard</Link>
//       <Link to="/doctor-dashboard" style={linkStyle}>Doctor Dashboard</Link>
//       <Link to="/doctor-profile" style={linkStyle}>My Profile</Link>
//     </nav>
//   );
// }

// const linkStyle = {
//   color: "#fff",
//   textDecoration: "none",
//   fontWeight: "700",
//   fontSize: "1.1rem",
//   transition: "color 0.3s ease",
// };

// export default Navbar;


import React from 'react';

const linkStyle = {
  color: "#fff",
  textDecoration: "none",
  fontWeight: "700",
  fontSize: "1.1rem",
  transition: "color 0.3s ease",
  cursor: 'pointer'
};

function Navbar({ setRoute, setLoggedInUser, loggedInUser, currentRoute }) {
  const handleLogout = () => {
    setLoggedInUser(null);
    setRoute('login');
  };

  const isActive = (route) => currentRoute === route;
  const getStyle = (route) => ({
    ...linkStyle,
    textDecoration: isActive(route) ? 'underline' : 'none',
    opacity: isActive(route) ? 1 : 0.9
  });

  return (
    <nav style={{ backgroundColor: '#1d4ed8', padding: '18px 32px', display: 'flex', flexWrap: 'wrap', gap: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <a onClick={() => setRoute('about')} style={getStyle('about')}>About Us</a>
      {(!loggedInUser || loggedInUser.role !== 'doctor') && (
        <a onClick={() => setRoute('consult')} style={getStyle('consult')}>Consult Doctor</a>
      )}
      {loggedInUser && loggedInUser.role !== 'doctor' && (
        <a onClick={() => setRoute('test')} style={getStyle('test')}>Take Cognitive Test</a>
      )}
      <div style={{ marginLeft: 'auto', display: 'flex', gap: '24px' }}>
        {loggedInUser ? (
          <>
            {loggedInUser.role === 'patient' && <a onClick={() => setRoute('dashboard')} style={getStyle('dashboard')}>Patient Dashboard</a>}
            {loggedInUser.role === 'doctor' && <a onClick={() => setRoute('doctor-dashboard')} style={getStyle('doctor-dashboard')}>Doctor Dashboard</a>}
            {loggedInUser.role === 'doctor' && <a onClick={() => setRoute('doctor-profile')} style={getStyle('doctor-profile')}>My Profile</a>}
            <a onClick={handleLogout} style={linkStyle}>Logout ({loggedInUser.username})</a>
          </>
        ) : (
          <>
            <a onClick={() => setRoute('login')} style={getStyle('login')}>Login</a>
            <a onClick={() => setRoute('signup')} style={getStyle('signup')}>Signup</a>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
