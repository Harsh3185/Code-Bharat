import axios from "axios";
import { useMemo, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { BACKEND_URL } from "../config/urls.js";
import MeshPageShell from "../Components/MeshPageShell.jsx";

function ProblemSetPage() {
  const { problems } = useLoaderData();
  const [search, setSearch] = useState("");
  const [band, setBand] = useState("all");

  const normalizedSearch = search.trim().toLowerCase();

  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      const matchesSearch =
        !normalizedSearch ||
        problem.title.toLowerCase().includes(normalizedSearch) ||
        String(problem.problemNumber).includes(normalizedSearch);

      if (!matchesSearch) return false;

      const rate = problem.acceptanceRate ?? 0;
      if (band === "warmup") return rate >= 70;
      if (band === "balanced") return rate >= 40 && rate < 70;
      if (band === "challenge") return rate < 40;
      return true;
    });
  }, [band, normalizedSearch, problems]);

  const stats = {
    total: problems.length,
    warmup: problems.filter((problem) => (problem.acceptanceRate ?? 0) >= 70).length,
    challenge: problems.filter((problem) => (problem.acceptanceRate ?? 0) < 40).length,
    average: problems.length
      ? (
          problems.reduce((sum, problem) => sum + (problem.acceptanceRate ?? 0), 0) /
          problems.length
        ).toFixed(1)
      : "0.0",
  };

  return (
    <MeshPageShell>
        <section className="rounded-3xl border border-white/15 bg-black/25 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-md">
          <div className="flex flex-col gap-6 border-b border-white/10 pb-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9fb3c8]">
                Problem Set
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Browse the full question bank with cleaner filtering and faster scanning.
              </h1>
              <p className="mt-3 text-sm leading-6 text-[#9eacba] sm:text-base">
                Use search for direct lookup, then narrow by acceptance band when you want an
                easier warm-up or a harder practice block.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 xl:min-w-[360px]">
              <Metric label="Total" value={`${stats.total}`} />
              <Metric label="Warm-Up" value={`${stats.warmup}`} />
              <Metric label="Challenge" value={`${stats.challenge}`} />
              <Metric label="Avg Rate" value={`${stats.average}%`} />
            </div>
          </div>

          <div className="mt-6">
            <div className="grid w-full gap-3 lg:grid-cols-[1fr_auto]">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title or problem number"
                className="w-full rounded-2xl border border-white/15 bg-black/25 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-white/30"
              />

              <div className="flex flex-wrap gap-2">
                {[
                  ["all", "All"],
                  ["warmup", "Warm-Up"],
                  ["balanced", "Balanced"],
                  ["challenge", "Challenge"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setBand(value)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      band === value
                        ? "border-white/25 bg-white text-[#10202f]"
                        : "border-white/15 bg-black/25 text-white/85 hover:border-white/25 hover:bg-black/30"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-3xl border border-white/15 bg-black/25 shadow-[0_16px_45px_rgba(0,0,0,0.22)] backdrop-blur-md">
          <div className="border-b border-white/10 px-6 py-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-semibold text-white">All Problems</h2>
              <p className="text-sm text-[#8ea0b2]">{filteredProblems.length} shown</p>
            </div>
          </div>

          {!filteredProblems.length && (
            <div className="px-6 py-12 text-center text-sm text-[#9eacba]">
              No problems matched the current search and filter.
            </div>
          )}

          {!!filteredProblems.length && (
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
                    const badge =
                      rate >= 70
                        ? "bg-emerald-500/15 text-emerald-200"
                        : rate >= 40
                        ? "bg-slate-400/15 text-slate-200"
                        : "bg-amber-500/15 text-amber-200";
                    const label =
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
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badge}`}>
                            {label}
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
    </MeshPageShell>
  );
}

function Metric({ label, value }) {
  return (
    <div className="min-w-0 rounded-2xl border border-white/12 bg-black/20 px-4 py-4 backdrop-blur-sm">
      <p className="truncate text-2xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-[#728394]">{label}</p>
    </div>
  );
}

export default ProblemSetPage;

export const problemSetLoader = async () => {
  const res = await axios.get(`${BACKEND_URL}/api/problems`, {
    withCredentials: true,
  });
  return { problems: res.data.problems };
};
