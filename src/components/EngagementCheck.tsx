import React, { useEffect, useRef, useState } from 'react';
import { FaceMesh } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const EngagementCheck: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isEngaged, setIsEngaged] = useState(true);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    const faceMesh = new FaceMesh({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults((results) => {
      if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        // Simple engagement check: are landmarks present? 
        // In a real app, we'd check head pose or eye gaze.
        setIsEngaged(true);
      } else {
        setIsEngaged(false);
      }
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        if (videoRef.current) {
          await faceMesh.send({ image: videoRef.current });
        }
      },
      width: 160,
      height: 120,
    });

    camera.start()
      .then(() => setIsCameraActive(true))
      .catch((err) => {
        console.error("Camera error:", err);
        setError("Camera access denied. Engagement check disabled.");
      });

    return () => {
      camera.stop();
      faceMesh.close();
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-slate-200 flex items-center gap-3">
        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-100 border-2 border-slate-200">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
            muted
            playsInline
          />
          {!isCameraActive && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
              <EyeOff className="w-5 h-5 text-slate-400" />
            </div>
          )}
        </div>
        
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Engagement
            </span>
            <div className={`w-2 h-2 rounded-full ${isEngaged ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
          </div>
          <span className="text-sm font-medium text-slate-900">
            {isEngaged ? 'Focused' : 'Distracted'}
          </span>
        </div>

        <AnimatePresence>
          {!isEngaged && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute -top-12 right-0 bg-rose-500 text-white text-[10px] px-2 py-1 rounded-lg shadow-lg flex items-center gap-1 whitespace-nowrap"
            >
              <AlertCircle className="w-3 h-3" />
              Please focus on the screen
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {error && (
        <div className="absolute -top-10 right-0 text-[10px] text-rose-500 bg-rose-50 px-2 py-1 rounded border border-rose-100">
          {error}
        </div>
      )}
    </div>
  );
};
