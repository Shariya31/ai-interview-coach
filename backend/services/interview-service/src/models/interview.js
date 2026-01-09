import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["created", "in_progress", "completed"],
      default: "created",
    },

    questions: [
      {
        question: String,
        answer: String,
        score: Number,
        feedback: String,
      },
    ],

    currentQuestionIndex: {
      type: Number,
      default: 0,
    },

    overallScore: {
      type: Number,
      default: null,
    },

    overallFeedback: {
      type: String,
      default: null,
    },

    resumePath: {
      type: String,
      default: null,
    },

    resumeText: {
      type: String,
      default: null,
    },

    cleanedResumeText: {
      type: String,
      default: null,
    },

    extractedSkills: {
      type: [String],
      default: [],
    },

    detectedRole: {
      type: String,
      default: null,
    },

    answers: [
      {
        questionIndex: Number,
        answer: String,
      },
    ],
  },
  { timestamps: true }
);

const Interview = mongoose.model("Interview", interviewSchema);

export default Interview;
