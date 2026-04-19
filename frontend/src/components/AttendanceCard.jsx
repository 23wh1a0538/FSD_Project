import React from 'react';
import { rateAttendance, toggleFavorite } from '../services/api';

const s = {
  card: { background: '#181c25', border: '1px solid #2a3040', borderRadius: 12, padding: 18, marginBottom: 12 },
  row: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  name: { fontWeight: 500, fontSize: 15 },
  chip: { display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 11, background: '#1f2433', border: '1px solid #2a3040', color: '#7a8090' },
  present: { background: '#1a3a1e', color: '#6cd97a', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500 },
  absent: { background: '#3a1a1a', color: '#d96c6c', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500 },
  muted: { fontSize: 12, color: '#7a8090' },
  starBtn: { background: 'none', border: 'none', fontSize: 17, cursor: 'pointer', transition: '.2s', padding: '0 1px' },
  actionBtn: { padding: '5px 12px', borderRadius: 7, border: '1px solid #2a3040', background: '#1f2433', color: '#e8e4dc', fontSize: 12, marginLeft: 6 },
  dangerBtn: { padding: '5px 12px', borderRadius: 7, border: 'none', background: '#c0524a', color: '#fff', fontSize: 12, marginLeft: 6 }
};

export default function AttendanceCard({ record, onUpdate, onDelete, onEdit }) {
  const handleRate = async (val) => {
    try {
      await rateAttendance(record._id, val);
      onUpdate();
    } catch {}
  };

  const handleFav = async () => {
    try {
      await toggleFavorite(record._id);
      onUpdate();
    } catch {}
  };

  return (
    <div style={s.card}>
      <div style={s.row}>
        <div>
          <div style={s.name}>{record.studentName}</div>
          <div style={{ marginTop: 4 }}>
            <span style={s.chip}>{record.rollNumber}</span>
            <span style={{ marginLeft: 8, ...(record.status === 'Present' ? s.present : s.absent) }}>{record.status}</span>
          </div>
        </div>
        <div>
          <button style={s.starBtn} onClick={handleFav} title="Toggle Favorite">
            <span style={{ color: record.favorite ? '#f0b429' : '#7a8090' }}>{record.favorite ? '★' : '☆'}</span>
          </button>
        </div>
      </div>

      <div style={{ ...s.row, marginBottom: 10 }}>
        <span style={s.muted}>{record.date}</span>
        <div>
          {[1, 2, 3, 4, 5].map(i => (
            <button key={i} style={{ ...s.starBtn, fontSize: 15 }} onClick={() => handleRate(i)}>
              <span style={{ color: i <= (record.rating || 0) ? '#f0b429' : '#7a8090' }}>{i <= (record.rating || 0) ? '★' : '☆'}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button style={s.actionBtn} onClick={() => onEdit(record._id)}>Edit</button>
        <button style={s.dangerBtn} onClick={() => onDelete(record._id)}>Delete</button>
      </div>
    </div>
  );
}
