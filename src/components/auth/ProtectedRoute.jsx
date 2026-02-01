import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../ui/Loader';

export default function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!currentUser) {
    // Redirect them to the /auth page, but save the current location they were trying to go to
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
}
