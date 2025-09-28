import type { ComponentType } from "react";
import { Navigate } from "react-router-dom";

// Props cho AppRoute
interface AppRouteProps {
  routeKey: string;
  component: ComponentType<any>;
  isPrivate?: boolean;
}

export function AppRoute({ component: Component, isPrivate }: AppRouteProps) {
  const isAuthenticated = false; // TODO: check login từ context hoặc redux

  if (isPrivate && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Component />;
}
