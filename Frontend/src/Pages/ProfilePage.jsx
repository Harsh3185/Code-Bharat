import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { logoutThunk } from "../Store/Features/Auth/authThunks.js";

function Stat({ label, value }) {
  return (
    <div className="bg-[#1a1a1a] rounded-xl p-4 text-center shadow transition-all hover:-translate-y-1 hover:shadow-purple-600/40">
      <p className="text-3xl font-extrabold text-white">{value}</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-gray-400">
        {label}
      </p>
    </div>
  );
}

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const profileRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/profile`,
          {
            withCredentials: true,
          }
        );
        setUser(profileRes.data.user);

        const subsRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/submissions`,
          {
            withCredentials: true,
          }
        );
        setSubmissions(subsRes.data.submissions);
      } catch {
        navigate("/login");
      }
    })();
  }, [navigate]);

  const handleLogout = () => {
    dispatch(logoutThunk());
    navigate("/login");
  };

  if (!user)
    return <div className="p-10 text-gray-300">Loading…</div>;

  return (
    <main className="min-h-screen bg-[#0f0f0f] px-4 py-10 text-gray-200">
      <div className="mx-auto flex max-w-5xl flex-col space-y-10">
        
        <div className="flex flex-col items-center justify-between gap-6 rounded-3xl bg-[#151515] p-8 shadow-lg md:flex-row md:gap-0">
          <div className="flex items-center gap-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-4xl font-extrabold">
              {user.userName[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{user.userName}</h1>
              <p className="text-sm text-gray-400">{user.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-full bg-red-600 px-6 py-2 text-sm font-semibold transition-colors hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Stat label="Solved" value={user.problemsSolved.length} />
          <Stat label="Submissions" value={user.totalSubmissions} />
          <Stat label="Accepted" value={user.acceptedSubmissions} />
          <Stat label="Acceptance %" value={(
            (user.acceptedSubmissions / Math.max(user.totalSubmissions, 1)) *
            100
          ).toFixed(1)} />
        </div>

        <div className="rounded-3xl bg-[#151515] p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-semibold text-white">About</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <p>
              <span className="font-semibold text-gray-400">Institution:</span>{" "}
              {user.institution || "\u2014"}
            </p>
            <p>
              <span className="font-semibold text-gray-400">Location:</span>{" "}
              {user.location || "\u2014"}
            </p>
            <p className="sm:col-span-2">
              <span className="font-semibold text-gray-400">Bio:</span>{" "}
              {user.bio || "\u2014"}
            </p>
          </div>
        </div>

        {!!submissions.length && (
          <div className="rounded-3xl bg-[#151515] p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold text-white">
              Submission History
            </h2>
            <div className="overflow-x-auto rounded-xl">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-[#222] text-left text-gray-400">
                    <th className="px-4 py-2 font-medium">#</th>
                    <th className="px-4 py-2 font-medium">Problem</th>
                    <th className="px-4 py-2 font-medium">Lang</th>
                    <th className="px-4 py-2 font-medium">Status</th>
                    <th className="px-4 py-2 font-medium">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((s, i) => (
                    <tr
                      key={s._id}
                      className="border-t border-[#2a2a2a] hover:bg-[#1f1f1f]"
                    >
                      <td className="px-4 py-2">{i + 1}</td>
                      <td className="px-4 py-2">
                        #{String(s.problemNumber).padStart(3, "0")}
                      </td>
                      <td className="px-4 py-2">{s.language}</td>
                      <td className="px-4 py-2">
                        <span
                          className={
                            s.status === "Accepted"
                              ? "rounded-full bg-green-600/20 px-3 py-1 text-green-400"
                              : s.status.includes("Wrong")
                              ? "rounded-full bg-yellow-600/20 px-3 py-1 text-yellow-400"
                              : "rounded-full bg-red-600/20 px-3 py-1 text-red-400"
                          }
                        >
                          {s.status}
                        </span>
                      </td>
                      <td className="px-4 py-2">
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
    </main>
  );
}
