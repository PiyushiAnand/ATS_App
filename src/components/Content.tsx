import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import ReactConfetti from 'react-confetti';
import { seedRemedial } from '../data/seedRemedial';

interface Question {
  _id: string;
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
  kcMastery: number;
  isLastOrder: boolean;
  onBack: () => void;
  onComplete: (kcId: string, order: number, score: number) => void;
  onAnswer: (isCorrect: boolean) => void;
  onRestartKC: (kcId: string) => void;
}

export const Content: React.FC<ContentProps> = ({
  kcId,
  order,
  kcMastery,
  isLastOrder,
  onBack,
  onComplete,
  onAnswer,
  onRestartKC
}) => {
  const [section, setSection] = useState<ContentSection | null>(null);
  const [loading, setLoading] = useState(true);

  const [step, setStep] = useState<'video' | 'examples' | 'assessment' | 'remedial'>('video');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [hintUnlocked, setHintUnlocked] = useState(false);
  const [timer, setTimer] = useState(0);

  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());

  const [attemptCount, setAttemptCount] = useState(1);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // FETCH LESSON
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
          const assessRes = await fetch(`/api/assessments/lesson/${lessonId}`, {
            credentials: 'include',
          });

          if (assessRes.ok) {
            const assessData = await assessRes.json();

            questions =
              assessData?.questions?.map((q: any) => ({
                _id: q._id,
                text: q.questionText,
                options: q.options || [],
                hint: q.hint?.text || "", // ✅ FIXED
              })) || [];
          }
        }

        

        setSection({
          id: data.kcId,
          title: data.subtopicName,
          videoUrl: data.videoUrl || '',
          explanation: data.learningContent,
          examples: data.exampleText ? [data.exampleText] : [],
          questions,
        });

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [kcId, order]);

  // RESET PER QUESTION
  useEffect(() => {
    setQuestionStartTime(Date.now());
    setAttemptCount(1);
    setIsCorrect(null);
    setShowFeedback(false);
    setSelectedOption(null);
    setShowHint(false);
  }, [currentQuestionIndex]);

  // TIMER (hint unlock)
  useEffect(() => {
    setHintUnlocked(false);
    setTimer(0);

    let interval: NodeJS.Timeout;
    const qNum = currentQuestionIndex + 1;

    if (qNum >= 3) {
      interval = setInterval(() => {
        setTimer(prev => {
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

    return () => interval && clearInterval(interval);
  }, [currentQuestionIndex]);

  if (loading) return <div className="p-10 text-center">Loading lesson...</div>;
  if (!section) return <div className="p-10 text-center text-red-500">Failed</div>;

  const currentQuestion = section.questions[currentQuestionIndex];
  // SUBMIT
  const handleAnswerSubmit = async () => {
    if (!currentQuestion || selectedOption === null) return;

    const timeTaken = Math.floor((Date.now() - questionStartTime) / 1000);

    try {
      const res = await fetch('/api/responses/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          attemptId: null,
          questionId: currentQuestion._id,
          kcId,
          selectedOption: currentQuestion.options[selectedOption],
          timeTaken,
          hintCount: showHint ? 1 : 0,
          attemptCount
        })
      });

      const data = await res.json();

      setIsCorrect(data.correct);
      setShowFeedback(true);

      if (data.correct) {
        setScore(prev => prev + 1);
        onAnswer(true);
      } else {
        setAttemptCount(prev => prev + 1);
        onAnswer(false);
      }

    } catch (err) {
      console.error(err);
    }
  };

  // NEXT
  const handleNext = () => {
    if (currentQuestionIndex < section.questions.length - 1) {
      setCurrentQuestionIndex(i => i + 1);
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
        <iframe className="w-full h-full" src={section.videoUrl} />
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
        {step === 'assessment' && section.questions.length > 0 && !isFinished && (
          <motion.div key="assessment">
            <p className="mb-4">{currentQuestion.text}</p>

            <div className="space-y-2 mb-4">
              {currentQuestion.options.map((opt, i) => (
                <button
                  key={i}
                  disabled={isCorrect === true}
                  onClick={() => setSelectedOption(i)}
                  className={`block w-full text-left px-4 py-2 border rounded ${
                    selectedOption === i
                      ? isCorrect
                        ? 'bg-green-100 border-green-500'
                        : 'bg-indigo-100 border-indigo-500'
                      : ''
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            {(currentQuestionIndex + 1 >= 3) && !hintUnlocked && (
              <p className="text-sm text-gray-500 mb-2">
                Hint in {(currentQuestionIndex + 1 === 5 ? 20 : 10) - timer}s
              </p>
            )}

            <div className="flex gap-3">
              {!isCorrect && (
                <button
                  onClick={handleAnswerSubmit}
                  className="bg-indigo-600 text-white px-4 py-2 rounded"
                >
                  Submit
                </button>
              )}

              {isCorrect && (
                <button
                  onClick={handleNext}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Next
                </button>
              )}

              {hintUnlocked && !isCorrect && (
                <button
                  onClick={() => setShowHint(true)}
                  className="text-yellow-600"
                >
                  Show Hint
                </button>
              )}
            </div>

            {showFeedback && (
              <div className="mt-4">
                {isCorrect ? (
                  <div className="text-green-600 text-lg">✅ Correct!</div>
                ) : (
                  <div className="text-red-500">❌ Incorrect, try again</div>
                )}
              </div>
            )}

            {showHint && currentQuestion.hint && (
              <div className="mt-4 p-4 bg-yellow-100 border-l-4 border-yellow-500">
                <p className="font-bold">Hint:</p>
                <p>{currentQuestion.hint}</p>
              </div>
            )}
          </motion.div>
        )}

        {step === 'remedial' && (
          <motion.div key="remedial">
            {(() => {
              const remedialData = seedRemedial.find(r => r.kcId === kcId);
              if (!remedialData) {
                return (
                  <div className="text-center">
                    <p>No remedial content found.</p>
                    <button
                      onClick={() => onRestartKC(kcId)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded mt-4"
                    >
                      Restart KC
                    </button>
                  </div>
                );
              }
              return (
                <div>
                  <h2 className="text-2xl font-bold mb-4">{remedialData.title}</h2>
                  {remedialData.videoUrl && (
                    <div className="aspect-video mb-4">
                      <iframe className="w-full h-full" src={remedialData.videoUrl} />
                    </div>
                  )}
                  <p className="mb-6 text-slate-700 whitespace-pre-line">{remedialData.explanation}</p>
                  <button
                    onClick={() => onRestartKC(kcId)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded font-bold hover:bg-indigo-700"
                  >
                    Restart Knowledge Component
                  </button>
                </div>
              );
            })()}
          </motion.div>
        )}

        {isFinished && (
          <motion.div key="finished" className="text-center">
            {isLastOrder && kcMastery < 0.8 ? (
              <>
                <h2 className="text-2xl font-bold mb-2">Needs Review</h2>
                <p className="mb-6 text-slate-600">Your mastery is {Math.round(kcMastery * 100)}%, which is below the 80% threshold. Let's review the core concepts.</p>
                <button
                  onClick={() => {
                    setIsFinished(false);
                    setStep('remedial');
                    setShowConfetti(false);
                  }}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700"
                >
                  Go to Remedial Content
                </button>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-2">Completed!</h2>
                <button
                  onClick={() => onComplete(kcId, order, score)}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Continue
                </button>
              </>
            )}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};