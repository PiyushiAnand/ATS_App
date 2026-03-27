import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Lock, PlayCircle, Trophy, BarChart3 } from 'lucide-react';
import { KNOWLEDGE_COMPONENTS, KC_LAST_ORDER } from '../services/bkt';
import { LearnerState } from '../types';
const API = "https://ats-app-2.onrender.com";
interface Lesson {
  _id: string;
  kcId: string;
  subtopicName: string;
  order: number;
}

interface PathwayProps {
  learnerState: LearnerState;
  onSelectTopic: (kcId: string, order: number) => void;
}

export const Pathway: React.FC<PathwayProps> = ({ learnerState, onSelectTopic }) => {
  const [lessonsMap, setLessonsMap] = useState<Record<string, Lesson[]>>({});
  const [masteryState, setMasteryState] = useState(learnerState.mastery);
  const [completedTopicsState, setCompletedTopicsState] = useState(
    learnerState.completedTopics
  );

  // 🔥 Fetch all subtopics for each KC
  useEffect(() => {
    const fetchLessons = async () => {
      const map: Record<string, Lesson[]> = {};

      for (const kc of KNOWLEDGE_COMPONENTS) {
        try {
          const res = await fetch(`${API}/api/lessons/${kc.id}`, {
            credentials: 'include',
          });
          console.log(`Fetching lessons for ${kc.id}, status:`, res.status);

          if (!res.ok) throw new Error(`Failed to fetch lessons for ${kc.id}`);
          const data = await res.json();
          map[kc.id] = data;
        } catch (err) {
          console.error('Failed for', kc.id);
          map[kc.id] = [];
        }
      }

      setLessonsMap(map);
    };

    fetchLessons();
  }, []);

  const fetchMastery = async () => { 
    try { 
      const res = await fetch(`${API}/api/mastery/get_mastery`, { credentials: 'include', }); 
    if (!res.ok) throw new Error('Failed to fetch mastery'); 
    const data = await res.json(); console.log("MASTERYYYY:", data); 
    setMasteryState(data.mastery || {}); setCompletedTopicsState(data.completedTopics || []); 
  } 
    catch (err) { console.error('Mastery fetch failed:', err); } 
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Learning Pathway</h2>
          <p className="text-slate-500 mt-1">Master each concept to unlock the next level.</p>
        </div>

        <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="text-right">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Overall Progress
            </p>
            <p className="text-xl font-bold text-indigo-600">
              {Math.round(
                (learnerState.completedTopics.length / 13) * 100
              )}
              %
            </p>
          </div>
          <Trophy className="w-8 h-8 text-amber-400" />
        </div>
      </div>

      {/* KC LIST */}
      <div className="space-y-8">
        {KNOWLEDGE_COMPONENTS.map((kc, index) => {
          learnerState.mastery[kc.id] = masteryState[kc.id] || kc.pL0; // Update mastery from state
          const mastery = learnerState.mastery[kc.id] || kc.pL0;

          // KC locking
          const prevKC = KNOWLEDGE_COMPONENTS[index - 1];
          const prevLessons = prevKC ? (lessonsMap[prevKC.id] || []).slice().sort((a, b) => a.order - b.order) : [];
          const prevKCCompleted =
            index === 0 ||
            learnerState.completedTopics.includes(
              `${prevKC.id}-${KC_LAST_ORDER[prevKC.id]}`
            );

          const isKCLocked = !prevKCCompleted;
          
          const lessons = (lessonsMap[kc.id] || []).slice().sort((a, b) => a.order - b.order);

          return (
            <motion.div
              key={kc.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-6 rounded-3xl border ${
                isKCLocked ? 'bg-slate-50 opacity-60' : 'bg-white shadow-sm'
              }`}
            >
              {/* KC HEADER */}
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold">{kc.title}</h3>

                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-500">
                    {Math.round(mastery * 100)}%
                  </span>
                </div>
              </div>

              <p className="text-sm text-slate-500 mb-4">{kc.description}</p>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-slate-100 rounded-full mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${mastery * 100}%` }}
                  className="h-full bg-indigo-500"
                />
              </div>

              {/* 🔥 SUBTOPICS */}
              <div className="space-y-2">
                {lessons.map((lesson, i) => {
                  console.log('Checking completion for', `${kc.id}-${lesson.order}`);
                  console.log('Completed topics:', learnerState.completedTopics);
                  let isLocked = false;
                  if (lesson.order === 1) {
                    isLocked = isKCLocked;
                  } else {
                    isLocked = !learnerState.completedTopics.includes(`${kc.id}-${lesson.order - 1}`);
                  }
                  const isCompleted =
                    learnerState.completedTopics.includes(`${kc.id}-${lesson.order}`);

                  return (
                    <div
                      key={lesson._id}
                      onClick={() =>
                        !isLocked && onSelectTopic(kc.id, lesson.order)
                      }
                      className={`flex justify-between items-center px-4 py-2 rounded-lg border ${
                        isLocked
                          ? 'bg-slate-50 opacity-50'
                          : 'hover:bg-indigo-50 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isCompleted ? (
                          <CheckCircle2 className="text-green-500 w-4 h-4" />
                        ) : isLocked ? (
                          <Lock className="text-slate-400 w-4 h-4" />
                        ) : (
                          <PlayCircle className="text-indigo-500 w-4 h-4" />
                        )}

                        <span className="text-sm">
                          {lesson.subtopicName}
                        </span>
                      </div>

                      {!isLocked && (
                        <span className="text-xs text-slate-400">
                          Start →
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};