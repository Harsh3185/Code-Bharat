import { Link } from 'react-router-dom';
import logo from "../assets/logo.png";

export default function AuthNavbar() {
  return (
    <nav className="bg-gradient-to-r from-[#0e0e0e] via-[#1a1a1a] to-[#0e0e0e] text-[#e5e5e5] shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-20 px-6">
        <Link to="/" className="flex items-center gap-3 group">
          <img src={logo} alt="logo" className="h-10 w-auto" />
          <span className="text-xl font-semibold tracking-wider hidden sm:block group-hover:text-gray-200 transition-colors">
          </span>
        </Link>
        <Link
          to="/"
          className="text-sm font-medium bg-gradient-to-r from-gray-500 to-gray-600 px-4 py-1.5 rounded-full hover:from-gray-400 hover:to-gray-500 transition-colors"
        >
          ← Home
        </Link>
      </div>
    </nav>
  );
}