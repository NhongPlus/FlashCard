import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../utils/hooks/useAuth';
import LoadingScreen from '../components/Layout/LoadingScreen/LoadingScreen';

export function PrivateRoute() {
  const { isAuthenticated, loading } = useAuth();

  // Step 1: Kiểm tra trạng thái loading
  if (loading) {
    return <LoadingScreen />;
  }

  // Step 2: Kiểm tra authentication
  if (!isAuthenticated) {
    // Nếu chưa đăng nhập, redirect về trang about
    // replace: true -> thay thế route hiện tại trong history stack
    return <Navigate to="/about" replace />;
  }

  // Step 3: User đã authenticated -> render protected content
  return <Outlet />;
}