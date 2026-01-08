import express from "express";
import authMiddleware from "../middlewares/auth.js";
import { createInterview, getInterviewById, getMyInterviews, uploadResume } from "../controllers/interview.controller.js";
import upload from "../config/multer.js";

const router = express.Router();

router.post("/", authMiddleware, createInterview);
router.get("/", authMiddleware, getMyInterviews);
router.post("/:id/resume", authMiddleware, upload.single("resume"), uploadResume);
router.get("/:id", authMiddleware, getInterviewById);
export default router;
