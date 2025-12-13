import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import interviewsRouter from "./routes/interviews.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok", time: new Date().toISOString() }));

app.use("/api/interviews", interviewsRouter);

app.use((req, res) => res.status(404).json({ error: "Not found" }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`AI Interviewer server running on http://localhost:${PORT} (provider=${process.env.AI_PROVIDER || "mock"})`);
});
