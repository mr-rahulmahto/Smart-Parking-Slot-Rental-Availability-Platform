import React from 'react';
import { 
  Car, 
  Grid3X3, 
  PlusCircle, 
  Ticket, 
  BarChart3, 
  User, 
  LogOut, 
  Zap,
  ShieldCheck,
  Lock
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  currentUser, 
  onOpenAuth, 
  onLogout,
  onOpenHostModal,
  activeBookingsCount,
  theme,
  onToggleTheme
}) {
  const isAdmin = currentUser?.role === 'admin';

  return (
    <header className="navbar">
      <div className="container nav-content">
        {/* Brand Logo */}
        <div className="logo-area" onClick={() => setCurrentTab('explore')}>
          <div className="logo-icon-box">
            <Car size={22} color="#fff" />
          </div>
          <div>
            <span style={{ color: 'var(--text-primary)' }}>Smart</span>
            <span style={{ color: '#10b981' }}>Park</span>
            <span style={{ fontSize: '0.7rem', display: 'block', color: 'var(--text-muted)', fontWeight: 600, marginTop: '-3px' }}>
              SLOT & RENTAL PLATFORM
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="nav-links">
          <button 
            className={`nav-btn ${currentTab === 'explore' ? 'active' : ''}`}
            onClick={() => setCurrentTab('explore')}
          >
            <Car size={16} />
            Find Parking
          </button>

          <button 
            className={`nav-btn ${currentTab === 'grid' ? 'active' : ''}`}
            onClick={() => setCurrentTab('grid')}
          >
            <Grid3X3 size={16} />
            Live Slot Matrix
          </button>

          <button 
            className={`nav-btn ${currentTab === 'bookings' ? 'active' : ''} ${!currentUser ? 'locked' : ''}`}
            onClick={() => setCurrentTab('bookings')}
          >
            <Ticket size={16} />
            My Passes
            {!currentUser && <Lock size={12} className="nav-lock-icon" />}
            {currentUser && activeBookingsCount > 0 && (
              <span style={{
                background: '#10b981',
                color: '#fff',
                borderRadius: '9999px',
                padding: '2px 7px',
                fontSize: '0.7rem',
                fontWeight: 800
              }}>
                {activeBookingsCount}
              </span>
            )}
          </button>

          <button 
            className={`nav-btn ${currentTab === 'admin' ? 'active' : ''} ${!isAdmin ? 'locked' : ''}`}
            onClick={() => setCurrentTab('admin')}
          >
            <BarChart3 size={16} />
            Live Console
            {!isAdmin && <Lock size={12} className="nav-lock-icon" />}
          </button>
        </nav>

        {/* Action Buttons & Auth */}
        <div className="nav-actions">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />

          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'var(--bg-input)',
                  padding: '0.45rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.85rem'
                }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: currentUser.role === 'admin' ? '#ef4444' : '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff'
                }}>
                  {currentUser.role === 'admin' ? (
                    <ShieldCheck size={14} />
                  ) : (
                    <Car size={14} />
                  )}
                </div>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{currentUser.name}</span>
                <span style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  background: currentUser.role === 'admin' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                  border: currentUser.role === 'admin' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
                  color: currentUser.role === 'admin' ? '#ef4444' : '#10b981',
                  padding: '2px 7px',
                  borderRadius: 'var(--radius-full)',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px'
                }}>
                  {currentUser.role === 'admin' ? (
                    <><ShieldCheck size={10} /> Admin</>
                  ) : (
                    <><Car size={10} /> Driver</>
                  )}
                </span>
              </div>
              <button 
                onClick={onLogout}
                title="Logout"
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#ef4444',
                  padding: '0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button 
              className="btn-secondary"
              onClick={onOpenAuth}
            >
              <User size={16} />
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
