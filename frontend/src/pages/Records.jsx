import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAttendance, deleteAttendance } from '../services/api';
import AttendanceCard from '../components/AttendanceCard';

const s = {
  row: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  btn: { padding: '9px 18px', borderRadius: 9, border: 'none', background: '#6c9e6e', color: '#fff', fontSize: 13, fontWeight: 500 },
  filterBar: { display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center' },
  filterBtn: (active) => ({ padding: '5px 14px', borderRadius: 20, border: active ? 'none' : '1px solid #2a3040', background: active ? '#6c9e6e' : 'none', color: active ? '#fff' : '#7a8090', cursor: 'pointer', fontSize: 12 }),
  muted: { color: '#7a8090', fontSize: 13, textAlign: 'center', padding: 40 },
  modal: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  modalCard: { background: '#181c25', border: '1px solid #2a3040', borderRadius: 14, padding: 28, width: 360 },
  modalTitle: { fontFamily: "'Playfair Display', serif", fontSize: 18, marginBottom: 12 },
  btnDanger: { padding: '8px 18px', borderRadius: 9, border: 'none', background: '#c0524a', color: '#fff', fontSize: 13 },
  btnSec: { padding: '8px 18px', borderRadius: 9, border: '1px solid #2a3040', background: '#1f2433', color: '#e8e4dc', fontSize: 13 }
};

export default function Records() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter === 'Present' || filter === 'Absent') params.status = filter;
      if (filter === 'fav') params.favorite = true;
      if (search) params.search = search;
      const res = await getAttendance(params);
      setRecords(res.data.data);
    } catch {}
    setLoading(false);
  }, [filter, search]);

  useEffect(() => {
    const t = setTimeout(fetchRecords, 300);
    return () => clearTimeout(t);
  }, [fetchRecords]);

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteAttendance(deletingId);
      setDeletingId(null);
      fetchRecords();
    } catch {}
  };

  return (
    <div>
      <div style={s.row}>
        <div className="page-title">All Records</div>
        <button style={s.btn} onClick={() => navigate('/mark')}>+ Mark Attendance</button>
      </div>

      <div style={s.filterBar}>
        <input
          placeholder="Search student or roll no..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, maxWidth: 240 }}
        />
        {[['all', 'All'], ['Present', 'Present'], ['Absent', 'Absent'], ['fav', 'Favorites']].map(([val, label]) => (
          <button key={val} style={s.filterBtn(filter === val)} onClick={() => setFilter(val)}>{label}</button>
        ))}
      </div>

      {loading
        ? <div style={s.muted}>Loading...</div>
        : records.length === 0
          ? <div style={s.muted}>No records found.</div>
          : records.map(rec => (
            <AttendanceCard
              key={rec._id}
              record={rec}
              onUpdate={fetchRecords}
              onDelete={setDeletingId}
              onEdit={(id) => navigate(`/edit/${id}`)}
            />
          ))
      }

      {deletingId && (
        <div style={s.modal} onClick={() => setDeletingId(null)}>
          <div style={s.modalCard} onClick={e => e.stopPropagation()}>
            <div style={s.modalTitle}>Delete Record</div>
            <p style={{ color: '#7a8090', fontSize: 13, marginBottom: 22 }}>
              Are you sure you want to delete this record? This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button style={s.btnSec} onClick={() => setDeletingId(null)}>Cancel</button>
              <button style={s.btnDanger} onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
