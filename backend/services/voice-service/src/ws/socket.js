import { WebSocketServer } from "ws";
import { saveAudioFile } from "../utils/saveAudio.js";
import { transcribeAudio } from "../clients/whisperClient.js";
import { v4 as uuid } from "uuid";

export const initSocket = (server) => {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    console.log("🎙️ Client connected");

    // Buffer to store incoming audio chunks
    ws.audioChunks = [];

    ws.on("message", async (message) => {
      
      const messageString = message.toString();

      // 🟢 CONTROL MESSAGE (JSON)
      if (messageString.startsWith("{")) {
        let data;

        try {
          data = JSON.parse(messageString);
        } catch (err) {
          console.error("❌ Failed to parse control message", err);
          return;
        }

        console.log("📩 Control message received:", data);

        if (data.type === "STOP") {
          console.log("🛑 Stop signal received");

          try {
            const filename = `${uuid()}.webm`;
            if (ws.audioChunks.length === 0) {
              console.warn("⚠️ No audio chunks received, skipping save");
              return;
            }
            const filePath = saveAudioFile(ws.audioChunks, filename);

            const text = await transcribeAudio(filePath);

            console.log("🧠 Transcription completed:", text);

            // Reset buffer for next question
            ws.audioChunks = [];

            ws.send(
              JSON.stringify({
                type: "TRANSCRIPTION",
                text,
              })
            );
          } catch (error) {
            console.error("❌ Transcription failed:", error);

            ws.send(
              JSON.stringify({
                type: "ERROR",
                message: "Transcription failed",
              })
            );
          }
        }

        return;
      }

      // 🔵 AUDIO CHUNK (binary)
      ws.audioChunks.push(message);
      console.log("🎧 Audio chunk buffered:", message.length);
    });

    ws.on("close", () => {
      console.log("🎙️ Client disconnected");
    });

    ws.on("error", (err) => {
      console.error("🎙️ WebSocket error:", err);
    });
  });
};

