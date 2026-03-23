import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, FileText, Mail, Phone, MapPin, Book, Award, Globe, X, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResume, setSelectedResume] = useState(null);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const res = await api.get('/resume');
        setResumes(res.data.resumes || []);
      } catch (err) {
        console.log('Error fetching resumes.');
      } finally {
        setLoading(false);
      }
    };
    fetchResumes();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="app-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <h2 style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>Loading Dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="app-container" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'var(--text-primary)', clipPath: 'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)' }}></div>
          <h1 className="auth-title" style={{ margin: 0, fontSize: '1.1rem', letterSpacing: '0.5px' }}>Dashboard</h1>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginLeft: '1rem' }}>Resume Portfolios</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => navigate('/resume-builder')} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '24px' }}>
            <Plus size={14} /> Create Resume
          </button>
          <button onClick={handleLogout} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: 'none', color: 'var(--text-secondary)' }}>
            Logout
          </button>
        </div>
      </header>
      
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
         <h2 style={{ fontSize: '1.75rem', margin: 0, fontWeight: 400 }}>Overview</h2>
         <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Total Resumes Built: {resumes.length}</span>
      </div>

      {resumes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
          <div style={{ background: 'var(--glass-border)', display: 'inline-block', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
            <FileText size={48} color="var(--text-secondary)" />
          </div>
          <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontWeight: 400 }}>No tracking data</h2>
          <p style={{ fontSize: '0.875rem' }}>Click the "Create Resume" button above to craft your first professional profile.</p>
        </div>
      ) : (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {resumes.map((resume, index) => (
          <motion.div 
            key={resume._id}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="glass-panel" 
            style={{ 
              padding: '1.5rem', 
              cursor: 'pointer', 
              display: 'flex', 
              flexDirection: 'column', 
              position: 'relative',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--glass-border)'
            }}
            onClick={() => setSelectedResume(resume)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>Resume Profile</div>
              <div style={{ letterSpacing: '2px', opacity: 0.8 }}>...</div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem' }}>
              <img 
                src={resume.photographUrl ? `http://localhost:5000${resume.photographUrl}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(resume.name)}&background=24282c&color=ffffff&size=128`} 
                alt="Profile" 
                style={{ width: '96px', height: '96px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--glass-border)' }}
                onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(resume.name)}&background=24282c&color=ffffff&size=128`; }}
              />
              <div>
                <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', fontWeight: 600 }}>{resume.name}</h3>
                <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>{resume.languageProficiency}</div>
              </div>
            </div>

            <div style={{ marginTop: 'auto' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 300, marginBottom: '0.25rem', lineHeight: 1 }}>{resume.skills.split(',').length}</div>
              <div style={{ fontSize: '0.65rem', opacity: 0.7, letterSpacing: '0.5px' }}>Listed Skills</div>
            </div>
            
            {/* Minimal power/usage line indicator from the reference image */}
            <div style={{ height: '2px', background: 'var(--glass-border)', width: '100%', marginTop: '1.5rem', position: 'relative' }}>
               <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: (Math.random() * 60 + 20) + '%', background: 'var(--text-secondary)' }}></div>
            </div>
          </motion.div>
        ))}
      </div>
      )}

      {/* Expanded Resume Modal */}
      <AnimatePresence>
        {selectedResume && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(10, 11, 13, 0.9)',
                zIndex: 40,
              }}
              onClick={() => setSelectedResume(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-panel"
              style={{
                position: 'fixed',
                top: '5%',
                left: '50%',
                x: '-50%',
                width: '100%',
                maxWidth: '800px',
                maxHeight: '90vh',
                overflowY: 'auto',
                zIndex: 50,
                padding: '3rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--glass-border)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Detailed report</span>
                <button 
                  onClick={() => setSelectedResume(null)}
                  style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', borderRadius: '24px', padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.875rem' }}
                >
                  Close
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                <img 
                  src={selectedResume.photographUrl ? `http://localhost:5000${selectedResume.photographUrl}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedResume.name)}&background=24282c&color=ffffff`}  
                  alt="Profile" 
                  style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }}
                  onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedResume.name)}&background=24282c&color=ffffff`; }}
                />
                <div>
                  <h2 style={{ fontSize: '1.75rem', margin: '0 0 0.5rem 0', fontWeight: 400 }}>
                    {selectedResume.name}
                  </h2>
                  <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-secondary)', flexWrap: 'wrap', marginTop: '0.5rem', fontSize: '0.875rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={14} /> {selectedResume.email}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={14} /> {selectedResume.phone}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={14} /> {selectedResume.address}</span>
                  </div>
                </div>
              </div>
              
              <div style={{ height: '1px', background: 'var(--glass-border)', margin: '0.5rem 0' }}></div>

              <div className="form-grid">
                <div style={{ border: '1px solid var(--glass-border)', padding: '1.5rem', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h3 style={{ fontWeight: 400, fontSize: '0.875rem', margin: 0, color: 'var(--text-primary)' }}>Education History</h3>
                    <span style={{ color: 'var(--text-secondary)' }}>...</span>
                  </div>
                  <p style={{ whiteSpace: 'pre-wrap', color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.875rem' }}>{selectedResume.education}</p>
                </div>
                
                <div style={{ border: '1px solid var(--glass-border)', padding: '1.5rem', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h3 style={{ fontWeight: 400, fontSize: '0.875rem', margin: 0, color: 'var(--text-primary)' }}>Skills Tracking</h3>
                    <span style={{ color: 'var(--text-secondary)' }}>...</span>
                  </div>
                  <p style={{ whiteSpace: 'pre-wrap', color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.875rem' }}>{selectedResume.skills}</p>
                </div>
              </div>

              <div style={{ border: '1px solid var(--glass-border)', padding: '1.5rem', borderRadius: '12px', background: 'rgba(219, 234, 197, 0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h3 style={{ fontWeight: 400, fontSize: '0.875rem', margin: 0, color: 'var(--accent)' }}>Language Proficiency Settings</h3>
                  <span style={{ fontSize: '0.875rem', color: 'var(--success)' }}>Connected</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 300, lineHeight: 1 }}>
                    {selectedResume.languageProficiency}
                  </span>
                </div>
                <span style={{ color: 'var(--text-secondary)', display: 'block', marginTop: '1rem', fontSize: '0.875rem' }}>Terminal Environment Assigned</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Dashboard;
