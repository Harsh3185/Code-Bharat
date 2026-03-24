import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutThunk } from "../Store/Features/Auth/authThunks.js";
import mesh from "../assets/mesh.png";

const links = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/problems", label: "Manage Problems" },
  { to: "/admin/problems/new", label: "Add Problem" },
];

export default function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0f14] text-[#e8edf2]">
      <img
        src={mesh}
        alt="Code Bharat background"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,10,14,0.78)_0%,rgba(6,10,14,0.56)_45%,rgba(6,10,14,0.48)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_28%)]" />

      <div className="relative mx-auto grid min-h-screen max-w-[1600px] gap-6 px-4 py-6 lg:grid-cols-[260px_1fr] lg:px-6">
        <aside className="rounded-[30px] border border-white/15 bg-black/25 px-5 py-6 backdrop-blur-md">
          <div className="border-b border-white/8 pb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8ea2b6]">
              Admin Console
            </p>
            <h1 className="mt-3 text-2xl font-semibold text-white">Code Bharat</h1>
            <p className="mt-2 text-sm text-[#91a1b1]">
              Signed in as {user?.userName || "Admin"}
            </p>
          </div>

          <nav className="mt-6 space-y-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `block rounded-2xl px-4 py-3 text-sm transition ${
                    isActive
                      ? "bg-white text-[#10212d]"
                      : "bg-transparent text-[#c7d2dc] hover:bg-white/10"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-8 rounded-2xl border border-white/12 bg-black/20 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-[#718293]">Public App</p>
            <a href="/" className="mt-2 inline-block text-sm text-white hover:text-[#dbe7f1]">
              Open main site
            </a>
          </div>

          <button
            onClick={handleLogout}
            className="mt-6 w-full rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-200 transition hover:bg-rose-500/15"
          >
            Logout
          </button>
        </aside>

        <main className="min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
