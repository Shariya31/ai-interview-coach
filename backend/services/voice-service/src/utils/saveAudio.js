import fs from "fs";
import path from "path";

export const saveAudioFile = (chunks, filename) => {
  console.log("🎧 Saving audio file, chunks:", chunks.length);
  const buffer = Buffer.concat(chunks);
  const filePath = path.join("/tmp", filename);

  fs.writeFileSync(filePath, buffer);
  console.log("📁 Audio saved at:", filePath);
  return filePath;
};
