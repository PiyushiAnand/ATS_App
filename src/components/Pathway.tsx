import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Circle, Lock, PlayCircle, Trophy, BarChart3 } from 'lucide-react';
import { KNOWLEDGE_COMPONENTS } from '../services/bkt';
import { LearnerState } from '../types';

interface PathwayProps {
  learnerState: LearnerState;
  onSelectTopic: (topicId: string) => void;
}

export const Pathway: React.FC<PathwayProps> = ({ learnerState, onSelectTopic }) => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Learning Pathway</h2>
          <p className="text-slate-500 mt-1">Master each concept to unlock the next level.</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="text-right">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overall Progress</p>
            <p className="text-xl font-bold text-indigo-600">
              {Math.round((learnerState.completedTopics.length / KNOWLEDGE_COMPONENTS.length) * 100)}%
            </p>
          </div>
          <Trophy className="w-8 h-8 text-amber-400" />
        </div>
      </div>

      <div className="relative space-y-8">
        {/* Vertical Line */}
        <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-slate-200" />

        {KNOWLEDGE_COMPONENTS.map((kc, index) => {
          const isCompleted = learnerState.completedTopics.includes(kc.id);
          const isLocked = index > 0 && !learnerState.completedTopics.includes(KNOWLEDGE_COMPONENTS[index - 1].id);
          const mastery = learnerState.mastery[kc.id] || kc.pL0;

          return (
            <motion.div
              key={kc.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative flex items-start gap-8 p-6 rounded-3xl border transition-all ${
                isLocked 
                  ? 'bg-slate-50 border-slate-100 opacity-60 grayscale' 
                  : 'bg-white border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-100 cursor-pointer'
              }`}
              onClick={() => !isLocked && onSelectTopic(kc.id)}
            >
              {/* Icon / Status */}
              <div className={`relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                isCompleted ? 'bg-emerald-50 text-emerald-600' : 
                isLocked ? 'bg-slate-200 text-slate-400' : 'bg-indigo-50 text-indigo-600'
              }`}>
                {isCompleted ? <CheckCircle2 className="w-8 h-8" /> : 
                 isLocked ? <Lock className="w-8 h-8" /> : <PlayCircle className="w-8 h-8" />}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-slate-900">{kc.title}</h3>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-semibold text-slate-500">
                      Mastery: {Math.round(mastery * 100)}%
                    </span>
                  </div>
                </div>
                <p className="text-slate-500 text-sm mb-4">{kc.description}</p>
                
                {/* Progress Bar */}
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${mastery * 100}%` }}
                    className={`h-full ${isCompleted ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                  />
                </div>
              </div>

              {!isLocked && (
                <div className="self-center">
                  <ArrowRight className="w-6 h-6 text-slate-300" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

const ArrowRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);
