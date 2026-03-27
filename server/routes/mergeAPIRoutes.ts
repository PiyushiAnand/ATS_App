import { Router, Request, Response } from "express";
import { Lesson } from "../models/Lesson";
import { Content } from "../models/Content";
import { Session } from "../models/Session"; // ✅ Uses Session instead of AssessmentAttempt
import { IResponse } from "../models/Response"; // ✅ Import typed Interface
import { User } from "../models/User";

const router = Router();

// ============================================================================
// 📍 API 1: Chapter Metadata API
// Get canonical chapter setups and subtopics derived from Lessons & Contents
// ============================================================================
const getChapterMetadata = async (req: Request, res: Response) => {
  try {
    const { kcId } = req.params; // Expects "KC1", "KC2", or "KC3"

    const lessons = await Lesson.find({ kcId }).sort({ order: 1 });
    const questions = await Content.find({ kcId });

    if (!lessons.length) {
      return res.status(404).json({ error: "Chapter lessons not found for this KC ID." });
    }

    // Map your lesson modules to Merge Team's subtopic objects
    const subtopics = lessons.map((lesson) => ({
      subtopic_id: `grade6_${kcId.toLowerCase()}_lesson_${lesson._id}`,
      name: lesson.subtopicName,
      difficulty: 0.5, // Normalized difficulty placeholder (0-1)
    }));

    // Map content string difficulties to 0-1 normalized float
    const difficultyMap: Record<string, number> = { Easy: 0.3, Medium: 0.6, Hard: 0.8 };
    const avgDifficulty = questions.length
      ? questions.reduce((sum, q) => sum + (difficultyMap[q.difficulty] || 0.5), 0) / questions.length
      : 0.5;

    const metadataPayload = {
      grade: 6,
      chapter_name: lessons[0].subtopicName.split(":")[0].trim(), // e.g. "Subtopic 1"
      chapter_id: `grade6_${kcId.toLowerCase()}`, // Format: grade{number}_{name_snake_case}
      chapter_url: "https://ats-frontend-uxub.onrender.com/",
      chapter_difficulty: Number(avgDifficulty.toFixed(2)),
      expected_completion_time_seconds: lessons.length * 600, // Roughly 10 mins per lesson
      subtopics,
      prerequisites: [],
    };

    return res.status(200).json(metadataPayload);
  } catch (error: any) {
    return res.status(500).json({ error: "Server Error fetching metadata", details: error.message });
  }
};

// ============================================================================
// 📍 API 2: Session Interaction Sync
// Consolidates assessment scoring and times to the Merge Team Tracking standard
// ============================================================================
const syncSessionInteraction = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params; // Expects the login-to-logout sessionId
    const { session_status } = req.body; 

    // Find the session and pull the actual question documents
    const session = await Session.findById(sessionId).populate("Responses");
    if (!session) {
      return res.status(404).json({ error: "User session context not found." });
    }

    const responses = (session.Responses || []) as unknown as IResponse[];

    // 1. Calculate uniqueness and tallies using exact IResponse attributes
    const correct_answers = responses.filter((r) => r.correctness === true).length;
    const wrong_answers = responses.filter((r) => r.correctness === false).length;

    const uniqueProblemIds = Array.from(new Set(responses.map((r) => r.problemId.toString())));
    const questions_attempted = uniqueProblemIds.length;

    // Use a fallback of questions attempted, or query the active chapter being done
    const total_questions = questions_attempted; 

    // Retries occur if attemptCount > 1 on any of the question responses
    const retry_count = responses.filter((r) => r.attemptCount > 1).length;

    const hints_used = responses.filter((r) => r.hintTaken === true).length;

    // 🎯 Dynamic Hint Calculation (Only Medium/Hard have hints)
    const takenQuestions = await Content.find({ _id: { $in: uniqueProblemIds } });
    const total_hints_embedded = takenQuestions.filter(
      (q) => q.difficulty === "Medium" || q.difficulty === "Hard"
    ).length;

    const time_spent_seconds = responses.reduce((sum, r) => sum + (r.timeTaken || 0), 0);

    // 🎯 Real Dynamic Topic Completion Ratio
    const user = await User.findById(session.userId);
    const completedTopicsCount = user?.completedTopics?.length || 0;
    const topic_completion_ratio = Number((completedTopicsCount / 13).toFixed(2));

    // 2. Map schema terms to exact Merge contract field types
    const sessionPayload = {
      student_id: session.userId.toString(), 
      session_id: session._id.toString(), // Unique reusable ID for safe idempotent network retries
      chapter_id: `grade6_kc_mastery`, // Or dynamically query chapter from standard analytics
      timestamp: new Date().toISOString(),
      session_status: session_status || (session.endTime ? "completed" : "exited_midway"),
      correct_answers,
      wrong_answers,
      questions_attempted,
      total_questions,
      retry_count,
      hints_used,
      total_hints_embedded,
      time_spent_seconds,
      topic_completion_ratio,
    };

    // 3. Validation sanity check
    if (correct_answers + wrong_answers < questions_attempted) {
      return res.status(400).json({
        error: "Sanity check failed: Attempted problems cannot be greater than sum of correct + wrong results.",
      });
    }

    return res.status(200).json({
      message: "Session interaction successfully computed.",
      payload: sessionPayload,
    });
  } catch (error: any) {
    return res.status(500).json({ error: "Server Error syncing session", details: error.message });
  }
};

// ============================================================================
// 📍 API 3: Midway Close Interceptor Trigger
// Triggered on UI intercept when tab shuts or is routed away un-submitted.
// ============================================================================
const handleMidwayExit = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ error: "Session context could not be found." });
    }

    // Wrap-up metrics for the whole sitting session
    session.endTime = new Date();
    await session.save();

    req.body.session_status = "exited_midway";
    return syncSessionInteraction(req, res);
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to handle midway trigger event", details: error.message });
  }
};

// ============================================================================
// Express Router Bindings
// ============================================================================
router.get("/chapters/:kcId/metadata", getChapterMetadata);
router.post("/sessions/:sessionId/sync", syncSessionInteraction);
router.post("/sessions/:sessionId/exit", handleMidwayExit);

export default router;