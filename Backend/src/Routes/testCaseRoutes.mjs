import { Router } from "express";
import { checkSchema } from "express-validator";
import { testCaseValidatingSchema } from "../Utils/Validating Schemas/testCaseValidatingSchema.mjs";
import {
  addTestCase,
  getTestCasesByProblem
} from "../Controllers/testCaseControllers.mjs";
import requireAuth from "../Middleware/requireAuth.mjs";
import isAdmin     from "../Middleware/isAdmin.mjs";

const router = Router();

router.post(
  "/api/testcases/:id",      
  requireAuth,
  isAdmin,
  checkSchema(testCaseValidatingSchema),
  addTestCase
);

router.get(
  "/api/testcases/:id",
  requireAuth,
  isAdmin,
  getTestCasesByProblem
);

export default router;
