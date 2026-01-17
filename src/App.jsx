import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
// Import components
import Navbar from './components/ui/Navbar';
import ProtectedRoute from './components/ui/ProtectedRoute';
import DownloadSuccess from './components/download/DownloadSuccess';
// Import auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Import main pages
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import Templates from './pages/Templates';

// Import payment pages
import Checkout from './pages/payment/Checkout';
import PaymentSuccess from './pages/payment/PaymentSuccess';
import Upgrade from './pages/payment/Upgrade';

// Import profile pages
import Profile from './pages/profile/Profile';
import Settings from './pages/profile/Settings';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h2>Something went wrong</h2>
          <p>We're sorry for the inconvenience.</p>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Fix Stripe initialization
let stripePromise = null;

// In App.js - Add this helper function
export const refreshUserData = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = user.token;
    
    if (!token) return user;
    
    const API_BASE = process.env.REACT_APP_API_URL || 'https://resume-builder-for-backend.onrender.com';
    
    const res = await fetch(`${API_BASE}/api/users/profile`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (res.ok) {
      const apiUserData = await res.json();
      const updatedUser = {
        ...user,
        ...apiUserData,
        token: token,
        id: apiUserData._id || apiUserData.id || user.id,
        
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    }
    return user;
  } catch (error) {
    console.error('Error refreshing user data:', error);
    return JSON.parse(localStorage.getItem('user') || '{}');
  }
};

// Load user data from backend API
const loadUserDataFromAPI = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = user.token;
    
    // If no token, return local user data
    if (!token) {
      console.log('No authentication token found');
      return user;
    }
    
    const API_BASE = process.env.REACT_APP_API_URL || 'https://resume-builder-for-backend.onrender.com';
    
    console.log('Loading user data from API:', `${API_BASE}/api/users/profile`);
    
    const res = await fetch(`${API_BASE}/api/users/profile`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (res.ok) {
      const apiUserData = await res.json();
      const normalizedUser = {
  ...user,
  ...apiUserData,
  subscription: apiUserData.subscription?.plan || 'free' // ← Extract plan
};
localStorage.setItem('user', JSON.stringify(normalizedUser));
      console.log('User data loaded successfully from API');
      
      // Merge API data with local data
      const mergedUser = {
        ...user,
        ...apiUserData,
        // Preserve token
        token: token,
        // Ensure we have required fields
        id: apiUserData._id || apiUserData.id || user.id,
        email: apiUserData.email || user.email,
        name: apiUserData.name || user.name,
        subscription: apiUserData.subscription || user.subscription || 'free',
        resumes: apiUserData.resumes || user.resumes || [],
        templates: apiUserData.templates || user.templates || [],
        // Add last sync timestamp
        lastSynced: new Date().toISOString()
      };
      
      localStorage.setItem('user', JSON.stringify(mergedUser));
      return mergedUser;
    } else {
      console.warn('Failed to fetch user data from API:', res.status);
      // If unauthorized (401), clear invalid token
      if (res.status === 401) {
        console.log('Clearing invalid token');
        const updatedUser = { ...user, token: null };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
      }
      return user;
    }
  } catch (error) {
    console.error('Error loading user data from API:', error);
    // Return local user data on error
    return JSON.parse(localStorage.getItem('user') || '{}');

  }

  
};



// Initialize user data
const initializeUser = async () => {
  // First, load from API if token exists
  let user = await loadUserDataFromAPI();
  
  // If still no user ID, create a new local user
  if (!user.id) {
    const newUser = {
      id: 'user_' + Date.now(),
      email: '',
      name: '',
      subscription: 'free',
      createdAt: new Date().toISOString(),
      resumes: [],
      templates: []
    };
    
    localStorage.setItem('user', JSON.stringify(newUser));
    console.log('✅ New user initialized');
    return newUser;
  }
  
  console.log('✅ User data loaded:', { 
    id: user.id, 
    email: user.email,
    subscription: user.subscription,
    resumesCount: user.resumes?.length || 0
  });
  
  return user;
};

// Only initialize Stripe if we have a valid key
const stripePublicKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY;
if (stripePublicKey && stripePublicKey.startsWith('pk_')) {
  try {
    const { loadStripe } = require('@stripe/stripe-js');
    stripePromise = loadStripe(stripePublicKey);
    console.log('✅ Stripe initialized successfully');
  } catch (error) {
    console.error('❌ Stripe initialization failed:', error);
  }
} else {
  console.warn('⚠️ Stripe public key not found or invalid. Payment features will be disabled.');
}

