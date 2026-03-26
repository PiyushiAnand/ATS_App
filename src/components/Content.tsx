import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import ReactConfetti from 'react-confetti';
import { seedRemedial } from '../data/seedRemedial';

/* =========================
   🎬 SIMPLE ANIMATION COMPONENTS
========================= */
const TallyAnimation = ({ count = 12 }: { count?: number }) => {
  const fullGroups = Math.floor(count / 5);
  const remainder = count % 5;

  // Staggered animation wrapper
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const lineVariants = {
    hidden: { pathLength: 0 },
    show: { pathLength: 1, transition: { duration: 0.3, ease: "easeOut" } },
  };

  return (
    <div className="p-6 bg-slate-50 border rounded-xl mt-4 shadow-sm">
      <h3 className="font-semibold text-slate-700 mb-3">Tally Count: {count}</h3>
      <motion.div
        className="flex flex-wrap gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Render groups of 5 */}
        {Array.from({ length: fullGroups }).map((_, gIdx) => (
          <svg key={`group-${gIdx}`} width="70" height="60" className="overflow-visible">
            {/* 4 Vertical Lines */}
            {[0, 1, 2, 3].map((i) => (
              <motion.line
                key={i}
                x1={15 + i * 12}
                y1="10"
                x2={15 + i * 12}
                y2="50"
                stroke="#4f46e5"
                strokeWidth="4"
                strokeLinecap="round"
                variants={lineVariants}
              />
            ))}
            {/* 1 Slash across */}
            <motion.line
              x1="5"
              y1="45"
              x2="65"
              y2="15"
              stroke="#e11d48"
              strokeWidth="4"
              strokeLinecap="round"
              variants={lineVariants}
            />
          </svg>
        ))}

        {/* Render leftover tallies */}
        {remainder > 0 && (
          <svg width="70" height="60" className="overflow-visible">
            {Array.from({ length: remainder }).map((_, i) => (
              <motion.line
                key={`rem-${i}`}
                x1={15 + i * 12}
                y1="10"
                x2={15 + i * 12}
                y2="50"
                stroke="#4f46e5"
                strokeWidth="4"
                strokeLinecap="round"
                variants={lineVariants}
              />
            ))}
          </svg>
        )}
      </motion.div>
    </div>
  );
};

