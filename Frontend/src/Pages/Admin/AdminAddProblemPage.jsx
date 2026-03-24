import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../config/urls.js";

function AdminAddProblemPage() {
  const [form, setForm] = useState({
    problemNumber: "",
    title: "",
    statement: "",
    constraints: "",
  });

  const [examples, setExamples] = useState([{ input: "", output: "" }]);
  const [testCases, setTestCases] = useState([{ input: "", output: "" }]);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((current) => ({ ...current, [e.target.name]: e.target.value }));

  const updateArray =
    (setter) =>
    (index, field, value) =>
      setter((rows) =>
        rows.map((row, rowIndex) =>
          rowIndex === index ? { ...row, [field]: value } : row
        )
      );

  const addRow = (setter) => () =>
    setter((rows) => [...rows, { input: "", output: "" }]);

  const rowsValid = (rows) =>
    rows.every((row) => row.input.trim() && row.output.trim());

  const formValid =
    form.problemNumber.trim() &&
    form.title.trim() &&
    form.statement.trim() &&
    form.constraints.trim() &&
    rowsValid(examples) &&
    rowsValid(testCases);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formValid) {
      alert("Please fill every field completely.");
      return;
    }

    try {
      setSubmitting(true);

      const problemResponse = await axios.post(
        `${BACKEND_URL}/api/problem`,
        { ...form, examples },
        { withCredentials: true }
      );
      const problemId = problemResponse.data.problem._id;

      await axios.post(
        `${BACKEND_URL}/api/testcases/${problemId}`,
        { testCases },
        { withCredentials: true }
      );

      alert("Problem and test-cases added successfully");
      navigate("/admin/problems");
    } catch (err) {
      const message = err?.response?.data?.message || "Add failed";
      if (message.includes("E11000")) {
        alert("Problem number already exists.");
      } else {
        console.error(err);
        alert(message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="px-6 py-8 sm:px-8">
      <div className="rounded-3xl border border-white/15 bg-black/25 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-md">
        <div className="border-b border-white/10 px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8ea1b3]">
            Problem Creation
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-white">Create a new coding problem</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#95a5b4]">
            Add the public statement, visible examples, and hidden judge test cases from the
            separate admin workspace.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#cad5de]">Problem Number</span>
              <input
                name="problemNumber"
                placeholder="e.g. 101"
                value={form.problemNumber}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/15 bg-black/25 px-4 py-3 text-white outline-none placeholder:text-white/35"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#cad5de]">Title</span>
              <input
                name="title"
                placeholder="Problem title"
                value={form.title}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/15 bg-black/25 px-4 py-3 text-white outline-none placeholder:text-white/35"
                required
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[#cad5de]">Statement</span>
            <textarea
              name="statement"
              placeholder="Write the full problem statement"
              value={form.statement}
              onChange={handleChange}
              rows={8}
              className="w-full rounded-2xl border border-white/15 bg-black/25 px-4 py-3 text-white outline-none placeholder:text-white/35"
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[#cad5de]">Constraints</span>
            <textarea
              name="constraints"
              placeholder="List input bounds and important guarantees"
              value={form.constraints}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-2xl border border-white/15 bg-black/25 px-4 py-3 text-white outline-none placeholder:text-white/35"
              required
            />
          </label>

          <Section
            title="Examples"
            description="Visible samples shown on the public problem page."
            rows={examples}
            onAdd={addRow(setExamples)}
            onChange={updateArray(setExamples)}
          />

          <Section
            title="Hidden Test Cases"
            description="Private judge cases used to evaluate submissions."
            rows={testCases}
            onAdd={addRow(setTestCases)}
            onChange={updateArray(setTestCases)}
          />

          <div className="flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/admin/problems")}
              className="rounded-2xl border border-white/15 bg-black/20 px-5 py-3 text-sm font-medium text-white transition hover:bg-black/25"
            >
              Cancel
            </button>
            <button
              disabled={submitting}
              className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-[#10212d] transition hover:bg-[#e7eef5] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Create Problem"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

const Section = ({ title, description, rows, onAdd, onChange }) => (
  <div className="rounded-3xl border border-white/12 bg-black/20 p-5 backdrop-blur-sm">
    <h2 className="text-lg font-semibold text-white">{title}</h2>
    <p className="mt-1 text-sm text-[#8fa1b3]">{description}</p>
    {rows.map((row, index) => (
      <div key={index} className="mt-4 grid gap-3 md:grid-cols-2">
        <input
          placeholder="Input"
          value={row.input}
          onChange={(e) => onChange(index, "input", e.target.value)}
          className="rounded-2xl border border-white/15 bg-black/25 px-4 py-3 text-white outline-none placeholder:text-white/35"
        />
        <input
          placeholder="Output"
          value={row.output}
          onChange={(e) => onChange(index, "output", e.target.value)}
          className="rounded-2xl border border-white/15 bg-black/25 px-4 py-3 text-white outline-none placeholder:text-white/35"
        />
      </div>
    ))}
    <button
      type="button"
      onClick={onAdd}
      className="mt-4 rounded-2xl border border-white/15 bg-black/20 px-4 py-2 text-sm font-medium text-white transition hover:bg-black/25"
    >
      Add Row
    </button>
  </div>
);

export default AdminAddProblemPage;
