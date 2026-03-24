import { Link } from "react-router-dom";

export default function SubmissionTable({ submissions = [] }) {
  if (!submissions.length) return null;

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/8">
      <table className="min-w-full text-sm">
        <thead className="bg-[#12171d] text-left text-xs uppercase tracking-[0.2em] text-[#748597]">
          <tr>
            <th className="px-5 py-4 font-medium">#</th>
            <th className="px-5 py-4 font-medium">Problem</th>
            <th className="px-5 py-4 font-medium">Language</th>
            <th className="px-5 py-4 font-medium">Status</th>
            <th className="px-5 py-4 font-medium">Submitted</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/6">
          {submissions.map((submission, index) => (
            <tr key={submission._id} className="hover:bg-white/[0.03]">
              <td className="px-5 py-4 font-mono text-[#b7c2cc]">{index + 1}</td>
              <td className="px-5 py-4">
                <Link
                  to={`/problems/${submission.problemId}`}
                  className="font-medium text-white transition hover:text-[#dbe6ef]"
                >
                  #
                  {submission.problemNumber != null
                    ? String(submission.problemNumber).padStart(3, "0")
                    : "???"}
                </Link>
              </td>
              <td className="px-5 py-4 text-[#d2dce5]">{submission.language}</td>
              <td className="px-5 py-4">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses(submission.status)}`}>
                  {submission.status}
                </span>
              </td>
              <td className="px-5 py-4 text-[#9aabb9]">
                {new Date(submission.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function statusClasses(status) {
  if (status === "Accepted") return "bg-emerald-500/15 text-emerald-200";
  if (status.includes("Wrong")) return "bg-amber-500/15 text-amber-200";
  return "bg-rose-500/15 text-rose-200";
}
