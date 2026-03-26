import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { KeyRound } from 'lucide-react';
import api from '../services/api';

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState(
    location.state?.message || 'Enter the OTP sent to your email to complete registration.'
  );

  useEffect(() => {
    if (!email) {
      navigate('/register', { replace: true });
    }
  }, [email, navigate]);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/verify-otp', { email, otp });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="glass-panel auth-card"
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <div style={{ background: 'var(--accent-gradient)', padding: '1rem', borderRadius: '50%' }}>
            <KeyRound size={32} color="white" />
          </div>
        </div>

        <h1 className="auth-title">Verify Account</h1>
        <p className="auth-subtitle">Use OTP sent to your registered email</p>

        {message && (
          <div
            style={{
              color: 'var(--success)',
              marginBottom: '1rem',
              background: 'rgba(16, 185, 129, 0.1)',
              padding: '0.75rem',
              borderRadius: '8px'
            }}
          >
            {message}
          </div>
        )}
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleVerifyOtp}>
          <div className="input-group">
            <label className="input-label">6-Digit OTP</label>
            <div style={{ position: 'relative' }}>
              <KeyRound
                size={18}
                style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-secondary)'
                }}
              />
              <input
                type="text"
                className="input-field"
                style={{ paddingLeft: '2.5rem', letterSpacing: '0.5rem', textAlign: 'center', fontSize: '1.25rem' }}
                placeholder="XXXXXX"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '1rem' }}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        <p style={{ marginTop: '2rem', color: 'var(--text-secondary)' }}>
          Already verified? <Link to="/login" className="auth-link">Login here</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default VerifyOtp;
