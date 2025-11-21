import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore.js';

function ProtectedRoute ({ children }) {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="py-20 text-center text-text/60">
        Checking session...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
