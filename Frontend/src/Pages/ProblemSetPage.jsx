import axios from 'axios';
import React from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import { useSelector } from 'react-redux';

function ProblemSetPage() {
  const { problems } = useLoaderData();
  const { user } = useSelector((s) => s.auth);

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold">Problem Set</h1>

          {user?.role?.toLowerCase() === 'admin' && (
            <Link
              to="/admin/add-problem"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold"
            >
              + Add Problem
            </Link>
          )}
        </div>

        <div className="overflow-x-auto rounded-xl shadow-lg">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-[#161616]">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">#</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Title</th>
                <th className="px-6 py-3 text-right text-sm font-semibold">Acceptance</th>
              </tr>
            </thead>
            <tbody className="bg-[#1e1e1e] divide-y divide-gray-800">
              {problems.map((p) => {
                const rate = p.acceptanceRate ?? 0;
                const color =
                  rate >= 70
                    ? 'text-green-400'
                    : rate >= 40
                    ? 'text-yellow-400'
                    : 'text-red-400';

                return (
                  <tr key={p._id} className="hover:bg-gray-700/20 group">
                    <td className="px-6 py-4 font-mono">
                      {String(p.problemNumber).padStart(3, '0')}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/problems/${p._id}`}
                        className="hover:text-blue-400 hover:underline"
                      >
                        {p.title}
                      </Link>
                    </td>
                    <td className={`px-6 py-4 text-right ${color}`}>
                      {rate.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

export default ProblemSetPage;

export const problemSetLoader = async () => {
  const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/problems`, {
    withCredentials: true
  });
  return { problems: res.data.problems };
};
