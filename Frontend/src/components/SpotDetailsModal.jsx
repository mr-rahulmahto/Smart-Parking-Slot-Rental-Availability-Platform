import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  Car, 
  ShieldCheck, 
  Zap, 
  User, 
  Phone, 
  CheckCircle2, 
  CreditCard,
  QrCode,
  Calendar
} from 'lucide-react';

export default function SpotDetailsModal({ 
  spot, 
  onClose, 
  currentUser, 
  onConfirmBooking 
}) {
  const [bookingType, setBookingType] = useState('hourly'); // 'hourly' | 'daily' | 'monthly'
  const [duration, setDuration] = useState(2);
  const [vehicleNumber, setVehicleNumber] = useState(currentUser?.vehicleNumber || '');
  const [vehicleType, setVehicleType] = useState(currentUser?.vehicleType || spot.spotType || 'car');
  const [driverName, setDriverName] = useState(currentUser?.name || '');
  const [driverPhone, setDriverPhone] = useState(currentUser?.phone || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedPass, setConfirmedPass] = useState(null);

  if (!spot) return null;

  // Calculate pricing
  let unitRate = spot.pricePerHour;
  let unitLabel = 'hr';
  if (bookingType === 'daily') {
    unitRate = spot.pricePerDay || spot.pricePerHour * 6;
    unitLabel = 'day';
  } else if (bookingType === 'monthly') {
    unitRate = spot.pricePerMonth || spot.pricePerHour * 45;
    unitLabel = 'month';
  }

  const subtotal = unitRate * Number(duration);
  const serviceFee = Number((subtotal * 0.05).toFixed(2));
  const totalAmount = Number((subtotal + serviceFee).toFixed(2));

  const handleBook = async (e) => {
    e.preventDefault();
    if (!vehicleNumber) {
      alert('Please enter your vehicle license plate number');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        spotId: spot._id,
        vehicleNumber,
        vehicleType,
        bookingType,
        durationHours: Number(duration),
        userName: driverName,
        userPhone: driverPhone,
        userEmail: currentUser?.email || 'driver@smartpark.io',
      };

      const result = await onConfirmBooking(payload);
      if (result && result.success) {
        setConfirmedPass(result.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        {confirmedPass ? (
          /* Confirmation & Digital Ticket Screen */
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.2)',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <CheckCircle2 size={36} />
            </div>

            <h2 style={{ fontSize: '1.6rem', color: '#fff', marginBottom: '0.25rem' }}>
              Booking Confirmed!
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Slot <strong>{spot.slotCode}</strong> has been secured for your vehicle.
            </p>

            {/* Ticket Card */}
            <div className="ticket-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem' }}>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PASS CODE</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981', fontFamily: 'Outfit' }}>
                    {confirmedPass.passCode}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>RESERVED SLOT</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', fontFamily: 'Outfit' }}>
                    {spot.slotCode}
                  </div>
                </div>
              </div>

              {/* QR Code Graphic */}
              <div className="ticket-barcode">
                <div className="qr-placeholder"></div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em' }}>
                  SCAN AT GATE BARRIER
                </div>
              </div>

              {/* Ticket Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', textAlign: 'left', fontSize: '0.85rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>LOCATION</span>
                  <strong>{spot.title}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>VEHICLE PLATE</span>
                  <strong>{confirmedPass.vehicleNumber}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>DURATION</span>
                  <strong>{confirmedPass.durationHours} {bookingType === 'hourly' ? 'Hours' : bookingType === 'daily' ? 'Days' : 'Months'}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>TOTAL PAID</span>
                  <strong style={{ color: '#10b981' }}>${confirmedPass.totalAmount}</strong>
                </div>
              </div>
            </div>

            <button 
              className="btn-primary" 
              style={{ width: '100%', marginTop: '1.5rem', justifyContent: 'center' }}
              onClick={onClose}
            >
              Done & View Active Passes
            </button>
          </div>
        ) : (
          /* Booking Configuration Form */
          <div style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span className="badge-tag" style={{ background: '#10b981', color: '#fff' }}>
                Slot {spot.slotCode}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {spot.floor || 'Ground Level'}
              </span>
            </div>

            <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              {spot.title}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              <MapPin size={14} color="#10b981" />
              <span>{spot.address}, {spot.city}</span>
            </div>

            {/* Booking Form */}
            <form onSubmit={handleBook} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Type Switcher */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', background: 'var(--bg-input)', padding: '4px', borderRadius: 'var(--radius-md)' }}>
                {[
                  { label: 'Hourly', val: 'hourly' },
                  { label: 'Daily Pass', val: 'daily' },
                  { label: 'Monthly', val: 'monthly' },
                ].map((t) => (
                  <button
                    key={t.val}
                    type="button"
                    onClick={() => {
                      setBookingType(t.val);
                      if (t.val === 'hourly') setDuration(2);
                      if (t.val === 'daily') setDuration(1);
                      if (t.val === 'monthly') setDuration(1);
                    }}
                    style={{
                      padding: '0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      background: bookingType === t.val ? '#10b981' : 'transparent',
                      color: bookingType === t.val ? '#fff' : 'var(--text-secondary)',
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Duration Selector */}
              <div className="search-field">
                <label className="field-label">
                  <Clock size={12} /> Duration ({unitLabel}s)
                </label>
                <div className="field-input-wrap">
                  <input
                    type="number"
                    min="1"
                    max={bookingType === 'hourly' ? 24 : 90}
                    className="field-input"
                    value={duration}
                    onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                </div>
              </div>

              {/* Vehicle Number & Category */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem' }}>
                <div className="search-field">
                  <label className="field-label">
                    <Car size={12} /> Vehicle Plate #
                  </label>
                  <div className="field-input-wrap">
                    <input
                      type="text"
                      required
                      placeholder="e.g. NY-8821-EV"
                      className="field-input"
                      value={vehicleNumber}
                      onChange={(e) => setVehicleNumber(e.target.value)}
                    />
                  </div>
                </div>

                <div className="search-field">
                  <label className="field-label">Vehicle Type</label>
                  <div className="field-input-wrap">
                    <select
                      className="field-select"
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value)}
                    >
                      <option value="car">Sedan / Hatch</option>
                      <option value="suv">SUV / Truck</option>
                      <option value="ev">Electric (EV)</option>
                      <option value="bike">Motorcycle</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Driver Contact Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="search-field">
                  <label className="field-label"><User size={12} /> Driver Name</label>
                  <div className="field-input-wrap">
                    <input
                      type="text"
                      required
                      className="field-input"
                      value={driverName}
                      onChange={(e) => setDriverName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="search-field">
                  <label className="field-label"><Phone size={12} /> Mobile Phone</label>
                  <div className="field-input-wrap">
                    <input
                      type="text"
                      className="field-input"
                      value={driverPhone}
                      onChange={(e) => setDriverPhone(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Price Breakdown Calculation Box */}
              <div style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
                fontSize: '0.85rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>Rate (${unitRate}/{unitLabel} × {duration} {unitLabel}s)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>IoT Reservation & Platform Fee (5%)</span>
                  <span>${serviceFee.toFixed(2)}</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  color: 'var(--text-primary)',
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '0.5rem',
                  marginTop: '0.25rem'
                }}>
                  <span>Total Amount</span>
                  <span style={{ color: '#10b981' }}>${totalAmount}</span>
                </div>
              </div>

              {/* Pay & Confirm CTA */}
              <button 
                type="submit" 
                className="btn-primary"
                disabled={isSubmitting}
                style={{ width: '100%', height: '48px', justifyContent: 'center', fontSize: '1rem' }}
              >
                <CreditCard size={18} />
                {isSubmitting ? 'Securing Slot...' : `Pay $${totalAmount} & Reserve`}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
