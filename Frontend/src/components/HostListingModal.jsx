import React, { useState } from 'react';
import { 
  X, 
  PlusCircle, 
  MapPin, 
  DollarSign, 
  ShieldCheck, 
  Zap, 
  Car, 
  Image, 
  Building,
  Check
} from 'lucide-react';

export default function HostListingModal({ onClose, onSubmitSpot, currentUser }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    slotCode: 'DW-0' + Math.floor(Math.random() * 9 + 1),
    floor: 'Private Driveway',
    address: '',
    city: 'New York',
    landmark: '',
    spotType: 'car',
    rentalType: 'flexible',
    pricePerHour: 4,
    pricePerDay: 25,
    pricePerMonth: 200,
    amenities: ['cctv', '24_7_access'],
    image: 'https://images.unsplash.com/photo-1584463699028-ebbb4b216972?auto=format&fit=crop&w=800&q=80',
    hostName: currentUser?.name || '',
    hostPhone: currentUser?.phone || '',
  });

  const [loading, setLoading] = useState(false);

  const amenityOptions = [
    { id: 'cctv', label: 'CCTV Security Camera' },
    { id: 'covered', label: 'Covered / Indoor Garage' },
    { id: '24_7_access', label: '24/7 Gated Access' },
    { id: 'ev_charging', label: 'EV Fast Charging Outlet' },
    { id: 'security_guard', label: 'Security Guard Patrol' },
    { id: 'valet', label: 'Valet Assistance' },
  ];

  const handleAmenityToggle = (id) => {
    setFormData((prev) => {
      const exists = prev.amenities.includes(id);
      return {
        ...prev,
        amenities: exists ? prev.amenities.filter((a) => a !== id) : [...prev.amenities, id],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.address || !formData.slotCode) {
      alert('Please fill out all required fields.');
      return;
    }

    setLoading(true);
    try {
      await onSubmitSpot(formData);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <div style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(139, 92, 246, 0.2)',
              color: '#c084fc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <PlusCircle size={18} />
            </div>
            <h2 style={{ fontSize: '1.4rem', color: '#fff' }}>
              List Your Parking Space
            </h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            Rent out your unused driveway, carport, or commercial garage spot to verified drivers.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Title */}
            <div className="search-field">
              <label className="field-label">Listing Title *</label>
              <div className="field-input-wrap">
                <input
                  type="text"
                  required
                  placeholder="e.g. Spacious Private Driveway near Downtown"
                  className="field-input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
            </div>

            {/* Address & City */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '0.75rem' }}>
              <div className="search-field">
                <label className="field-label"><MapPin size={12} /> Street Address *</label>
                <div className="field-input-wrap">
                  <input
                    type="text"
                    required
                    placeholder="e.g. 742 Evergreen Terrace"
                    className="field-input"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </div>

              <div className="search-field">
                <label className="field-label"><Building size={12} /> City</label>
                <div className="field-input-wrap">
                  <select
                    className="field-select"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  >
                    <option value="New York">New York</option>
                    <option value="San Francisco">San Francisco</option>
                    <option value="Chicago">Chicago</option>
                    <option value="Los Angeles">Los Angeles</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Slot Code & Vehicle Type */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="search-field">
                <label className="field-label">Slot Identifier Code *</label>
                <div className="field-input-wrap">
                  <input
                    type="text"
                    required
                    placeholder="e.g. DW-01 or BAY-4"
                    className="field-input"
                    value={formData.slotCode}
                    onChange={(e) => setFormData({ ...formData, slotCode: e.target.value })}
                  />
                </div>
              </div>

              <div className="search-field">
                <label className="field-label"><Car size={12} /> Spot Category</label>
                <div className="field-input-wrap">
                  <select
                    className="field-select"
                    value={formData.spotType}
                    onChange={(e) => setFormData({ ...formData, spotType: e.target.value })}
                  >
                    <option value="car">Car / Sedan</option>
                    <option value="suv">Large SUV / Truck</option>
                    <option value="ev">Electric Vehicle (EV)</option>
                    <option value="bike">Motorcycle / Scooter</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Pricing Rates */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              <div className="search-field">
                <label className="field-label">Hourly Rate ($)</label>
                <div className="field-input-wrap">
                  <input
                    type="number"
                    min="1"
                    className="field-input"
                    value={formData.pricePerHour}
                    onChange={(e) => setFormData({ ...formData, pricePerHour: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="search-field">
                <label className="field-label">Daily Pass ($)</label>
                <div className="field-input-wrap">
                  <input
                    type="number"
                    min="1"
                    className="field-input"
                    value={formData.pricePerDay}
                    onChange={(e) => setFormData({ ...formData, pricePerDay: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="search-field">
                <label className="field-label">Monthly ($)</label>
                <div className="field-input-wrap">
                  <input
                    type="number"
                    min="1"
                    className="field-input"
                    value={formData.pricePerMonth}
                    onChange={(e) => setFormData({ ...formData, pricePerMonth: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>

            {/* Amenities Grid */}
            <div className="search-field">
              <label className="field-label">Available Amenities</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                {amenityOptions.map((a) => {
                  const checked = formData.amenities.includes(a.id);
                  return (
                    <div
                      key={a.id}
                      onClick={() => handleAmenityToggle(a.id)}
                      style={{
                        padding: '0.5rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        background: checked ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                        border: checked ? '1px solid #10b981' : '1px solid var(--border-color)',
                        color: checked ? '#10b981' : 'var(--text-secondary)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                      }}
                    >
                      <div style={{
                        width: '14px',
                        height: '14px',
                        borderRadius: '3px',
                        background: checked ? '#10b981' : 'transparent',
                        border: checked ? 'none' : '1px solid #64748b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        {checked && <Check size={10} color="#fff" />}
                      </div>
                      {a.label}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Image URL */}
            <div className="search-field">
              <label className="field-label"><Image size={12} /> Space Photo URL</label>
              <div className="field-input-wrap">
                <input
                  type="url"
                  className="field-input"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: '100%', height: '46px', justifyContent: 'center', marginTop: '0.5rem' }}
            >
              <PlusCircle size={18} />
              {loading ? 'Publishing Spot...' : 'Publish Space Listing'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
