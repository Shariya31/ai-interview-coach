import express from "express";
import cors from "cors";
import authProxy from "./proxies/auth.proxy.js";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

// ⬇️ proxy FIRST (no body parsing)
app.use("/auth", authProxy);

// ⬇️ body parser ONLY for gateway-owned routes
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "API Gateway running" });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`API Gateway listening on port ${PORT}`);
});
