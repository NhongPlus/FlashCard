import { Outlet, Navigate } from 'react-router-dom';
import useAuth from '../utils/hooks/useAuth';

function AuthLayout() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) { // true
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default AuthLayout;