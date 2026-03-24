import { Outlet } from "react-router-dom";

export default function AdminAuthLayout() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <Outlet />
    </div>
  );
}
