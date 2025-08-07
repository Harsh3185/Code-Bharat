import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { logoutThunk } from "../Store/Features/Auth/authThunks.js";
import SubmissionTable from "../components/SubmissionTable.jsx";

function Stat({ label, value }) {
  return (
    <div className="bg-[#1a1a1a] rounded-xl p-4 text-center shadow transition-all hover:-translate-y-1 hover:shadow-purple-600/40">
      <p className="text-3xl font-extrabold text-white">{value}</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-gray-400">{label}</p>
    </div>
  );
}

export default function ProfilePage() {
  const [u, su] = useState(null);
  const [s, ss] = useState([]);
  const d = useDispatch();
  const n = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const pr = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/profile`, { withCredentials: true });
        su(pr.data.user);
        const sr = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/submissions`, { withCredentials: true });
        ss(sr.data.submissions);
      } catch {
        n("/login");
      }
    })();
  }, [n]);

  const h = () => {
    d(logoutThunk());
    n("/login");
  };

  if (!u) return <div className="p-10 text-gray-300">Loading…</div>;

  return (
    <main className="min-h-screen bg-[#0f0f0f] px-4 py-10 text-gray-200">
      <div className="mx-auto flex max-w-5xl flex-col space-y-10">
        <div className="flex flex-col items-center justify-between gap-6 rounded-3xl bg-[#151515] p-8 shadow-lg md:flex-row md:gap-0">
          <div className="flex items-center gap-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-4xl font-extrabold">
              {u.userName[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{u.userName}</h1>
              <p className="text-sm text-gray-400">{u.email}</p>
            </div>
          </div>
          <button onClick={h} className="rounded-full bg-red-600 px-6 py-2 text-sm font-semibold transition-colors hover:bg-red-700">Logout</button>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Stat label="Solved" value={u.problemsSolved.length} />
          <Stat label="Submissions" value={u.totalSubmissions} />
          <Stat label="Accepted" value={u.acceptedSubmissions} />
          <Stat label="Acceptance %" value={((u.acceptedSubmissions / Math.max(u.totalSubmissions, 1)) * 100).toFixed(1)} />
        </div>
        <div className="rounded-3xl bg-[#151515] p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-semibold text-white">About</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <p><span className="font-semibold text-gray-400">Institution:</span> {u.institution || "\u2014"}</p>
            <p><span className="font-semibold text-gray-400">Location:</span> {u.location || "\u2014"}</p>
            <p className="sm:col-span-2"><span className="font-semibold text-gray-400">Bio:</span> {u.bio || "\u2014"}</p>
          </div>
        </div>
        {!!s.length && (
          <div className="rounded-3xl bg-[#151515] p-6 shadow-lg space-y-4">
            <h2 className="text-xl font-semibold text-white">Submission History</h2>
            <SubmissionTable submissions={s} />
          </div>
        )}
      </div>
    </main>
  );
}