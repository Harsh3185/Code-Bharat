import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { logoutThunk } from '../Store/Features/Auth/authThunks.js';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const profileRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/profile`, {
          withCredentials: true
        });
        setUser(profileRes.data.user);

        const subsRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/submissions`, {
          withCredentials: true
        });
        setSubmissions(subsRes.data.submissions);
      } catch {
        navigate('/login');
      }
    })();
  }, [navigate]);

  const handleLogout = () => {
    dispatch(logoutThunk());
    navigate('/login');
  };

  if (!user) return <div className="p-10 text-white">Loading…</div>;

  return (
    <div className="p-10 text-white max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

      <div className="space-y-3 text-lg">
        <p><b>Username:</b> {user.userName}</p>
        <p><b>Email:</b> {user.email}</p>
        <p><b>Solved:</b> {user.problemsSolved.length}</p>
        <p><b>Total Submissions:</b> {user.totalSubmissions}</p>
        <p><b>Accepted Submissions:</b> {user.acceptedSubmissions}</p>
        <p><b>Institution:</b> {user.institution || '—'}</p>
        <p><b>Location:</b> {user.location || '—'}</p>
        <p><b>Bio:</b> {user.bio || '—'}</p>
      </div>

      <button
        onClick={handleLogout}
        className="mt-8 px-6 py-2 bg-red-600 hover:bg-red-700 rounded text-white font-semibold"
      >
        Logout
      </button>

      {!!submissions.length && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Submission History</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-[#1f1f1f] rounded shadow">
              <thead>
                <tr className="bg-[#2a2a2a] text-left text-sm">
                  <th className="py-2 px-4">#</th>
                  <th className="py-2 px-4">Problem</th>
                  <th className="py-2 px-4">Lang</th>
                  <th className="py-2 px-4">Status</th>
                  <th className="py-2 px-4">Time</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((s, i) => (
                  <tr key={s._id} className="border-t border-gray-700 text-sm">
                    <td className="py-2 px-4">{i + 1}</td>
                    <td className="py-2 px-4">#{String(s.problemNumber).padStart(3, '0')}</td>
                    <td className="py-2 px-4">{s.language}</td>
                    <td className="py-2 px-4">
                      <span
                        className={
                          s.status === 'Accepted'
                            ? 'text-green-400'
                            : s.status.includes('Wrong')
                            ? 'text-yellow-400'
                            : 'text-red-400'
                        }
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="py-2 px-4">
                      {new Date(s.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