// Check for Google Client ID
const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

if (!googleClientId) {
  console.warn('⚠️ REACT_APP_GOOGLE_CLIENT_ID is not set. Google OAuth will not work.');
}

// Create Stripe Elements wrapper
const StripeWrapper = ({ children }) => {
  if (!stripePromise) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h3>⚠️ Payment System Disabled</h3>
        <p>Stripe payment system is currently unavailable.</p>
        <p>Please set REACT_APP_STRIPE_PUBLIC_KEY in .env file</p>
       
       <button 
            onClick={() => window.location.href = '/upgrade'}
            style={{ 
              padding: '10px 20px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Back to Plans
          </button>
        <button 
          onClick={() => window.location.reload()}
          style={{ marginTop: '20px', padding: '10px 20px' }}
        >
          Retry
        </button>
      </div>
    );
  }
  
  const { Elements } = require('@stripe/react-stripe-js');
  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
};

function App() {
  useEffect(() => {
    const initApp = async () => {
      await initializeUser();
      
      // Listen for subscription updates
      const handleSubscriptionUpdate = (event) => {
        console.log('📢 Subscription updated:', event.detail);
        // Reload user data when subscription updates
        loadUserDataFromAPI().then(updatedUser => {
          console.log('User data refreshed after subscription update');
          // Dispatch event for other components
          window.dispatchEvent(new CustomEvent('user-data-updated', { 
            detail: { user: updatedUser } 
          }));
        });
      };
      
      window.addEventListener('subscription-updated', handleSubscriptionUpdate);
      
      return () => {
        window.removeEventListener('subscription-updated', handleSubscriptionUpdate);
      };
    };
    
    initApp();
  }, []);
  
  return (
    <GoogleOAuthProvider clientId={googleClientId || ''}>
      <BrowserRouter>
        <ErrorBoundary>
          <div className="app-container">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Navbar />
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/templates" element={
                <ProtectedRoute>
                  <Navbar />
                  <Templates />
                </ProtectedRoute>
              } />
              
              <Route path="/editor" element={
                <ProtectedRoute>
                  <Navbar />
                  <Editor />
                </ProtectedRoute>
              } />
              <Route path="/download-success" element={<DownloadSuccess />} />
              
              <Route path="/editor/:id" element={
                <ProtectedRoute>
                  <Navbar />
                  <Editor />
                </ProtectedRoute>
              } />
              
              {/* Payment Routes */}
              <Route path="/checkout" element={
                <ProtectedRoute>
                  <Navbar />
                  <StripeWrapper>
                    <Checkout />
                  </StripeWrapper>
                </ProtectedRoute>
              } />
              
              <Route path="/payment/success" element={
                <ProtectedRoute>
                  <Navbar />
                  <PaymentSuccess />
                </ProtectedRoute>
              } />
              
              <Route path="/upgrade" element={
                <ProtectedRoute>
                  <Navbar />
                  <Upgrade />
                </ProtectedRoute>
              } />
              
              {/* Profile Routes */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Navbar />
                  <Profile />
                </ProtectedRoute>
              } />
              
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Navbar />
                  <Settings />
                </ProtectedRoute>
              } />

                {/* 404 Route */}
                <Route path="*" element={
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '100px 20px',
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <h1 style={{ fontSize: '4rem', marginBottom: '20px' }}>sorry </h1>
                    <h2 style={{ marginBottom: '20px' }}>work in progress</h2>
                    <p style={{ marginBottom: '30px', color: '#6b7280' }}>
                      The page you're looking for doesn't exist for sometime  .
                    </p>
                    <div style={{ display: 'flex', gap: '15px' }}>
                      <button 
                        onClick={() => window.history.back()}
                        style={{ 
                          padding: '12px 24px',
                          background: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer'
                        }}
                      >
                        Go Back
                      </button>
                      <button 
                        onClick={() => window.location.href = '/'}
                        style={{ 
                          padding: '12px 24px',
                          background: '#e5e7eb',
                          color: '#4b5563',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer'
                        }}
                      >
                        Go Home
                      </button>
                    </div>
                  </div>
                } />
            </Routes>
          </div>
        </ErrorBoundary>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;