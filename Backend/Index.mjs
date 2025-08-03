import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import DBConnection from './src/Database/Database.mjs';
import authRouter from './src/Routes/authRoutes.mjs';
import problemRouter from './src/Routes/problemRoutes.mjs';
import testCaseRouter from './src/Routes/testCaseRoutes.mjs';
import profileRouter from './src/Routes/profileRoutes.mjs';
import submissionRouter from './src/Routes/submissionRoutes.mjs';
import cors from "cors";

dotenv.config();
const app = express();

DBConnection();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(authRouter);
app.use(problemRouter);
app.use(testCaseRouter);
app.use(profileRouter); 
app.use(submissionRouter); 

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
