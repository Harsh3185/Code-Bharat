import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminAddProblemPage() {
  
  const [form, setForm] = useState({
    problemNumber: "",
    title: "",
    statement: "",
    constraints: ""
  });

  const [examples, setExamples] = useState([{ input: "", output: "" }]);
  const [testCases, setTestCases] = useState([{ input: "", output: "" }]);

  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const updateArray =
    (setter) =>
    (idx, field, val) =>
      setter((arr) =>
        arr.map((row, i) => (i === idx ? { ...row, [field]: val } : row))
      );

  const addRow = (setter) => () =>
    setter((arr) => [...arr, { input: "", output: "" }]);

  const rowsValid = (rows) =>
    rows.every((r) => r.input.trim() && r.output.trim());

  const formValid =
    form.problemNumber.trim() &&
    form.title.trim() &&
    form.statement.trim() &&
    form.constraints.trim() &&
    rowsValid(examples) &&
    rowsValid(testCases);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formValid) return alert("Please fill every field completely.");

    try {
      setSubmitting(true);

      const pRes = await axios.post(
        "http://localhost:8000/api/problem",
        { ...form, examples },
        { withCredentials: true }
      );
      const problemId = pRes.data.problem._id;

      await axios.post(
        `http://localhost:8000/api/testcases/${problemId}`,
        { testCases },
        { withCredentials: true }
      );

      alert("Problem and test-cases added 🎉");
      navigate("/problems");
    } catch (err) {
      const msg = err?.response?.data?.message || "Add failed";
      if (msg.includes("E11000")) {
        alert("Problem number already exists.");
      } else {
        console.error(err);
        alert(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="p-6 max-w-4xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-6">Add New Problem</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {["problemNumber", "title"].map((name) => (
          <input
            key={name}
            name={name}
            placeholder={name === "title" ? "Title" : "Problem Number"}
            value={form[name]}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded"
            required
          />
        ))}

        <textarea
          name="statement"
          placeholder="Problem Statement"
          value={form.statement}
          onChange={handleChange}
          rows={5}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded"
          required
        />

        <textarea
          name="constraints"
          placeholder="Constraints"
          value={form.constraints}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded"
          required
        />

        <Section
          title="Examples"
          rows={examples}
          onAdd={addRow(setExamples)}
          onChange={updateArray(setExamples)}
        />

        <Section
          title="Hidden Test Cases"
          rows={testCases}
          onAdd={addRow(setTestCases)}
          onChange={updateArray(setTestCases)}
        />

        <button
          disabled={submitting}
          className="w-full bg-green-600 hover:bg-green-700 py-3 rounded font-semibold disabled:opacity-50"
        >
          {submitting ? "Submitting…" : "Submit"}
        </button>
      </form>
    </main>
  );
}

const Section = ({ title, rows, onAdd, onChange }) => (
  <div>
    <h2 className="font-semibold text-lg mb-2">{title}</h2>
    {rows.map((row, i) => (
      <div key={i} className="grid grid-cols-2 gap-2 mb-2">
        <input
          placeholder="Input"
          value={row.input}
          onChange={(e) => onChange(i, "input", e.target.value)}
          className="px-3 py-2 bg-gray-700 rounded border border-gray-500"
        />
        <input
          placeholder="Output"
          value={row.output}
          onChange={(e) => onChange(i, "output", e.target.value)}
          className="px-3 py-2 bg-gray-700 rounded border border-gray-500"
        />
      </div>
    ))}
    <button
      type="button"
      onClick={onAdd}
      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
    >
      + Add
    </button>
  </div>
);

export default AdminAddProblemPage;
