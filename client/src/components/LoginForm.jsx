// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// function LoginForm() {
//   const [user, setUser] = useState({ username: "", password: "" });
//   const navigate = useNavigate();

//   function handleChange(e) {
//     setUser({ ...user, [e.target.name]: e.target.value });
//   }

//   function handleSubmit(e) {
//     e.preventDefault();
//     // Placeholder: Add DB check later
//     if (user.username === "test" && user.password === "test") {
//       navigate("/dashboard");
//     } else {
//       alert("Invalid credentials");
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit}>
//       <input name="username" placeholder="Username" onChange={handleChange} required />
//       <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
//       <button type="submit">Login</button>
//     </form>
//   );
// }

// export default LoginForm;


// import React, { useState } from "react";
// import api from '../api';

// function LoginForm({ setRoute, setLoggedInUser }) {
//   const [user, setUser] = useState({ username: "", password: "" });
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError('');
//     const response = await api.login(user);
//     setIsLoading(false);
//     if (response.success) {
//       setLoggedInUser(response.user);
//       setRoute(response.user.role === 'patient' ? "dashboard" : "doctor-dashboard");
//     } else {
//       setError(response.message);
//     }
//   };

//   return (
//     <div className="card">
//       <h2>Login</h2>
//       <form onSubmit={handleSubmit}>
//         <input name="username" placeholder="Username" onChange={handleChange} required />
//         <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
//         {error && <p style={{color: 'red'}}>{error}</p>}
//         <button type="submit" disabled={isLoading}>{isLoading ? 'Logging in...' : 'Login'}</button>
//       </form>
//     </div>
//   );
// }

// export default LoginForm;


import React, { useState } from "react";
import api from '../api';

function LoginForm({ setRoute, setLoggedInUser }) {
  const [user, setUser] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await api.login({
        email: user.email,
        password: user.password
      });

      setIsLoading(false);

      if (response.data?.token) {
        // Save token and user info
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('userRole', response.data.user.role);
        
        setLoggedInUser(response.data.user);
        
        // Route based on role
        const route = response.data.user.role === 'doctor' ? 'doctor-dashboard' : 'dashboard';
        setRoute(route);
      } else {
        setError(response.data?.error || 'Login failed. Please try again.');
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Login error:', error);
      setError(error.response?.data?.error || 'Invalid email or password');
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: '24px auto', border: '1px solid #e7ebea', borderRadius: 18, overflow: 'hidden', background: '#ffffff' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 52%', minWidth: 300, background: 'linear-gradient(135deg,#eef3ed 0%,#faf8f4 60%,#ffffff 100%)', padding: '42px 32px' }}>
          <div style={{ color: '#4b5563', fontWeight: 700, marginBottom: 8 }}>Alzheimer’s Assessment</div>
          <h1 style={{ margin: 0, fontSize: 32, lineHeight: 1.3, color: '#1f2937' }}>Early Detection, Compassionate Care</h1>
          <p style={{ marginTop: 12, color: '#374151', fontSize: 18, lineHeight: 1.6 }}>
            Log in to continue your assessment, consult a specialist, and securely manage your appointments and results.
          </p>
          <ul style={{ marginTop: 16, color: '#374151', lineHeight: 1.8, fontSize: 16, paddingLeft: 18 }}>
            <li>Secure, privacy-first access</li>
            <li>Clear, senior-friendly interface</li>
            <li>Trusted medical guidance</li>
          </ul>
        </div>
        <div style={{ flex: '1 1 48%', minWidth: 300, padding: '42px 32px', background: '#fff' }}>
          <h2 style={{ marginTop: 0, color: '#1f2937' }}>Login</h2>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 14 }}>
            <label style={{ color: '#1f2937', fontWeight: 600, display: 'grid', gap: 6 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 6a2 2 0 012-2h12a2 2 0 012 2v.5l-10 6-10-6V6z" stroke="#6b7280" strokeWidth="1.5"/><path d="M20 8.5l-8 4.8-8-4.8V18a2 2 0 002 2h12a2 2 0 002-2V8.5z" stroke="#6b7280" strokeWidth="1.5"/></svg>
                Email
              </span>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={user.email}
                onChange={handleChange}
                required
                style={{ padding: '14px 16px', borderRadius: 12, border: '1px solid #d1d5db', fontSize: 16 }}
              />
            </label>
            <label style={{ color: '#1f2937', fontWeight: 600, display: 'grid', gap: 6 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="10" width="18" height="10" rx="2" stroke="#6b7280" strokeWidth="1.5"/><path d="M8 10V7a4 4 0 118 0v3" stroke="#6b7280" strokeWidth="1.5"/></svg>
                Password
              </span>
              <input
                name="password"
                type="password"
                placeholder="Enter your password"
                value={user.password}
                onChange={handleChange}
                required
                style={{ padding: '14px 16px', borderRadius: 12, border: '1px solid #d1d5db', fontSize: 16 }}
              />
            </label>

            {error && <p style={{color: '#991b1b', background: '#fef2f2', border: '1px solid #fee2e2', padding: '10px 12px', borderRadius: 12}}>{error}</p>}

            <button type="submit" disabled={isLoading} style={{backgroundColor: '#1d4ed8', color: '#fff', border: 'none', borderRadius: 12, padding: '14px 16px', fontWeight: 700, cursor: 'pointer', fontSize: 16}}>
              {isLoading ? 'Logging in...' : 'Login'}
            </button>

            <div style={{ marginTop: 6, color: '#374151', fontSize: 15 }}>
              Don’t have an account?
              <button
                type="button"
                onClick={() => setRoute('signup')}
                style={{ background: 'none', border: 'none', color: '#1d4ed8', cursor: 'pointer', marginLeft: 8, fontWeight: 700 }}
              >
                Sign up here
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
