import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Lock, 
  Car, 
  Phone,
  ShieldCheck, 
  KeyRound,
  Check
} from 'lucide-react';

export default function AuthModal({ onClose, onLogin, onRegister }) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'driver', // 'driver' | 'admin'
    phone: '',
    vehicleNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        if (!formData.name.trim()) {
          throw new Error('Please enter your full name');
        }
        if (!formData.email.trim() || !formData.password.trim()) {
          throw new Error('Please provide email and password');
        }
        await onRegister(formData);
      } else {
        if (!formData.email.trim() || !formData.password.trim()) {
          throw new Error('Please provide email and password');
        }
        await onLogin({ email: formData.email, password: formData.password });
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <div style={{ padding: '2rem' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: formData.role === 'admin' && isRegister 
                ? 'linear-gradient(135deg, #ef4444, #f59e0b)' 
                : 'linear-gradient(135deg, #10b981, #06b6d4)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.85rem',
              boxShadow: formData.role === 'admin' && isRegister 
                ? '0 4px 15px rgba(239, 68, 68, 0.4)' 
                : '0 4px 15px rgba(16, 185, 129, 0.4)',
              transition: 'var(--transition)'
            }}>
              {isRegister && formData.role === 'admin' ? (
                <ShieldCheck size={26} />
              ) : (
                <Car size={26} />
              )}
            </div>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>
              {isRegister ? (formData.role === 'admin' ? 'Register as Admin' : 'Register as Driver') : 'Sign In to SmartPark'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
              {isRegister 
                ? (formData.role === 'admin' 
                    ? 'Create an administrative operator account to manage slots' 
                    : 'Join to find, reserve, and manage smart parking passes')
                : 'Enter your credentials to manage your passes & reservations'}
            </p>
          </div>

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}>
              <span>{error}</span>
            </div>
          )}

          {/* Direct Auth Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
            {/* Role Selection in Sign Up (Driver vs Admin) */}
            {isRegister && (
              <div style={{ marginBottom: '0.25rem' }}>
                <label className="field-label" style={{ marginBottom: '0.5rem' }}>
                  Select Account Type
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                  {/* Driver Option */}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'driver' })}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem',
                      padding: '0.75rem 0.5rem',
                      borderRadius: 'var(--radius-md)',
                      background: formData.role === 'driver' ? 'rgba(16, 185, 129, 0.14)' : 'var(--bg-input)',
                      border: formData.role === 'driver' ? '2px solid #10b981' : '1px solid var(--border-color)',
                      color: formData.role === 'driver' ? '#10b981' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      transition: 'var(--transition)',
                      position: 'relative'
                    }}
                  >
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: formData.role === 'driver' ? '#10b981' : 'rgba(255,255,255,0.06)',
                      color: formData.role === 'driver' ? '#fff' : 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Car size={18} />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Driver</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Find & Book Slots</span>
                  </button>

                  {/* Admin Option */}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'admin' })}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem',
                      padding: '0.75rem 0.5rem',
                      borderRadius: 'var(--radius-md)',
                      background: formData.role === 'admin' ? 'rgba(239, 68, 68, 0.14)' : 'var(--bg-input)',
                      border: formData.role === 'admin' ? '2px solid #ef4444' : '1px solid var(--border-color)',
                      color: formData.role === 'admin' ? '#ef4444' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      transition: 'var(--transition)',
                      position: 'relative'
                    }}
                  >
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: formData.role === 'admin' ? '#ef4444' : 'rgba(255,255,255,0.06)',
                      color: formData.role === 'admin' ? '#fff' : 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <ShieldCheck size={18} />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Admin</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Console & Telemetry</span>
                  </button>
                </div>
              </div>
            )}

            {isRegister && (
              <div className="search-field">
                <label className="field-label"><User size={12} /> Full Name *</label>
                <div className="field-input-wrap">
                  <input
                    type="text"
                    required
                    placeholder={formData.role === 'admin' ? 'e.g. Admin Operator' : 'e.g. John Doe'}
                    className="field-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>
            )}

            <div className="search-field">
              <label className="field-label"><Mail size={12} /> Email Address *</label>
              <div className="field-input-wrap">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="field-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="search-field">
              <label className="field-label"><Lock size={12} /> Password *</label>
              <div className="field-input-wrap">
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="field-input"
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            {isRegister && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="search-field">
                  <label className="field-label"><Phone size={12} /> Phone Number</label>
                  <div className="field-input-wrap">
                    <input
                      type="text"
                      placeholder="+1 (555) 000-0000"
                      className="field-input"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="search-field">
                  <label className="field-label">
                    {formData.role === 'admin' ? (
                      <><ShieldCheck size={12} /> Operator ID</>
                    ) : (
                      <><Car size={12} /> Vehicle Plate #</>
                    )}
                  </label>
                  <div className="field-input-wrap">
                    <input
                      type="text"
                      placeholder={formData.role === 'admin' ? 'e.g. OP-901' : 'e.g. NY-8821'}
                      className="field-input"
                      value={formData.vehicleNumber}
                      onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{
                width: '100%',
                height: '46px',
                justifyContent: 'center',
                marginTop: '0.5rem',
                fontSize: '0.95rem',
                background: isRegister && formData.role === 'admin'
                  ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                  : 'linear-gradient(135deg, #10b981, #059669)',
              }}
            >
              {loading ? 'Processing...' : isRegister ? (formData.role === 'admin' ? 'Create Admin Account' : 'Create Driver Account') : 'Sign In'}
            </button>
          </form>

          {/* Toggle Register/Login */}
          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {isRegister ? 'Already have an account?' : "Don't have an account yet?"}{' '}
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
              style={{
                background: 'transparent',
                color: '#10b981',
                fontWeight: 700,
                textDecoration: 'underline',
              }}
            >
              {isRegister ? 'Sign In' : 'Sign Up Free'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
