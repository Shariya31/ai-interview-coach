import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import interviewRoutes from "./routes/interview.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get("/health", (req, res) => {
  res.json({ status: "Interview service running" });
});

app.use("/interviews", interviewRoutes);

const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
  console.log(`Interview service running on port ${PORT}`);
});
