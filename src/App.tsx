/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Auth } from './components/Auth';
import { Pathway } from './components/Pathway';
import { Content } from './components/Content';
import { EngagementCheck } from './components/EngagementCheck';
import { KNOWLEDGE_COMPONENTS, updateMastery, KC_LAST_ORDER } from './services/bkt';
import { LearnerState } from './types';
import { LogOut, User, Bell} from 'lucide-react';
import { Profile } from './components/Profile';
import { ExitModal } from './components/ExitModal';
const API = "";

// Helper to get session info from storage or URL
const getSessionInfo = () => {
  const params = new URLSearchParams(window.location.search);
  
  const token = params.get("token") || sessionStorage.getItem("token");
  const student_id = params.get("student_id") || sessionStorage.getItem("student_id");
  const session_id = params.get("session_id") || sessionStorage.getItem("session_id");

  if (params.get("token")) sessionStorage.setItem("token", params.get("token") || "");
  if (params.get("student_id")) sessionStorage.setItem("student_id", params.get("student_id") || "");
  if (params.get("session_id")) sessionStorage.setItem("session_id", params.get("session_id") || "");

  return { token, student_id, session_id };
};
export default function App() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [activeKC, setActiveKC] = useState<string | null>(null);
  const [activeOrder, setActiveOrder] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
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

  /* =========================
     🛡️ SAFE FETCH & RETRY LOGIC
  ========================= */
  
  // Recursively replace NaN with null for JSON compliance
  const cleanPayload = (obj: any): any => {
    if (obj === null || obj === undefined) return obj;
    if (typeof obj === 'number' && isNaN(obj)) return null;
    if (Array.isArray(obj)) return obj.map(cleanPayload);
    if (typeof obj === 'object') {
      const cleaned: any = {};
      for (const key in obj) {
        cleaned[key] = cleanPayload(obj[key]);
      }
      return cleaned;
    }
    return obj;
  };

  const storeFailedRequest = (url: string, options: any) => {
    try {
      const failedRequests = JSON.parse(localStorage.getItem('failed_api_requests') || '[]');
      // Avoid duplicate storage of the exact same request if it's already there
      const requestKey = `${options.method || 'GET'}:${url}:${JSON.stringify(options.body)}`;
      if (!failedRequests.some((r: any) => r.key === requestKey)) {
        failedRequests.push({ 
          url, 
          options, 
          timestamp: Date.now(),
          key: requestKey 
        });
        localStorage.setItem('failed_api_requests', JSON.stringify(failedRequests));
        console.warn("📥 Network failure: Request stored locally for retry.", url);
      }
    } catch (e) {
      console.error("Failed to store request locally", e);
    }
  };

  const retryFailedRequests = async () => {
    const failedRequests = JSON.parse(localStorage.getItem('failed_api_requests') || '[]');
    if (failedRequests.length === 0) return;

    console.log(`🔄 Attempting to retry ${failedRequests.length} failed requests...`);
    const remainingRequests = [];

    for (const req of failedRequests) {
      try {
        const response = await fetch(req.url, req.options);
        if (response.ok) {
          console.log("✅ Retry successful:", req.url);
        } else {
          remainingRequests.push(req);
        }
      } catch (err) {
        remainingRequests.push(req);
      }
    }

    localStorage.setItem('failed_api_requests', JSON.stringify(remainingRequests));
  };

  const safeFetch = async (url: string, options: any = {}) => {
    // 1. Process body to handle NaN -> null
    if (options.body && typeof options.body === 'string') {
      try {
        const parsed = JSON.parse(options.body);
        options.body = JSON.stringify(cleanPayload(parsed));
      } catch (e) { /* Not JSON */ }
    }

    // 2. Inject Authorization Header if token exists
    const token = sessionStorage.getItem("token");
    if (token) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
      };
    }

    try {
      const response = await fetch(url, options);
      if (!response.ok && response.status >= 500) {
        // Server error - might be worth retrying
        storeFailedRequest(url, options);
      }
      return response;
    } catch (err) {
      // Network failure
      storeFailedRequest(url, options);
      throw err;
    }
  };

  // Retry on mount and when windows goes online
  useEffect(() => {
    retryFailedRequests();
    window.addEventListener('online', retryFailedRequests);
    return () => window.removeEventListener('online', retryFailedRequests);
  }, []);
      useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
          if (sessionId) {
            // 1. This triggers the native browser "Leave site?" popup
            e.preventDefault();
            e.returnValue = ''; // Standard requirement for modern browsers

            // 2. Fire the beacon to mark the session as exited midway
            // Note: This fires as soon as the tab starts closing
            navigator.sendBeacon(`${API}/api/merge/sessions/${sessionId}/exit`);
          }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
          window.removeEventListener("beforeunload", handleBeforeUnload);
        };
      }, [sessionId]);

 const startUserSession = async () => {
  const { student_id, session_id } = getSessionInfo();

  if (!student_id || !session_id) {
    console.error("Missing student_id or session_id");
    return;
  }

  try {
    const response = await safeFetch(`${API}/api/session/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: session_id,   // ✅ ALWAYS use external session_id
        student_id: student_id    // ✅ REQUIRED
      })
    });

    if (response.ok) {
      const data = await response.json();

      // You can still store if backend returns something new
      setSessionId(data.session_id || session_id);

      console.log("📍 Session started:", data.session_id || session_id);
    }
  } catch (err) {
    console.error("Failed to start session", err);
  }
};
  // ✅ AUTH CHECK
  useEffect(() => {
    const checkAuth = async () => {
      const { token } = getSessionInfo();
      
      try {
        const fetchOptions: any = { credentials: 'include' };
        if (token) {
          fetchOptions.headers = { 'Authorization': `Bearer ${token}` };
        }

        const response = await fetch(`${API}/api/user/me`, fetchOptions);

        if (response.ok) {
          const data = await response.json();

          setUser({ name: data.name, email: data.email });

          setLearnerState({
            mastery: data.mastery || {},
            completedTopics: data.completedTopics || []
          });

          startUserSession();
        }
      } catch (err) {
        console.error("Auth check failed", err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // ✅ SYNC TO BACKEND
useEffect(() => {
  if (!user) return;

  const syncState = async () => {
    try {
      await safeFetch(`${API}/api/user/state`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mastery: learnerState.mastery,
          completedTopics: learnerState.completedTopics,
        }),
      });
    } catch (err) {
      console.error("State sync failed", err);
    }
  };

  const timeoutId = setTimeout(syncState, 2000);
  return () => clearTimeout(timeoutId);
}, [learnerState, user]);

  // ✅ LOGIN
  const handleLogin = (userData: any) => {
    setUser({ name: userData.name, email: userData.email });

    setLearnerState({
      mastery: userData.mastery || {},
      completedTopics: userData.completedTopics || []
    });

    startUserSession();
  };

  // ✅ LOGOUT
  const handleLogout = async () => {

    if (sessionId) {
        await safeFetch(`${API}/api/session/complete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ sessionId })
        });
        console.log("🏁 Session closed successfully.");
    }

    await fetch(`${API}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    
    // Clear session storage for one-time auth
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("student_id");
    sessionStorage.removeItem("session_id");
    
    setUser(null);
    setSessionId(null); // Reset
  };

  // ✅ BKT UPDATE
  const handleAnswer = (isCorrect: boolean) => {
    if (!activeKC) return;

    const kc = KNOWLEDGE_COMPONENTS.find(k => k.id === activeKC);
    if (!kc) return;

    setLearnerState(prev => {
      const currentMastery = prev.mastery[activeKC];
      const newMastery = updateMastery(currentMastery, isCorrect, kc);

      return {
        ...prev,
        mastery: {
          ...prev.mastery,
          [activeKC]: newMastery
        }
      };
    });
  };

  // ✅ LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  // ✅ NOT LOGGED IN
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl shadow-slate-200/60 p-8 text-center border border-slate-100">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <LogOut className="w-8 h-8 text-rose-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h2>
          <p className="text-slate-600 mb-8">
            Please access this chapter through your student dashboard.
          </p>
          <div className="p-4 bg-slate-50 rounded-xl text-sm text-slate-500 text-left border border-slate-100">
            <p className="font-medium text-slate-700 mb-1">Missing Session Info:</p>
            <ul className="list-disc list-inside space-y-1">
              {!sessionStorage.getItem("token") && <li>Authentication Token</li>}
              {!sessionStorage.getItem("student_id") && <li>Student ID</li>}
              {!sessionStorage.getItem("session_id") && <li>Session ID</li>}
            </ul>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">

      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight">CogniPath</h1>
          </div>

          <div className="flex items-center gap-6">
            <button className="text-slate-400 hover:text-slate-600">
              <Bell className="w-5 h-5" />
            </button>

            <div className="h-6 w-px bg-slate-200" />

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>

              <button 
                onClick={() => setShowProfile(true)}
                className="w-10 h-10 bg-slate-100 hover:bg-indigo-50 rounded-full flex items-center justify-center border hover:border-indigo-200 transition-colors"
                title="View Profile"
              >
                <User className="w-6 h-6 text-slate-400 hover:text-indigo-600" />
              </button>

              <div className="h-6 w-px bg-slate-200 mx-1" />

              <button
                onClick={() => setShowExitModal(true)}
                className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                title="Log Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* MAIN */}
      <main>
        {showProfile ? (
          <Profile onBack={() => setShowProfile(false)} safeFetch={safeFetch} />
        ) : activeKC && activeOrder !== null ? (
          <Content
            kcId={activeKC}
            order={activeOrder}
            sessionId={sessionId}
            safeFetch={safeFetch} // 👈 Pass safeFetch here
            onBack={() => {
              setActiveKC(null);
              setActiveOrder(null);
            }}

            onAnswer={handleAnswer}

            // ✅ REMEDIAL LOGIC HERE
            kcMastery={learnerState.mastery[activeKC] || 0}
            isLastOrder={activeOrder === KC_LAST_ORDER[activeKC]}
            onRestartKC={(kcId) => {
              setLearnerState(prev => ({
                ...prev,
                completedTopics: prev.completedTopics.filter(t => !t.startsWith(`${kcId}-`))
              }));
              setActiveKC(null);
              setActiveOrder(null);
            }}

            // ✅ FIXED LOGIC HERE
            onComplete={(kcId, order, score) => {
              setLearnerState(prev => ({
                ...prev,
                completedTopics: Array.from(new Set([
                  ...prev.completedTopics,
                  `${kcId}-${order}`
                ]))
              }));

              // 🔥 ALWAYS go back to pathway
              setActiveKC(null);
              setActiveOrder(null);
            }}
          />
        ) : (
          <Pathway
            learnerState={learnerState}
            safeFetch={safeFetch}
            onSelectTopic={(kcId, order) => {
              setActiveKC(kcId);
              setActiveOrder(order);
            }}
          />
        )}
      </main>

      <EngagementCheck />
      <ExitModal 
        isOpen={showExitModal} 
        onClose={() => setShowExitModal(false)}
        onConfirm={() => {
          setShowExitModal(false);
          handleLogout();
        }}
      />
    </div>
  );
}