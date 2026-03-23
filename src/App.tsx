/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Auth } from './components/Auth';
import { Pathway } from './components/Pathway';
import { Content } from './components/Content';
import { EngagementCheck } from './components/EngagementCheck';
import { KNOWLEDGE_COMPONENTS, updateMastery } from './services/bkt';
import { COURSE_CONTENT } from './data/content';
import { LearnerState } from './types';
import { LogOut, User, Settings, Bell } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [learnerState, setLearnerState] = useState<LearnerState>(() => {
    const initialMastery: Record<string, number> = {};
    KNOWLEDGE_COMPONENTS.forEach(kc => {
      initialMastery[kc.id] = kc.pL0;
    });
    
    return {
      mastery: initialMastery,
      completedTopics: []
    };
  });

  // Check auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/user/me');
        if (response.ok) {
          const data = await response.json();
          setUser({ name: data.name, email: data.email });
          setLearnerState({
            mastery: data.mastery || {},
            completedTopics: data.completedTopics || []
          });
        }
      } catch (err) {
        console.error("Auth check failed", err);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Sync state to backend
  useEffect(() => {
    if (!user) return;
    
    const syncState = async () => {
      try {
        await fetch('/api/user/state', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mastery: learnerState.mastery,
            completedTopics: learnerState.completedTopics
          }),
        });
      } catch (err) {
        console.error("State sync failed", err);
      }
    };

    const timeoutId = setTimeout(syncState, 2000); // Debounce sync
    return () => clearTimeout(timeoutId);
  }, [learnerState, user]);

  const handleLogin = (userData: any) => {
    setUser({ name: userData.name, email: userData.email });
    setLearnerState({
      mastery: userData.mastery || {},
      completedTopics: userData.completedTopics || []
    });
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (!activeTopicId) return;
    
    const kc = KNOWLEDGE_COMPONENTS.find(k => k.id === activeTopicId);
    if (!kc) return;

    setLearnerState(prev => {
      const currentMastery = prev.mastery[activeTopicId];
      const newMastery = updateMastery(currentMastery, isCorrect, kc);
      
      return {
        ...prev,
        mastery: {
          ...prev.mastery,
          [activeTopicId]: newMastery
        }
      };
    });
  };

  const handleTopicComplete = (score: number) => {
    if (!activeTopicId) return;

    setLearnerState(prev => {
      const isAlreadyCompleted = prev.completedTopics.includes(activeTopicId);
      if (isAlreadyCompleted) return prev;

      return {
        ...prev,
        completedTopics: [...prev.completedTopics, activeTopicId]
      };
    });
    setActiveTopicId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  // const activeSection = COURSE_CONTENT.find(s => s.id === activeTopicId);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight">CogniPath</h1>
          </div>

          <div className="flex items-center gap-6">
            <button className="text-slate-400 hover:text-slate-600 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <div className="h-6 w-px bg-slate-200" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
                <User className="w-6 h-6 text-slate-400" />
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                title="Log Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

    <main>
      {activeTopicId ? (
        <Content 
          kcId={activeTopicId}   // 🔥 pass kcId directly
          order={1}              // ⚠️ temporary (first subtopic)
          onBack={() => setActiveTopicId(null)}
          onAnswer={handleAnswer}
          onComplete={handleTopicComplete}
        />
      ) : (
        <Pathway 
          learnerState={learnerState} 
          onSelectTopic={setActiveTopicId} 
        />
      )}
    </main>

      {/* Engagement Check Component */}
      <EngagementCheck />
    </div>
  );
}
