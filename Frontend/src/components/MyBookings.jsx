import React, { useState, useEffect } from 'react';
import { 
  Ticket, 
  Clock, 
  MapPin, 
  Car, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  QrCode,
  Calendar,
  DollarSign
} from 'lucide-react';

export default function MyBookings({ bookings, onCancelBooking, onCompleteBooking }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const activeBookings = bookings.filter((b) => b.status === 'active');
  const pastBookings = bookings.filter((b) => b.status !== 'active');

  const getTimeRemaining = (endTimeStr) => {
    const total = Date.parse(endTimeStr) - now;
    if (total <= 0) return 'Expired / Completed';
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const seconds = Math.floor((total / 1000) % 60);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div style={{ padding: '1rem 0 3rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Ticket size={28} color="#10b981" />
            My Parking Passes & Digital Tickets
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Manage active reservations, scan barcodes at parking gates, or view payment receipts.
          </p>
        </div>
      </div>

      {/* Active Passes Section */}
      <h2 style={{ fontSize: '1.25rem', color: '#10b981', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Clock size={18} /> Active Parking Passes ({activeBookings.length})
      </h2>

      {activeBookings.length === 0 ? (
        <div style={{
          background: 'var(--bg-card)',
          border: '1px dashed var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '2.5rem',
          textAlign: 'center',
          color: 'var(--text-muted)',
          marginBottom: '2.5rem'
        }}>
          <Car size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
          <p style={{ fontSize: '1rem', fontWeight: 600 }}>No Active Parking Passes</p>
          <p style={{ fontSize: '0.85rem' }}>Reserve a slot from the explore tab to generate an instant gate pass.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          {activeBookings.map((b) => (
            <div key={b._id} className="ticket-card" style={{ marginTop: 0 }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PASS CODE</span>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#10b981', fontFamily: 'Outfit' }}>
                    {b.passCode}
                  </div>
                </div>
                <div style={{
                  background: 'rgba(16, 185, 129, 0.2)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  color: '#10b981',
                  padding: '0.3rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase'
                }}>
                  ● LIVE ACTIVE
                </div>
              </div>

              {/* QR Code */}
              <div className="ticket-barcode">
                <div className="qr-placeholder"></div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em' }}>
                  GATE ACCESS QR CODE
                </div>
              </div>

              {/* Pass Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>LOCATION & SLOT</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{b.spotTitle} ({b.slotCode})</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>VEHICLE NUMBER</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{b.vehicleNumber}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>REMAINING TIME</span>
                  <strong style={{ color: '#06b6d4' }}>{getTimeRemaining(b.endTime)}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>PAID TOTAL</span>
                  <strong style={{ color: '#10b981' }}>${b.totalAmount}</strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => onCompleteBooking(b._id)}
                  style={{
                    flex: 1,
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid #10b981',
                    color: '#10b981',
                    padding: '0.55rem',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.3rem'
                  }}
                >
                  <CheckCircle2 size={14} />
                  Check Out
                </button>

                <button
                  onClick={() => {
                    if (confirm('Cancel this active reservation?')) {
                      onCancelBooking(b._id);
                    }
                  }}
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#ef4444',
                    padding: '0.55rem 0.9rem',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  <XCircle size={14} />
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Past Booking History */}
      <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>
        Booking & Receipt History ({pastBookings.length})
      </h2>

      {pastBookings.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No past parking history.</p>
      ) : (
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-input)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.9rem 1.25rem' }}>PASS CODE</th>
                <th style={{ padding: '0.9rem 1.25rem' }}>LOCATION / SLOT</th>
                <th style={{ padding: '0.9rem 1.25rem' }}>VEHICLE</th>
                <th style={{ padding: '0.9rem 1.25rem' }}>DURATION</th>
                <th style={{ padding: '0.9rem 1.25rem' }}>AMOUNT</th>
                <th style={{ padding: '0.9rem 1.25rem' }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {pastBookings.map((b) => (
                <tr key={b._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.9rem 1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>{b.passCode}</td>
                  <td style={{ padding: '0.9rem 1.25rem' }}>{b.spotTitle} ({b.slotCode})</td>
                  <td style={{ padding: '0.9rem 1.25rem' }}>{b.vehicleNumber}</td>
                  <td style={{ padding: '0.9rem 1.25rem' }}>{b.durationHours} hrs</td>
                  <td style={{ padding: '0.9rem 1.25rem', color: '#10b981', fontWeight: 700 }}>${b.totalAmount}</td>
                  <td style={{ padding: '0.9rem 1.25rem' }}>
                    <span style={{
                      padding: '0.2rem 0.5rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      background: b.status === 'completed' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: b.status === 'completed' ? '#10b981' : '#ef4444',
                    }}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
