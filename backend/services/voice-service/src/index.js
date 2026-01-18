import http from "http";
import express from "express";
import { initSocket } from "./ws/socket.js";
import path from "path";
import speakRoutes from "./routes/speak.routes.js";
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config();
const app = express();
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json());

const server = http.createServer(app);

initSocket(server);

app.get("/health", (req, res) => {
  res.send("Voice service is running");
})

app.use("/voice/audio", express.static("/tmp"));
app.use("/voice", speakRoutes)

const PORT = process.env.PORT || 8000
server.listen(PORT, () => {
  console.log("🎙️ Voice service running on port 8000");
});
