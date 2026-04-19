import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAttendance } from '../services/api';

const s = {
  row: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 22 },
  statCard: { background: '#181c25', border: '1px solid #2a3040', borderRadius: 12, padding: 18, textAlign: 'center' },
  statNum: { fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 600 },
  statLabel: { fontSize: 11, color: '#7a8090', marginTop: 4 },
  card: { background: '#181c25', border: '1px solid #2a3040', borderRadius: 12, padding: 20, marginBottom: 14 },
  btn: { padding: '9px 18px', borderRadius: 9, border: 'none', background: '#6c9e6e', color: '#fff', fontSize: 13, fontWeight: 500 },
  muted: { color: '#7a8090', fontSize: 13 },
  recRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #2a3040' },
  badge: (s) => ({ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500, background: s === 'Present' ? '#1a3a1e' : '#3a1a1a', color: s === 'Present' ? '#6cd97a' : '#d96c6c' }),
  bar: { height: 7, borderRadius: 4, background: '#2a3040', overflow: 'hidden', marginTop: 8 },
  fill: (pct) => ({ height: '100%', borderRadius: 4, background: '#6c9e6e', width: pct + '%', transition: '1s' })
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const user = JSON.parse(localStorage.getItem('ae_user') || '{}');

  useEffect(() => {
    getAttendance().then(r => setRecords(r.data.data)).catch(() => {});
  }, []);

  const present = records.filter(r => r.status === 'Present').length;
  const absent = records.filter(r => r.status === 'Absent').length;
  const pct = records.length ? Math.round((present / records.length) * 100) : 0;
  const recent = [...records].reverse().slice(0, 5);
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div>
      <div style={s.row}>
        <div>
          <div className="page-title">Dashboard</div>
          <div style={s.muted}>{today}</div>
        </div>
        <button style={s.btn} onClick={() => navigate('/mark')}>+ Mark Attendance</button>
      </div>

      <div style={s.statsGrid}>
        {[
          { num: records.length, label: 'Total Records', color: '#6c9e6e' },
          { num: present, label: 'Present', color: '#6cd97a' },
          { num: absent, label: 'Absent', color: '#d96c6c' }
        ].map((item, i) => (
          <div key={i} style={s.statCard}>
            <div style={{ ...s.statNum, color: item.color }}>{item.num}</div>
            <div style={s.statLabel}>{item.label}</div>
          </div>
        ))}
      </div>

      <div style={s.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 13 }}>Overall Attendance Rate</span>
          <span style={{ fontSize: 13, fontWeight: 500 }}>{pct}%</span>
        </div>
        <div style={s.bar}><div style={s.fill(pct)} /></div>
      </div>

      <div style={s.card}>
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 14 }}>Recent Records</div>
        {recent.length === 0
          ? <div style={{ ...s.muted, textAlign: 'center', padding: 24 }}>No records yet. Mark some attendance!</div>
          : recent.map(r => (
            <div key={r._id} style={s.recRow}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{r.studentName}</div>
                <div style={{ fontSize: 11, color: '#7a8090' }}>{r.rollNumber} · {r.date}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={s.badge(r.status)}>{r.status}</span>
                {r.favorite && <span style={{ color: '#f0b429', fontSize: 15 }}>★</span>}
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}
