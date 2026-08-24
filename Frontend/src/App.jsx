import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSearch from './components/HeroSearch';
import ParkingGrid from './components/ParkingGrid';
import SpotCard from './components/SpotCard';
import SpotDetailsModal from './components/SpotDetailsModal';
import HostListingModal from './components/HostListingModal';
import MyBookings from './components/MyBookings';
import AdminDashboard from './components/AdminDashboard';
import AuthModal from './components/AuthModal';
import LoginRequired from './components/LoginRequired';
import { api } from './services/api';
import { 
  SlidersHorizontal, 
  Car, 
  Zap, 
  Building, 
  ShieldCheck, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState('explore'); // 'explore' | 'grid' | 'bookings' | 'admin'
  const [spots, setSpots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem('smartpark_theme') || 'dark');

  // User state
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('smartpark_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Search & Filter state
  const [searchParams, setSearchParams] = useState({
    query: '',
    city: 'All',
    spotType: 'all',
    rentalType: 'all',
  });
  const [activeQuickFilter, setActiveQuickFilter] = useState('all');

  // Modals state
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [isHostModalOpen, setIsHostModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Initial Fetch
  const fetchAllData = async () => {
    try {
      setLoading(true);
      const spotsRes = await api.getSpots(searchParams);
      if (spotsRes.success && Array.isArray(spotsRes.data)) {
        setSpots(spotsRes.data);
      } else if (!spotsRes.success) {
        addToast(spotsRes.message || 'Make sure Backend is running on port 5000 (cd Backend; npm start)', 'error');
      }

      const bookingsRes = await api.getBookings();
      if (bookingsRes.success && Array.isArray(bookingsRes.data)) setBookings(bookingsRes.data);

      const analyticsRes = await api.getAnalytics();
      if (analyticsRes.success && analyticsRes.data) setAnalytics(analyticsRes.data);
    } catch (err) {
      console.error('Data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('smartpark_theme', theme);
  }, [theme]);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const res = await api.getSpots(searchParams);
      if (res.success) {
        setSpots(res.data);
        addToast(`Found ${res.data.length} parking spots matching your criteria`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Quick Filter handler
  const handleQuickFilter = async (filterKey) => {
    setActiveQuickFilter(filterKey);
    let params = { ...searchParams };

    if (filterKey === 'ev') {
      params.spotType = 'ev';
    } else if (filterKey === 'host') {
      params.hostOnly = 'true';
    } else if (filterKey === 'available') {
      params.status = 'available';
    } else if (filterKey === 'cheap') {
      params.maxPrice = '5';
    } else {
      params = { query: '', city: 'All', spotType: 'all', rentalType: 'all' };
    }

    try {
      const res = await api.getSpots(params);
      if (res.success) setSpots(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  // Booking Confirmation
  const handleConfirmBooking = async (bookingPayload) => {
    try {
      const res = await api.createBooking(bookingPayload);
      if (res.success) {
        addToast(`Slot ${res.data.slotCode} reserved successfully! Gate pass generated.`);
        // Refresh spots & bookings
        fetchAllData();
        return res;
      } else {
        alert(res.message || 'Failed to create booking');
      }
    } catch (err) {
      console.error(err);
      alert('Error creating booking');
    }
  };

  // Host Space Submission
  const handleCreateSpot = async (spotData) => {
    if (currentUser?.role !== 'admin') {
      addToast('Only admins can rent out parking spaces.', 'error');
      return;
    }

    try {
      const res = await api.createSpot(spotData);
      if (res.success) {
        addToast(`Listing "${spotData.title}" published to live network!`);
        fetchAllData();
      } else {
        addToast(res.message || 'Only admins can rent out parking spaces.', 'error');
      }
    } catch (err) {
      console.error(err);
      alert('Error publishing spot');
    }
  };

  // Status toggle from console
  const handleToggleStatus = async (id, newStatus) => {
    try {
      const res = await api.updateSpotStatus(id, newStatus);
      if (res.success) {
        addToast(`Slot status updated to ${newStatus}`);
        setSpots((prev) => prev.map((s) => (s._id === id ? { ...s, status: newStatus } : s)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete spot
  const handleDeleteSpot = async (id) => {
    try {
      const res = await api.deleteSpot(id);
      if (res.success) {
        addToast('Spot deleted successfully');
        setSpots((prev) => prev.filter((s) => s._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Cancel Booking
  const handleCancelBooking = async (id) => {
    try {
      const res = await api.cancelBooking(id);
      if (res.success) {
        addToast('Reservation cancelled. Slot released to network.');
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Complete Booking
  const handleCompleteBooking = async (id) => {
    try {
      const res = await api.completeBooking(id);
      if (res.success) {
        addToast('Check-out confirmed. Thank you for parking with us!');
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Auth Handlers
  const handleLogin = async (credentials) => {
    const res = await api.login(credentials);
    if (res.success) {
      setCurrentUser(res.user);
      localStorage.setItem('smartpark_user', JSON.stringify(res.user));
      localStorage.setItem('smartpark_token', res.token);
      addToast(`Welcome back, ${res.user.name}!`);
    } else {
      throw new Error(res.message || 'Login failed');
    }
  };

  const handleRegister = async (userData) => {
    const res = await api.register(userData);
    if (res.success) {
      setCurrentUser(res.user);
      localStorage.setItem('smartpark_user', JSON.stringify(res.user));
      localStorage.setItem('smartpark_token', res.token);
      addToast(`Account created! Welcome, ${res.user.name}`);
    } else {
      throw new Error(res.message || 'Registration failed');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('smartpark_user');
    localStorage.removeItem('smartpark_token');
    setCurrentTab('explore');
    addToast('Signed out successfully');
  };

  const activeBookingsCount = bookings.filter((b) => b.status === 'active').length;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onOpenHostModal={() => {
          if (!currentUser) {
            setIsAuthModalOpen(true);
            return;
          }
          if (currentUser.role !== 'admin') {
            addToast('Only admins can rent out parking spaces.', 'error');
            setCurrentTab('admin');
            return;
          }
          setIsHostModalOpen(true);
        }}
        activeBookingsCount={activeBookingsCount}
        theme={theme}
        onToggleTheme={() => setTheme((value) => (value === 'dark' ? 'light' : 'dark'))}
      />

      {/* Main Content Area */}
      <main className="container" style={{ flexGrow: 1 }}>
        {currentTab === 'explore' && (
          <div>
            <HeroSearch
              searchParams={searchParams}
              setSearchParams={setSearchParams}
              onSearch={handleSearch}
              stats={{
                availableSpots: spots.filter((s) => s.status === 'available').length,
                evSpots: spots.filter((s) => s.spotType === 'ev').length,
                hostListings: spots.filter((s) => s.isHostListing).length,
              }}
            />

            {/* Quick Filter Pills */}
            <div className="filter-bar">
              <div className="pill-group">
                <button
                  className={`pill-btn ${activeQuickFilter === 'all' ? 'active' : ''}`}
                  onClick={() => handleQuickFilter('all')}
                >
                  All Spots
                </button>
                <button
                  className={`pill-btn ${activeQuickFilter === 'available' ? 'active' : ''}`}
                  onClick={() => handleQuickFilter('available')}
                >
                  <CheckCircle2 size={13} color="#10b981" /> Available Now
                </button>
                <button
                  className={`pill-btn ${activeQuickFilter === 'ev' ? 'active' : ''}`}
                  onClick={() => handleQuickFilter('ev')}
                >
                  <Zap size={13} color="#06b6d4" /> EV Fast Hubs
                </button>
                <button
                  className={`pill-btn ${activeQuickFilter === 'host' ? 'active' : ''}`}
                  onClick={() => handleQuickFilter('host')}
                >
                  <Building size={13} color="#8b5cf6" /> Private Driveway Rentals
                </button>
                <button
                  className={`pill-btn ${activeQuickFilter === 'cheap' ? 'active' : ''}`}
                  onClick={() => handleQuickFilter('cheap')}
                >
                  Under $5/hr
                </button>
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Showing <strong>{spots.length}</strong> smart parking locations
              </div>
            </div>

            {/* Spot Cards Grid */}
            <div className="spots-grid">
              {spots.map((spot) => (
                <SpotCard
                  key={spot._id}
                  spot={spot}
                  onBook={(s) => {
                    if (!currentUser) {
                      setIsAuthModalOpen(true);
                      return;
                    }
                    setSelectedSpot(s);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {currentTab === 'grid' && (
          <div style={{ paddingTop: '2rem' }}>
            <ParkingGrid
              spots={spots}
              onSelectSpot={(s) => {
                if (!currentUser) {
                  setIsAuthModalOpen(true);
                  return;
                }
                setSelectedSpot(s);
              }}
            />
          </div>
        )}

        {currentTab === 'bookings' && (
          currentUser ? (
            <MyBookings
              bookings={bookings}
              onCancelBooking={handleCancelBooking}
              onCompleteBooking={handleCompleteBooking}
            />
          ) : (
            <LoginRequired section="bookings" onOpenAuth={() => setIsAuthModalOpen(true)} />
          )
        )}

        {currentTab === 'admin' && (
          currentUser?.role === 'admin' ? (
            <AdminDashboard
              analytics={analytics}
              spots={spots}
              onToggleStatus={handleToggleStatus}
              onDeleteSpot={handleDeleteSpot}
              onRefresh={fetchAllData}
              onOpenHostModal={() => setIsHostModalOpen(true)}
            />
          ) : (
            <LoginRequired section="admin" onOpenAuth={() => setIsAuthModalOpen(true)} />
          )
        )}
      </main>

      {/* Modals */}
      {selectedSpot && (
        <SpotDetailsModal
          spot={selectedSpot}
          onClose={() => setSelectedSpot(null)}
          currentUser={currentUser}
          onConfirmBooking={handleConfirmBooking}
        />
      )}

      {isHostModalOpen && (
        <HostListingModal
          onClose={() => setIsHostModalOpen(false)}
          onSubmitSpot={handleCreateSpot}
          currentUser={currentUser}
        />
      )}

      {isAuthModalOpen && (
        <AuthModal
          onClose={() => setIsAuthModalOpen(false)}
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
      )}

      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className="toast">
            <CheckCircle2 size={16} color="#10b981" />
            <span style={{ fontSize: '0.85rem' }}>{t.message}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-color)',
        padding: '2rem 0',
        background: 'rgba(10, 15, 29, 0.95)',
        marginTop: 'auto',
        fontSize: '0.85rem',
        color: 'var(--text-muted)'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ color: '#fff', fontWeight: 700 }}>SmartPark Platform</span> &copy; 2026. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>MongoDB Atlas Integration</span>
            <span>Real-time IoT Sensor Matrix</span>
            <span>Digital Gate Passes</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
