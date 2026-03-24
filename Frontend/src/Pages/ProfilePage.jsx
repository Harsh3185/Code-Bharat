import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutThunk } from "../Store/Features/Auth/authThunks.js";
import SubmissionTable from "../Components/SubmissionTable.jsx";
import MeshPageShell from "../Components/MeshPageShell.jsx";
import { BACKEND_URL } from "../config/urls.js";

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/12 bg-black/20 px-4 py-4 backdrop-blur-sm">
      <p className="text-2xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/55">{label}</p>
    </div>
  );
}

export default function ProfilePage() {
  const [u, su] = useState(null);
  const [s, ss] = useState([]);
  const d = useDispatch();
  const n = useNavigate();

  const logout = async () => {
    await d(logoutThunk());
    n("/login", { replace: true });
  };

  useEffect(() => {
    (async () => {
      try {
        const pr = await axios.get(`${BACKEND_URL}/api/profile`, {
          withCredentials: true,
        });
        su(pr.data.user);

        const sr = await axios.get(`${BACKEND_URL}/api/submissions`, {
          withCredentials: true,
        });
        ss(sr.data.submissions);
      } catch {
        n("/login");
      }
    })();
  }, [n]);

  const acceptanceRate = useMemo(() => {
    if (!u) return "0.0";
    return ((u.acceptedSubmissions / Math.max(u.totalSubmissions, 1)) * 100).toFixed(1);
  }, [u]);

  if (!u) {
    return (
      <MeshPageShell contentClassName="flex min-h-screen items-center justify-center">
        <div className="rounded-3xl border border-white/15 bg-black/25 px-6 py-5 text-white backdrop-blur-md">
          Loading...
        </div>
      </MeshPageShell>
    );
  }

  return (
    <MeshPageShell>
      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <section className="rounded-[32px] border border-white/15 bg-black/25 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-md sm:p-8">
          <div className="flex flex-col gap-6 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/15 bg-white/10 text-4xl font-semibold text-white">
                {u.userName[0].toUpperCase()}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/60">
                  Profile
                </p>
                <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
                  {u.userName}
                </h1>
                <p className="mt-2 text-sm text-white/72">{u.email}</p>
              </div>
            </div>

            <button
              onClick={logout}
              className="rounded-full border border-rose-400/25 bg-rose-400/10 px-5 py-2.5 text-sm font-medium text-rose-100 transition hover:bg-rose-400/15"
            >
              Logout
            </button>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Stat label="Solved" value={u.problemsSolved.length} />
            <Stat label="Submissions" value={u.totalSubmissions} />
            <Stat label="Accepted" value={u.acceptedSubmissions} />
            <Stat label="Acceptance" value={`${acceptanceRate}%`} />
          </div>

          <div className="mt-6 rounded-[28px] border border-white/12 bg-white/[0.05] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/55">
              About
            </p>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-white/78">
              {u.bio || "No bio added yet."}
            </p>
          </div>
        </section>

        <aside className="space-y-6">
          <Panel title="Profile Snapshot">
            <InfoRow label="Institution" value={u.institution || "-"} />
            <InfoRow label="Location" value={u.location || "-"} />
            <InfoRow label="Status" value={u.role || "User"} />
          </Panel>

          <Panel title="Current Focus">
            <div className="rounded-2xl border border-white/12 bg-black/20 px-4 py-4 backdrop-blur-sm">
              <p className="text-sm font-medium text-white">Keep solving consistently</p>
              <p className="mt-2 text-sm leading-6 text-white/70">
                Your recent submissions and acceptance rate are tracked below.
              </p>
            </div>
          </Panel>
        </aside>
      </div>

      <section className="mt-6 rounded-[32px] border border-white/15 bg-black/25 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-md">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Submission History</h2>
            <p className="text-sm text-white/68">Recent work across the platform.</p>
          </div>
        </div>

        {!!s.length ? (
          <SubmissionTable submissions={s} />
        ) : (
          <p className="rounded-2xl border border-dashed border-white/15 bg-black/20 px-4 py-8 text-center text-sm text-white/65">
            No submissions yet.
          </p>
        )}
      </section>
    </MeshPageShell>
  );
}

function Panel({ title, children }) {
  return (
    <div className="rounded-[28px] border border-white/15 bg-black/25 p-5 backdrop-blur-md">
      <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-white/58">{title}</h2>
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/12 bg-black/20 px-4 py-4 backdrop-blur-sm">
      <span className="text-sm text-white/72">{label}</span>
      <span className="text-sm font-medium text-white">{value}</span>
    </div>
  );
}
