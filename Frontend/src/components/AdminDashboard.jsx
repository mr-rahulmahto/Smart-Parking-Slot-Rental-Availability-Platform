import React, { useState } from 'react';
import { 
  BarChart3, 
  Car, 
  Zap, 
  DollarSign, 
  Activity, 
  CheckCircle, 
  RefreshCw, 
  Trash2, 
  Sliders,
  PlusCircle
} from 'lucide-react';

export default function AdminDashboard({ 
  analytics, 
  spots, 
  onToggleStatus, 
  onDeleteSpot, 
  onRefresh,
  onOpenHostModal
}) {
  const [filterFloor, setFilterFloor] = useState('All');

  const total = spots.length;
  const available = spots.filter((s) => s.status === 'available').length;
  const occupied = spots.filter((s) => s.status === 'occupied').length;
  const reserved = spots.filter((s) => s.status === 'reserved').length;
  const rate = total > 0 ? Math.round(((occupied + reserved) / total) * 100) : 0;

  return (
    <div style={{ padding: '1rem 0 3rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <BarChart3 size={28} color="#10b981" />
            Live Operations & Parking Console
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Real-time IoT occupancy telemetry, revenue telemetry, and manual slot override control.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button 
            className="btn-primary"
            onClick={onOpenHostModal}
          >
            <PlusCircle size={16} />
            Rent Out Space
          </button>

          <button 
            className="btn-secondary"
            onClick={onRefresh}
          >
            <RefreshCw size={16} />
            Refresh Telemetry
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="stats-strip">
        <div className="stat-box">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <Activity size={22} />
          </div>
          <div>
            <div className="stat-val">{rate}%</div>
            <div className="stat-lbl">Occupancy Rate</div>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}>
            <Car size={22} />
          </div>
          <div>
            <div className="stat-val">{available} / {total}</div>
            <div className="stat-lbl">Slots Free</div>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
            <DollarSign size={22} />
          </div>
          <div>
            <div className="stat-val">${analytics?.totalRevenue || 270}</div>
            <div className="stat-lbl">Total Booking Revenue</div>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}>
            <Zap size={22} />
          </div>
          <div>
            <div className="stat-val">{spots.filter((s) => s.spotType === 'ev').length}</div>
            <div className="stat-lbl">Active EV Bays</div>
          </div>
        </div>
      </div>

      {/* Live Slot Override Table */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-card)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sliders size={18} color="#10b981" />
            Slot Status & Telemetry Override
          </h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Showing {spots.length} registered parking slots
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-input)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.9rem 1rem' }}>SLOT CODE</th>
                <th style={{ padding: '0.9rem 1rem' }}>LOCATION / PLAZA</th>
                <th style={{ padding: '0.9rem 1rem' }}>FLOOR / ZONE</th>
                <th style={{ padding: '0.9rem 1rem' }}>CATEGORY</th>
                <th style={{ padding: '0.9rem 1rem' }}>RATE</th>
                <th style={{ padding: '0.9rem 1rem' }}>CURRENT STATUS</th>
                <th style={{ padding: '0.9rem 1rem' }}>CHANGE STATUS</th>
                <th style={{ padding: '0.9rem 1rem', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {spots.map((spot) => (
                <tr key={spot._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.9rem 1rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Outfit' }}>
                    {spot.slotCode}
                  </td>
                  <td style={{ padding: '0.9rem 1rem' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{spot.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{spot.city}</div>
                  </td>
                  <td style={{ padding: '0.9rem 1rem', color: 'var(--text-secondary)' }}>
                    {spot.floor || 'Ground Level'}
                  </td>
                  <td style={{ padding: '0.9rem 1rem' }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      background: spot.spotType === 'ev' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255,255,255,0.06)',
                      color: spot.spotType === 'ev' ? '#06b6d4' : 'var(--text-primary)',
                    }}>
                      {spot.spotType}
                    </span>
                  </td>
                  <td style={{ padding: '0.9rem 1rem', color: '#10b981', fontWeight: 700 }}>
                    ${spot.pricePerHour}/hr
                  </td>
                  <td style={{ padding: '0.9rem 1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.6rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      background: 
                        spot.status === 'available' ? 'rgba(16, 185, 129, 0.15)' :
                        spot.status === 'occupied' ? 'rgba(239, 68, 68, 0.15)' :
                        'rgba(139, 92, 246, 0.15)',
                      color: 
                        spot.status === 'available' ? '#10b981' :
                        spot.status === 'occupied' ? '#ef4444' :
                        '#c084fc',
                    }}>
                      {spot.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.9rem 1rem' }}>
                    <select
                      value={spot.status}
                      onChange={(e) => onToggleStatus(spot._id, e.target.value)}
                      style={{
                        background: 'var(--bg-input)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)',
                        padding: '0.35rem 0.6rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="available">Available</option>
                      <option value="occupied">Occupied</option>
                      <option value="reserved">Reserved</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </td>
                  <td style={{ padding: '0.9rem 1rem', textAlign: 'right' }}>
                    <button
                      onClick={() => {
                        if (confirm(`Delete slot ${spot.slotCode}?`)) {
                          onDeleteSpot(spot._id);
                        }
                      }}
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        color: '#ef4444',
                        padding: '0.35rem 0.5rem',
                        borderRadius: 'var(--radius-sm)',
                      }}
                      title="Delete Slot"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
