import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { BACKEND_URL } from "../config/urls.js";
import MeshPageShell from "../Components/MeshPageShell.jsx";

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/leaderboard`, {
          withCredentials: true,
        });
        setLeaders(res.data.leaderboard || []);
      } catch {
        setLeaders([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const podium = leaders.slice(0, 3);
  const currentUserRank = useMemo(
    () => leaders.find((entry) => entry._id === user?._id),
    [leaders, user]
  );

  return (
    <MeshPageShell>
        <section className="rounded-3xl border border-white/15 bg-black/25 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-md">
            <div className="flex flex-col gap-6 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9fb3c8]">
                  Seasonal Ranking
                </p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  A realistic leaderboard built around solved count, accepted runs, and control.
                </h1>
                <p className="mt-3 text-sm leading-6 text-[#9eacba] sm:text-base">
                  Rankings prioritize total solved, then accepted submissions, and finally lower
                  submission volume as a tie-breaker for cleaner problem solving.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 text-left sm:min-w-[360px]">
                <Metric label="Ranked Coders" value={`${leaders.length}`} />
                <Metric label="Top Score" value={`${leaders[0]?.solved ?? 0}`} />
                <Metric label="Your Rank" value={currentUserRank ? `#${currentUserRank.rank}` : "-"} />
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {podium.map((entry) => (
                <PodiumCard
                  key={entry._id}
                  entry={entry}
                  highlight={user?._id === entry._id}
                />
              ))}
            </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-3xl border border-white/15 bg-black/25 shadow-[0_16px_45px_rgba(0,0,0,0.22)] backdrop-blur-md">
          <div className="border-b border-white/10 px-6 py-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-semibold text-white">Full Table</h2>
              <p className="text-xs uppercase tracking-[0.22em] text-[#70808f]">
                Ranked by solved, accepted, and efficiency
              </p>
            </div>
          </div>

          {loading && <div className="px-6 py-10 text-sm text-[#9eacba]">Loading leaderboard...</div>}

          {!loading && !leaders.length && (
            <div className="px-6 py-12 text-center text-sm text-[#9eacba]">
              No leaderboard data is available yet.
            </div>
          )}

          {!loading && !!leaders.length && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-black/25 text-left text-xs uppercase tracking-[0.2em] text-white/55">
                  <tr>
                    <th className="px-6 py-4">Rank</th>
                    <th className="px-6 py-4">Coder</th>
                    <th className="px-6 py-4 text-right">Solved</th>
                    <th className="px-6 py-4 text-right">Accepted</th>
                    <th className="px-6 py-4 text-right">Submissions</th>
                    <th className="px-6 py-4 text-right">Acceptance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/6">
                  {leaders.map((entry) => {
                    const isCurrentUser = user?._id === entry._id;

                    return (
                      <tr
                        key={entry._id}
                        className={isCurrentUser ? "bg-white/[0.08]" : "hover:bg-white/[0.05]"}
                      >
                        <td className="px-6 py-4 font-semibold text-white">#{entry.rank}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-semibold uppercase text-white">
                              {entry.userName?.[0] || "U"}
                            </div>
                            <div>
                              <p className="font-medium text-white">
                                {entry.userName}
                                {isCurrentUser ? " (You)" : ""}
                              </p>
                              <p className="text-xs text-[#7c8e9f]">
                                {entry.institution || "Independent Coder"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right text-white">{entry.solved}</td>
                        <td className="px-6 py-4 text-right text-white">{entry.acceptedSubmissions}</td>
                        <td className="px-6 py-4 text-right text-[#cad5de]">{entry.totalSubmissions}</td>
                        <td className="px-6 py-4 text-right text-[#d9e3ea]">
                          {entry.acceptanceRate.toFixed(1)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
    </MeshPageShell>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/12 bg-black/20 px-4 py-4 backdrop-blur-sm">
      <p className="text-2xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#728394]">{label}</p>
    </div>
  );
}

function PodiumCard({ entry, highlight }) {
  return (
    <div className={`rounded-2xl border px-5 py-5 backdrop-blur-sm ${highlight ? "border-white/25 bg-white/[0.12]" : "border-white/12 bg-black/20"}`}>
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-sm font-semibold uppercase text-white">
          {entry.userName?.[0] || "U"}
        </div>
        <div>
          <p className="text-sm font-medium text-white">{entry.userName}</p>
          <p className="text-xs text-[#7d8c9a]">Rank #{entry.rank}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <PodiumStat label="Solved" value={entry.solved} />
        <PodiumStat label="Accepted" value={entry.acceptedSubmissions} />
        <PodiumStat label="Rate" value={`${entry.acceptanceRate.toFixed(1)}%`} />
      </div>
    </div>
  );
}

function PodiumStat({ label, value }) {
  return (
    <div className="rounded-xl border border-white/12 bg-black/20 px-3 py-3 text-center backdrop-blur-sm">
      <p className="text-sm font-semibold text-white">{value}</p>
      <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-[#6d7f8f]">{label}</p>
    </div>
  );
}
