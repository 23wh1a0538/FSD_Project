import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createAttendance, updateAttendance, getAttendance } from '../services/api';

const s = {
  card: { background: '#181c25', border: '1px solid #2a3040', borderRadius: 14, padding: 32, maxWidth: 480, margin: '0 auto' },
  label: { fontSize: 12, color: '#7a8090', display: 'block', marginBottom: 5 },
  group: { marginBottom: 18 },
  err: { color: '#d96c6c', fontSize: 11, marginTop: 4 },
  row: { display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 },
  btn: { padding: '9px 22px', borderRadius: 9, border: 'none', background: '#6c9e6e', color: '#fff', fontSize: 13, fontWeight: 500 },
  btnSec: { padding: '9px 22px', borderRadius: 9, border: '1px solid #2a3040', background: '#1f2433', color: '#e8e4dc', fontSize: 13 }
};

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export default function MarkAttendance() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({ studentName: '', rollNumber: '', date: today(), status: 'Present' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverErr, setServerErr] = useState('');

  useEffect(() => {
    if (isEdit) {
      getAttendance().then(res => {
        const rec = res.data.data.find(r => r._id === id);
        if (rec) setForm({ studentName: rec.studentName, rollNumber: rec.rollNumber, date: rec.date, status: rec.status });
      }).catch(() => {});
    }
  }, [id, isEdit]);

  const handle = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const errs = {};
    if (!form.studentName.trim()) errs.studentName = 'Student name is required.';
    if (!form.rollNumber.trim()) errs.rollNumber = 'Roll number is required.';
    else if (!/^[a-zA-Z0-9\-]+$/.test(form.rollNumber)) errs.rollNumber = 'Roll number must be alphanumeric.';
    if (!form.date) errs.date = 'Date is required.';
    return errs;
  };

  const submit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setServerErr('');
    try {
      if (isEdit) {
        await updateAttendance(id, form);
      } else {
        await createAttendance(form);
      }
      navigate('/records');
    } catch (err) {
      setServerErr(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-title" style={{ marginBottom: 22 }}>{isEdit ? 'Edit Record' : 'Mark Attendance'}</div>
      <div style={s.card}>
        {serverErr && <div style={{ ...s.err, marginBottom: 14, fontSize: 13 }}>{serverErr}</div>}

        <div style={s.group}>
          <label style={s.label}>Student Name *</label>
          <input name="studentName" placeholder="Full name" value={form.studentName} onChange={handle} />
          {errors.studentName && <div style={s.err}>{errors.studentName}</div>}
        </div>

        <div style={s.group}>
          <label style={s.label}>Roll Number *</label>
          <input name="rollNumber" placeholder="e.g. CS-2024-001" value={form.rollNumber} onChange={handle} />
          {errors.rollNumber && <div style={s.err}>{errors.rollNumber}</div>}
        </div>

        <div style={s.group}>
          <label style={s.label}>Date *</label>
          <input name="date" type="date" value={form.date} onChange={handle} />
          {errors.date && <div style={s.err}>{errors.date}</div>}
        </div>

        <div style={s.group}>
          <label style={s.label}>Status</label>
          <select name="status" value={form.status} onChange={handle}>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>
        </div>

        <div style={s.row}>
          <button style={s.btnSec} onClick={() => navigate('/records')}>Cancel</button>
          <button style={s.btn} onClick={submit} disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update Record' : 'Save Record'}
          </button>
        </div>
      </div>
    </div>
  );
}
