import http from "http";
import express from "express";
import { initSocket } from "./ws/socket.js";
import path from "path";
import speakRoutes from "./routes/speak.routes.js";
import dotenv from 'dotenv'

dotenv.config();
const app = express();
app.use(express.json());

const server = http.createServer(app);

initSocket(server);

app.use("/voice/audio", express.static("/tmp"));
app.use("/voice", speakRoutes)

const PORT  = process.env.PORT || 8000
server.listen(PORT, () => {
  console.log("🎙️ Voice service running on port 8000");
});
