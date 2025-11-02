// import React, { useState } from "react";

// function SignupForm() {
//   const [form, setForm] = useState({
//     name: "",
//     dob: "",
//     country: "",
//     city: "",
//     age: "",
//     username: "",
//     password: ""
//   });

//   function handleChange(e) {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   }

//   function handleSubmit(e) {
//     e.preventDefault();
//     // Placeholder: Add DB integration later
//     alert("Signup submitted:\n" + JSON.stringify(form, null, 2));
//   }

//   return (
//     <form onSubmit={handleSubmit}>
//       <input name="name" placeholder="Full Name" onChange={handleChange} required />
//       <input name="dob" type="date" placeholder="Date of Birth" onChange={handleChange} required />
//       <input name="country" placeholder="Country" onChange={handleChange} required />
//       <input name="city" placeholder="City" onChange={handleChange} required />
//       <input name="age" type="number" placeholder="Age" onChange={handleChange} required />
//       <input name="username" placeholder="Username" onChange={handleChange} required />
//       <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
//       <button type="submit">Signup</button>
//     </form>
//   );
// }

// export default SignupForm;


// import React, { useState } from "react";
// import api from '../api';

// function SignupForm({ setRoute }) {
//   const [form, setForm] = useState({ name: "", dob: "", country: "", city: "", age: "", username: "", password: "" });
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError('');
//     const response = await api.signup(form);
//     setIsLoading(false);
//     if (response.success) {
//       alert("Signup Successful! You can now log in.");
//       setRoute('login');
//     } else {
//       setError(response.message || 'Signup failed. Please try again.');
//     }
//   };

//   return (
//     <div className="card">
//       <h2>Create an Account</h2>
//       <form onSubmit={handleSubmit}>
//         <input name="name" placeholder="Full Name" onChange={handleChange} required />
//         <input name="dob" type="date" placeholder="Date of Birth" onChange={handleChange} required />
//         <input name="country" placeholder="Country" onChange={handleChange} required />
//         <input name="city" placeholder="City" onChange={handleChange} required />
//         <input name="age" type="number" placeholder="Age" onChange={handleChange} required />
//         <input name="username" placeholder="Username" onChange={handleChange} required />
//         <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
//         {error && <p style={{color: 'red'}}>{error}</p>}
//         <button type="submit" disabled={isLoading}>{isLoading ? 'Signing up...' : 'Signup'}</button>
//       </form>
//     </div>
//   );
// }
// export default SignupForm;



import React, { useState } from "react";
import api from '../api';

