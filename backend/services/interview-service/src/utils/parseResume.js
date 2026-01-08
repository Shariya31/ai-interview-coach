import fs from "fs";
import { PDFParse } from "pdf-parse";

const parseResume = async (filePath) => {
  const buffer = fs.readFileSync(filePath);

  const parser = new PDFParse({
    data: buffer,
  });

  const result = await parser.getText();
  return result.text;
};

export default parseResume;
