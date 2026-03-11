'use client';

import React, { useEffect, useState } from 'react';
import { useIdentityStore } from '@/store/useIdentityStore';
import { useAuth } from '@/components/AuthProvider';
import OnboardingFlow from '@/components/OnboardingFlow';
import Dashboard from '@/components/Dashboard';
import Forcefield from '@/components/Forcefield';
import CyberneticFeedback from '@/components/CyberneticFeedback';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const appState = useIdentityStore((state) => state.appState);
  const loadFromSupabase = useIdentityStore((state) => state.loadFromSupabase);
  const migrateLocalStorageToSupabase = useIdentityStore((state) => state.migrateLocalStorageToSupabase);
  const isSyncing = useIdentityStore((state) => state.isSyncing);
  const [isHydrated, setIsHydrated] = useState(false);
  const [feedbackTask, setFeedbackTask] = useState<any>(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Handle hydration to prevent mismatch between server and client
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Load data from Supabase when user is authenticated
  useEffect(() => {
    if (user && isHydrated && !dataLoaded) {
      (async () => {
        // Try to migrate localStorage data first
        const migrated = await migrateLocalStorageToSupabase(user.id);
        if (!migrated) {
          // If no migration needed, load from Supabase
          await loadFromSupabase(user.id);
        }
        setDataLoaded(true);
      })();
    }
  }, [user, isHydrated, dataLoaded]);

  if (!isHydrated || authLoading || (user && !dataLoaded)) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="text-zinc-600 animate-spin" size={32} />
          <span className="text-zinc-700 text-sm uppercase tracking-widest">
            {isSyncing ? 'Синхронизация...' : 'Загрузка системы...'}
          </span>
        </motion.div>
      </div>
    );
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
