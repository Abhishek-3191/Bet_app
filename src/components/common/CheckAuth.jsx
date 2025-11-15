
import { Navigate, Outlet } from "react-router-dom";
export default function CheckAuth({ isAuthenticated, user, children }) {
  // When no children are passed, this works like a redirect handler
  if (!children) {
    return isAuthenticated ? (
      <Navigate to="/" />
    ) : (
      <Navigate to="/auth/login" />
    );
  }
  // Protected route check
   if (!isAuthenticated)
   return <Navigate to="/auth/login" />;
  return children;
}