const PictographAnimation = ({ count = 7, icon = "🍎" }: { count?: number; icon?: string }) => {
  return (
    <div className="p-6 bg-slate-50 border rounded-xl mt-4 shadow-sm">
      <h3 className="font-semibold text-slate-700 mb-3">Pictograph Dataset</h3>
      <motion.div
        className="flex flex-wrap gap-2 text-3xl"
        initial="hidden"
        animate="show"
        variants={{
          show: { transition: { staggerChildren: 0.1 } },
        }}
      >
        {Array.from({ length: count }).map((_, i) => (
          <motion.span
            key={i}
            variants={{
              hidden: { scale: 0, opacity: 0 },
              show: { scale: 1, opacity: 1 },
            }}
            whileHover={{ scale: 1.2 }}
            className="cursor-pointer"
          >
            {icon}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
};

interface BarItem {
  label: string;
  value: number;
  color?: string;
  valueB?: number; // Used for Double Bar Charts
}

/* =========================
   📊 ENHANCED BAR GRAPH
========================= */
const BarGraphAnimation = ({ data }: { data?: BarItem[] }) => {
  const fallbackData: BarItem[] = [
    { label: "2021", value: 50 },
    { label: "2022", value: 70 },
    { label: "2023", value: 60 },
  ];

  const chartData = data || fallbackData;
  const maxValue = Math.ceil(Math.max(...chartData.map((d) => d.value)) / 10) * 10 || 10;
  
  const gridSteps = [0, maxValue * 0.25, maxValue * 0.5, maxValue * 0.75, maxValue];

  return (
    <div className="p-8 bg-white border border-slate-200 rounded-2xl mt-6 shadow-sm">
      <h3 className="font-bold text-slate-800 mb-8 flex items-center gap-2">
        <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
        Data Trends
      </h3>

      {/* Increased height to 72 to give labels more breathing room */}
      <div className="flex h-72 relative">
        {/* Y-Axis Labels & Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {gridSteps.reverse().map((step, i) => (
            <div key={i} className="flex items-center w-full border-b border-slate-100 h-0 relative">
              <span className="absolute -left-10 text-[10px] font-medium text-slate-400 w-8 text-right">
                {Math.round(step)}
              </span>
            </div>
          ))}
        </div>

        {/* Bars Container - Added padding-bottom for labels */}
        <div className="flex-1 flex items-end justify-around px-4 z-10 pb-8">
          {chartData.map((item, i) => {
            const heightPercentage = (item.value / maxValue) * 100;

            return (
              // KEY FIX: Added h-full and justify-end here
              <div key={i} className="group flex flex-col items-center w-full h-full relative justify-end">
                <motion.div
                  className="w-12 rounded-t-lg bg-gradient-to-t from-indigo-600 to-indigo-400 shadow-lg shadow-indigo-100 relative"
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPercentage}%` }}
                  transition={{ duration: 1, delay: i * 0.1, ease: [0.33, 1, 0.68, 1] }}
                  whileHover={{ scaleX: 1.05, filter: "brightness(1.1)" }}
                >
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded shadow-xl pointer-events-none whitespace-nowrap">
                    Value: {item.value}
                  </div>
                </motion.div>
                
                {/* Labels now sit comfortably in the padding area */}
                <div className="absolute bottom-0 text-xs font-semibold text-slate-500 pt-2">
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* =========================
   📊 ENHANCED DOUBLE BAR GRAPH
========================= */
const DoubleBarGraphAnimation = ({ data }: { data?: BarItem[] }) => {
  const fallbackData: BarItem[] = [
    { label: "Maths", value: 70, valueB: 85 },
    { label: "Science", value: 80, valueB: 75 },
    { label: "English", value: 65, valueB: 70 },
  ];

  const chartData = (data && data.length > 0) ? data : fallbackData;
  
  // Safe Max Value calculation to prevent -Infinity or 0 errors
  const rawMax = Math.max(...chartData.flatMap((d) => [d.value || 0, d.valueB || 0]));
  const maxValue = rawMax > 0 ? Math.ceil(rawMax / 10) * 10 : 100;

  const gridSteps = [0, maxValue * 0.5, maxValue];

  return (
    <div className="p-8 bg-white border border-slate-200 rounded-2xl mt-6 shadow-sm">
      <div className="flex justify-between items-center mb-10">
        <h3 className="font-bold text-slate-800">Performance Comparison</h3>
        
        {/* Legend */}
        <div className="flex gap-4 text-[10px] font-bold uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-indigo-500" />
            <span className="text-slate-500">Term 1</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-rose-500" />
            <span className="text-slate-500">Term 2</span>
          </div>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="flex h-72 relative border-l border-slate-200 ml-6">
        
        {/* Y-Axis Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {gridSteps.slice().reverse().map((step, i) => (
            <div key={i} className="flex items-center w-full border-t border-slate-100 h-0 relative">
              <span className="absolute -left-10 text-[10px] font-bold text-slate-400 w-8 text-right">
                {Math.round(step)}
              </span>
            </div>
          ))}
        </div>

        {/* Bars Container */}
        <div className="flex-1 flex items-end justify-around px-2 z-10 pb-10">
          {chartData.map((item, i) => (
            <div key={i} className="flex flex-col items-center h-full justify-end relative">
              
              {/* FIXED: This wrapper now has h-full so children can use % height */}
              <div className="flex items-end gap-1 h-full">
                
                {/* Bar A (Term 1) */}
                <motion.div
                  className="w-8 rounded-t-md bg-gradient-to-t from-indigo-600 to-indigo-400 shadow-md shadow-indigo-100"
                  initial={{ height: 0 }}
                  animate={{ height: `${(item.value / maxValue) * 100}%` }}
                  transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                />

                {/* Bar B (Term 2) */}
                <motion.div
                  className="w-8 rounded-t-md bg-gradient-to-t from-rose-600 to-rose-400 shadow-md shadow-rose-100"
                  initial={{ height: 0 }}
                  animate={{ height: `${((item.valueB || 0) / maxValue) * 100}%` }}
                  transition={{ duration: 1, delay: (i * 0.1) + 0.2, ease: "easeOut" }}
                />
              </div>

              {/* Subject Label */}
              <div className="absolute bottom-0 text-[11px] font-bold text-slate-600 bg-slate-50 border border-slate-100 px-3 py-1 rounded-full whitespace-nowrap translate-y-2">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


interface PieItem {
  label: string;
  value: number;
  color?: string;
}

const PieChartAnimation = ({ data }: { data?: PieItem[] }) => {
  // Default data if none is provided in the config
  const defaultData: PieItem[] = [
    { label: "Cricket", value: 45 },
    { label: "Football", value: 30 },
    { label: "Tennis", value: 15 },
    { label: "Basketball", value: 10 },
  ];

  const chartData = data && data.length > 0 ? data : defaultData;
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  // Default vibrant colors matching your Tailwind palette
  const colors = ["#4f46e5", "#e11d48", "#10b981", "#f59e0b", "#0ea5e9", "#8b5cf6"];

  // Helper function to draw the SVG wedge paths
  const createWedge = (startAngle: number, endAngle: number, radius: number) => {
    // Convert degrees to radians and offset by -90 so the first slice starts at the top (12 o'clock)
    const start = (startAngle - 90) * (Math.PI / 180);
    const end = (endAngle - 90) * (Math.PI / 180);

    // Center point of the SVG
    const cx = 100;
    const cy = 100;

    const x1 = cx + radius * Math.cos(start);
    const y1 = cy + radius * Math.sin(start);
    const x2 = cx + radius * Math.cos(end);
    const y2 = cy + radius * Math.sin(end);

    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

    // SVG Path: Move to center -> Line to arc start -> Arc -> Close path
    return `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  let currentAngle = 0;

  return (
    <div className="p-6 bg-slate-50 border rounded-xl mt-4 shadow-sm flex flex-col md:flex-row items-center gap-8">
      <div className="flex-1">
        <h3 className="font-semibold text-slate-700 mb-4">Data Distribution</h3>
        
        {/* Legend */}
        <motion.div 
          className="flex flex-col gap-2"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        >
          {chartData.map((item, i) => (
            <motion.div 
              key={`legend-${i}`} 
              className="flex items-center gap-2"
              variants={{
                hidden: { opacity: 0, x: -10 },
                show: { opacity: 1, x: 0 }
              }}
            >
              <div 
                className="w-4 h-4 rounded-sm" 
                style={{ backgroundColor: item.color || colors[i % colors.length] }} 
              />
              <span className="text-sm font-medium text-slate-600">
                {item.label} ({Math.round((item.value / total) * 100)}%)
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* SVG Pie Chart */}
      <div className="relative w-48 h-48 drop-shadow-md">
        <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
          {chartData.map((item, i) => {
            const sliceAngle = (item.value / total) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + sliceAngle;
            currentAngle += sliceAngle; // Advance angle for next slice

            return (
              <motion.path
                key={`slice-${i}`}
                d={createWedge(startAngle, endAngle, 95)}
                fill={item.color || colors[i % colors.length]}
                stroke="#f8fafc" // Matches slate-50 background for a clean gap
                strokeWidth="2"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.15,
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }}
                // Transform origin must be the center of the viewBox to scale correctly
                style={{ transformOrigin: "100px 100px" }}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
};
/* =========================
   🎬 ANIMATION RENDERER
========================= */
const AnimationRenderer = ({ type, config }: { type: string; config?: any }) => {
  switch (type) {
    case "tally-build":
      return <TallyAnimation count={config?.count} />;
    case "pictograph-scale":
      return <PictographAnimation count={config?.count} icon={config?.icon} />;
    case "bar-grow":
      return <BarGraphAnimation data={config?.data} />;
    case "double-bar-compare":
      return <DoubleBarGraphAnimation data={config?.data} />;
    case "pie-chart": // ✅ Add this case!
      return <PieChartAnimation data={config?.data} />;
    default:
      return null;
  }
};

/* =========================
   TYPES
========================= */
interface Question {
  _id: string;
  text: string;
  options: string[];
  hint?: string;
  animation?: {
    type: string;
    config?: any;
  };
}

interface ContentSection {
  id: string;
  title: string;
  videoUrl: string;
  explanation: string;
  examples: string[];
  questions: Question[];

  // ✅ NEW
  animation?: {
    type: string;
    config?: any;
  };
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

  /* =========================
     FETCH LESSON
  ========================= */
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
                hint: q.hint?.text || "",
                animation: q.animation || null,
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
          animation: data.animation || null,
        });

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [kcId, order]);

  /* =========================
     RESET PER QUESTION
  ========================= */
  useEffect(() => {
    setQuestionStartTime(Date.now());
    setAttemptCount(1);
    setIsCorrect(null);
    setShowFeedback(false);
    setSelectedOption(null);
    setShowHint(false);
  }, [currentQuestionIndex]);

  /* =========================
     TIMER
  ========================= */
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

  /* =========================
     SUBMIT
  ========================= */
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

            {section.animation?.type && (
              <AnimationRenderer
                type={section.animation.type}
                config={section.animation.config}
              />
            )}

            <button
              onClick={() => setStep('assessment')}
              className="bg-indigo-600 text-white px-4 py-2 rounded"
            >
              Start Assessment
            </button>
          </motion.div>
        )}

        {/* ASSESSMENT */}
        {step === 'assessment' && section.questions.length > 0 && !isFinished && (
          <motion.div key="assessment">
            <p className="mb-4">{currentQuestion.text}</p>

            {currentQuestion.animation?.type && (
              <div className="mb-6 pointer-events-none"> 
                {/* pointer-events-none ensures users don't accidentally interact with chart tooltips when trying to answer */}
                <AnimationRenderer
                  type={currentQuestion.animation.type}
                  config={currentQuestion.animation.config}
                />
              </div>
            )}
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
                <button onClick={handleAnswerSubmit} className="bg-indigo-600 text-white px-4 py-2 rounded">
                  Submit
                </button>
              )}

              {isCorrect && (
                <button onClick={handleNext} className="bg-green-600 text-white px-4 py-2 rounded">
                  Next
                </button>
              )}

              {hintUnlocked && !isCorrect && (
                <button onClick={() => setShowHint(true)} className="text-yellow-600">
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

        {/* REMEDIAL */}
        {step === 'remedial' && (
          <motion.div key="remedial">
            {(() => {
              const remedialData = seedRemedial.find(r => r.kcId === kcId);
              if (!remedialData) return <div>No remedial content found.</div>;

              return (
                <div>
                  <h2 className="text-2xl font-bold mb-4">{remedialData.title}</h2>

                  {remedialData.videoUrl && (
                    <div className="aspect-video mb-4">
                      <iframe className="w-full h-full" src={remedialData.videoUrl} />
                    </div>
                  )}

                  <p className="mb-6 whitespace-pre-line">{remedialData.explanation}</p>

                  <button
                    onClick={() => onRestartKC(kcId)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded"
                  >
                    Restart KC
                  </button>
                </div>
              );
            })()}
          </motion.div>
        )}

        {/* FINISHED */}
        {isFinished && (
          <motion.div key="finished" className="text-center">
            {isLastOrder && kcMastery < 0.8 ? (
              <>
                <h2 className="text-2xl font-bold mb-2">Needs Review</h2>
                <button
                  onClick={() => {
                    setIsFinished(false);
                    setStep('remedial');
                    setShowConfetti(false);
                  }}
                  className="bg-indigo-600 text-white px-6 py-3 rounded"
                >
                  Go to Remedial
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