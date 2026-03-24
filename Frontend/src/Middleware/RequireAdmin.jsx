import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { fetchUser } from "../Store/Features/Auth/authThunks.js";

export default function RequireAdmin() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      dispatch(fetchUser());
    }
  }, [dispatch, user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f1419] text-white">
        Loading...
      </div>
    );
  }

  if (!user || user.role?.toLowerCase() !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
