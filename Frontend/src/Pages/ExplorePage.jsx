import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config/urls.js";
import MeshPageShell from "../Components/MeshPageShell.jsx";

const acceptanceFilters = [
  { key: "all", label: "All" },
  { key: "warmup", label: "Warm-Up" },
  { key: "balanced", label: "Balanced" },
  { key: "challenge", label: "Challenge" },
];

export default function ExplorePage() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("number");

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/problems`, {
          withCredentials: true,
        });
        setProblems(res.data.problems || []);
      } catch {
        setProblems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const normalizedSearch = search.trim().toLowerCase();

  const filteredProblems = useMemo(() => {
    return problems
      .filter((problem) => {
        const matchesSearch =
          !normalizedSearch ||
          problem.title.toLowerCase().includes(normalizedSearch) ||
          String(problem.problemNumber).includes(normalizedSearch);

        if (!matchesSearch) return false;

        const rate = problem.acceptanceRate ?? 0;
        if (filter === "warmup") return rate >= 70;
        if (filter === "balanced") return rate >= 40 && rate < 70;
        if (filter === "challenge") return rate < 40;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "acceptance-high") return (b.acceptanceRate ?? 0) - (a.acceptanceRate ?? 0);
        if (sortBy === "acceptance-low") return (a.acceptanceRate ?? 0) - (b.acceptanceRate ?? 0);
        if (sortBy === "title") return a.title.localeCompare(b.title);
        return (a.problemNumber ?? 0) - (b.problemNumber ?? 0);
      });
  }, [filter, normalizedSearch, problems, sortBy]);

  const averageAcceptance = problems.length
    ? (
        problems.reduce((sum, problem) => sum + (problem.acceptanceRate ?? 0), 0) /
        problems.length
      ).toFixed(1)
    : "0.0";

  const problemBands = {
    warmup: problems.filter((problem) => (problem.acceptanceRate ?? 0) >= 70).length,
    balanced: problems.filter((problem) => {
      const rate = problem.acceptanceRate ?? 0;
      return rate >= 40 && rate < 70;
    }).length,
    challenge: problems.filter((problem) => (problem.acceptanceRate ?? 0) < 40).length,
  };

  const spotlight = filteredProblems.slice(0, 5);

  return (
    <MeshPageShell>
        <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
          <section className="rounded-3xl border border-white/15 bg-black/25 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-md">
            <div className="flex flex-col gap-6 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9fb3c8]">
                  Practice Library
                </p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Explore problems by pace, difficulty band, and acceptance trend.
                </h1>
                <p className="mt-3 text-sm leading-6 text-[#9eacba] sm:text-base">
                  A cleaner way to move through the bank: search by title or number, sort by
                  acceptance, and pick the right band for your next session.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 text-left sm:min-w-[360px]">
                <StatCard label="Live Problems" value={String(problems.length).padStart(2, "0")} />
                <StatCard label="Avg Acceptance" value={`${averageAcceptance}%`} />
                <StatCard label="Challenge Pool" value={`${problemBands.challenge}`} />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4">
              <div className="grid gap-3 lg:grid-cols-[1fr_200px]">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by title or problem number"
                  className="w-full rounded-2xl border border-white/15 bg-black/25 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-white/30"
                />

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-2xl border border-white/15 bg-black/25 px-4 py-3 text-sm text-white outline-none focus:border-white/30"
                >
                  <option value="number">Sort: Number</option>
                  <option value="title">Sort: Title</option>
                  <option value="acceptance-high">Sort: Acceptance High-Low</option>
                  <option value="acceptance-low">Sort: Acceptance Low-High</option>
                </select>
              </div>

              <div className="flex flex-wrap gap-2">
                {acceptanceFilters.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setFilter(item.key)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      filter === item.key
                        ? "border-white/25 bg-white text-[#10202f]"
                        : "border-white/15 bg-black/25 text-white/85 hover:border-white/25 hover:bg-black/30"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <Panel title="Problem Bands">
              <BandRow label="Warm-Up" count={problemBands.warmup} tone="emerald" />
              <BandRow label="Balanced" count={problemBands.balanced} tone="slate" />
              <BandRow label="Challenge" count={problemBands.challenge} tone="amber" />
            </Panel>
          </aside>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.55fr_0.85fr]">
          <section className="overflow-hidden rounded-3xl border border-white/15 bg-black/25 backdrop-blur-md">
            <div className="border-b border-white/10 px-6 py-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">Problem Index</h2>
                  <p className="text-sm text-[#8ea0b2]">
                    {loading ? "Loading problems..." : `${filteredProblems.length} problems in view`}
                  </p>
                </div>
                <p className="text-xs uppercase tracking-[0.22em] text-[#70808f]">
                  Acceptance-driven discovery
                </p>
              </div>
            </div>

            {loading && <div className="px-6 py-10 text-sm text-[#9eacba]">Loading problems...</div>}

            {!loading && !filteredProblems.length && (
              <div className="px-6 py-12 text-center text-sm text-[#9eacba]">
                No problems matched the current search and filter.
              </div>
            )}

            {!loading && !!filteredProblems.length && (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-black/25 text-left text-xs uppercase tracking-[0.2em] text-white/55">
                    <tr>
                      <th className="px-6 py-4">#</th>
                      <th className="px-6 py-4">Title</th>
                      <th className="px-6 py-4">Band</th>
                      <th className="px-6 py-4 text-right">Acceptance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/6">
                    {filteredProblems.map((problem) => {
                      const rate = problem.acceptanceRate ?? 0;
                      const band =
                        rate >= 70 ? "Warm-Up" : rate >= 40 ? "Balanced" : "Challenge";

                      return (
                        <tr key={problem._id} className="hover:bg-white/[0.05]">
                          <td className="px-6 py-4 font-mono text-[#b3bfca]">
                            {String(problem.problemNumber).padStart(3, "0")}
                          </td>
                          <td className="px-6 py-4">
                            <Link
                              to={`/problems/${problem._id}`}
                              className="font-medium text-white transition hover:text-[#d8e4ef]"
                            >
                              {problem.title}
                            </Link>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${bandClasses(rate)}`}>
                              {band}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right font-medium text-[#dde6ee]">
                            {rate.toFixed(1)}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="space-y-6">
            <Panel title="Current Spotlight">
              {spotlight.length ? (
                spotlight.map((problem, index) => (
                  <Link
                    key={problem._id}
                    to={`/problems/${problem._id}`}
                    className="flex items-start justify-between gap-4 rounded-2xl border border-white/8 bg-[#12171d] px-4 py-4 transition hover:border-white/15 hover:bg-[#141a21]"
                  >
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-[#6f8090]">
                        Pick {index + 1}
                      </p>
                      <h3 className="mt-1 text-sm font-medium text-white">{problem.title}</h3>
                    </div>
                    <span className="text-sm text-[#c9d4de]">
                      {(problem.acceptanceRate ?? 0).toFixed(1)}%
                    </span>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-[#9eacba]">No spotlight problems available.</p>
              )}
            </Panel>
          </section>
        </div>
    </MeshPageShell>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/12 bg-black/20 px-4 py-4 backdrop-blur-sm">
      <p className="text-2xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#728394]">{label}</p>
    </div>
  );
}

function Panel({ title, children }) {
  return (
    <div className="rounded-3xl border border-white/15 bg-black/25 p-5 backdrop-blur-md">
      <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8fa1b3]">{title}</h2>
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );
}

function BandRow({ label, count, tone }) {
  const palette = {
    emerald: "bg-emerald-500/12 text-emerald-200",
    slate: "bg-slate-400/12 text-slate-200",
    amber: "bg-amber-500/12 text-amber-200",
  };

  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/12 bg-black/20 px-4 py-3 backdrop-blur-sm">
      <span className="text-sm text-white">{label}</span>
      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${palette[tone]}`}>
        {count}
      </span>
    </div>
  );
}

function bandClasses(rate) {
  if (rate >= 70) return "bg-emerald-500/15 text-emerald-200";
  if (rate >= 40) return "bg-slate-400/15 text-slate-200";
  return "bg-amber-500/15 text-amber-200";
}
