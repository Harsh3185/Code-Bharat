import { Router } from "express";
import { checkSchema } from "express-validator";
import { submissionValidatingSchema } from "../Utils/Validating Schemas/submissionValidatingSchema.mjs";
import { showAllSubmissions, showProblemSubmissions, submitSolution } from "../Controllers/submissionControllers.mjs";
import requireAuth from "../Middleware/requireAuth.mjs";

const router = Router();

router.get("/api/submissions", requireAuth, showAllSubmissions);

router.get("/api/problem/:id/submissions", requireAuth, showProblemSubmissions);

router.post("/api/problem/:id/submit", requireAuth, checkSchema(submissionValidatingSchema), submitSolution);

export default router;
