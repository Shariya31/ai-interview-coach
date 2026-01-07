import Interview from "../models/interview.js";

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
      .select("_id status overallScore createdAt");

    res.json(interviews);
  } catch (error) {
    console.error("Fetch interviews error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
