import buildQuestionPrompt from "../ai/buildQuestionPrompt.js";
import llmClient from "../ai/llmClient.js";
import Interview from "../models/interview.js";
import cleanText from "../utils/cleanText.js";
import detectRole from "../utils/detectRole.js";
import extractSkills from "../utils/extractSkills.js";
import parseResume from "../utils/parseResume.js";

export const createInterview = async (req, res) => {
  try {
    const interview = await Interview.create({
      userId: req.user.id,
    });

    res.status(201).json({
      message: "Interview created",
      interviewId: interview._id,
    });
  } catch (error) {
    console.error("Create interview error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({
      userId: req.user.id,
    })
      .sort({ createdAt: -1 })
      .select("_id status overallScore createdAt resumePath");

    res.json(interviews);
  } catch (error) {
    console.error("Fetch interviews error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const uploadResume = async (req, res) => {
  try {
    const interviewId = req.params.id;

    const interview = await Interview.findOne({
      _id: interviewId,
      userId: req.user.id,
    });

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    interview.resumePath = req.file.path;

    // 👇 NEW
    const extractedText = await parseResume(req.file.path);
    const cleanedText = cleanText(extractedText);
    const skills = extractSkills(cleanedText);
    const role = detectRole(skills);

    interview.resumeText = extractedText;
    interview.cleanedResumeText = cleanedText;
    interview.extractedSkills = skills;
    interview.detectedRole = role;

    await interview.save();

    res.json({
      message: "Resume uploaded & parsed successfully",
      textLength: extractedText.length,
    });
  } catch (error) {
    console.error("Upload resume error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    res.json(interview);
  } catch (error) {
    console.error("Get interview error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const generateQuestions = async (req, res) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!interview || !interview.cleanedResumeText) {
      return res.status(400).json({ message: "Resume not processed yet" });
    }

    const prompt = buildQuestionPrompt({
      role: interview.detectedRole,
      skills: interview.extractedSkills,
      resumeText: interview.cleanedResumeText,
    });

    const aiResponse = await llmClient(prompt);

    const questions = aiResponse
      .split("\n")
      .filter((q) => q.trim())
      .slice(0, 5)
      .map((q) => ({ question: q }));

    interview.questions = questions;
    interview.status = "in_progress";
    await interview.save();

    res.json({
      message: "Questions generated",
      questions,
    });
  } catch (error) {
    console.error("Generate questions error:", error);
    res.status(500).json({ message: "AI generation failed" });
  }
};

export const startInterview = async (req, res) => {
  const interview = await Interview.findById(req.params.id);

  if (!interview) {
    return res.status(404).json({ message: "Interview not found" });
  }

  interview.status = "in_progress";
  interview.currentQuestionIndex = 0;

  await interview.save();

  res.json({
    message: "Interview started",
    currentQuestion: interview.questions[0],
    currentIndex: interview.currentQuestionIndex + 1,
    totalQuestions: interview.questions.length,

  });
};

export const submitAnswer = async (req, res) => {
  const { answer } = req.body;
  const interview = await Interview.findById(req.params.id);

  if (!interview || interview.status !== "in_progress") {
    return res.status(400).json({ message: "Interview not active" });
  }

  interview.answers.push({
    questionIndex: interview.currentQuestionIndex,
    answer,
  });

  interview.currentQuestionIndex += 1;

  // Interview finished
  if (interview.currentQuestionIndex >= interview.questions.length) {
    interview.status = "completed";
    await interview.save();

    return res.json({
      message: "Interview completed",
      answers: interview.answers
    });
  }

  await interview.save();

  res.json({
    message: "Answer submitted",
    nextQuestion:
      interview.questions[interview.currentQuestionIndex],
    // currentQuestion,
    currentIndex: interview.currentQuestionIndex + 1,
    totalQuestions: interview.questions.length,

  });
};
