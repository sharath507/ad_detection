// import React from 'react';

// function DoctorProfile() {
//   const profileData = {
//     name: "Dr. Alice Johnson",
//     specialization: "Neurologist",
//     experience: "15 years",
//     certification: "MD, PhD",
//     hospital: "City Hospital"
//   };

//   return (
//     <div style={{ padding: '20px', backgroundColor: '#f0f8ff', borderRadius: '8px', maxWidth: '400px', margin: '20px auto' }}>
//       <h2>My Profile</h2>
//       <p><strong>Name:</strong> {profileData.name}</p>
//       <p><strong>Specialization:</strong> {profileData.specialization}</p>
//       <p><strong>Experience:</strong> {profileData.experience}</p>
//       <p><strong>Certification:</strong> {profileData.certification}</p>
//       <p><strong>Hospital:</strong> {profileData.hospital}</p>
//     </div>
//   );
// }

// export default DoctorProfile;


import React from 'react';

function DoctorProfile() {
  const profileData = {
    name: "Dr. Alice Johnson",
    specialization: "Neurologist",
    experience: "15 years",
    certification: "MD, PhD in Cognitive Neuroscience",
    hospital: "General Hospital, NeuroCare Department"
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '640px' }}>
        <h2 style={{ textAlign: 'center' }}>My Profile</h2>
        <div style={{ lineHeight: '2' }}>
          <p><strong>Name:</strong> {profileData.name}</p>
          <p><strong>Specialization:</strong> {profileData.specialization}</p>
          <p><strong>Experience:</strong> {profileData.experience}</p>
          <p><strong>Certification:</strong> {profileData.certification}</p>
          <p><strong>Hospital:</strong> {profileData.hospital}</p>
        </div>
      </div>
    </div>
  );
}

export default DoctorProfile;
