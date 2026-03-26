import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, Mail, Lock, KeyRound } from 'lucide-react';
import api from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(location.state?.step || 1);
  const [formData, setFormData] = useState({ email: location.state?.email || '', password: '' });
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState(location.state?.message || '');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const res = await api.post('/auth/login', formData);
      if (res.data.requiresVerification) {
        navigate('/verify-otp', {
          state: {
            message: res.data.message,
            email: res.data.email
          }
        });
        return;
      }
      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/verify-otp', { email: formData.email, otp });
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
      <AnimatePresence mode="wait">
        <motion.div 
          key={step}
          initial={{ opacity: 0, x: step === 1 ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: step === 1 ? 20 : -20 }}
          transition={{ duration: 0.3 }}
          className="glass-panel auth-card"
        >
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <div style={{ background: 'var(--accent-gradient)', padding: '1rem', borderRadius: '50%' }}>
              {step === 1 ? <LogIn size={32} color="white" /> : <KeyRound size={32} color="white" />}
            </div>
          </div>
          
          <h1 className="auth-title">{step === 1 ? 'Welcome Back' : 'Verification'}</h1>
          <p className="auth-subtitle">
            {step === 1 ? 'Login to access your premium dashboard' : 'Enter the OTP sent to your email'}
          </p>

          {message && <div style={{ color: 'var(--success)', marginBottom: '1rem', background: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem', borderRadius: '8px' }}>{message}</div>}
          {error && <div className="error-message">{error}</div>}

          {step === 1 ? (
            <form onSubmit={handleLogin}>
              <div className="input-group">
                <label className="input-label">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                  <input 
                    type="email" 
                    className="input-field" 
                    style={{ paddingLeft: '2.5rem' }}
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required 
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                  <input 
                    type="password" 
                    className="input-field" 
                    style={{ paddingLeft: '2.5rem' }}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required 
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '1rem' }}>
                {loading ? 'Authenticating...' : 'Login'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <div className="input-group">
                <label className="input-label">6-Digit OTP</label>
                <div style={{ position: 'relative' }}>
                  <KeyRound size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
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
              
              <button 
                type="button" 
                onClick={() => setStep(1)} 
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', marginTop: '1rem', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Back to Login
              </button>
            </form>
          )}

          {step === 1 && (
            <p style={{ marginTop: '2rem', color: 'var(--text-secondary)' }}>
              Don't have an account? <Link to="/register" className="auth-link">Sign up here</Link>
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Login;
