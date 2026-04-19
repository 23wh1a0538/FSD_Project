import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAttendance, deleteAttendance } from '../services/api';
import AttendanceCard from '../components/AttendanceCard';

const s = {
  muted: { color: '#7a8090', fontSize: 13, textAlign: 'center', padding: 48 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 },
  modal: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  modalCard: { background: '#181c25', border: '1px solid #2a3040', borderRadius: 14, padding: 28, width: 360 },
  modalTitle: { fontFamily: "'Playfair Display', serif", fontSize: 18, marginBottom: 12 },
  btnDanger: { padding: '8px 18px', borderRadius: 9, border: 'none', background: '#c0524a', color: '#fff', fontSize: 13 },
  btnSec: { padding: '8px 18px', borderRadius: 9, border: '1px solid #2a3040', background: '#1f2433', color: '#e8e4dc', fontSize: 13 }
};

export default function Favorites() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchFavs = async () => {
    setLoading(true);
    try {
      const res = await getAttendance({ favorite: true });
      setRecords(res.data.data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchFavs(); }, []);

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteAttendance(deletingId);
      setDeletingId(null);
      fetchFavs();
    } catch {}
  };

  return (
    <div>
      <div className="page-title" style={{ marginBottom: 22 }}>Favorites</div>

      {loading
        ? <div style={s.muted}>Loading...</div>
        : records.length === 0
          ? <div style={s.muted}>No favorites yet. Star records from the Records page!</div>
          : (
            <div style={s.grid}>
              {records.map(rec => (
                <AttendanceCard
                  key={rec._id}
                  record={rec}
                  onUpdate={fetchFavs}
                  onDelete={setDeletingId}
                  onEdit={(id) => navigate(`/edit/${id}`)}
                />
              ))}
            </div>
          )
      }

      {deletingId && (
        <div style={s.modal} onClick={() => setDeletingId(null)}>
          <div style={s.modalCard} onClick={e => e.stopPropagation()}>
            <div style={s.modalTitle}>Delete Record</div>
            <p style={{ color: '#7a8090', fontSize: 13, marginBottom: 22 }}>
              Are you sure you want to delete this record?
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