function SignupForm({ setRoute }) {
  const [form, setForm] = useState({ 
    fullName: "", 
    email: "", 
    password: "", 
    confirmPassword: "",
    role: "patient"
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await api.signup({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        role: form.role
      });

      setIsLoading(false);
      
      if (response.data?.token) {
        // Save token
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.userId);
        alert("Signup Successful! You can now log in.");
        setRoute('login');
      } else {
        setError(response.data?.error || 'Signup failed. Please try again.');
      }
    } catch (error) {
      setIsLoading(false);
      setError(error.response?.data?.error || 'Signup failed. Please try again.');
      console.error('Signup error:', error);
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: '24px auto', border: '1px solid #e7ebea', borderRadius: 18, overflow: 'hidden', background: '#ffffff' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 52%', minWidth: 300, background: 'linear-gradient(135deg,#eef3ed 0%,#faf8f4 60%,#ffffff 100%)', padding: '42px 32px' }}>
          <div style={{ color: '#4b5563', fontWeight: 700, marginBottom: 8 }}>Alzheimer’s Assessment</div>
          <h1 style={{ margin: 0, fontSize: 32, lineHeight: 1.3, color: '#1f2937' }}>Create Your Account</h1>
          <p style={{ marginTop: 12, color: '#374151', fontSize: 18, lineHeight: 1.6 }}>
            Start your journey with a calm, accessible experience designed for clarity and confidence.
          </p>
          <ul style={{ marginTop: 16, color: '#374151', lineHeight: 1.8, fontSize: 16, paddingLeft: 18 }}>
            <li>Secure sign up with email</li>
            <li>Designed for readability and ease</li>
            <li>Doctor and patient roles supported</li>
          </ul>
        </div>
        <div style={{ flex: '1 1 48%', minWidth: 300, padding: '42px 32px', background: '#fff' }}>
          <h2 style={{ marginTop: 0, color: '#1f2937' }}>Sign up</h2>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 14 }}>
            <label style={{ color: '#1f2937', fontWeight: 600, display: 'grid', gap: 6 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="8" r="4" stroke="#6b7280" strokeWidth="1.5"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke="#6b7280" strokeWidth="1.5"/></svg>
                Full Name
              </span>
              <input name="fullName" placeholder="Your full name" value={form.fullName} onChange={handleChange} required style={{ padding: '14px 16px', borderRadius: 12, border: '1px solid #d1d5db', fontSize: 16 }} />
            </label>
            <label style={{ color: '#1f2937', fontWeight: 600, display: 'grid', gap: 6 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 6a2 2 0 012-2h12a2 2 0 012 2v.5l-10 6-10-6V6z" stroke="#6b7280" strokeWidth="1.5"/><path d="M20 8.5l-8 4.8-8-4.8V18a2 2 0 002 2h12a2 2 0 002-2V8.5z" stroke="#6b7280" strokeWidth="1.5"/></svg>
                Email
              </span>
              <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required style={{ padding: '14px 16px', borderRadius: 12, border: '1px solid #d1d5db', fontSize: 16 }} />
            </label>
            <label style={{ color: '#1f2937', fontWeight: 600, display: 'grid', gap: 6 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="10" width="18" height="10" rx="2" stroke="#6b7280" strokeWidth="1.5"/><path d="M8 10V7a4 4 0 118 0v3" stroke="#6b7280" strokeWidth="1.5"/></svg>
                Password
              </span>
              <input name="password" type="password" placeholder="Password (min 6 characters)" value={form.password} onChange={handleChange} required style={{ padding: '14px 16px', borderRadius: 12, border: '1px solid #d1d5db', fontSize: 16 }} />
            </label>
            <label style={{ color: '#1f2937', fontWeight: 600, display: 'grid', gap: 6 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="10" width="18" height="10" rx="2" stroke="#6b7280" strokeWidth="1.5"/><path d="M8 10V7a4 4 0 118 0v3" stroke="#6b7280" strokeWidth="1.5"/></svg>
                Confirm Password
              </span>
              <input name="confirmPassword" type="password" placeholder="Re-enter your password" value={form.confirmPassword} onChange={handleChange} required style={{ padding: '14px 16px', borderRadius: 12, border: '1px solid #d1d5db', fontSize: 16 }} />
            </label>
            <label style={{ color: '#1f2937', fontWeight: 600, display: 'grid', gap: 6 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 12h12M6 12a2 2 0 110-4h12a2 2 0 110 4M6 12a2 2 0 100 4h12a2 2 0 100-4" stroke="#6b7280" strokeWidth="1.5"/></svg>
                Role
              </span>
              <select name="role" value={form.role} onChange={handleChange} required style={{ padding: '14px 16px', borderRadius: 12, border: '1px solid #d1d5db', fontSize: 16, background: '#ffffff', color: '#111827' }}>
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
              </select>
            </label>

            {error && <p style={{color: '#991b1b', background: '#fef2f2', border: '1px solid #fee2e2', padding: '10px 12px', borderRadius: 12}}>{error}</p>}

            <button type="submit" disabled={isLoading} style={{backgroundColor: '#1d4ed8', color: '#fff', border: 'none', borderRadius: 12, padding: '14px 16px', fontWeight: 700, cursor: 'pointer', fontSize: 16}}>
              {isLoading ? 'Signing up...' : 'Signup'}
            </button>

            <div style={{ marginTop: 6, color: '#374151', fontSize: 15 }}>
              Already have an account?
              <button type="button" onClick={() => setRoute('login')} style={{ background: 'none', border: 'none', color: '#1d4ed8', cursor: 'pointer', marginLeft: 8, fontWeight: 700 }}>
                Login here
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignupForm;
