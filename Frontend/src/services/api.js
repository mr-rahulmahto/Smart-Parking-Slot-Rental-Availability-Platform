// API base with automatic fallback and environment variable support for Netlify/Vercel
const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api` : '/api';

const getHeaders = () => {
  const token = localStorage.getItem('smartpark_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Safe JSON parser to prevent 'Unexpected end of JSON input'
const safeFetchJson = async (url, options = {}) => {
  try {
    const res = await fetch(url, options);
    const text = await res.text();

    if (!text || text.trim() === '') {
      if (!res.ok) {
        return {
          success: false,
          message: `Backend server error (${res.status} ${res.statusText}). Make sure the Backend server is running on port 5000.`,
          data: [],
        };
      }
      return { success: res.ok, data: [] };
    }

    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.warn('Response was not valid JSON:', text.substring(0, 100));
      return {
        success: false,
        message: 'Invalid response format from server. Please ensure the Backend is running on port 5000.',
        data: [],
      };
    }
  } catch (networkError) {
    console.error('Network request failed:', networkError.message);
    return {
      success: false,
      message: 'Cannot connect to Backend server. Please run "cd Backend; npm start" in your terminal.',
      data: [],
    };
  }
};

export const api = {
  // Auth
  login: async (credentials) => {
    return safeFetchJson(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
  },

  register: async (userData) => {
    return safeFetchJson(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
  },

  getProfile: async () => {
    return safeFetchJson(`${API_BASE}/auth/profile`, {
      headers: getHeaders(),
    });
  },

  // Spots
  getSpots: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return safeFetchJson(`${API_BASE}/spots${query ? `?${query}` : ''}`);
  },

  getSpotById: async (id) => {
    return safeFetchJson(`${API_BASE}/spots/${id}`);
  },

  createSpot: async (spotData) => {
    return safeFetchJson(`${API_BASE}/spots`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(spotData),
    });
  },

  updateSpotStatus: async (id, status) => {
    return safeFetchJson(`${API_BASE}/spots/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
  },

  deleteSpot: async (id) => {
    return safeFetchJson(`${API_BASE}/spots/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
  },

  // Bookings
  createBooking: async (bookingData) => {
    return safeFetchJson(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(bookingData),
    });
  },

  getBookings: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return safeFetchJson(`${API_BASE}/bookings${query ? `?${query}` : ''}`);
  },

  cancelBooking: async (id) => {
    return safeFetchJson(`${API_BASE}/bookings/${id}/cancel`, {
      method: 'POST',
      headers: getHeaders(),
    });
  },

  completeBooking: async (id) => {
    return safeFetchJson(`${API_BASE}/bookings/${id}/complete`, {
      method: 'POST',
      headers: getHeaders(),
    });
  },

  // Analytics
  getAnalytics: async () => {
    return safeFetchJson(`${API_BASE}/analytics`);
  },
};
