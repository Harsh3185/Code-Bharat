import { Router } from "express";
import requireAuth from "../Middleware/requireAuth.mjs";
import { checkSchema } from "express-validator";
import { profileValidatingSchema } from "../Utils/Validating Schemas/profileValidatingSchema.mjs";
import { editProfile, getMyProfile, userProfile } from "../Controllers/profileControllers.mjs";

const router = Router();

router.get("/api/user/:id" , userProfile);

router.get("/api/profile" , requireAuth  , getMyProfile);

router.put("/api/profile" , requireAuth, checkSchema(profileValidatingSchema), editProfile);

export default router;
