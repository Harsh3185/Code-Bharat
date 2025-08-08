import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  submissionId: {
    type: Number,
    default: () => Date.now()
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Problem",
    required: true
  },
  problemNumber: {
    type: Number,
    required: true
  }, 
  language: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  input: {
    type:
      String,
    default: ""
  },
  output:
  {
    type: String
  },
  status: {
    type: String,
    enum: ["Accepted", "Wrong Answer", "Runtime Error", "Compilation Error", "Pending"],
    default: "Pending"
  },
  executionTime: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Submission = mongoose.models.Submission || mongoose.model("Submission", submissionSchema);
