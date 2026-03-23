import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, ArrowLeft, Upload, User, Mail, Phone, MapPin, Book, Award, Globe } from 'lucide-react';
import api from '../services/api';

const ResumeBuilder = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    education: '',
    skills: '',
    languageProficiency: 'Beginner'
  });
  const [photo, setPhoto] = useState(null);
  const [photoName, setPhotoName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!photo) {
      setError('Please upload a photograph.');
      return;
    }

    setLoading(true);
    setError('');

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    data.append('photograph', photo);

    try {
      const res = await api.post('/resume', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      <button 
        onClick={() => navigate('/dashboard')} 
        style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '2rem', padding: 0 }}
      >
        <ArrowLeft size={20} /> Back to Dashboard
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel" 
        style={{ padding: '2.5rem' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ background: 'var(--accent-gradient)', padding: '0.75rem', borderRadius: '12px' }}>
            <FileText size={28} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.75rem', margin: 0 }}>Resume Builder</h1>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Craft your professional profile</p>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="input-group">
            <label className="input-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input type="text" name="name" className="input-field" style={{ paddingLeft: '2.5rem' }} value={formData.name} onChange={handleInputChange} required />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input type="email" name="email" className="input-field" style={{ paddingLeft: '2.5rem' }} value={formData.email} onChange={handleInputChange} required />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Phone Number</label>
            <div style={{ position: 'relative' }}>
              <Phone size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input type="tel" name="phone" className="input-field" style={{ paddingLeft: '2.5rem' }} value={formData.phone} onChange={handleInputChange} required />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Address</label>
            <div style={{ position: 'relative' }}>
              <MapPin size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input type="text" name="address" className="input-field" style={{ paddingLeft: '2.5rem' }} value={formData.address} onChange={handleInputChange} required />
            </div>
          </div>

          <div className="input-group full-width">
            <label className="input-label">Education</label>
            <div style={{ position: 'relative' }}>
              <Book size={18} style={{ position: 'absolute', left: '1rem', top: '1rem', color: 'var(--text-secondary)' }} />
              <textarea name="education" className="input-field" style={{ paddingLeft: '2.5rem', minHeight: '100px', resize: 'vertical' }} value={formData.education} onChange={handleInputChange} placeholder="University, Degree, Year..." required />
            </div>
          </div>

          <div className="input-group full-width">
            <label className="input-label">Skills</label>
            <div style={{ position: 'relative' }}>
              <Award size={18} style={{ position: 'absolute', left: '1rem', top: '1rem', color: 'var(--text-secondary)' }} />
              <textarea name="skills" className="input-field" style={{ paddingLeft: '2.5rem', minHeight: '100px', resize: 'vertical' }} value={formData.skills} onChange={handleInputChange} placeholder="React, Node.js, Project Management..." required />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Language Proficiency</label>
            <div style={{ position: 'relative' }}>
              <Globe size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <select name="languageProficiency" className="input-field" style={{ paddingLeft: '2.5rem', appearance: 'none', backgroundColor: 'rgba(15, 23, 42, 0.6)' }} value={formData.languageProficiency} onChange={handleInputChange} required>
                <option value="Beginner">Beginner (Basic Terminal)</option>
                <option value="Intermediate">Intermediate (Enhanced Terminal)</option>
                <option value="Advanced">Advanced (Enhanced Terminal)</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Photograph</label>
            <label className="input-field" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', justifyContent: 'center', borderStyle: 'dashed' }}>
              <Upload size={18} color="var(--accent)" />
              <span style={{ color: photoName ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                {photoName || 'Upload Image (Max 5MB)'}
              </span>
              <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
            </label>
          </div>

          <div className="full-width" style={{ marginTop: '1rem' }}>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Generating Resume & Terminal Environment...' : 'Build Resume'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ResumeBuilder;
