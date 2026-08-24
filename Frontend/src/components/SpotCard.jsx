import React from 'react';
import { 
  MapPin, 
  Star, 
  Zap, 
  Shield, 
  Video, 
  Car, 
  Clock, 
  KeyRound, 
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export default function SpotCard({ spot, onBook }) {
  const isAvailable = spot.status === 'available';

  const amenityIcons = {
    ev_charging: { label: 'EV Fast Charge', icon: <Zap size={12} color="#06b6d4" /> },
    cctv: { label: 'CCTV 24/7', icon: <Video size={12} color="#10b981" /> },
    covered: { label: 'Covered Deck', icon: <Shield size={12} color="#8b5cf6" /> },
    '24_7_access': { label: '24/7 Gate Access', icon: <Clock size={12} color="#f59e0b" /> },
    security_guard: { label: 'Guarded', icon: <Shield size={12} color="#3b82f6" /> },
    valet: { label: 'Valet Service', icon: <KeyRound size={12} color="#ec4899" /> },
  };

  return (
    <div className="spot-card">
      {/* Image & Badges */}
      <div className="spot-img-wrap">
        <img 
          src={spot.image || 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80'} 
          alt={spot.title} 
          className="spot-img"
          loading="lazy"
        />

        <div className="spot-badge-top">
          <span className="badge-tag">
            Slot {spot.slotCode}
          </span>
          {spot.spotType === 'ev' && (
            <span className="badge-tag ev">
              <Zap size={11} /> EV Fast Hub
            </span>
          )}
          {spot.isHostListing && (
            <span className="badge-tag host">
              Private Host
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="spot-card-body">
        <div className="spot-title-row">
          <h3 className="spot-title">{spot.title}</h3>
          <div className="spot-rating">
            <Star size={14} fill="#fbbf24" color="#fbbf24" />
            <span>{spot.rating || '4.9'}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
              ({spot.reviewsCount || 18})
            </span>
          </div>
        </div>

        <div className="spot-address">
          <MapPin size={14} color="#10b981" style={{ flexShrink: 0 }} />
          <span>{spot.address}, {spot.city}</span>
        </div>

        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: '0.2rem 0' }}>
          {spot.description ? (spot.description.length > 90 ? spot.description.slice(0, 90) + '...' : spot.description) : 'Smart automated parking bay.'}
        </p>

        {/* Amenities Chips */}
        <div className="amenities-list">
          {spot.amenities && spot.amenities.slice(0, 3).map((a) => {
            const info = amenityIcons[a] || { label: a, icon: <CheckCircle size={12} color="#10b981" /> };
            return (
              <span key={a} className="amenity-chip">
                {info.icon}
                {info.label}
              </span>
            );
          })}
        </div>

        {/* Footer with Price & CTA */}
        <div className="spot-footer">
          <div className="price-display">
            <div className="price-amount">${spot.pricePerHour}<span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>/hr</span></div>
            <div className="price-unit">${spot.pricePerDay || (spot.pricePerHour * 6)}/day • ${spot.pricePerMonth || (spot.pricePerHour * 45)}/mo</div>
          </div>

          <button 
            className={`btn-${isAvailable ? 'primary' : 'secondary'}`}
            disabled={!isAvailable}
            onClick={() => onBook(spot)}
            style={{ 
              opacity: isAvailable ? 1 : 0.6,
              cursor: isAvailable ? 'pointer' : 'not-allowed',
              padding: '0.55rem 1rem'
            }}
          >
            {isAvailable ? 'Reserve Slot' : 'Occupied'}
          </button>
        </div>
      </div>
    </div>
  );
}
