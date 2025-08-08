import { Link } from "react-router-dom";

export default function SubmissionTable({ submissions = [] }) {
  if (!submissions.length) return null;

  return (
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
            <tr key={s._id} className="border-t border-[#2a2a2a] hover:bg-[#1f1f1f]">
              <td className="px-4 py-2">{i + 1}</td>
              <td className="px-4 py-2">
                <Link to={`/problems/${s.problemId}`} className="hover:underline">
                  #{String(s.problemNumber).padStart(3, "0")}
                </Link>
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
              <td className="px-4 py-2">{new Date(s.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
