import mongoose from "mongoose";

const exampleSchema = new mongoose.Schema({
    input: {
        type: String,
        required: true,
    },
    output: {
        type: String,
        required: true,
    },
    explanation: {
        type: String,
        required: false,
        default: ""
    }
});

const problemSchema = new mongoose.Schema({
    problemNumber: {
        type: Number,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
        unique: true,
    },
    statement: {
        type: String,
        required: true,
    },
    examples: {
        type: [exampleSchema],
        default: [],
    },
    constraints: {
        type: String,
        required: true,
    },
    totalSubmissions: {
        type: Number,
        default: 0,
    },
    acceptance: {
        type: Number,
        default: 0,
    },
    acceptanceRate: {
        type: Number,
        default: 0,
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
});

export const Problem = mongoose.models.Problem || mongoose.model("Problem", problemSchema);
