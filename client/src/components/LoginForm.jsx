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
    <div className="card">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input 
          name="email" 
          type="email"
          placeholder="Email" 
          value={user.email}
          onChange={handleChange} 
          required 
        />
        <input 
          name="password" 
          type="password" 
          placeholder="Password" 
          value={user.password}
          onChange={handleChange} 
          required 
        />
        {error && <p style={{color: 'red', marginBottom: '1rem'}}>{error}</p>}
        
        <button type="submit" disabled={isLoading} style={{width: '100%'}}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        
        <p style={{marginTop: '1rem', fontSize: '0.9rem'}}>
          Don't have an account? 
          <button 
            type="button" 
            onClick={() => setRoute('signup')}
            style={{background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', marginLeft: '0.5rem'}}
          >
            Sign up here
          </button>
        </p>
      </form>
    </div>
  );
}

export default LoginForm;
