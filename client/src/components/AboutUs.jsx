// export default function AboutUs() {
//   return (
//     <div>
//       <h1>About Alzheimer’s Assessment Project</h1>
//       <p>
//         This application helps screen and predict Alzheimer's disease using
//         cognitive assessments. It allows users to take tests, consult doctors,
//         view results, and download reports.
//       </p>
//       <p>
//         Developed as a MERN stack project with React for the frontend and Node.js
//         for the backend, this app aims to assist patients and clinicians alike.
//       </p>
//     </div>
//   );
// }


import React from 'react';
const AboutUs = () => (
  <>
    <section
      style={{
        background: 'linear-gradient(135deg, #e8f1ff 0%, #f7fbff 60%, #ffffff 100%)',
        border: '1px solid #e6eefc',
        borderRadius: 16,
        padding: '48px 32px',
        margin: '24px auto',
        maxWidth: 1100,
      }}
    >
      <div style={{ display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 440px', minWidth: 280 }}>
          <div style={{ color: '#1d4ed8', fontWeight: 700, letterSpacing: 0.4, marginBottom: 8 }}>Alzheimer’s Assessment</div>
          <h1 style={{ margin: 0, fontSize: 36, lineHeight: 1.2, color: '#0f172a' }}>
            Advancing Cognitive Health with Trusted AI Support
          </h1>
          <p style={{ marginTop: 12, color: '#334155', fontSize: 16 }}>
            A modern, privacy-conscious platform for early screening and monitoring. Built for patients and clinicians
            to collaborate with clarity and confidence.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
            <button
              onClick={() => (window.location.hash = '#/test')}
              style={{
                backgroundColor: '#1d4ed8',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                padding: '12px 16px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 6px 14px rgba(29,78,216,0.25)'
              }}
            >
              Take Assessment
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('about-details');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                backgroundColor: '#ffffff',
                color: '#1d4ed8',
                border: '1px solid #c6d5fb',
                borderRadius: 10,
                padding: '12px 16px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Learn More
            </button>
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 16, color: '#475569', fontSize: 14 }}>
            <div>Calming blues</div>
            <div>Clinical-grade design</div>
            <div>Data privacy first</div>
          </div>
        </div>
        <div style={{ flex: '1 1 420px', minWidth: 280 }}>
          <svg viewBox="0 0 520 360" width="100%" height="auto" role="img" aria-label="Human support silhouettes with subtle AI brain graphic">
            <title>Support and AI Brain</title>
            <defs>
              <linearGradient id="bgGrad" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#dbeafe" />
                <stop offset="100%" stopColor="#eff6ff" />
              </linearGradient>
              <linearGradient id="accent" x1="0" x2="1">
                <stop offset="0%" stopColor="#1d4ed8" />
                <stop offset="100%" stopColor="#60a5fa" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="520" height="360" rx="18" fill="url(#bgGrad)" />

            <circle cx="360" cy="130" r="78" fill="#ffffff" stroke="#93c5fd" strokeWidth="2" />
            <g>
              <circle cx="330" cy="110" r="5" fill="#1d4ed8" />
              <circle cx="355" cy="95" r="5" fill="#1d4ed8" />
              <circle cx="380" cy="115" r="5" fill="#1d4ed8" />
              <circle cx="350" cy="135" r="5" fill="#1d4ed8" />
              <circle cx="375" cy="145" r="5" fill="#1d4ed8" />
              <line x1="330" y1="110" x2="355" y2="95" stroke="#60a5fa" strokeWidth="2" />
              <line x1="355" y1="95" x2="380" y2="115" stroke="#60a5fa" strokeWidth="2" />
              <line x1="330" y1="110" x2="350" y2="135" stroke="#60a5fa" strokeWidth="2" />
              <line x1="350" y1="135" x2="375" y2="145" stroke="#60a5fa" strokeWidth="2" />
              <line x1="355" y1="95" x2="350" y2="135" stroke="#60a5fa" strokeWidth="2" />
            </g>

            <g transform="translate(60,180)">
              <circle cx="60" cy="-30" r="24" fill="#1e3a8a" opacity="0.95" />
              <rect x="40" y="-10" width="40" height="70" rx="18" fill="#1d4ed8" opacity="0.95" />
              <rect x="30" y="50" width="60" height="18" rx="9" fill="#93c5fd" opacity="0.9" />
              <circle cx="140" cy="-30" r="22" fill="#1e3a8a" opacity="0.9" />
              <rect x="120" y="-8" width="40" height="68" rx="18" fill="#3b82f6" opacity="0.95" />
              <rect x="110" y="50" width="60" height="18" rx="9" fill="#bfdbfe" opacity="0.9" />
              <rect x="70" y="10" width="40" height="14" rx="7" fill="#60a5fa" opacity="0.9" />
            </g>

            <path d="M300 250 C340 220, 420 220, 460 250" fill="none" stroke="url(#accent)" strokeWidth="6" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </section>

    <div id="about-details" className="card" style={{ maxWidth: '900px', margin: '0 auto', lineHeight: 1.6 }}>
      <h1>About the Alzheimer’s Assessment Platform</h1>
      <p>
        This platform provides structured cognitive screening and risk assessment support for Alzheimer’s disease.
        It is designed to help individuals complete validated assessments and to assist clinicians with organized,
        accessible results.
      </p>

      <h2 style={{ marginTop: '1.25rem' }}>Our Mission</h2>
      <p>
        To improve early identification and monitoring of cognitive decline by delivering a clear, accessible,
        and privacy-conscious digital assessment experience.
      </p>

      <h2 style={{ marginTop: '1.25rem' }}>What the Platform Offers</h2>
      <ul style={{ paddingLeft: '1.25rem' }}>
        <li>Guided cognitive screening with an intuitive test-taking experience.</li>
        <li>Secure access to results with structured summaries and downloadable reports.</li>
        <li>Optional consultation workflow to facilitate clinician review.</li>
        <li>Privacy and security by design, with role-based access for patients and doctors.</li>
      </ul>

      <h2 style={{ marginTop: '1.25rem' }}>How It Works</h2>
      <ol style={{ paddingLeft: '1.25rem' }}>
        <li>Create an account and sign in.</li>
        <li>Complete the cognitive assessment at your own pace.</li>
        <li>View results and download your report.</li>
        <li>Share results with a clinician or proceed to a consultation as appropriate.</li>
      </ol>

      <h2 style={{ marginTop: '1.25rem' }}>Technology</h2>
      <p>
        Built with the MERN stack to ensure reliability and responsiveness: React for the client interface and Node.js
        on the server, supported by a robust API and data layer.
      </p>

      <h2 style={{ marginTop: '1.25rem' }}>Disclaimer</h2>
      <p>
        This platform is intended to support screening and monitoring. It does not provide a medical diagnosis. Clinical
        evaluation by qualified healthcare professionals is required for diagnosis and treatment decisions.
      </p>
    </div>
  </>
);
export default AboutUs;
