'use client';

import React, { useEffect, useState } from 'react';
import { useIdentityStore } from '@/store/useIdentityStore';
import OnboardingFlow from '@/components/OnboardingFlow';
import Dashboard from '@/components/Dashboard';
import Forcefield from '@/components/Forcefield';
import CyberneticFeedback from '@/components/CyberneticFeedback';

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

  if (appState === 'onboarding') {
    return <OnboardingFlow />;
  }

  if (appState === 'forcefield') {
    return (
      <>
        <Forcefield onTaskComplete={(task) => setFeedbackTask(task)} />
        {feedbackTask && (
          <CyberneticFeedback 
            task={feedbackTask} 
            onClose={() => setFeedbackTask(null)} 
          />
        )}
      </>
    );
  }

  return <Dashboard />;
}
