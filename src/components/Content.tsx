import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, BookOpen, CheckCircle, AlertTriangle, ArrowLeft, Lightbulb, RefreshCw } from 'lucide-react';
import ReactConfetti from 'react-confetti';
import { cn } from '../lib/utils';

// 🔥 Define minimal types (since backend structure differs)
interface Question {
  text: string;
  options: string[];
  correctIndex: number;
  hint?: string;
}

interface ContentSection {
  id: string;
  title: string;
  videoUrl: string;
  explanation: string;
  examples: string[];
  questions: Question[];
  remedialContent?: {
    explanation: string;
    videoUrl: string;
  };
}

interface ContentProps {
  kcId: string;
  order: number;
  onBack: () => void;
  onComplete: (score: number) => void;
  onAnswer: (isCorrect: boolean) => void;
}

export const Content: React.FC<ContentProps> = ({ kcId, order, onBack, onComplete, onAnswer }) => {
  const [section, setSection] = useState<ContentSection | null>(null);
  const [loading, setLoading] = useState(true);

  const [step, setStep] = useState<'video' | 'examples' | 'assessment' | 'remedial'>('video');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // 🔥 Fetch lesson from backend
  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await fetch(`/api/lessons/${kcId}/${order}`, {
          credentials: 'include',
        });

        if (!res.ok) throw new Error('Failed to fetch lesson');

        const data = await res.json();

        // 🔥 Transform backend → frontend format
        const formatted: ContentSection = {
          id: data.kcId,
          title: data.subtopicName,
          videoUrl: data.videoUrl || '',
          explanation: data.learningContent,
          examples: data.exampleText ? [data.exampleText] : [],
          questions: [], // ⚠️ Add later from DB
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

    const isCorrect = selectedOption === currentQuestion.correctIndex;
    onAnswer(isCorrect);

    if (isCorrect) {
      setScore(s => s + 1);
    }

    if (currentQuestionIndex < section.questions.length - 1) {
      setCurrentQuestionIndex(i => i + 1);
      setSelectedOption(null);
      setShowHint(false);
    } else {
      const finalScore = score + (isCorrect ? 1 : 0);
      const passThreshold = section.questions.length * 0.7;

      if (finalScore >= passThreshold) {
        setIsFinished(true);
        setShowConfetti(true);
      } else {
        setIsFinished(true);
      }
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
        {step === 'video' && (
          <motion.div key="video">
            <h2 className="text-2xl font-bold mb-4">{section.title}</h2>

            {section.videoUrl && (
              <div className="aspect-video mb-4">
                <iframe className="w-full h-full" src={section.videoUrl} allowFullScreen />
              </div>
            )}

            <p className="mb-4">{section.explanation}</p>

            <button onClick={() => setStep('examples')} className="bg-indigo-600 text-white px-4 py-2 rounded">
              Next
            </button>
          </motion.div>
        )}

        {step === 'examples' && (
          <motion.div key="examples">
            <h2 className="text-xl font-bold mb-4">Examples</h2>

            {section.examples.map((ex, i) => (
              <div key={i} className="mb-2">{ex}</div>
            ))}

            <button onClick={() => setStep('assessment')} className="bg-indigo-600 text-white px-4 py-2 rounded">
              Start Assessment
            </button>
          </motion.div>
        )}

        {step === 'assessment' && section.questions.length === 0 && (
          <div className="text-center text-slate-500">
            No questions available yet.
          </div>
        )}

        {step === 'assessment' && section.questions.length > 0 && !isFinished && (
          <motion.div key="assessment">
            <p>{currentQuestion.text}</p>

            {currentQuestion.options.map((opt, i) => (
              <button key={i} onClick={() => setSelectedOption(i)}>
                {opt}
              </button>
            ))}

            <button onClick={handleAnswerSubmit}>Submit</button>
          </motion.div>
        )}

        {isFinished && (
          <motion.div key="finished" className="text-center">
            <h2>Completed!</h2>
            <p>Score: {score}</p>

            <button onClick={() => onComplete(score)}>Continue</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};