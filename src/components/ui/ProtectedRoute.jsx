// src/components/ui/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredSubscription }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Store the intended path before redirecting to login
  if (!token) {
    localStorage.setItem('redirectPath', location.pathname + location.search);
    return <Navigate to="/login" replace />;
  }

  // Check subscription if required
  if (requiredSubscription) {
    const subscriptionLevels = {
      'free': 0,
      'basic': 1,
      'premium': 2,
      'vip': 3
    };

    const userLevel = subscriptionLevels[user.subscription] || 0;
    const requiredLevel = subscriptionLevels[requiredSubscription] || 0;

    if (userLevel < requiredLevel) {
      return <Navigate to="/upgrade" replace state={{ from: location, required: requiredSubscription }} />;
    }
  }
 if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;