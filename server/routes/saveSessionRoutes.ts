import express, { Response } from "express";
import { Session } from "../models/Session";
import { Response as UserResponse } from "../models/Response";
import { authenticate, AuthRequest } from "../middleware/auth";
import { Content } from "../models/Content";
import { User } from "../models/User";
import { Lesson } from "../models/Lesson";
const router = express.Router();


const getChapterMetadata = async (_req: Request, res: Response) => {
  try {
    // 1. Fetch ALL lessons and ALL questions for the entire chapter
    // We sort by kcId and then order to maintain a logical flow
    const lessons = await Lesson.find({}).sort({ kcId: 1, order: 1 });
    const questions = await Content.find({});

    if (!lessons.length) {
      return res.status(404).json({ error: "No lessons found for the Data Handling chapter." });
    }

    const subtopicDifficultyMap: Record<string, number> = {
      // KC1
      "Introduction to Data and Organising Data": 0.2,
      "Pictographs": 0.3,
      "Bar Graphs": 0.4,
      "Double Bar Graphs": 0.5,
      // KC2
      "Fractions & % calculations": 0.6,
      "Drawing a pie chart": 0.7,
      "Problem solving using Pie charts": 0.8,
      // KC3
      "Introduction to Chance": 0.4,
      "Random Experiments & Outcomes": 0.5,
      "Equally Likely Outcomes": 0.6,
      "Probability": 0.7,
      "Events": 0.7,
      "Probability in Real Life": 0.8
    };
    // 2. Map every lesson across all KCs to the subtopics array
    const subtopics = lessons.map((lesson) => {
      // Clean the subtopic name by removing "Subtopic X:" prefix if it exists
      const subtopic_name = (lesson.subtopicName.split(':').pop()?.trim() || lesson.subtopicName)
              .toLowerCase()
              .replace(/[^a-z0-9 ]/g, '')
              .split(' ')
              .join('_');
      const cleanName = lesson.subtopicName.split(':').pop()?.trim() || lesson.subtopicName;
      return {
        subtopic_id: `grade6_${subtopic_name}`,
        name: `${lesson.kcId}: ${lesson.subtopicName}`,
        difficulty: subtopicDifficultyMap[cleanName] || 0.5, // Fallback to 0.5 if name doesn't match
      };
    });

    // 3. Calculate Average Difficulty across the whole chapter
    const difficultyMap: Record<string, number> = { Easy: 0.3, Medium: 0.6, Hard: 0.8 };
    const avgDifficulty = questions.length
      ? questions.reduce((sum, q) => sum + (difficultyMap[q.difficulty] || 0.5), 0) / questions.length
      : NaN;

    // 4. Final Payload representing the entire Grade 6 Data Handling chapter
    const metadataPayload = {
      grade: 6,
      chapter_name: "Data Handling",
      chapter_id: "grade6_data_handling",
      chapter_url: "https://ats-frontend-uxub.onrender.com/",
      chapter_difficulty: Number(avgDifficulty.toFixed(2)),
      expected_completion_time_seconds: 4000, 
      subtopics,
      prerequisites: [
        "grade3_data_handling",
        "grade4_tick_tick_tick", // Tallying and recording time-based data
        "grade4_smart_charts",   // Core NCERT data handling chapter
        "grade5_parts_and_wholes", // Foundation for Pie Charts
        "grade5_smart_charts",   // Advanced tallying and bar representations
        "grade5_ways_to_multiply_and_divide" // Arithmetic foundation for Probability
      ],
    };

    return res.status(200).json(metadataPayload);
  } catch (error: any) {
    return res.status(500).json({ error: "Server Error fetching chapter metadata", details: error.message });
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
    const session = await Session.findOne({ session_id: sessionId }).populate("responses");
    if (!session) {
      return res.status(404).json({ error: "User session context not found for ID: " + sessionId });
    }

    const responses = (session.responses || []) as unknown as IResponse[];

    // 1. Calculate uniqueness and tallies using exact IResponse attributes
    // const correct_answers = responses.filter((r) => r.correctness === true).length;
    // const wrong_answers = responses.filter((r) => r.correctness === false).length;

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

    const time_spent_seconds = responses.reduce((sum, r) => sum + (r.timeTaken || NaN), 0);

    // 🎯 Real Dynamic Topic Completion Ratio
    const user = await User.findOne({ user_id: session.user_id });
    const completedTopicsCount = user?.completedTopics?.length || NaN;
    const topic_completion_ratio = Number((completedTopicsCount / 13).toFixed(2));

    // 2. Map schema terms to exact Merge contract field types
    const sessionPayload = {
      student_id: (session as any).externalStudentId || session.student_id, 
      session_id: (session as any).externalSessionId || session.session_id, // Unique reusable ID for safe idempotent network retries
      chapter_id: "grade6_data_handling", 
      timestamp: new Date().toISOString(),
      session_status: session_status || (session.endTime ? "completed" : "exited_midway"),
      questions_attempted,
      total_questions,
      retry_count,
      hints_used,
      total_hints_embedded,
      time_spent_seconds,
      topic_completion_ratio,
    };


    // 2. attempted <= total
    // total_questions here should represent the total questions available in the chapter
    if (questions_attempted > total_questions) {
      return res.status(400).json({ 
        error: "Validation Failed: Attempted count exceeds total available questions." 
      });
    }

    // 3. hints_used <= total_hints
    if (hints_used > total_hints_embedded) {
      return res.status(400).json({ 
        error: "Validation Failed: Used hints count cannot exceed available hints." 
      });
    }

    //check if topic_completion_ratio is between 0 and 1
    if (topic_completion_ratio < 0 || topic_completion_ratio > 1) {
      return res.status(400).json({ 
        error: "Validation Failed: Topic completion ratio must be between 0 and 1." 
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
// 📍 Route 1: Start / Resume Session
// ============================================================================
router.post("/start", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user_id = req.userId; 
    const { session_id, student_id } = req.body;
    console.log("✨ Creating new session with ID:", session_id);
    console.log("Session details:", { user_id, student_id, session_id });
    if (!user_id || !session_id || !student_id) {
      return res.status(400).json({ 
        error: "user_id, session_id, and student_id are required." 
      });
    }

    // ✅ Idempotency: session_id is UNIQUE → reuse if exists
    let session = await Session.findOne({ session_id });

    if (session) {
      console.log("♻️ Resuming existing session:", session_id);
      return res.status(200).json({
        message: "Existing session resumed successfully!",
        session_id: session.session_id
      });
    }
  
    // ✅ Create new session
    session = await Session.create({
      user_id,
      student_id,
      session_id,
      responses: []
    });

    return res.status(201).json({
      message: "Session started successfully!",
      session_id: session.session_id
    });

  } catch (error: any) {
    return res.status(500).json({ 
      error: "Failed to create/resume session.", 
      details: error.message 
    });
  }
});


// ============================================================================
// 📍 Route 2: Complete Session
// ============================================================================
router.post("/complete", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { session_id, token } = req.body;

    if (!session_id) {
      return res.status(400).json({ error: "session_id is required." });
    }

    // 1. Fetch session + responses
    const session = await Session.findOne({ session_id });
    const responses = await UserResponse.find({ session_id });

    if (!session) {
      console.warn("⚠️ Session not found for ID:", session_id);
      return res.status(404).json({
        error: "Session not found."
      });
    }
    if (responses.length === 0) {
      console.warn("⚠️ No responses found for session:", session_id);
      return res.status(404).json({
        message: "No responses found for this session."
      });
    }

    // 2. Attach responses + end session
    const updatedSession = await Session.findOneAndUpdate(
      { session_id },
      {
        endTime: new Date()
      },
      { new: true }
    );

    if (!updatedSession) {
      console.error("Failed to update session end time for ID:", session_id);
      return res.status(404).json({ error: "Session update failed." });
    }

    // 3. Core metrics (aligned with syncSessionInteraction)
    const uniqueProblemIds = Array.from(
      new Set(responses.map((r) => r.problemId.toString()))
    );

    const questions_attempted = uniqueProblemIds.length;

    const correct_answers = responses.filter(r => r.correctness === true).length;
    const wrong_answers = responses.filter(r => r.correctness === false).length;

    const retry_count = responses.filter(r => r.attemptCount > 1).length;
    const hints_used = responses.filter(r => r.hintTaken === true).length;

    // FIXED: proper hint computation (Medium/Hard only)
    const takenQuestions = await Content.find({
      _id: { $in: uniqueProblemIds }
    });

    const total_hints_embedded = takenQuestions.filter(
      (q) => q.difficulty === "Medium" || q.difficulty === "Hard"
    ).length;

    const time_spent_seconds = responses.reduce(
      (sum, r) => sum + (r.timeTaken || 0),
      0
    );

    const user = await User.findOne({ user_id: updatedSession.user_id });

    const topic_completion_ratio = Number(
      (((user?.completedTopics?.length || 0) / 13) || 0).toFixed(2)
    );

    const total_questions = questions_attempted;

    // 4. VALIDATIONS (fixed + complete)
    if (questions_attempted > total_questions) {
      return res.status(400).json({ 
        error: "Validation Failed: Attempted count exceeds total available questions." 
      });
    }

    // 3. hints_used <= total_hints
    if (hints_used > total_hints_embedded) {
      return res.status(400).json({ 
        error: "Validation Failed: Used hints count cannot exceed available hints." 
      });
    }

    //check if topic_completion_ratio is between 0 and 1
    if (topic_completion_ratio < 0 || topic_completion_ratio > 1) {
      return res.status(400).json({ 
        error: "Validation Failed: Topic completion ratio must be between 0 and 1." 
      });
    }

    // 5. FINAL PAYLOAD (matches recommendation API contract)
    const payload = {
      student_id: updatedSession.student_id,
      session_id: updatedSession.session_id,
      chapter_id: "grade6_data_handling",
      timestamp: new Date().toISOString(),
      session_status: "completed",

      correct_answers,
      wrong_answers,
      questions_attempted,
      total_questions,
      retry_count,
      hints_used,
      total_hints_embedded,
      time_spent_seconds,
      topic_completion_ratio
    };

    // 6. CALL RECOMMENDATION API
    let recommendationData = null;

    try {
      const response = await fetch("https://kaushik-dev.online/api/recommend/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        recommendationData = await response.json();
      } else {
        console.error("Recommendation API failed:", await response.text());
      }

    } catch (err: any) {
      console.error("Recommendation API error:", err.message);
    }

    console.log("🏁 Session completed + recommendation generated:", session_id);

    // 7. RESPONSE
    return res.status(200).json({
      message: "Session completed successfully!",
      session: updatedSession,
      recommendation: recommendationData
    });

  } catch (error: any) {
    return res.status(500).json({
      error: "Server Error completing session",
      details: error.message
    });
  }
});
export default router;