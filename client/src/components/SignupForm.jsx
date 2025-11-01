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
    <div className="card">
      <h2>Create an Account</h2>
      <form onSubmit={handleSubmit}>
        <input 
          name="fullName" 
          placeholder="Full Name" 
          value={form.fullName}
          onChange={handleChange} 
          required 
        />
        <input 
          name="email" 
          type="email"
          placeholder="Email" 
          value={form.email}
          onChange={handleChange} 
          required 
        />
        <input 
          name="password" 
          type="password" 
          placeholder="Password (min 6 characters)" 
          value={form.password}
          onChange={handleChange} 
          required 
        />
        <input 
          name="confirmPassword" 
          type="password" 
          placeholder="Confirm Password" 
          value={form.confirmPassword}
          onChange={handleChange} 
          required 
        />
        <select 
          name="role" 
          value={form.role}
          onChange={handleChange}
          required
        >
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
        </select>

        {error && <p style={{color: 'red', marginBottom: '1rem'}}>{error}</p>}
        
        <button type="submit" disabled={isLoading} style={{width: '100%'}}>
          {isLoading ? 'Signing up...' : 'Signup'}
        </button>
        
        <p style={{marginTop: '1rem', fontSize: '0.9rem'}}>
          Already have an account? 
          <button 
            type="button" 
            onClick={() => setRoute('login')}
            style={{background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', marginLeft: '0.5rem'}}
          >
            Login here
          </button>
        </p>
      </form>
    </div>
  );
}

export default SignupForm;
