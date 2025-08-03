import { Router } from "express";
import { addProblem, deleteProblem, getProblem, getProblemSet } from "../Controllers/problemControllers.mjs";
import requireAuth from "../Middleware/requireAuth.mjs";
import isAdmin from "../Middleware/isAdmin.mjs";
import { checkSchema } from "express-validator";
import { problemValidatingSchema } from "../Utils/Validating Schemas/problemValidatingSchema.mjs";

const router = Router();

router.get('/api/problems' , getProblemSet);

router.get('/api/problem/:Id' , requireAuth , getProblem);

router.post('/api/problem' , requireAuth , isAdmin , checkSchema(problemValidatingSchema) , addProblem);

router.post('/api/problem/:Id' , requireAuth , isAdmin , deleteProblem);

export default router;