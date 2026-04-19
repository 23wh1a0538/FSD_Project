import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';

const s = {
  wrap: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f1117' },
  card: { background: '#181c25', border: '1px solid #2a3040', borderRadius: 16, padding: 36, width: 380 },
  title: { fontFamily: "'Playfair Display', serif", fontSize: 28, color: '#6c9e6e', textAlign: 'center', marginBottom: 6 },
  sub: { color: '#7a8090', fontSize: 13, textAlign: 'center', marginBottom: 28 },
  label: { fontSize: 12, color: '#7a8090', display: 'block', marginBottom: 5 },
  group: { marginBottom: 16 },
  btn: { width: '100%', padding: 11, borderRadius: 9, border: 'none', background: '#6c9e6e', color: '#fff', fontSize: 14, fontWeight: 500, marginTop: 6 },
  err: { color: '#d96c6c', fontSize: 12, marginBottom: 10 },
  foot: { textAlign: 'center', marginTop: 18, fontSize: 13, color: '#7a8090' }
};

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    setError('');
    if (!form.email || !form.password) { setError('All fields are required.'); return; }
    setLoading(true);
    try {
      const res = await login(form);
      localStorage.setItem('ae_token', res.data.token);
      localStorage.setItem('ae_user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.wrap}>
      <div style={s.card}>
        <div style={s.title}>AttendEase</div>
        <div style={s.sub}>Sign in to manage attendance</div>
        {error && <div style={s.err}>{error}</div>}
        <div style={s.group}>
          <label style={s.label}>Email</label>
          <input name="email" type="email" placeholder="teacher@school.edu" value={form.email} onChange={handle} />
        </div>
        <div style={s.group}>
          <label style={s.label}>Password</label>
          <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handle}
            onKeyDown={(e) => e.key === 'Enter' && submit()} />
        </div>
        <button style={s.btn} onClick={submit} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
        <div style={s.foot}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#6c9e6e' }}>Register</Link>
        </div>
      </div>
    </div>
  );
}
