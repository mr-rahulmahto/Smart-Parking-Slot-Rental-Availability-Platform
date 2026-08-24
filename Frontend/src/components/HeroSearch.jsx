import React from 'react';
import { 
  Search, 
  MapPin, 
  Car, 
  Clock, 
  Zap, 
  Shield, 
  Building, 
  SlidersHorizontal,
  Compass
} from 'lucide-react';

export default function HeroSearch({ 
  searchParams, 
  setSearchParams, 
  onSearch, 
  stats 
}) {
  const cities = ['All', 'New York', 'San Francisco', 'Chicago', 'Los Angeles'];
  const vehicleTypes = [
    { label: 'All Vehicles', value: 'all' },
    { label: 'Cars', value: 'car' },
    { label: 'SUVs & Trucks', value: 'suv' },
    { label: 'EV Charging', value: 'ev' },
    { label: 'Bikes / Scooters', value: 'bike' },
  ];

  const rentalTypes = [
    { label: 'Hourly Parking', value: 'hourly' },
    { label: 'Daily Pass', value: 'daily' },
    { label: 'Monthly Rental', value: 'monthly' },
  ];

  return (
    <div className="hero-section">
      <div className="hero-badge">
        <Zap size={14} /> Real-Time IoT Sensor & Host Network
      </div>
      
      <h1 className="hero-title">
        Smart Parking Slots & <span>Rental Spaces</span>
      </h1>
      
      <p className="hero-desc">
        Instant guaranteed parking reservation in premium commercial decks, EV charging hubs, and verified private driveway rentals.
      </p>

      {/* Main Search Card */}
      <div className="search-card">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            onSearch();
          }}
          className="search-grid"
        >
          {/* Location / Query */}
          <div className="search-field">
            <label className="field-label">
              <MapPin size={13} color="#10b981" /> Destination / Landmark
            </label>
            <div className="field-input-wrap">
              <input 
                type="text" 
                className="field-input" 
                placeholder="e.g. Grand Central, Brooklyn, Wall St..."
                value={searchParams.query || ''}
                onChange={(e) => setSearchParams({ ...searchParams, query: e.target.value })}
              />
            </div>
          </div>

          {/* City */}
          <div className="search-field">
            <label className="field-label">
              <Building size={13} color="#06b6d4" /> City / Region
            </label>
            <div className="field-input-wrap">
              <select 
                className="field-select"
                value={searchParams.city || 'All'}
                onChange={(e) => setSearchParams({ ...searchParams, city: e.target.value })}
              >
                {cities.map((c) => (
                  <option key={c} value={c}>{c === 'All' ? 'All Cities' : c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Vehicle Type */}
          <div className="search-field">
            <label className="field-label">
              <Car size={13} color="#8b5cf6" /> Vehicle Category
            </label>
            <div className="field-input-wrap">
              <select 
                className="field-select"
                value={searchParams.spotType || 'all'}
                onChange={(e) => setSearchParams({ ...searchParams, spotType: e.target.value })}
              >
                {vehicleTypes.map((v) => (
                  <option key={v.value} value={v.value}>{v.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Duration Type */}
          <div className="search-field">
            <label className="field-label">
              <Clock size={13} color="#f59e0b" /> Booking Mode
            </label>
            <div className="field-input-wrap">
              <select 
                className="field-select"
                value={searchParams.rentalType || 'all'}
                onChange={(e) => setSearchParams({ ...searchParams, rentalType: e.target.value })}
              >
                <option value="all">All Durations</option>
                {rentalTypes.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button 
              type="submit" 
              className="btn-primary" 
              style={{ width: '100%', height: '46px', justifyContent: 'center' }}
            >
              <Search size={18} />
              Check Availability
            </button>
          </div>
        </form>
      </div>

      {/* Live Stats Strip */}
      <div className="stats-strip">
        <div className="stat-box">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <Car size={22} />
          </div>
          <div>
            <div className="stat-val">{stats.availableSpots || 6}</div>
            <div className="stat-lbl">Live Slots Available</div>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}>
            <Zap size={22} />
          </div>
          <div>
            <div className="stat-val">{stats.evSpots || 3}</div>
            <div className="stat-lbl">EV Fast Hubs</div>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}>
            <Building size={22} />
          </div>
          <div>
            <div className="stat-val">{stats.hostListings || 4}</div>
            <div className="stat-lbl">Private Driveway Hosts</div>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
            <Shield size={22} />
          </div>
          <div>
            <div className="stat-val">100%</div>
            <div className="stat-lbl">Guaranteed Booking</div>
          </div>
        </div>
      </div>
    </div>
  );
}
