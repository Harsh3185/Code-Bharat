import { matchedData, validationResult } from "express-validator";
import { Problem } from "../Models/Problem.mjs";
import mongoose from "mongoose";
import { TestCase } from "../Models/Testcase.mjs";


export const getProblem = async (req, res) => {
    const { Id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(Id)) {
        return res.status(400).json({ message: 'Invalid MongoDB ID' });
    }

    try {
        const problem = await Problem.findById(Id);

        if (!problem) {
            return res.status(404).json({ message: 'Problem not found' });
        }

        res.status(200).json(problem);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch problem', error: error.message });
    }
};

export const addProblem = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const data = matchedData(req, { includeOptionals: true });

        const created_by = req.user.id;

        const problem = await Problem.create({
            ...data,
            created_by
        });

        res.status(201).json({ message: 'Problem added successfully', problem });
    } catch (error) {
        console.error("Add Problem Error:", error.stack || error.message || error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const getProblemSet = async (req, res) => {
    try {
        const problems = await Problem.find().select('problemNumber title acceptanceRate');

        res.status(200).json({ problems });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch problems', error });
    }
};

export const deleteProblem = async (req, res) => {
    const Id = req.params.Id;

    if (!mongoose.Types.ObjectId.isValid(Id)) {
        return res.status(400).json({ message: "Invalid problem ID" });
    }

    try {
        const deletedProblem = await Problem.findByIdAndDelete(Id);

        if (!deletedProblem) {
            return res.status(404).json({ message: "Problem not found" });
        }

        await TestCase.deleteMany({ problemId: Id });

        res.status(200).json({ message: "Problem and associated test cases deleted successfully" });
    } catch (err) {
        console.error("Delete Problem Error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};