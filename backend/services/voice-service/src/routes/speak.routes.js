import express from "express";
import { speakText } from "../controllers/speak.controller.js";

const router = express.Router();

router.post("/speak", speakText);

export default router;
