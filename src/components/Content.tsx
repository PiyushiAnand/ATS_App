import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, BookOpen, CheckCircle, AlertTriangle, ArrowLeft, Lightbulb, RefreshCw } from 'lucide-react';
import ReactConfetti from 'react-confetti';
import { ContentSection, Question } from '../types';
import { cn } from '../lib/utils';

interface ContentProps {
  section: ContentSection;
  onBack: () => void;
  onComplete: (score: number) => void;
  onAnswer: (isCorrect: boolean) => void;
}

export const Content: React.FC<ContentProps> = ({ section, onBack, onComplete, onAnswer }) => {
  const [step, setStep] = useState<'video' | 'examples' | 'assessment' | 'remedial'>('video');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const currentQuestion = section.questions[currentQuestionIndex];

  const handleAnswerSubmit = () => {
    if (selectedOption === null) return;

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
      
      if (finalScore < passThreshold && section.remedialContent) {
        setStep('remedial');
      } else {
        setIsFinished(true);
        if (finalScore >= passThreshold) setShowConfetti(true);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-6">
      {showConfetti && <ReactConfetti recycle={false} numberOfPieces={500} />}
      
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Pathway
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          <NavButton 
            active={step === 'video'} 
            done={['examples', 'assessment', 'remedial'].includes(step) || isFinished}
            icon={<Play className="w-4 h-4" />} 
            label="Video Lesson" 
            onClick={() => setStep('video')}
          />
          <NavButton 
            active={step === 'examples'} 
            done={['assessment', 'remedial'].includes(step) || isFinished}
            icon={<BookOpen className="w-4 h-4" />} 
            label="Examples" 
            onClick={() => setStep('examples')}
          />
          <NavButton 
            active={step === 'assessment'} 
            done={isFinished}
            icon={<CheckCircle className="w-4 h-4" />} 
            label="Assessment" 
            onClick={() => setStep('assessment')}
          />
          {step === 'remedial' && (
            <NavButton 
              active={true} 
              done={false}
              icon={<AlertTriangle className="w-4 h-4" />} 
              label="Remedial Help" 
              onClick={() => {}}
            />
          )}
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {step === 'video' && (
              <motion.div 
                key="video"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-slate-900">{section.title}</h2>
                <div className="aspect-video rounded-3xl overflow-hidden bg-slate-900 shadow-2xl">
                  <iframe 
                    className="w-full h-full"
                    src={section.videoUrl}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <p className="text-slate-600 leading-relaxed text-lg">{section.explanation}</p>
                <button 
                  onClick={() => setStep('examples')}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                >
                  Next: See Examples
                </button>
              </motion.div>
            )}

            {step === 'examples' && (
              <motion.div 
                key="examples"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-slate-900">Worked Examples</h2>
                <div className="grid gap-4">
                  {section.examples.map((ex, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-indigo-100 text-indigo-600 text-xs font-bold px-2 py-1 rounded">Example {i + 1}</span>
                      </div>
                      <p className="text-slate-700">{ex}</p>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => setStep('assessment')}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                >
                  Start Assessment
                </button>
              </motion.div>
            )}

            {step === 'assessment' && !isFinished && (
              <motion.div 
                key="assessment"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900">Quick Check</h2>
                  <span className="text-slate-400 font-medium">Question {currentQuestionIndex + 1} of {section.questions.length}</span>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl">
                  <p className="text-xl font-medium text-slate-800 mb-8">{currentQuestion.text}</p>
                  
                  <div className="grid gap-3">
                    {currentQuestion.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedOption(i)}
                        className={cn(
                          "w-full text-left px-6 py-4 rounded-2xl border transition-all font-medium",
                          selectedOption === i 
                            ? "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm" 
                            : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100"
                        )}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  <div className="mt-8 flex items-center justify-between">
                    <button 
                      onClick={() => setShowHint(!showHint)}
                      className="flex items-center gap-2 text-amber-600 font-semibold text-sm hover:text-amber-700 transition-colors"
                    >
                      <Lightbulb className="w-4 h-4" />
                      {showHint ? 'Hide Hint' : 'Need a Hint?'}
                    </button>
                    <button 
                      disabled={selectedOption === null}
                      onClick={handleAnswerSubmit}
                      className="bg-slate-900 text-white px-8 py-3 rounded-xl font-semibold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Submit Answer
                    </button>
                  </div>

                  <AnimatePresence>
                    {showHint && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-6 overflow-hidden"
                      >
                        <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl text-amber-800 text-sm italic">
                          {currentQuestion.hint}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {step === 'remedial' && (
              <motion.div 
                key="remedial"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="bg-rose-50 border border-rose-100 p-6 rounded-3xl flex items-start gap-4">
                  <AlertTriangle className="w-8 h-8 text-rose-500 shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-rose-900">Let's try a different approach</h3>
                    <p className="text-rose-700 mt-1">It seems you're having a bit of trouble. Here's some remedial content to help you master this concept.</p>
                  </div>
                </div>
                
                <div className="aspect-video rounded-3xl overflow-hidden bg-slate-900 shadow-2xl">
                  <iframe 
                    className="w-full h-full"
                    src={section.remedialContent?.videoUrl}
                    title="Remedial video"
                    allowFullScreen
                  />
                </div>
                <p className="text-slate-600 leading-relaxed text-lg">{section.remedialContent?.explanation}</p>
                
                <button 
                  onClick={() => {
                    setStep('assessment');
                    setCurrentQuestionIndex(0);
                    setScore(0);
                    setSelectedOption(null);
                  }}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Retry Assessment
                </button>
              </motion.div>
            )}

            {isFinished && (
              <motion.div 
                key="finished"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-6"
              >
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-16 h-16" />
                </div>
                <h2 className="text-4xl font-bold text-slate-900">Topic Completed!</h2>
                <p className="text-slate-500 text-xl">
                  You scored <span className="text-indigo-600 font-bold">{score}</span> out of <span className="font-bold">{section.questions.length}</span>
                </p>
                <div className="pt-8">
                  <button 
                    onClick={() => onComplete(score)}
                    className="bg-slate-900 text-white px-12 py-4 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl"
                  >
                    Continue to Pathway
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const NavButton = ({ active, done, icon, label, onClick }: { active: boolean; done: boolean; icon: React.ReactNode; label: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all",
      active ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : 
      done ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
      "bg-white text-slate-500 border border-slate-100 hover:bg-slate-50"
    )}
  >
    <div className={cn(
      "w-8 h-8 rounded-lg flex items-center justify-center",
      active ? "bg-white/20" : done ? "bg-emerald-100" : "bg-slate-100"
    )}>
      {icon}
    </div>
    {label}
    {done && <CheckCircle className="w-4 h-4 ml-auto" />}
  </button>
);
