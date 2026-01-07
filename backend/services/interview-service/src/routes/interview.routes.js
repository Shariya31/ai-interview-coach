import express from "express";
import authMiddleware from "../middlewares/auth.js";
import { createInterview, getMyInterviews } from "../controllers/interview.controller.js";

const router = express.Router();

router.post("/", authMiddleware, createInterview);
router.get("/", authMiddleware, getMyInterviews);

export default router;
