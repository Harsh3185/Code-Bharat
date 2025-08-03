import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import logo from '../assets/logo.png';
import { fetchUser } from '../Store/Features/Auth/authThunks.js';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);

  useEffect(() => {
    if (!user) dispatch(fetchUser());
  }, [dispatch, user]);

  const nav = [
    { path: '/explore', label: 'Explore' },
    { path: '/problems', label: 'Problems' },
    { path: '/contests', label: 'Contests' },
    { path: '/leaderboard', label: 'Leaderboard' }
  ];

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur bg-[#0e0e0ee6] border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={logo}
              alt="Code Bharat logo"
              className="h-12 w-auto transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {nav.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`relative px-3 py-2 duration-300 ${
                  pathname.startsWith(path) ? 'text-gray-50' : 'text-gray-300 hover:text-gray-50'
                }`}
              >
                {label}
                <span
                  className={`absolute left-0 -bottom-0.5 h-0.5 w-full bg-gradient-to-r from-gray-300 to-gray-500 origin-left
                  transform ${
                    pathname.startsWith(path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  } duration-300`}
                />
              </Link>
            ))}

            {user ? (
              <Link to="/profile">
                <div className="ml-4 w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg uppercase">
                  {user.userName?.[0] ?? 'U'}
                </div>
              </Link>
            ) : (
              <Link
                to="/login"
                className="ml-4 px-6 py-2 rounded-full bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-500 hover:to-gray-700 text-white font-semibold shadow-md"
              >
                Login
              </Link>
            )}
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden w-9 h-9 flex flex-col justify-center items-center"
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-0.5 bg-gray-200 transition-transform ${
                open ? 'rotate-45 translate-y-1' : ''
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-gray-200 mt-1 transition-opacity ${
                open ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-gray-200 mt-1 transition-transform ${
                open ? '-rotate-45 -translate-y-1' : ''
              }`}
            />
          </button>
        </div>

        <div
          className={`md:hidden grid transition-[grid-template-rows] duration-300 overflow-hidden ${
            open ? 'grid-rows-[1fr] pb-4' : 'grid-rows-[0fr]'
          }`}
        >
          <div className="overflow-hidden flex flex-col gap-3 text-sm font-medium border-t border-white/10 pt-4">
            {nav.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-gray-200/90 hover:bg-white/10 rounded-lg"
              >
                {label}
              </Link>
            ))}

            {user ? (
              <Link to="/profile" onClick={() => setOpen(false)}>
                <div className="ml-4 mt-2 w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg uppercase">
                  {user.userName?.[0] ?? 'U'}
                </div>
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="mx-4 mt-2 px-4 py-2 text-center rounded-lg bg-gradient-to-r from-gray-600 to-gray-800 text-white font-semibold hover:from-gray-500 hover:to-gray-700"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
