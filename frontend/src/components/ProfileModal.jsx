import React, { useState, useRef } from 'react';
import { uploadProfilePhoto, createCheckout } from '../services/api';

const ProfileModal = ({ userData, setUserData, setShowProfile, handleLogout, totalClients, totalRevenue }) => {
  const [uploading, setUploading] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const fileInputRef = useRef(null); 

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploading(true);
      const updatedUser = await uploadProfilePhoto(file);
      setUserData(updatedUser); 
    } catch (error) {
      alert("Failed to upload photo.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
      <div style={{ background: 'var(--surface-1)', borderRadius: '16px', padding: '32px', width: '400px', position: 'relative', border: '1px solid var(--border)', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
        
        <button onClick={() => setShowProfile(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '20px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Avatar Section */}
          <div style={{ position: 'relative', cursor: 'pointer', marginBottom: '16px' }} onClick={() => fileInputRef.current.click()}>
            <div style={{ width: '96px', height: '96px', borderRadius: '50%', background: 'var(--fill-accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', fontWeight: 'bold', overflow: 'hidden', border: '4px solid var(--surface-0)' }}>
              {userData.profilePic ? (
                <img src={userData.profilePic} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                userData.name ? userData.name.charAt(0).toUpperCase() : 'U'
              )}
            </div>
            <input type="file" ref={fileInputRef} onChange={handlePhotoChange} accept="image/*" style={{ display: 'none' }} />
          </div>
          
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>{userData.name}</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '0 0 24px 0' }}>{userData.email}</p>
          
          {/* Stats Box */}
          <div style={{ width: '100%', background: 'var(--surface-2)', borderRadius: '12px', padding: '20px', marginBottom: '24px', border: '1px solid var(--border)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--border)', marginBottom: '16px' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase' }}>Plan</span>
              <button 
                onClick={async () => {
                  try {
                    setIsCheckoutLoading(true);
                    const data = await createCheckout();
                    window.location.href = data.url; 
                  } catch (error) {
                    alert("Failed to load payment gateway.");
                    setIsCheckoutLoading(false);
                  }
                }}
                disabled={isCheckoutLoading}
                style={{ background: 'var(--fill-accent)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}
              >
                {isCheckoutLoading ? "Loading..." : "Upgrade to PRO 🚀"}
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 'bold', fontSize: '14px' }}>Total Clients</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '16px' }}>{totalClients}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 'bold', fontSize: '14px' }}>Revenue</span>
              <span style={{ color: 'var(--text-success)', fontWeight: 'bold', fontSize: '16px' }}>${totalRevenue.toLocaleString()}</span>
            </div>
          </div>
          
          <button onClick={handleLogout} style={{ width: '100%', padding: '12px', background: 'var(--bg-warning)', color: 'var(--text-warning)', border: '1px solid var(--text-warning)', borderRadius: 'var(--radius)', fontWeight: 'bold', cursor: 'pointer' }}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;