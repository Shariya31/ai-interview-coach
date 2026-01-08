import Interview from "../models/interview.js";
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
    interview.resumeText = extractedText;

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

