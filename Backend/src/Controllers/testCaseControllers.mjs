import { matchedData, validationResult } from "express-validator";
import mongoose from "mongoose";
import { TestCase } from "../Models/Testcase.mjs";

export const addTestCase = async (req, res) => {
  const { id } = req.params;                       

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ message: "Invalid problem ID" });

  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ message: "Validation failed", errors: errors.array() });

  const { testCases } = matchedData(req, { includeOptionals: true });

  const docs = testCases.map(tc => ({ ...tc, problemId: id }));

  try {
    await TestCase.insertMany(docs);
    res.status(201).json({ message: "Test-cases added" });
  } catch (err) {
    res.status(500).json({ message: "Insert failed", error: err.message });
  }
};

export const getTestCasesByProblem = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ message: "Invalid problem ID" });

  try {
    const testCases = await TestCase.find({ problemId: id });
    res.json({ testCases });
  } catch (err) {
    res.status(500).json({ message: "Fetch failed", error: err.message });
  }
};
