import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function RequireAdmin() {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) return <div className="p-10 text-white">Loading...</div>;

  if (!user || user.role?.toLowerCase() !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
