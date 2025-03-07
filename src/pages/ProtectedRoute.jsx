import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, role } = useAuth();

  if (!user) return <Navigate to="/" replace />;
  if (!allowedRoles.includes(role)) return <Navigate to="/home" replace />; // Redirect non-admins

  return <Outlet />;
};

export default ProtectedRoute;
