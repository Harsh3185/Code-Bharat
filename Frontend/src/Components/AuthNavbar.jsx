import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function AuthNavbar() {
  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-[#0e0e0e] via-[#1a1a1a] to-[#0e0e0e] text-[#e5e5e5] shadow-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Code Bharat logo" className="h-10 w-auto" />
        </Link>
        <Link
          to="/"
          className="rounded-full bg-gradient-to-r from-gray-500 to-gray-600 px-4 py-1.5 text-sm font-medium transition-colors hover:from-gray-400 hover:to-gray-500"
        >
          &larr; Home
        </Link>
      </div>
    </nav>
  );
}
