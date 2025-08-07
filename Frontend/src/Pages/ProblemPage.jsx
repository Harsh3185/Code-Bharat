import { useState, useEffect } from "react";
import { useLoaderData, useNavigate, useParams, redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import Split from "react-split";
import Editor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SubmissionTable from "../components/SubmissionTable.jsx";

function ProblemPage() {
  const { problem } = useLoaderData();
  const examples = problem.examples ?? [];

  const [code, setCode] = useState(`#include <iostream>\nusing namespace std;\n\nint main() {\n    \n}`);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [review, setReview] = useState("");
  const [language, setLanguage] = useState("cpp");

  const [loading, setLoading] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);

  const { user } = useSelector((s) => s.auth);
  const navigate = useNavigate();
  const { problemId } = useParams();

  const [subsOpen, setSubsOpen] = useState(false);
  const [subs, setSubs] = useState([]);

  const fetchSubs = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/problem/${problemId}/submissions`, { withCredentials: true });
      setSubs(data.submissions);
    } catch {
      setSubs([]);
    }
  };

  const toggleSubs = () => {
    const next = !subsOpen;
    setSubsOpen(next);
    if (next && !subs.length) fetchSubs();
  };

  const difficultyColor = {
    Easy: "bg-green-600/20 text-green-400",
    Medium: "bg-yellow-600/20 text-yellow-400",
    Hard: "bg-red-600/20 text-red-400",
  }[problem.difficulty || "Easy"];

  const handleDelete = async () => {
    if (!window.confirm("Delete this problem?")) return;
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/problem/${problemId}`, {}, { withCredentials: true });
      navigate("/problems");
    } catch {
      alert("Delete failed");
    }
  };

  const handleRun = async () => {
    setLoading(true);
    setOutput("");
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_COMPILER_URL}/run`, { code, language, input });
      setOutput(typeof data.output === "object" ? JSON.stringify(data.output, null, 2) : data.output);
    } catch (err) {
      setOutput(err?.response?.data?.error || "Run error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setOutput("");
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/problem/${problem._id}/submit`, { code, language }, { withCredentials: true });
      setOutput(`Submission Result: ${data.status}`);
      fetchSubs();
    } catch (err) {
      setOutput(err?.response?.data?.message || "Submission error");
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async () => {
    if (reviewLoading) return;
    setReview("");
    setReviewLoading(true);
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_COMPILER_URL}/ai-review`, { code });
      setReview(data.review);
    } catch {
      setReview("AI review failed");
    } finally {
      setReviewLoading(false);
    }
  };

  useEffect(() => {
    if (language === "cpp") setCode(`#include <iostream>\nusing namespace std;\n\nint main() {\n    \n}`);
    else if (language === "java") setCode(`public class Main {\n    public static void main(String[] args) {\n        \n    }\n}`);
    else if (language === "python") setCode(`print(\"Hello, world!\")`);
    else if (language === "javascript") setCode(`console.log(\"Hello, world!\");`);
    else if (language === "go") setCode(`package main\nimport \"fmt\"\nfunc main() {\n    fmt.Println(\"Hello, world!\")\n}`);
    else if (language === "c") setCode(`#include <stdio.h>\nint main() {\n    return 0;\n}`);
  }, [language]);

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-gray-200 flex flex-col">
      <header className="border-b border-gray-700 px-6 py-4 flex flex-wrap gap-4 justify-between items-center">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">{problem.title}</h1>
          <div className="flex flex-col gap-1 text-sm font-medium mt-1">
            <span className={`px-3 py-1 rounded-full self-start ${difficultyColor}`}>{problem.difficulty}</span>
            <span>Acceptance <b>{problem.acceptanceRate?.toFixed(1) ?? 0}%</b></span>
            <span className="text-gray-400 text-xs">Total {problem.totalSubmissions} | Accepted {problem.acceptance}</span>
          </div>
        </div>
        <div className="flex gap-3">
          {user?.role?.toLowerCase() === "admin" && (
            <button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded">Delete</button>
          )}
          <button onClick={toggleSubs} className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded">
            {subsOpen ? "Hide Submissions" : "Submissions"}
          </button>
        </div>
      </header>

      {subsOpen && (
        <div className="border-b border-gray-700 px-6 py-4 bg-[#0f0f0f]">
          <SubmissionTable submissions={subs} />
        </div>
      )}

      <Split className="flex-1 flex" gutterSize={6} sizes={[40, 60]}>
        <article className="overflow-y-auto px-6 py-6 space-y-6">
          <pre className="whitespace-pre-wrap leading-relaxed">{problem.statement}</pre>
          <section>
            <h2 className="text-lg font-semibold mt-6">Examples</h2>
            {examples.map((ex, i) => (
              <pre key={i} className="bg-gray-800 p-3 rounded text-sm whitespace-pre-wrap my-2"><b>Input #{i + 1}:</b> {ex.input}{"\n"}<b>Output:</b> {ex.output}</pre>
            ))}
          </section>
          <section>
            <h2 className="text-lg font-semibold mt-6">Constraints</h2>
            <pre className="bg-gray-800 p-3 rounded text-sm whitespace-pre-wrap">{problem.constraints}</pre>
          </section>
        </article>
        <Split className="flex flex-col border-l border-gray-700" direction="vertical" gutterSize={6} sizes={[55, 45]}>
          <div className="flex-1 flex flex-col">
            <div className="px-4 py-3 text-sm font-semibold border-b border-gray-700 flex justify-between items-center">Code Editor
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="bg-black border border-gray-600 rounded px-2 py-1 text-sm">
                <option value="c">C</option><option value="cpp">C++</option><option value="python">Python</option><option value="javascript">JavaScript</option><option value="go">Go</option>
              </select>
            </div>
            <Editor className="flex-1" theme="vs-dark" defaultLanguage="cpp" value={code} onChange={setCode} options={{ fontSize: 14, minimap: { enabled: false }, automaticLayout: true }} />
          </div>
          <div className="flex-1 flex flex-col px-4 py-4 space-y-3 overflow-hidden">
            <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={3} placeholder="Custom input" className="w-full p-2 bg-[#0f0f0f] border border-gray-600 rounded text-sm resize-y" />
            <div className="flex gap-3 flex-wrap">
              <button onClick={handleRun} disabled={loading} className="flex-1 py-2 rounded bg-blue-600 hover:bg-blue-700 disabled:opacity-50">{loading ? "Running…" : "Run"}</button>
              <button onClick={handleSubmit} disabled={loading} className="flex-1 py-2 rounded bg-green-600 hover:bg-green-700 disabled:opacity-50">Submit</button>
              <button onClick={handleReview} disabled={reviewLoading} className="flex-1 py-2 rounded bg-purple-600 hover:bg-purple-700 disabled:opacity-50">{reviewLoading ? "Reviewing…" : "AI Review"}</button>
            </div>
            <section className="border border-gray-700 rounded p-3 text-sm font-mono flex-1 overflow-y-auto"><div className="text-gray-400 mb-1">Output:</div><pre className="whitespace-pre-wrap break-words">{output}</pre></section>
            {review && <section className="border border-purple-700 rounded p-3 text-sm flex-1 overflow-y-auto"><div className="font-semibold text-purple-400 mb-2">AI Code Review:</div><div className="prose prose-sm prose-invert max-w-none"><ReactMarkdown remarkPlugins={[remarkGfm]}>{review}</ReactMarkdown></div></section>}
          </div>
        </Split>
      </Split>
    </main>
  );
}

export default ProblemPage;

export const ProblemLoader = async ({ params }) => {
  try {
    const { problemId } = params;
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/problem/${problemId}`, { withCredentials: true });
    return { problem: res.data };
  } catch (err) {
    if (err.response?.status === 401) return redirect("/login");
    throw new Response("Problem not found", { status: 404 });
  }
};
