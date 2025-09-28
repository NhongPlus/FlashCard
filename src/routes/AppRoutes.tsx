import { Navigate, Route, Routes } from 'react-router-dom';
import { protectedRoutes, publicRoutes } from '@/config/routes.config.ts';
import AuthLayout from './PublicRoute';
import { PrivateRoute } from './PrivateRoute';
import { AppRoute } from './AppRoute';
import DefaultLayout from '@/components/Layout/LayoutTypes/DefaultLayout'

const AllRoutes = () => {
  return (
    <Routes>
      {/* Protected Routes */}
      <Route path="/" element={<PrivateRoute />}>
        <Route path="/" element={<Navigate replace to="/dashboard" />} />
        {protectedRoutes.map((route) => (
          <Route
            key={route.key}
            path={route.path}
            element={<AppRoute routeKey={route.key} component={route.component} />}
          />
        ))}
      </Route>

      {/* Public Routes */}
      <Route element={<AuthLayout />}>
        {publicRoutes.map((route) => (
          <Route
            key={route.key}
            path={route.path}
            element={<AppRoute routeKey={route.key} component={route.component} />}
          />
        ))}
      </Route>

      <Route path="/" element={<DefaultLayout />} />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AllRoutes;
