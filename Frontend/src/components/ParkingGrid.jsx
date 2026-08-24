import React, { useState } from 'react';
import { 
  Grid3X3, 
  Car, 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ShieldCheck, 
  Navigation,
  Info
} from 'lucide-react';

export default function ParkingGrid({ spots, onSelectSpot }) {
  const [selectedFloor, setSelectedFloor] = useState('All');

  // Extract unique floors or zones
  const floors = ['All', ...new Set(spots.map((s) => s.floor || 'Ground Level'))];

  const filteredSpots = selectedFloor === 'All' 
    ? spots 
    : spots.filter((s) => (s.floor || 'Ground Level') === selectedFloor);

  return (
    <div className="parking-matrix-box">
      <div className="matrix-header">
        <div>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Grid3X3 size={20} color="#10b981" />
            Live 2D Parking Matrix & Slot Map
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Click on any available slot to inspect sensor status and instantly reserve.
          </p>
        </div>

        {/* Status Legend */}
        <div className="matrix-legend">
          <div className="legend-item">
            <span className="legend-dot avail"></span> Available
          </div>
          <div className="legend-item">
            <span className="legend-dot occ"></span> Occupied
          </div>
          <div className="legend-item">
            <span className="legend-dot ev"></span> EV Hub
          </div>
          <div className="legend-item">
            <span className="legend-dot res"></span> Reserved
          </div>
        </div>
      </div>

      {/* Floor Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
        {floors.map((floor) => (
          <button
            key={floor}
            onClick={() => setSelectedFloor(floor)}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              fontWeight: 600,
              background: selectedFloor === floor ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.04)',
              color: selectedFloor === floor ? '#10b981' : 'var(--text-secondary)',
              border: selectedFloor === floor ? '1px solid #10b981' : '1px solid var(--border-color)',
            }}
          >
            {floor}
          </button>
        ))}
      </div>

      {/* 2D Parking Lot Grid */}
      <div className="matrix-grid">
        {filteredSpots.map((spot) => {
          const isEv = spot.spotType === 'ev';
          const isAvailable = spot.status === 'available';
          const isOccupied = spot.status === 'occupied';
          const isReserved = spot.status === 'reserved';

          let statusClass = 'available';
          let statusText = 'Available';
          let badgeClass = 'avail';

          if (isOccupied) {
            statusClass = 'occupied';
            statusText = 'Occupied';
            badgeClass = 'occ';
          } else if (isReserved) {
            statusClass = 'reserved';
            statusText = 'Reserved';
            badgeClass = 'res';
          }

          if (isEv) {
            statusClass += ' ev-slot';
          }

          return (
            <div
              key={spot._id}
              className={`slot-bay ${statusClass}`}
              onClick={() => onSelectSpot(spot)}
              title={`${spot.title} - ${spot.slotCode} (${statusText})`}
            >
              {/* Header with Slot Code and Icon */}
              <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="slot-code">{spot.slotCode}</span>
                {isEv ? (
                  <Zap size={16} color="#06b6d4" />
                ) : isOccupied ? (
                  <Car size={16} color="#ef4444" />
                ) : (
                  <Car size={16} color="#10b981" />
                )}
              </div>

              {/* Middle Section with Visual Slot Graphic */}
              <div style={{ textAlign: 'center', margin: '0.4rem 0' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {spot.spotType ? spot.spotType.toUpperCase() : 'CAR'}
                </div>
                <div className="slot-price">
                  ${spot.pricePerHour}/hr
                </div>
              </div>

              {/* Status Badge */}
              <span className={`slot-status-pill ${badgeClass}`}>
                {statusText}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
