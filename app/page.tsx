'use client';

import React, { useEffect, useState } from 'react';
import { useIdentityStore } from '@/store/useIdentityStore';
import OnboardingFlow from '@/components/OnboardingFlow';
import Dashboard from '@/components/Dashboard';
import Forcefield from '@/components/Forcefield';
import CyberneticFeedback from '@/components/CyberneticFeedback';
import { AnimatePresence, motion } from 'framer-motion';

export default function Home() {
  const appState = useIdentityStore((state) => state.appState);
  const [isHydrated, setIsHydrated] = useState(false);
  const [feedbackTask, setFeedbackTask] = useState<any>(null);

  // Handle hydration to prevent mismatch between server and client
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return <div className="min-h-screen bg-black" />;
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {appState === 'onboarding' && (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <OnboardingFlow />
          </motion.div>
        )}

        {appState === 'forcefield' && (
          <motion.div
            key="forcefield"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <Forcefield onTaskComplete={(task) => setFeedbackTask(task)} />
          </motion.div>
        )}

        {appState === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Dashboard />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {feedbackTask && (
          <CyberneticFeedback
            task={feedbackTask}
            onClose={() => setFeedbackTask(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
