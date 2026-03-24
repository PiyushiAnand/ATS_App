import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import ReactConfetti from 'react-confetti';

// 🔥 Types
interface Question {
  text: string;
  options: string[];
  hint?: string;
}

interface ContentSection {
  id: string;
  title: string;
  videoUrl: string;
  explanation: string;
  examples: string[];
  questions: Question[];
}

interface ContentProps {
  kcId: string;
  order: number;
  onBack: () => void;
  onComplete: (kcId: string, order: number, score: number) => void;
  onAnswer: (isCorrect: boolean) => void;
}

export const Content: React.FC<ContentProps> = ({
  kcId,
  order,
  onBack,
  onComplete,
  onAnswer
}) => {
  const [section, setSection] = useState<ContentSection | null>(null);
  const [loading, setLoading] = useState(true);

  const [step, setStep] = useState<'video' | 'examples' | 'assessment'>('video');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0); // ⚠️ will remain 0 (no correct answers)
  const [isFinished, setIsFinished] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // 🔥 Fetch lesson + assessment
useEffect(() => {
  const fetchLesson = async () => {
    try {
      // 1️⃣ Fetch lesson
      const res = await fetch(`/api/lessons/${kcId}/${order}`, {
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Failed to fetch lesson');

      const data = await res.json();
      console.log("Lesson data:", data);

      // 🔥 Extract lessonId from lesson response
      const lessonId = data._id;

      if (!lessonId) {
        console.error("Lesson ID missing from lesson API");
        return;
      }

      // 2️⃣ Fetch assessment using lessonId
      let questions: Question[] = [];

      try {
        const assessRes = await fetch(`/api/assessments/lesson/${lessonId}`, {
          credentials: 'include',
        });

        console.log("Assessment status:", assessRes.status);

        if (assessRes.ok) {
          const assessData = await assessRes.json();
          console.log("Assessment data:", assessData);

          questions =
            assessData?.questions?.map((q: any) => ({
              text: q.questionText,   // ✅ matches your Content model
              options: q.options || [],
              hint: q.hint,
            })) || [];
        }
      } catch (err) {
        console.error("Assessment fetch failed:", err);
      }

      console.log("Mapped questions:", questions);

      // 3️⃣ Combine everything
      const formatted: ContentSection = {
        id: data.kcId,
        title: data.subtopicName,
        videoUrl: data.videoUrl || '',
        explanation: data.learningContent,
        examples: data.exampleText ? [data.exampleText] : [],
        questions, // ✅ NOW FILLED
      };

      setSection(formatted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchLesson();
}, [kcId, order]);

  // 🔥 Loading states
  if (loading) {
    return <div className="p-10 text-center">Loading lesson...</div>;
  }

  if (!section) {
    return <div className="p-10 text-center text-red-500">Failed to load lesson</div>;
  }

  const currentQuestion = section.questions[currentQuestionIndex];

  const handleAnswerSubmit = () => {
    if (!currentQuestion || selectedOption === null) return;

    // ⚠️ No correctness check (backend hides answers)
    onAnswer(true); // just mark attempt

    if (currentQuestionIndex < section.questions.length - 1) {
      setCurrentQuestionIndex(i => i + 1);
      setSelectedOption(null);
      setShowHint(false);
    } else {
      setIsFinished(true);
      setShowConfetti(true);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-6">
      {showConfetti && <ReactConfetti recycle={false} numberOfPieces={300} />}

      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <AnimatePresence mode="wait">

        {/* VIDEO */}
        {step === 'video' && (
          <motion.div key="video">
            <h2 className="text-2xl font-bold mb-4">{section.title}</h2>

            {section.videoUrl && (
              <div className="aspect-video mb-4">
                <iframe className="w-full h-full" src={section.videoUrl} allowFullScreen />
              </div>
            )}

            <p className="mb-4">{section.explanation}</p>

            <button
              onClick={() => setStep('examples')}
              className="bg-indigo-600 text-white px-4 py-2 rounded"
            >
              Next
            </button>
          </motion.div>
        )}

        {/* EXAMPLES */}
        {step === 'examples' && (
          <motion.div key="examples">
            <h2 className="text-xl font-bold mb-4">Examples</h2>

            {section.examples.map((ex, i) => (
              <div key={i} className="mb-2">{ex}</div>
            ))}

            <button
              onClick={() => setStep('assessment')}
              className="bg-indigo-600 text-white px-4 py-2 rounded"
            >
              Start Assessment
            </button>
          </motion.div>
        )}

        {/* NO QUESTIONS */}
        {step === 'assessment' && section.questions.length === 0 && (
          <div className="text-center text-slate-500">
            <p>No questions available yet.</p>
            <button
              onClick={() => {
                setIsFinished(true);
                setShowConfetti(true);
                onComplete(kcId, order, score);
              }}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
            >
              Continue
            </button>
          </div>
        )}

        {/* QUESTIONS */}
        {step === 'assessment' && section.questions.length > 0 && !isFinished && (
          <motion.div key="assessment">
            <p className="mb-4">{currentQuestion.text}</p>

            <div className="space-y-2 mb-4">
              {currentQuestion.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedOption(i)}
                  className={`block w-full text-left px-4 py-2 border rounded ${
                    selectedOption === i ? 'bg-indigo-100 border-indigo-500' : ''
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAnswerSubmit}
                className="bg-indigo-600 text-white px-4 py-2 rounded"
              >
                Submit
              </button>

              <button
                onClick={() => setShowHint(true)}
                className="text-yellow-600"
              >
                Hint
              </button>
            </div>

            {showHint && currentQuestion.hint && (
              <p className="mt-3 text-yellow-600">{currentQuestion.hint}</p>
            )}
          </motion.div>
        )}

        {/* FINISHED */}
        {isFinished && (
          <motion.div key="finished" className="text-center">
            <h2 className="text-2xl font-bold mb-2">Completed!</h2>

            <p className="mb-4">
              You attempted all questions 🎉
            </p>

            <button
              onClick={() => onComplete(kcId, order, score)}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Continue
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};