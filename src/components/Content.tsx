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
  const [hintUnlocked, setHintUnlocked] = useState(false);
  const [timer, setTimer] = useState(0);

  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // 🔥 Fetch lesson + assessment
  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await fetch(`/api/lessons/${kcId}/${order}`, {
          credentials: 'include',
        });

        if (!res.ok) throw new Error('Failed to fetch lesson');

        const data = await res.json();
        const lessonId = data._id;

        let questions: Question[] = [];

        if (lessonId) {
          try {
            const assessRes = await fetch(`/api/assessments/lesson/${lessonId}`, {
              credentials: 'include',
            });

            if (assessRes.ok) {
              const assessData = await assessRes.json();

              questions =
                assessData?.questions?.slice(0, 5).map((q: any) => ({
                  text: q.questionText,
                  options: q.options || [],
                  hint: q.hint,
                })) || [];
            }
          } catch (err) {
            console.error("Assessment fetch failed:", err);
          }
        }

        const formatted: ContentSection = {
          id: data.kcId,
          title: data.subtopicName,
          videoUrl: data.videoUrl || '',
          explanation: data.learningContent,
          examples: data.exampleText ? [data.exampleText] : [],
          questions,
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

  // 🔥 Timer logic (only unlock hint, don't show it)
  useEffect(() => {
    setShowHint(false);
    setHintUnlocked(false);
    setTimer(0);

    let interval: NodeJS.Timeout;
    const qNum = currentQuestionIndex + 1;

    if (qNum >= 3) {
      interval = setInterval(() => {
        setTimer((prev) => {
          const newTime = prev + 1;

          if ((qNum === 3 || qNum === 4) && newTime >= 10) {
            setHintUnlocked(true);
            clearInterval(interval);
          }

          if (qNum === 5 && newTime >= 20) {
            setHintUnlocked(true);
            clearInterval(interval);
          }

          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentQuestionIndex]);

  if (loading) {
    return <div className="p-10 text-center">Loading lesson...</div>;
  }

  if (!section) {
    return <div className="p-10 text-center text-red-500">Failed to load lesson</div>;
  }

  const currentQuestion = section.questions[currentQuestionIndex];

  const handleAnswerSubmit = () => {
    if (!currentQuestion || selectedOption === null) return;

    onAnswer(true);

    if (currentQuestionIndex < section.questions.length - 1) {
      setCurrentQuestionIndex(i => i + 1);
      setSelectedOption(null);
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

            {/* Countdown */}
            {(currentQuestionIndex + 1 >= 3) && !hintUnlocked && (
              <p className="text-sm text-gray-500 mb-2">
                Hint available in{" "}
                {(currentQuestionIndex + 1 === 5 ? 20 : 10) - timer}s
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleAnswerSubmit}
                className="bg-indigo-600 text-white px-4 py-2 rounded"
              >
                Submit
              </button>

              {/* Hint button ONLY after unlock */}
              {hintUnlocked && (
                <button
                  onClick={() => setShowHint(true)}
                  className="text-yellow-600"
                >
                  Show Hint
                </button>
              )}
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