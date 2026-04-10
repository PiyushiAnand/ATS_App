import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Target, 
  Zap, 
  Clock, 
  RefreshCcw, 
  HelpCircle, 
  ArrowRight,
  TrendingUp,
  Brain,
  CheckCircle2,
  X
} from 'lucide-react';

interface RecommendationData {
  student_id: string;
  chapter_id: string;
  performance_score: number;
  confidence_score: number;
  learning_state: string;
  diagnosis: {
    accuracy: number;
    hint_dependency: string;
    retry_behavior: string;
    time_efficiency: string;
    history: {
      past_attempts: number;
      trend: string;
    };
  };
  recommendation: {
    type: string;
    reason: string;
    next_steps: string[];
  };
}

interface RecommendationModalProps {
  data: RecommendationData | null;
  onClose: () => void;
}

export const RecommendationModal: React.FC<RecommendationModalProps> = ({ data, onClose }) => {
  if (!data) return null;

  const getLearningStateColor = (state: string) => {
    switch (state.toLowerCase()) {
      case 'expert': return 'from-emerald-500 to-teal-600';
      case 'moderate': return 'from-indigo-500 to-purple-600';
      case 'struggling': return 'from-rose-500 to-orange-600';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  const getMetricIcon = (label: string) => {
    switch (label.toLowerCase()) {
      case 'accuracy': return <Target className="w-4 h-4" />;
      case 'hint_dependency': return <HelpCircle className="w-4 h-4" />;
      case 'retry_behavior': return <RefreshCcw className="w-4 h-4" />;
      case 'time_efficiency': return <Clock className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  const formatPathId = (id: string) => {
    return id.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden relative border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header/Banner */}
        <div className={`p-8 bg-gradient-to-br ${getLearningStateColor(data.learning_state)} text-white relative overflow-hidden`}>
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Brain className="w-32 h-32 rotate-12" />
          </div>
          
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                Session Summary
              </span>
              <span className="text-white/80 text-sm font-medium">•</span>
              <span className="text-white/90 text-sm font-medium">{formatPathId(data.chapter_id)}</span>
            </div>
            
            <h2 className="text-4xl font-black mb-6 flex items-center gap-3">
              {data.learning_state === 'moderate' ? 'Solid Progress!' : 'Mastery Achieved!'}
              <Trophy className="w-8 h-8 text-yellow-300" />
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <p className="text-white/70 text-xs font-bold uppercase mb-1">Performance</p>
                <p className="text-2xl font-black">{(data.performance_score * 100).toFixed(1)}%</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <p className="text-white/70 text-xs font-bold uppercase mb-1">Confidence</p>
                <p className="text-2xl font-black">{(data.confidence_score * 100).toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 bg-slate-50/50">
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Diagnosis Selection */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-500" />
                Learning Diagnosis
              </h3>
              
              <div className="space-y-4">
                {[
                  { label: 'Accuracy', value: data.diagnosis.accuracy, type: 'percent' },
                  { label: 'Hint Dependency', value: data.diagnosis.hint_dependency, type: 'text' },
                  { label: 'Retry Behavior', value: data.diagnosis.retry_behavior, type: 'text' },
                  { label: 'Time Efficiency', value: data.diagnosis.time_efficiency, type: 'text' }
                ].map((metric, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-50 text-slate-400">
                        {getMetricIcon(metric.label.replace(' ', '_'))}
                      </div>
                      <span className="text-sm font-semibold text-slate-600">{metric.label}</span>
                    </div>
                    <span className={`text-sm font-bold ${
                      metric.value === 'low' || metric.value === 'high' ? 'text-indigo-600' : 'text-slate-800'
                    }`}>
                      {typeof metric.value === 'number' ? `${(metric.value * 100)}%` : metric.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendation Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-500" />
                Next Steps
              </h3>

              <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-2xl border border-indigo-100 shadow-sm">
                <p className="text-sm text-slate-600 mb-4 italic leading-relaxed">
                  " {data.recommendation.reason} "
                </p>
                
                <div className="space-y-3">
                  {data.recommendation.next_steps.map((step, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="mt-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      </div>
                      <p className="text-sm font-medium text-slate-700">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-10">
            <button 
              onClick={onClose}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
            >
              Continue My Journey
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
