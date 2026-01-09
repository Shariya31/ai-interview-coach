import express from "express";
import authMiddleware from "../middlewares/auth.js";
import { createInterview, generateQuestions, getInterviewById, getMyInterviews, startInterview, submitAnswer, uploadResume } from "../controllers/interview.controller.js";
import upload from "../config/multer.js";

const router = express.Router();

router.post("/", authMiddleware, createInterview);
router.get("/", authMiddleware, getMyInterviews);
router.post("/:id/resume", authMiddleware, upload.single("resume"), uploadResume);
router.get("/:id", authMiddleware, getInterviewById);
router.post("/:id/questions", authMiddleware, generateQuestions);
router.post("/:id/start", authMiddleware, startInterview);
router.post("/:id/answer", authMiddleware, submitAnswer);
export default router;
