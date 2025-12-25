import express from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "API Gateway running" });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`API Gateway listening on port ${PORT}`);
});
