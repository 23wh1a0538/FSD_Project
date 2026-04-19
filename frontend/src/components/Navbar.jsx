import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const styles = {
  nav: { background: '#181c25', borderBottom: '1px solid #2a3040', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 },
  logo: { fontFamily: "'Playfair Display', serif", fontSize: 20, color: '#6c9e6e' },
  links: { display: 'flex', gap: 4 },
  link: { padding: '6px 14px', borderRadius: 8, fontSize: 13, color: '#7a8090', textDecoration: 'none', transition: '.2s' },
  activeLink: { background: '#1f2433', color: '#e8e4dc' },
  btn: { padding: '6px 14px', borderRadius: 8, border: '1px solid #2a3040', background: '#1f2433', color: '#e8e4dc', fontSize: 13 },
  user: { fontSize: 12, color: '#7a8090', marginRight: 10 }
};

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('ae_user') || '{}');

  const logout = () => {
    localStorage.removeItem('ae_token');
    localStorage.removeItem('ae_user');
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>AttendEase</div>
      <div style={styles.links}>
        {[['/', 'Dashboard'], ['/records', 'Records'], ['/favorites', 'Favorites'], ['/mark', '+ Mark']].map(([to, label]) => (
          <NavLink key={to} to={to} end={to === '/'} style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.activeLink : {}) })}>
            {label}
          </NavLink>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={styles.user}>{user.name}</span>
        <button style={styles.btn} onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}
