import { Link } from "react-router-dom";

export default function AdminDashboardPage() {
  return (
    <section className="px-6 py-8 sm:px-8">
      <div className="rounded-3xl border border-white/15 bg-black/25 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-md">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9fb3c8]">
          Dashboard
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
          Manage the platform from a separate admin workspace.
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[#9eacba] sm:text-base">
          Problem creation and moderation live here, separate from the public user-facing routes.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Link
            to="/admin/problems"
            className="rounded-2xl border border-white/12 bg-black/20 p-5 transition hover:bg-black/25"
          >
            <p className="text-sm font-medium text-white">Manage Problems</p>
            <p className="mt-2 text-sm text-[#96a6b5]">
              Review the current problem bank, open questions, and remove outdated items.
            </p>
          </Link>

          <Link
            to="/admin/problems/new"
            className="rounded-2xl border border-white/12 bg-black/20 p-5 transition hover:bg-black/25"
          >
            <p className="text-sm font-medium text-white">Create New Problem</p>
            <p className="mt-2 text-sm text-[#96a6b5]">
              Add a new problem statement, examples, constraints, and hidden test cases.
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
}
