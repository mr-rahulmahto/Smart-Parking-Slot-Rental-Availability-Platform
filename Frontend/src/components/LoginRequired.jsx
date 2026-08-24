import React from 'react';
import { 
  Lock, 
  LogIn, 
  ShieldCheck, 
  Zap, 
  Ticket, 
  BarChart3,
  Sparkles
} from 'lucide-react';

const sectionMeta = {
  bookings: {
    icon: <Ticket size={28} />,
    title: 'My Parking Passes & Digital Tickets',
    description: 'View your active reservations, scan gate pass barcodes, manage bookings, and access payment receipts.',
    features: [
      'Real-time countdown on active passes',
      'QR code gate access passes',
      'Complete booking & receipt history',
      'Cancel or check-out from reservations',
    ],
  },
  admin: {
    icon: <BarChart3 size={28} />,
    title: 'Live Operations & Parking Console',
    description: 'Access real-time IoT occupancy telemetry, revenue analytics, and manual slot override controls.',
    features: [
      'Live occupancy rate dashboard',
      'Revenue & booking analytics',
      'Slot status override controls',
      'EV bay monitoring & management',
    ],
  },
  host: {
    icon: <Sparkles size={28} />,
    title: 'Rent Out Your Parking Space',
    description: 'List your unused driveway, carport, or commercial garage spot to earn passive income from verified drivers.',
    features: [
      'Publish your space to the live network',
      'Set flexible hourly, daily & monthly rates',
      'Manage amenities & availability',
      'Track earnings from your listings',
    ],
  },
  booking: {
    icon: <ShieldCheck size={28} />,
    title: 'Reserve a Parking Slot',
    description: 'Sign in to book this parking slot and receive an instant digital gate pass with QR code access.',
    features: [
      'Instant digital gate pass generation',
      'Flexible hourly, daily & monthly booking',
      'Secure payment processing',
      'Real-time slot reservation',
    ],
  },
};

export default function LoginRequired({ section = 'bookings', onOpenAuth }) {
  const meta = sectionMeta[section] || sectionMeta.bookings;

  return (
    <div className="login-required-wrapper">
      <div className="login-required-card">
        {/* Animated glow ring */}
        <div className="login-lock-ring">
          <div className="login-lock-icon">
            <Lock size={32} />
          </div>
        </div>

        <h2 className="login-required-title">Sign In Required</h2>
        <p className="login-required-subtitle">
          You need to be logged in to access this feature
        </p>

        {/* Section info card */}
        <div className="login-section-info">
          <div className="login-section-header">
            <div className="login-section-icon">{meta.icon}</div>
            <div>
              <h3 className="login-section-title">{meta.title}</h3>
              <p className="login-section-desc">{meta.description}</p>
            </div>
          </div>

          <div className="login-features-grid">
            {meta.features.map((feature, idx) => (
              <div key={idx} className="login-feature-item">
                <Zap size={12} className="login-feature-icon" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <button className="login-cta-btn" onClick={onOpenAuth}>
          <LogIn size={18} />
          Sign In to Continue
        </button>

        <p className="login-register-hint">
          Don't have an account? Click above to create one — it's free!
        </p>
      </div>
    </div>
  );
}
