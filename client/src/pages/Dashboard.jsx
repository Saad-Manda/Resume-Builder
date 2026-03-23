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
        <h2 style={{ color: 'var(--text-secondary)' }}>Loading Dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="app-container" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <h1 className="auth-title" style={{ margin: 0 }}>Dashboard</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => navigate('/resume-builder')} className="btn-primary" style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
            <Plus size={16} /> Create Resume
          </button>
          <button onClick={handleLogout} className="btn-primary" style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>
      
      {resumes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', display: 'inline-block', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
            <FileText size={48} color="rgba(255,255,255,0.4)" />
          </div>
          <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No resumes built yet</h2>
          <p>Click the "Create Resume" button above to craft your first professional profile.</p>
        </div>
      ) : (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
        {resumes.map((resume) => (
          <motion.div 
            key={resume._id}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            className="glass-panel" 
            style={{ padding: '1.5rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}
            onClick={() => setSelectedResume(resume)}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'var(--accent-gradient)' }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <img 
                src={`http://localhost:5000${resume.photographUrl}`} 
                alt="Profile" 
                style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent)' }}
              />
              <div>
                <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.25rem' }}>{resume.name}</h3>
                <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: 'rgba(59, 130, 246, 0.2)', color: 'var(--accent)', borderRadius: '12px' }}>
                  {resume.languageProficiency}
                </span>
              </div>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Mail size={14} /> {resume.email}
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={14} /> {resume.skills.length > 30 ? resume.skills.substring(0, 30) + '...' : resume.skills}
            </p>
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
                background: 'rgba(15, 23, 42, 0.8)',
                backdropFilter: 'blur(4px)',
                zIndex: 40,
              }}
              onClick={() => setSelectedResume(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-panel"
              style={{
                position: 'fixed',
                top: '5%',
                left: '50%',
                x: '-50%',
                width: '90%',
                maxWidth: '800px',
                maxHeight: '90vh',
                overflowY: 'auto',
                zIndex: 50,
                padding: '3rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem'
              }}
            >
              <button 
                onClick={() => setSelectedResume(null)}
                style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '50%', padding: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={20} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ width: '120px', height: '120px', borderRadius: '50%', padding: '4px', background: 'var(--accent-gradient)' }}>
                  <img 
                    src={`http://localhost:5000${selectedResume.photographUrl}`} 
                    alt="Profile" 
                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--bg-primary)' }}
                  />
                </div>
                <div>
                  <h2 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0', background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {selectedResume.name}
                  </h2>
                  <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-secondary)', flexWrap: 'wrap', marginTop: '1rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={16} color="var(--accent)" /> {selectedResume.email}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={16} color="var(--accent)" /> {selectedResume.phone}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={16} color="var(--accent)" /> {selectedResume.address}</span>
                  </div>
                </div>
              </div>
              
              <hr style={{ borderColor: 'var(--glass-border)', margin: '1rem 0' }} />

              <div className="form-grid">
                <div style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '1.5rem', borderRadius: '12px' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--accent)' }}><Book size={20} /> Education</h3>
                  <p style={{ whiteSpace: 'pre-wrap', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{selectedResume.education}</p>
                </div>
                <div style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '1.5rem', borderRadius: '12px' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--accent)' }}><Award size={20} /> Skills</h3>
                  <p style={{ whiteSpace: 'pre-wrap', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{selectedResume.skills}</p>
                </div>
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, color: 'var(--accent)' }}><Globe size={20} /> Language Proficiency:</h3>
                <span style={{ padding: '0.5rem 1rem', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid var(--accent)', borderRadius: '20px', color: 'var(--text-primary)', fontWeight: '500' }}>
                  {selectedResume.languageProficiency}
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Dashboard;
