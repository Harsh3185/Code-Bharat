import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config/urls.js";
import MeshPageShell from "../Components/MeshPageShell.jsx";

export default function ContestsPage() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const contestCards = useMemo(() => {
    const easiest = [...problems]
      .sort((a, b) => (b.acceptanceRate ?? 0) - (a.acceptanceRate ?? 0))
      .slice(0, 3);

    const balanced = [...problems]
      .sort(
        (a, b) =>
          Math.abs((a.acceptanceRate ?? 0) - 55) - Math.abs((b.acceptanceRate ?? 0) - 55)
      )
      .slice(0, 3);

    const hardest = [...problems]
      .sort((a, b) => (a.acceptanceRate ?? 0) - (b.acceptanceRate ?? 0))
      .slice(0, 4);

    return [
      {
        title: "Starter Sprint",
        subtitle: "Fast practice round with easier, higher-success problems.",
        duration: "45 min",
        difficulty: "Entry",
        problems: easiest,
      },
      {
        title: "Weekly Balance",
        subtitle: "A measured round designed around mid-band acceptance rates.",
        duration: "75 min",
        difficulty: "Core",
        problems: balanced,
      },
      {
        title: "Hardcore Marathon",
        subtitle: "Lower-acceptance picks for longer, pressure-heavy sessions.",
        duration: "120 min",
        difficulty: "Advanced",
        problems: hardest,
      },
    ].filter((contest) => contest.problems.length);
  }, [problems]);

  return (
    <MeshPageShell>
        <section className="rounded-3xl border border-white/15 bg-black/25 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-md">
            <div className="flex flex-col gap-6 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#a6b6c7]">
                  Practice Contests
                </p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Structured rounds built directly from your live problem bank.
                </h1>
                <p className="mt-3 text-sm leading-6 text-[#98a7b5] sm:text-base">
                  This is a practice-first contest hub. Each pack groups current problems into a
                  timed session so you can train rhythm, pacing, and clean submission habits.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 text-left sm:min-w-[360px]">
                <MiniMetric label="Live Problems" value={`${problems.length}`} />
                <MiniMetric label="Available Rounds" value={`${contestCards.length}`} />
                <MiniMetric
                  label="Longest Round"
                  value={contestCards.length ? contestCards[contestCards.length - 1].duration : "0"}
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/problems"
                className="rounded-full bg-white px-5 py-3 text-sm font-medium text-[#10212d] transition hover:bg-[#e7eef5]"
              >
                Open Problem Bank
              </Link>
              <Link
                to="/leaderboard"
                className="rounded-full border border-white/15 bg-black/25 px-5 py-3 text-sm font-medium text-white transition hover:bg-black/30"
              >
                View Rankings
              </Link>
            </div>
        </section>

        <section className="mt-6 grid gap-6">
          {loading && <div className="rounded-3xl border border-white/15 bg-black/25 px-6 py-8 text-sm text-[#9bacbb] backdrop-blur-md">Loading contest packs...</div>}

          {!loading && !contestCards.length && (
            <div className="rounded-3xl border border-dashed border-white/15 bg-black/25 px-6 py-12 text-center text-sm text-[#9bacbb] backdrop-blur-md">
              Add a few problems first to generate contest rounds.
            </div>
          )}

          {!loading &&
            contestCards.map((contest) => (
              <article
                key={contest.title}
                className="rounded-3xl border border-white/15 bg-black/25 p-6 shadow-[0_16px_45px_rgba(0,0,0,0.22)] backdrop-blur-md"
              >
                <div className="flex flex-col gap-5 border-b border-white/10 pb-5 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#7c8c9b]">
                      <span>{contest.duration}</span>
                      <span className="h-1 w-1 rounded-full bg-[#5f7284]" />
                      <span>{contest.problems.length} Problems</span>
                      <span className="h-1 w-1 rounded-full bg-[#5f7284]" />
                      <span>{contest.difficulty}</span>
                    </div>
                    <h2 className="mt-3 text-2xl font-semibold text-white">{contest.title}</h2>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-[#98a7b5]">
                      {contest.subtitle}
                    </p>
                  </div>

                  <Link
                    to="/problems"
                    className="rounded-full border border-white/15 bg-black/25 px-4 py-2 text-sm font-medium text-white transition hover:bg-black/30"
                  >
                    Start Session
                  </Link>
                </div>

                <div className="mt-5 overflow-hidden rounded-2xl border border-white/12">
                  <table className="min-w-full text-sm">
                    <thead className="bg-black/25 text-left text-xs uppercase tracking-[0.2em] text-white/55">
                      <tr>
                        <th className="px-5 py-4">Order</th>
                        <th className="px-5 py-4">Problem</th>
                        <th className="px-5 py-4 text-right">Acceptance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/6">
                      {contest.problems.map((problem, index) => (
                        <tr key={problem._id} className="hover:bg-white/[0.05]">
                          <td className="px-5 py-4 font-mono text-[#aebbc7]">Q{index + 1}</td>
                          <td className="px-5 py-4">
                            <Link
                              to={`/problems/${problem._id}`}
                              className="font-medium text-white transition hover:text-[#dde8f2]"
                            >
                              {problem.title}
                            </Link>
                          </td>
                          <td className="px-5 py-4 text-right text-[#d7e0e8]">
                            {(problem.acceptanceRate ?? 0).toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>
            ))}
        </section>
    </MeshPageShell>
  );
}

function MiniMetric({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/12 bg-black/20 px-4 py-4 backdrop-blur-sm">
      <p className="text-2xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#728394]">{label}</p>
    </div>
  );
}
