import React, { useMemo, useState } from 'react';

const doctorsSeed = [
  { id: 1, name: 'Dr. Ananya Rao', specialty: 'Neurologist', rating: 4.8, location: 'Bengaluru', availability: ['2025-11-03T10:00', '2025-11-03T11:30', '2025-11-04T15:00'] },
  { id: 2, name: 'Dr. Arjun Mehta', specialty: 'Geriatrician', rating: 4.6, location: 'Mumbai', availability: ['2025-11-03T09:30', '2025-11-05T14:00'] },
  { id: 3, name: 'Dr. Priya Sharma', specialty: 'Neuropsychologist', rating: 4.9, location: 'Delhi', availability: ['2025-11-06T10:00', '2025-11-06T16:00'] },
];

function Hero({ onPrimary }) {
  return (
    <section style={{ background: 'linear-gradient(135deg,#eef3ed 0%,#faf8f4 60%,#ffffff 100%)', border: '1px solid #e7ebea', borderRadius: 18, padding: '48px 32px', margin: '28px auto', maxWidth: 1100 }}>
      <div style={{ display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 480px', minWidth: 300 }}>
          <div style={{ color: '#4b5563', fontWeight: 700, marginBottom: 10, fontSize: 16 }}>Consult a Doctor</div>
          <h1 style={{ margin: 0, fontSize: 36, lineHeight: 1.25, color: '#1f2937' }}>Professional Alzheimer’s Care, With Comfort and Clarity</h1>
          <p style={{ marginTop: 14, color: '#374151', fontSize: 18, lineHeight: 1.6 }}>Search trusted specialists, book appointments on a simple calendar, and connect securely—built to be soothing and easy to read.</p>
          <div style={{ display: 'flex', gap: 14, marginTop: 24, flexWrap: 'wrap' }}>
            <button onClick={onPrimary} style={{ backgroundColor: '#1d4ed8', color: '#fff', border: 'none', borderRadius: 12, padding: '14px 18px', fontWeight: 700, cursor: 'pointer' }}>Find a Doctor</button>
            <a href="#consult-hero-prompt" style={{ color: '#4b5563', fontWeight: 700, textDecoration: 'none', border: '1px solid #d9dedc', background: '#f6f4f1', borderRadius: 12, padding: '14px 18px' }}>View Banner Prompt</a>
          </div>
        </div>
        <div style={{ flex: '1 1 420px', minWidth: 280 }}>
          <svg viewBox="0 0 520 360" width="100%" height="auto" role="img" aria-label="Doctor patient connection and booking UI visualization">
            <defs>
              <linearGradient id="cg1" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stopColor="#e8eee6"/><stop offset="100%" stopColor="#f7f4ef"/></linearGradient>
              <linearGradient id="cg2" x1="0" x2="1"><stop offset="0%" stopColor="#1d4ed8"/><stop offset="100%" stopColor="#3b82f6"/></linearGradient>
            </defs>
            <rect x="0" y="0" width="520" height="360" rx="18" fill="url(#cg1)"/>
            <rect x="36" y="48" width="300" height="190" rx="12" fill="#ffffff" stroke="#d9dedc"/>
            <rect x="56" y="72" width="160" height="16" rx="8" fill="#1d4ed8" opacity="0.85"/>
            <rect x="56" y="98" width="240" height="10" rx="5" fill="#e7ebea"/>
            <rect x="56" y="116" width="220" height="10" rx="5" fill="#edeae5"/>
            <rect x="56" y="146" width="72" height="26" rx="8" fill="#ded9cf"/>
            <rect x="136" y="146" width="72" height="26" rx="8" fill="#e7e2da"/>
            <rect x="216" y="146" width="72" height="26" rx="8" fill="#efece7"/>
            <rect x="360" y="70" width="124" height="124" rx="62" fill="#ffffff" stroke="#d9dedc"/>
            <circle cx="422" cy="102" r="8" fill="#1d4ed8"/>
            <circle cx="402" cy="126" r="6" fill="#6b7280"/>
            <circle cx="440" cy="128" r="6" fill="#6b7280"/>
            <circle cx="420" cy="150" r="6" fill="#6b7280"/>
            <line x1="422" y1="102" x2="402" y2="126" stroke="#9aa3a1" strokeWidth="2"/>
            <line x1="422" y1="102" x2="440" y2="128" stroke="#9aa3a1" strokeWidth="2"/>
            <line x1="402" y1="126" x2="420" y2="150" stroke="#9aa3a1" strokeWidth="2"/>
            <g transform="translate(64,256)">
              <rect x="0" y="0" width="392" height="52" rx="12" fill="#ffffff" stroke="#d9dedc"/>
              <rect x="14" y="14" width="120" height="24" rx="8" fill="#ded9cf"/>
              <rect x="144" y="14" width="96" height="24" rx="8" fill="#e7e2da"/>
              <rect x="252" y="14" width="112" height="24" rx="8" fill="#efece7"/>
            </g>
            <path d="M360 240 C380 208, 448 208, 472 236" fill="none" stroke="url(#cg2)" strokeWidth="6" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
      <div id="consult-hero-prompt" style={{ marginTop: 16, fontSize: 14, color: '#4b5563', lineHeight: 1.6 }}>
        Professional healthcare consultation platform interface, modern medical technology aesthetic, doctor-patient connection visualization, clean minimalist design with blue and white colors, hospital/clinic professional atmosphere, trustworthy and innovative medical app design, high-resolution, corporate healthcare website style, showing consultation booking feature
      </div>
    </section>
  );
}

function Directory({ onSelect }) {
  const [q, setQ] = useState('');
  const [spec, setSpec] = useState('');
  const [loc, setLoc] = useState('');
  const filtered = useMemo(() => doctorsSeed.filter(d => (
    (!q || d.name.toLowerCase().includes(q.toLowerCase())) &&
    (!spec || d.specialty === spec) &&
    (!loc || d.location === loc)
  )), [q, spec, loc]);
  const specialties = [...new Set(doctorsSeed.map(d => d.specialty))];
  const locations = [...new Set(doctorsSeed.map(d => d.location))];
  return (
    <section id="doctor-directory" className="card" style={{ maxWidth: 1100, margin: '0 auto' }}>
      <h2 style={{ color: '#1f2937' }}>Doctor Directory</h2>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 16 }}>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by name" style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid #d1d5db', background: '#ffffff', color: '#111827', flex: '1 1 260px', fontSize: 16 }} />
        <select value={spec} onChange={e => setSpec(e.target.value)} style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid #d1d5db', background: '#ffffff', color: '#111827', fontSize: 16 }}>
          <option value="">All Specialties</option>
          {specialties.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={loc} onChange={e => setLoc(e.target.value)} style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid #d1d5db', background: '#ffffff', color: '#111827', fontSize: 16 }}>
          <option value="">All Locations</option>
          {locations.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {filtered.map(d => (
          <div key={d.id} className="card" style={{ padding: 18, background: '#ffffff', borderRadius: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: '#1f2937' }}>{d.name}</div>
            <div style={{ color: '#4b5563', marginTop: 6, fontSize: 16 }}>{d.specialty} • {d.location}</div>
            <div style={{ marginTop: 6, color: '#111827', fontSize: 16 }}>Rating {d.rating.toFixed(1)}</div>
            <button onClick={() => onSelect(d)} style={{ marginTop: 12, backgroundColor: '#1d4ed8', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 14px', fontWeight: 700, cursor: 'pointer' }}>View Profile</button>
          </div>
        ))}
      </div>
    </section>
  );
}

function Profile({ doctor, onBack, onBook }) {
  return (
    <section className="card" style={{ maxWidth: 900, margin: '0 auto' }}>
      <h2>{doctor.name}</h2>
      <div style={{ color: '#475569' }}>{doctor.specialty} • {doctor.location}</div>
      <div style={{ marginTop: 4 }}>Rating {doctor.rating.toFixed(1)}</div>
      <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
        <button onClick={onBack} style={{ backgroundColor: '#ffffff', color: '#1d4ed8', border: '1px solid #c6d5fb', borderRadius: 8, padding: '10px 12px', fontWeight: 700, cursor: 'pointer' }}>Back to Directory</button>
        <button onClick={onBook} style={{ backgroundColor: '#1d4ed8', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 12px', fontWeight: 700, cursor: 'pointer' }}>Book Appointment</button>
      </div>
    </section>
  );
}

function Booking({ doctor, onConfirm, onCancel }) {
  const [slot, setSlot] = useState(doctor.availability[0] || '');
  return (
    <section className="card" style={{ maxWidth: 900, margin: '0 auto' }}>
      <h2 style={{ color: '#1f2937' }}>Book Appointment</h2>
      <div style={{ color: '#4b5563', fontSize: 16 }}>{doctor.name} • {doctor.specialty}</div>
      <div style={{ display: 'flex', gap: 14, marginTop: 14, alignItems: 'center', flexWrap: 'wrap' }}>
        <select value={slot} onChange={e => setSlot(e.target.value)} style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid #d1d5db', background: '#ffffff', color: '#111827', fontSize: 16 }}>
          {doctor.availability.map(s => <option key={s} value={s}>{new Date(s).toLocaleString()}</option>)}
        </select>
        <button onClick={() => onConfirm(slot)} style={{ backgroundColor: '#1d4ed8', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 14px', fontWeight: 700, cursor: 'pointer' }}>Confirm</button>
        <button onClick={onCancel} style={{ backgroundColor: '#f6f4f1', color: '#374151', border: '1px solid #d9dedc', borderRadius: 10, padding: '12px 14px', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
      </div>
    </section>
  );
}

function Chat({ doctor }) {
  const [messages, setMessages] = useState([{ from: 'doctor', text: 'Hello, how can I help you today?' }]);
  const [text, setText] = useState('');
  const send = () => {
    if (!text.trim()) return;
    setMessages([...messages, { from: 'you', text }]);
    setText('');
  };
  return (
    <section className="card" style={{ maxWidth: 900, margin: '0 auto' }}>
      <h2 style={{ color: '#1f2937' }}>Secure Messaging</h2>
      <div style={{ border: '1px solid #e5e7eb', borderRadius: 14, padding: 14, height: 240, overflowY: 'auto', background: '#ffffff' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ textAlign: m.from === 'you' ? 'right' : 'left', margin: '8px 0' }}>
            <span style={{ display: 'inline-block', background: m.from === 'you' ? '#1d4ed8' : '#efece7', color: m.from === 'you' ? '#ffffff' : '#1f2937', borderRadius: 14, padding: '10px 14px', fontSize: 16 }}>{m.text}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
        <input value={text} onChange={e => setText(e.target.value)} placeholder={`Message ${doctor.name}`} style={{ flex: 1, padding: '12px 14px', borderRadius: 10, border: '1px solid #d1d5db', fontSize: 16 }} />
        <button onClick={send} style={{ backgroundColor: '#1d4ed8', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 18px', fontWeight: 700, cursor: 'pointer' }}>Send</button>
      </div>
    </section>
  );
}

function History({ items, onView }) {
  return (
    <section className="card" style={{ maxWidth: 1100, margin: '0 auto' }}>
      <h2>Appointment History</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 8, fontWeight: 700, color: '#334155', padding: '8px 0' }}>
        <div>Doctor</div><div>Date & Time</div><div>Status</div><div>Actions</div>
      </div>
      {items.map((it, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 8, padding: '10px 0', borderTop: '1px solid #e2e8f0' }}>
          <div>{it.doctor}</div>
          <div>{new Date(it.when).toLocaleString()}</div>
          <div>{it.status}</div>
          <div>
            <button onClick={() => onView(i)} style={{ background: '#ffffff', color: '#1d4ed8', border: '1px solid #c6d5fb', borderRadius: 8, padding: '6px 10px', fontWeight: 700, cursor: 'pointer' }}>View</button>
          </div>
        </div>
      ))}
    </section>
  );
}

function AppointmentDetailsModal({ item, onClose, onChat, onReschedule, onCancel }) {
  return (
    <div role="dialog" aria-modal="true" style={{ position: 'fixed', inset: 0, background: 'rgba(17,24,39,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 18, zIndex: 50 }}>
      <div className="card" style={{ maxWidth: 600, width: '100%', background: '#ffffff', borderRadius: 18, padding: 22 }}>
        <h3 style={{ marginTop: 0, color: '#1f2937' }}>Appointment Details</h3>
        <div style={{ color: '#374151', marginTop: 6, fontSize: 16, lineHeight: 1.6 }}>
          <div><strong>Doctor:</strong> {item.doctor}</div>
          <div><strong>When:</strong> {new Date(item.when).toLocaleString()}</div>
          <div><strong>Status:</strong> {item.status}</div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 18 }}>
          <button onClick={onChat} style={{ backgroundColor: '#1d4ed8', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 16px', fontWeight: 700, cursor: 'pointer' }}>Open Chat</button>
          <button onClick={onReschedule} style={{ backgroundColor: '#f6f4f1', color: '#374151', border: '1px solid #d9dedc', borderRadius: 12, padding: '12px 16px', fontWeight: 700, cursor: 'pointer' }}>Reschedule</button>
          <button onClick={onCancel} style={{ backgroundColor: '#fff', color: '#7f1d1d', border: '1px solid #f5c2c7', borderRadius: 12, padding: '12px 16px', fontWeight: 700, cursor: 'pointer' }}>Cancel Appointment</button>
          <button onClick={onClose} style={{ marginLeft: 'auto', backgroundColor: '#eef2f7', color: '#1f2937', border: '1px solid #d1d5db', borderRadius: 12, padding: '12px 16px', fontWeight: 700, cursor: 'pointer' }}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default function ConsultDoctor() {
  const [selected, setSelected] = useState(null);
  const [bookingFor, setBookingFor] = useState(null);
  const [history, setHistory] = useState([
    { doctor: 'Dr. Priya Sharma', when: '2025-10-20T10:00', status: 'Completed' },
    { doctor: 'Dr. Arjun Mehta', when: '2025-11-05T14:00', status: 'Upcoming' },
  ]);
  const [viewingIndex, setViewingIndex] = useState(null);

  const goToDirectory = () => {
    const el = document.getElementById('doctor-directory');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const confirmBooking = (slot) => {
    setHistory([{ doctor: selected.name, when: slot, status: 'Upcoming' }, ...history]);
    setBookingFor(null);
    alert('Appointment confirmed');
  };

  const openChatFromHistory = (item) => {
    const doc = doctorsSeed.find(d => d.name === item.doctor);
    if (doc) {
      setSelected(doc);
      setBookingFor(null);
      setViewingIndex(null);
      setTimeout(() => {
        const el = document.getElementById('secure-chat');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 0);
    }
  };

  const rescheduleFromHistory = (item) => {
    const doc = doctorsSeed.find(d => d.name === item.doctor);
    if (doc) {
      setSelected(doc);
      setBookingFor(doc);
      setViewingIndex(null);
      setTimeout(() => {
        const el = document.querySelector('section h2');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 0);
    }
  };

  const cancelFromHistory = (index) => {
    setHistory(prev => prev.map((it, i) => i === index ? { ...it, status: 'Cancelled' } : it));
    setViewingIndex(null);
  };

  return (
    <div>
      <Hero onPrimary={goToDirectory} />
      {!selected && <Directory onSelect={setSelected} />}
      {selected && !bookingFor && (
        <>
          <Profile doctor={selected} onBack={() => setSelected(null)} onBook={() => setBookingFor(selected)} />
          <div id="secure-chat"><Chat doctor={selected} /></div>
        </>
      )}
      {bookingFor && (
        <Booking doctor={bookingFor} onConfirm={confirmBooking} onCancel={() => setBookingFor(null)} />
      )}
      <History items={history} onView={(i) => setViewingIndex(i)} />
      {viewingIndex !== null && history[viewingIndex] && (
        <AppointmentDetailsModal
          item={history[viewingIndex]}
          onClose={() => setViewingIndex(null)}
          onChat={() => openChatFromHistory(history[viewingIndex])}
          onReschedule={() => rescheduleFromHistory(history[viewingIndex])}
          onCancel={() => cancelFromHistory(viewingIndex)}
        />
      )}
    </div>
  );
}
