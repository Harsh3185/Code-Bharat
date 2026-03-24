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

const defaultAllowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://code-bharat-one.vercel.app",
  "https://jatsamajdirectory.com",
];

const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS
  ? process.env.CORS_ALLOWED_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean)
  : defaultAllowedOrigins;

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Origin not allowed by CORS"));
  },
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

app.get("/", (req, res) => {
  res.json({ message: "Code Bharat Backend API is live" });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
