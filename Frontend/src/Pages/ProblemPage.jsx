import { useState, useEffect } from "react";
import { useLoaderData, useParams, redirect } from "react-router-dom";
import axios from "axios";
import Split from "react-split";
import Editor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SubmissionTable from "../Components/SubmissionTable.jsx";
import { BACKEND_URL, COMPILER_URL } from "../config/urls.js";

function ProblemPage() {
  const { problem } = useLoaderData();
  const examples = problem.examples ?? [];

  const [code, setCode] = useState(
    `#include <iostream>\nusing namespace std;\n\nint main() {\n    \n}`
  );
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [review, setReview] = useState("");
  const [language, setLanguage] = useState("cpp");

  const [loading, setLoading] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const { problemId } = useParams();

  const [subsOpen, setSubsOpen] = useState(false);
  const [subs, setSubs] = useState([]);

  const acceptanceRate = problem.acceptanceRate ?? 0;
  const band = acceptanceRate >= 70 ? "Warm-Up" : acceptanceRate >= 40 ? "Balanced" : "Challenge";

  const fetchSubs = async () => {
    try {
      const { data } = await axios.get(
        `${BACKEND_URL}/api/problem/${problemId}/submissions`,
        { withCredentials: true }
      );
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

  const handleRun = async () => {
    setLoading(true);
    setOutput("");
    try {
      const { data } = await axios.post(`${COMPILER_URL}/run`, {
        code,
        language,
        input,
      });
      setOutput(
        typeof data.output === "object"
          ? JSON.stringify(data.output, null, 2)
          : data.output
      );
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
      const { data } = await axios.post(
        `${BACKEND_URL}/api/problem/${problem._id}/submit`,
        { code, language },
        { withCredentials: true }
      );
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
      const { data } = await axios.post(`${COMPILER_URL}/ai-review`, { code });
      setReview(data.review);
    } catch {
      setReview("AI review failed");
    } finally {
      setReviewLoading(false);
    }
  };

  useEffect(() => {
    if (language === "cpp")
      setCode(
        `#include <iostream>\nusing namespace std;\n\nint main() {\n    \n}`
      );
    else if (language === "java")
      setCode(
        `public class Main {\n    public static void main(String[] args) {\n        \n    }\n}`
      );
    else if (language === "python") setCode(`print("Hello, world!")`);
    else if (language === "javascript") setCode(`console.log("Hello, world!");`);
    else if (language === "go")
      setCode(
        `package main\nimport "fmt"\nfunc main() {\n    fmt.Println("Hello, world!")\n}`
      );
    else if (language === "c")
      setCode(`#include <stdio.h>\nint main() {\n    return 0;\n}`);
  }, [language]);

  return (
    <main className="min-h-screen bg-[#0f1419] text-[#e8edf2]">
      <section className="border-b border-white/10 bg-[#171d24]">
        <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-4xl">
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#8092a3]">
                <span>Problem {String(problem.problemNumber ?? 0).padStart(3, "0")}</span>
                <span className="h-1 w-1 rounded-full bg-[#5f7284]" />
                <span>{band}</span>
              </div>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
                {problem.title}
              </h1>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <TopStat label="Acceptance" value={`${acceptanceRate.toFixed(1)}%`} />
                <TopStat label="Accepted Runs" value={`${problem.acceptance ?? 0}`} />
                <TopStat label="Total Submissions" value={`${problem.totalSubmissions ?? 0}`} />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={toggleSubs}
                className="rounded-full border border-white/12 bg-[#12171d] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#141a21]"
              >
                {subsOpen ? "Hide Submissions" : "View Submissions"}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        {subsOpen && (
          <div className="mb-6 rounded-3xl border border-white/10 bg-[#171d24] p-5">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-white">Submission History</h2>
              <p className="text-sm text-[#95a5b4]">Your runs on this problem.</p>
            </div>
            <SubmissionTable submissions={subs} />
          </div>
        )}

        <Split className="flex min-h-[calc(100vh-220px)] gap-0" gutterSize={10} sizes={[42, 58]}>
          <article className="overflow-y-auto rounded-3xl border border-white/10 bg-[#171d24]">
            <div className="border-b border-white/10 px-6 py-5">
              <h2 className="text-lg font-semibold text-white">Statement</h2>
            </div>

            <div className="space-y-8 px-6 py-6">
              <section>
                <pre className="whitespace-pre-wrap text-sm leading-7 text-[#d5dee6]">
                  {problem.statement}
                </pre>
              </section>

              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-white">Examples</h3>
                  <span className="text-xs uppercase tracking-[0.2em] text-[#758697]">
                    {examples.length} sample{examples.length === 1 ? "" : "s"}
                  </span>
                </div>

                {examples.map((example, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-white/8 bg-[#12171d] p-5"
                  >
                    <div className="grid gap-4 lg:grid-cols-2">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-[#718191]">
                          Input {index + 1}
                        </p>
                        <pre className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#e3ebf2]">
                          {example.input}
                        </pre>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-[#718191]">
                          Expected Output
                        </p>
                        <pre className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#e3ebf2]">
                          {example.output}
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </section>

              <section className="rounded-2xl border border-white/8 bg-[#12171d] p-5">
                <h3 className="text-base font-semibold text-white">Constraints</h3>
                <pre className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#d5dee6]">
                  {problem.constraints}
                </pre>
              </section>
            </div>
          </article>

          <Split
            className="flex flex-col gap-0"
            direction="vertical"
            gutterSize={10}
            sizes={review ? [52, 20, 28] : [58, 42]}
          >
            <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#171d24]">
              <div className="flex flex-col gap-3 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">Workspace</h2>
                  <p className="text-sm text-[#95a5b4]">Write, run, and submit from the same panel.</p>
                </div>

                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="rounded-xl border border-white/10 bg-[#0f1419] px-3 py-2 text-sm text-white outline-none"
                >
                  <option value="c">C</option>
                  <option value="cpp">C++</option>
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                  <option value="go">Go</option>
                </select>
              </div>

              <div className="h-[100%] min-h-[320px]">
                <Editor
                  className="h-full"
                  theme="vs-dark"
                  defaultLanguage="cpp"
                  value={code}
                  onChange={setCode}
                  options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                    padding: { top: 16 },
                  }}
                />
              </div>
            </section>

            <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#171d24]">
              <div className="border-b border-white/10 px-5 py-4">
                <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8fa1b3]">
                  Console
                </h2>
              </div>

              <div className="space-y-4 px-5 py-5">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  rows={4}
                  placeholder="Custom input"
                  className="w-full rounded-2xl border border-white/10 bg-[#0f1419] p-3 text-sm text-white outline-none placeholder:text-[#70808f]"
                />

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleRun}
                    disabled={loading}
                    className="rounded-full bg-[#d7e2ec] px-5 py-2 text-sm font-medium text-[#10212d] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Running..." : "Run Code"}
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-5 py-2 text-sm font-medium text-emerald-200 transition hover:bg-emerald-500/15 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Submit
                  </button>
                  <button
                    onClick={handleReview}
                    disabled={reviewLoading}
                    className="rounded-full border border-white/12 bg-[#12171d] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#141a21] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {reviewLoading ? "Reviewing..." : "AI Review"}
                  </button>
                </div>

                <div className="rounded-2xl border border-white/8 bg-[#0f1419] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#70808f]">Output</p>
                  <pre className="mt-3 min-h-[96px] whitespace-pre-wrap break-words text-sm leading-6 text-[#dbe4ec]">
                    {output || "Run your code to inspect the result here."}
                  </pre>
                </div>
              </div>
            </section>

            {review && (
              <section className="overflow-y-auto rounded-3xl border border-white/10 bg-[#171d24]">
                <div className="border-b border-white/10 px-5 py-4">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8fa1b3]">
                    Review Notes
                  </h2>
                </div>

                <div className="px-5 py-5">
                  <div className="prose prose-sm prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{review}</ReactMarkdown>
                  </div>
                </div>
              </section>
            )}
          </Split>
        </Split>
      </section>
    </main>
  );
}

export default ProblemPage;

function TopStat({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-[#12171d] px-4 py-4">
      <p className="text-xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#728394]">{label}</p>
    </div>
  );
}

export const ProblemLoader = async ({ params }) => {
  try {
    const { problemId } = params;
    const res = await axios.get(`${BACKEND_URL}/api/problem/${problemId}`, {
      withCredentials: true,
    });
    return { problem: res.data };
  } catch (err) {
    if (err.response?.status === 401) {
      return redirect("/login");
    }
    throw new Response("Problem not found", { status: 404 });
  }
};
