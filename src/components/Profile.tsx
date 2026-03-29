import React, { useEffect, useState } from 'react';
import { User as UserIcon, Mail, Award, ArrowLeft, Loader2 } from 'lucide-react';
import { KNOWLEDGE_COMPONENTS } from '../services/bkt';

const API = "https://ats-app-2.onrender.com";

interface UserProfile {
  name: string;
  email: string;
  mastery: Record<string, number>;
  completedTopics: string[];
}

interface ProfileProps {
  onBack: () => void;
}

export function Profile({ onBack }: ProfileProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API}/api/user/me`, {
          credentials: 'include'
        });

        if (!response.ok) throw new Error('Failed to fetch profile');

        const data = await response.json();
        // The server returns the user object directly: { name, email, mastery, completedTopics }
        setUser(data);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-rose-500">
        <p>Error loading profile: {error}</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  const averageMastery = KNOWLEDGE_COMPONENTS.reduce((acc, kc) => {
    return acc + (user.mastery?.[kc.id] ?? kc.pL0);
  }, 0) / KNOWLEDGE_COMPONENTS.length;

  return (
    <div className="max-w-4xl mx-auto p-6 animate-in fade-in duration-300">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-8 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-32"></div>

        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="w-24 h-24 bg-white rounded-full p-1 shadow-md">
              <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center border-2 border-indigo-100">
                <UserIcon className="w-10 h-10 text-indigo-400" />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">
              {user.name}
            </h1>
            <div className="flex items-center gap-2 text-slate-500 mt-2">
              <Mail className="w-4 h-4" />
              <span>{user.email}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Stats Card */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-6 h-6 text-purple-500" />
                <h2 className="text-lg font-semibold text-slate-800">
                  Learning Progress
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">
                      Average Mastery
                    </span>
                    <span className="font-medium text-indigo-600">
                      {(averageMastery * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(0, averageMastery * 100)
                        )}%`
                      }}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <p className="text-sm text-slate-600">
                    Topics Completed:{' '}
                    <span className="font-semibold text-slate-900">
                      {user.completedTopics?.length || 0}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Mastery Details */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">
                Mastery by Component
              </h2>
              <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                {KNOWLEDGE_COMPONENTS.map((kc) => {
                  const val = user.mastery?.[kc.id] ?? kc.pL0;
                  return (
                    <div key={kc.id} className="flex justify-between items-center text-sm">
                      <span className="text-slate-700 truncate mr-3 flex-1" title={kc.title}>
                        {kc.title}
                      </span>
                      <span className={`font-medium ${val > 0.8 ? 'text-green-600' : val > 0.5 ? 'text-amber-600' : 'text-slate-500'}`}>
                        {(val * 100).toFixed(0)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}