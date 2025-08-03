import { Router } from 'express';
import { login, logout, register, me } from '../Controllers/authControllers.mjs';
import { registerValidatingSchema } from '../Utils/Validating Schemas/Auth/registerValidatingSchema.mjs';
import { checkSchema } from "express-validator";
import loginValidatingSchema from '../Utils/Validating Schemas/Auth/loginValidatingSchema.mjs';
import requireAuth from '../Middleware/requireAuth.mjs';

const router = Router();

router.post('/api/auth/register' , checkSchema(registerValidatingSchema) , register);

router.post('/api/auth/login' , checkSchema(loginValidatingSchema) , login);

router.get('/api/auth/me', requireAuth, me);

router.post('/api/auth/logout' , logout);

export default router;
