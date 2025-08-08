import { matchedData, validationResult } from "express-validator";
import mongoose from "mongoose";
import axios from "axios";
import { Submission } from "../Models/Submission.mjs";
import { Problem } from "../Models/Problem.mjs";
import { TestCase } from "../Models/Testcase.mjs";
import { User } from "../Models/User.mjs";

const normalize = (s) => s.trim().split("\n").map((l) => l.trim()).join("\n");

export const showAllSubmissions = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const submissions = await Submission.find({ userId: req.user._id })
    .select("problemId problemNumber language status createdAt")
    .sort({ createdAt: -1 })
    .lean();

  res.json({ submissions });
};

export const showProblemSubmissions = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ message: "Invalid MongoDB ID" });

  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const submissions = await Submission.find({
    userId: req.user._id,
    problemId: id,
  })
    .select("problemId problemNumber language status createdAt")
    .sort({ createdAt: -1 })
    .lean();

  res.json({ submissions });
};

export const submitSolution = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ message: "Validation failed", errors: errors.array() });

  const problemId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(problemId))
    return res.status(400).json({ message: "Invalid problem ID" });

  const { code, language } = matchedData(req);

  try {
    console.log("[1] Finding problem:", problemId);
    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    console.log("[2] Fetching test cases...");
    const testCases = await TestCase.find({ problemId });
    if (!testCases.length)
      return res.status(400).json({ message: "No test cases found" });

    let passed = 0;
    const compilerUrl = process.env.COMPILER_SERVICE_URL || "http://localhost:7000";

    console.log("[3] Compiler URL:", compilerUrl);
    for (const tc of testCases) {
      console.log("[4] Sending test case input:", tc.input);
      try {
        const runRes = await axios.post(
          `${compilerUrl}/run`,
          { code, language, input: tc.input },
          { timeout: 10000 }
        );
        console.log("[5] Compiler response:", runRes.data);

        const actual = normalize(runRes.data.output);
        const expected = normalize(tc.output);
        if (actual === expected) passed++;
      } catch (err) {
        console.error("[6] Test case failed:", tc.input);
        console.error("[6] Error message:", err.message);
        console.error("[6] Response:", err?.response?.data);
        return res.status(500).json({
          message: "Error while running test cases",
          error: err?.message,
          detail: err?.response?.data
        });
      }
    }

    const isAccepted = passed === testCases.length;

    console.log("[7] Updating problem stats");
    problem.totalSubmissions++;
    if (isAccepted) problem.acceptance++;
    problem.acceptanceRate = (problem.acceptance / problem.totalSubmissions) * 100;
    await problem.save();

    console.log("[8] Fetching user:", req.user._id);
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    console.log("[9] Updating user stats");
    user.totalSubmissions++;
    if (isAccepted) {
      user.acceptedSubmissions++;
      if (
        problem.problemNumber != null &&
        Array.isArray(user.problemsSolved) &&
        !user.problemsSolved.includes(problem.problemNumber)
      ) {
        user.problemsSolved.push(problem.problemNumber);
      }
    }
    await user.save();

    console.log("[10] Creating submission");
    const submissionData = {
      userId: user._id,
      problemId: problem._id,
      language,
      code,
      input: testCases.map((tc) => tc.input).join("\n---\n"),
      output: testCases.map((tc) => tc.output).join("\n---\n"),
      status: isAccepted ? "Accepted" : "Wrong Answer",
      executionTime: "N/A",
    };

    if (problem.problemNumber != null) {
      submissionData.problemNumber = problem.problemNumber;
    }

    const submission = await Submission.create(submissionData);

    console.log("[11] Submission saved");
    return res.json({ status: submission.status });
  } catch (e) {
    console.error("[12] Fatal backend error in submitSolution:");
    console.dir(e, { depth: null });
    return res.status(500).json({
      message: "Internal server error",
      error: e.message,
      stack: e.stack,
    });
  }
};
