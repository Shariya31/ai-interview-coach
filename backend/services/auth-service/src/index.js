import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db.js";

//Routes import
import authRoutes from './routes/auth.routes.js'
dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "Auth service running" });
});

app.use("/", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
