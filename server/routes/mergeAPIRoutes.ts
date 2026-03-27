import { Router, Request, Response } from "express";
import { Lesson } from "../models/Lesson";
import { Content } from "../models/Content";
import { Assessment } from "../models/Assessment";
import { AssessmentAttempt } from "../models/AssessmentAttempt";
import { IResponse } from "../models/Response"; // ✅ Import the typed Interface

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
      chapter_url: `https://math-platform.com/chapters/${kcId.toLowerCase()}`,
      chapter_difficulty: Number(avgDifficulty.toFixed(2)),
      expected_completion_time_seconds: lessons.length * 600, // Roughly 10 mins per lesson
      subtopics,
      prerequisites: [],
    };

    return res.status(200).json(metadataPayload);
  } catch (error) {
    return res.status(500).json({ error: "Server Error fetching metadata", details: error });
  }
};

// ============================================================================
// 📍 API 2: Session Interaction Sync
// Consolidates assessment scoring and times to the Merge Team Tracking standard
// ============================================================================
const syncSessionInteraction = async (req: Request, res: Response) => {
  try {
    const { attemptId } = req.params;
    const { session_status } = req.body; // Allows overrides such as "exited_midway"

    const attempt = await AssessmentAttempt.findById(attemptId).populate("responses");
    if (!attempt) {
      return res.status(404).json({ error: "Session attempt not found." });
    }

    const assessment = await Assessment.findById(attempt.assessmentId);

    // ✅ Cast populated responses safely to your standard TypeScript IResponse schema
    const responses = attempt.responses as unknown as IResponse[]; 

    // 1. Calculate uniqueness and tallies
    const correct_answers = responses.filter((r) => r.correctness === true).length;
    const wrong_answers = responses.filter((r) => r.correctness === false).length;

    const uniqueProblems = new Set(responses.map((r) => r.problemId.toString()));
    const questions_attempted = uniqueProblems.size;
    const total_questions = assessment?.questions?.length || 5;

    // Retries occur if attemptCount > 1 on any of the question responses
    const retry_count = responses.filter((r) => r.attemptCount > 1).length;

    const hints_used = responses.filter((r) => r.hintTaken === true).length;
    const total_hints_embedded = total_questions; // Assuming standard 1 hint per question in Content.ts

    const time_spent_seconds = responses.reduce((sum, r) => sum + (r.timeTaken || 0), 0);
    const topic_completion_ratio = Number((questions_attempted / total_questions).toFixed(2));

    // 2. Map schema terms to exact Merge contract field types
    const sessionPayload = {
      student_id: attempt.userId.toString(), // Pulled from auth context via your Attempt schema
      session_id: attempt._id.toString(), // Unique reusable ID for safe idempotent network retries
      chapter_id: `grade6_${assessment?.kcId?.toLowerCase() || "kc1"}`,
      timestamp: new Date().toISOString(),
      session_status: session_status || (attempt.isCompleted ? "completed" : "exited_midway"),
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

    // 3. Validation sanity: Enforce correct+wrong <= attempted <= total
    if (correct_answers + wrong_answers < questions_attempted) {
      return res.status(400).json({
        error: "Sanity check failed: Attempted problems cannot be greater than the sum of results.",
      });
    }

    return res.status(200).json({
      message: "Session interaction successfully computed.",
      payload: sessionPayload,
    });
  } catch (error) {
    return res.status(500).json({ error: "Server Error syncing session", details: error });
  }
};

// ============================================================================
// 📍 API 3: Midway Close Interceptor Trigger
// Triggered on UI intercept when tab shuts or is routed away un-submitted.
// ============================================================================
const handleMidwayExit = async (req: Request, res: Response) => {
  try {
    const { attemptId } = req.params;

    const attempt = await AssessmentAttempt.findById(attemptId);
    if (!attempt) {
      return res.status(404).json({ error: "Session attempt could not be found." });
    }

    // Wrap-up session metrics
    attempt.endTime = new Date();
    attempt.isCompleted = false;
    await attempt.save();

    // Redirect control directly into your payload formatter
    req.body.session_status = "exited_midway"; 
    return syncSessionInteraction(req, res);
  } catch (error) {
    return res.status(500).json({ error: "Failed to handle midway trigger event", details: error });
  }
};

// ============================================================================
// Express Router Bindings
// ============================================================================
router.get("/chapters/:kcId/metadata", getChapterMetadata);
router.post("/sessions/:attemptId/sync", syncSessionInteraction);
router.post("/sessions/:attemptId/exit", handleMidwayExit);

export default router;