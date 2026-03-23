import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="app-container" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <h1 className="auth-title" style={{ margin: 0 }}>Dashboard</h1>
        <button onClick={handleLogout} className="btn-primary" style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
          <LogOut size={18} /> Logout
        </button>
      </header>
      
      <div className="form-grid">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="glass-panel" 
          style={{ padding: '3rem 2rem', textAlign: 'center', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} 
          onClick={() => navigate('/resume-builder')}
        >
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '1.5rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
            <FileText size={48} color="var(--accent)" />
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Create New Resume</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Fill out your details to generate a stunning profile and access your personalized terminal.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
