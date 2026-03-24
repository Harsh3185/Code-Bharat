import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../../config/urls.js";

export default function AdminProblemsPage() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProblems = async () => {
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
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this problem?")) return;

    try {
      await axios.delete(`${BACKEND_URL}/api/problem/${id}`, {
        withCredentials: true,
      });
      setProblems((current) => current.filter((problem) => problem._id !== id));
    } catch (err) {
      alert(err?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <section className="px-6 py-8 sm:px-8">
      <div className="rounded-3xl border border-white/15 bg-black/25 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-md">
        <div className="flex flex-col gap-4 border-b border-white/10 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8ea1b3]">
              Problem Management
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-white">Review and update the problem bank</h1>
          </div>

          <Link
            to="/admin/problems/new"
            className="rounded-full bg-white px-5 py-3 text-sm font-medium text-[#10212d] transition hover:bg-[#e7eef5]"
          >
            Add Problem
          </Link>
        </div>

        {loading && <div className="px-6 py-10 text-sm text-[#9eacba]">Loading problems...</div>}

        {!loading && !problems.length && (
          <div className="px-6 py-10 text-sm text-[#9eacba]">No problems found.</div>
        )}

        {!loading && !!problems.length && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-black/25 text-left text-xs uppercase tracking-[0.2em] text-white/55">
                <tr>
                  <th className="px-6 py-4">#</th>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4 text-right">Acceptance</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/6">
                {problems.map((problem) => (
                  <tr key={problem._id} className="hover:bg-white/[0.05]">
                    <td className="px-6 py-4 font-mono text-[#b7c2cc]">
                      {String(problem.problemNumber).padStart(3, "0")}
                    </td>
                    <td className="px-6 py-4 font-medium text-white">{problem.title}</td>
                    <td className="px-6 py-4 text-right text-[#dde6ee]">
                      {(problem.acceptanceRate ?? 0).toFixed(1)}%
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/problems/${problem._id}`}
                          className="rounded-full border border-white/15 bg-black/20 px-4 py-2 text-xs font-medium text-white transition hover:bg-black/25"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleDelete(problem._id)}
                          className="rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-medium text-rose-200 transition hover:bg-rose-500/15"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
