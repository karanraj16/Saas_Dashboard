import React from 'react';

const Sidebar = ({ userData, setShowProfile, handleLogout, exportToCSV, copyPublicLink }) => {
  return (
    <aside style={{ width: '240px', background: 'var(--surface-1)', borderRight: '0.5px solid var(--border)', display: 'flex', flexDirection: 'column', transition: 'all 0.3s' }}>
      
      {/* Brand */}
      <div style={{ padding: '24px', borderBottom: '0.5px solid var(--border)' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-accent)', margin: 0 }}>SaaS Dash 🚀</h1>
      </div>
      
      {/* User Mini Profile */}
      <div 
        onClick={() => setShowProfile(true)}
        style={{ padding: '16px 24px', borderBottom: '0.5px solid var(--border)', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        className="hover:opacity-80 transition"
      >
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--fill-accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px', overflow: 'hidden' }}>
          {userData.profilePic ? (
            <img src={userData.profilePic} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            userData.name ? userData.name.charAt(0).toUpperCase() : 'U'
          )}
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <p style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-primary)', margin: 0, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
            {userData.name || 'Loading...'}
          </p>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>Pro Plan</p>
        </div>
        <div style={{ color: 'var(--text-secondary)' }}>⚙️</div>
      </div>

      {/* Navigation */}
      <nav style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        <button style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: 'var(--radius)', background: 'var(--bg-accent)', color: 'var(--text-accent)', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
          <span style={{ fontSize: '18px' }}>📊</span> Overview
        </button>
        <button onClick={copyPublicLink} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: 'var(--radius)', background: 'transparent', color: 'var(--text-secondary)', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
          <span style={{ fontSize: '18px' }}>🔗</span> Public Link
        </button>
        <button onClick={exportToCSV} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: 'var(--radius)', background: 'transparent', color: 'var(--text-secondary)', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
          <span style={{ fontSize: '18px' }}>📥</span> Export CSV
        </button>
      </nav>

      {/* Logout */}
      <div style={{ padding: '16px', borderTop: '0.5px solid var(--border)' }}>
        <button onClick={handleLogout} style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius)', background: 'var(--bg-warning)', color: 'var(--text-warning)', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;