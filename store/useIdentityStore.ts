import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createClient } from '@/lib/supabase/client';

export type EgoLevel = 1 | 2 | 3 | 4 | 5;

export interface Lever {
  id: string;
  text: string;
  completed: boolean;
  feeling: 'alive' | 'dead' | null;
  sortOrder: number;
}

export interface IdentityState {
  // Profile
  vision: string;
  antiVision: string;
  yearGoal: string;
  monthProject: string;
  dailyLevers: Lever[];
  constraints: string;
  egoLevel: EgoLevel;
  xp: number;

  // App State
  appState: 'onboarding' | 'dashboard' | 'forcefield';
  lens: 'macro' | 'micro';

  // Sync state
  userId: string | null;
  isSyncing: boolean;
  isHydrated: boolean;

  // Actions
  setProfile: (profile: Partial<IdentityState>) => void;
  setAppState: (state: 'onboarding' | 'dashboard' | 'forcefield') => void;
  setLens: (lens: 'macro' | 'micro') => void;
  completeTask: (taskId: string, feeling: 'alive' | 'dead') => void;
  resetLevers: () => void;
  addXp: (amount: number) => void;
  triggerOnboardingComplete: (data: any) => void;

  // Supabase actions
  setUserId: (userId: string | null) => void;
  loadFromSupabase: (userId: string) => Promise<void>;
  syncProfileToSupabase: () => Promise<void>;
  syncLeversToSupabase: () => Promise<void>;
  migrateLocalStorageToSupabase: (userId: string) => Promise<boolean>;
}

// Debounce helper
let profileSyncTimeout: ReturnType<typeof setTimeout> | null = null;
let leversSyncTimeout: ReturnType<typeof setTimeout> | null = null;

function debouncedProfileSync(fn: () => Promise<void>, delay = 1000) {
  if (profileSyncTimeout) clearTimeout(profileSyncTimeout);
  profileSyncTimeout = setTimeout(fn, delay);
}

function debouncedLeversSync(fn: () => Promise<void>, delay = 1000) {
  if (leversSyncTimeout) clearTimeout(leversSyncTimeout);
  leversSyncTimeout = setTimeout(fn, delay);
}

export const useIdentityStore = create<IdentityState>()(
  persist(
    (set, get) => ({
      // Initial State
      vision: '',
      antiVision: '',
      yearGoal: '',
      monthProject: '',
      dailyLevers: [],
      constraints: '',
      egoLevel: 1,
      xp: 0,
      appState: 'onboarding',
      lens: 'micro',
      userId: null,
      isSyncing: false,
      isHydrated: false,

      // Actions
      setProfile: (profile) => {
        set((state) => ({ ...state, ...profile }));
        if (get().userId) {
          debouncedProfileSync(() => get().syncProfileToSupabase());
        }
      },

      setAppState: (appState) => {
        set({ appState });
        if (get().userId) {
          debouncedProfileSync(() => get().syncProfileToSupabase());
        }
      },

      setLens: (lens) => {
        set({ lens });
        if (get().userId) {
          debouncedProfileSync(() => get().syncProfileToSupabase());
        }
      },

      completeTask: (taskId, feeling) => {
        const { dailyLevers, xp, egoLevel, userId } = get();
        const updatedLevers = dailyLevers.map((l) =>
          l.id === taskId ? { ...l, completed: true, feeling } : l
        );

        const lever = dailyLevers.find((l) => l.id === taskId);
        const xpGained = feeling === 'alive' ? 20 : 5;
        const newXp = xp + xpGained;
        let newLevel = egoLevel;

        if (newXp >= newLevel * 50 && newLevel < 5) {
          newLevel = (newLevel + 1) as EgoLevel;
        }

        set({ dailyLevers: updatedLevers, xp: newXp, egoLevel: newLevel });

        if (userId) {
          // Sync levers and profile (XP changed)
          debouncedLeversSync(() => get().syncLeversToSupabase());
          debouncedProfileSync(() => get().syncProfileToSupabase());

          // Log to state diary
          const supabase = createClient();
          supabase.from('state_diary').insert({
            user_id: userId,
            lever_text: lever?.text ?? '',
            feeling,
            xp_gained: xpGained,
          }).then();
        }
      },

      resetLevers: () => {
        set((state) => ({
          dailyLevers: state.dailyLevers.map((l) => ({ ...l, completed: false, feeling: null })),
        }));
        if (get().userId) {
          debouncedLeversSync(() => get().syncLeversToSupabase());
        }
      },

      addXp: (amount) => {
        const { xp, egoLevel } = get();
        const newXp = xp + amount;
        let newLevel = egoLevel;

        if (newXp >= newLevel * 50 && newLevel < 5) {
          newLevel = (newLevel + 1) as EgoLevel;
        }

        set({ xp: newXp, egoLevel: newLevel });
        if (get().userId) {
          debouncedProfileSync(() => get().syncProfileToSupabase());
        }
      },

      triggerOnboardingComplete: (data) => {
        const levers: Lever[] = data.leversInput
          ? data.leversInput
              .split(',')
              .map((l: string, i: number) => ({
                id: crypto.randomUUID(),
                text: l.trim(),
                completed: false,
                feeling: null,
                sortOrder: i,
              }))
              .filter((l: Lever) => l.text !== '')
          : data.dailyLevers || [];

        set({
          vision: data.vision,
          antiVision: data.antiVision,
          yearGoal: data.yearGoal,
          monthProject: data.monthProject,
          constraints: data.constraints,
          dailyLevers: levers,
          egoLevel: 2,
          xp: 10,
          appState: 'dashboard',
        });

        if (get().userId) {
          get().syncProfileToSupabase();
          get().syncLeversToSupabase();
        }
      },

      // Supabase Actions
      setUserId: (userId) => set({ userId }),

      loadFromSupabase: async (userId: string) => {
        set({ isSyncing: true });
        const supabase = createClient();

        // Load profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (profile) {
          set({
            vision: profile.vision || '',
            antiVision: profile.anti_vision || '',
            yearGoal: profile.year_goal || '',
            monthProject: profile.month_project || '',
            constraints: profile.constraints || '',
            egoLevel: (profile.ego_level || 1) as EgoLevel,
            xp: profile.xp || 0,
            appState: profile.app_state || 'onboarding',
            lens: profile.lens || 'micro',
          });
        }

        // Load levers
        const { data: levers } = await supabase
          .from('daily_levers')
          .select('*')
          .eq('user_id', userId)
          .order('sort_order', { ascending: true });

        if (levers && levers.length > 0) {
          set({
            dailyLevers: levers.map((l: any) => ({
              id: l.id,
              text: l.text,
              completed: l.completed,
              feeling: l.feeling,
              sortOrder: l.sort_order,
            })),
          });
        }

        set({ userId, isSyncing: false, isHydrated: true });
      },

      syncProfileToSupabase: async () => {
        const state = get();
        if (!state.userId) return;

        const supabase = createClient();
        await supabase
          .from('profiles')
          .update({
            vision: state.vision,
            anti_vision: state.antiVision,
            year_goal: state.yearGoal,
            month_project: state.monthProject,
            constraints: state.constraints,
            ego_level: state.egoLevel,
            xp: state.xp,
            app_state: state.appState,
            lens: state.lens,
          })
          .eq('id', state.userId);
      },

      syncLeversToSupabase: async () => {
        const state = get();
        if (!state.userId) return;

        const supabase = createClient();

        // Delete existing and re-insert (simple upsert strategy)
        await supabase
          .from('daily_levers')
          .delete()
          .eq('user_id', state.userId);

        if (state.dailyLevers.length > 0) {
          await supabase.from('daily_levers').insert(
            state.dailyLevers.map((l, i) => ({
              id: l.id,
              user_id: state.userId,
              text: l.text,
              completed: l.completed,
              feeling: l.feeling,
              sort_order: i,
            }))
          );
        }
      },

      migrateLocalStorageToSupabase: async (userId: string) => {
        const state = get();
        // Only migrate if the profile in Supabase is empty (new user)
        // but localStorage has data
        if (state.vision || state.antiVision || state.dailyLevers.length > 0) {
          const supabase = createClient();

          // Check if Supabase profile is empty
          const { data: profile } = await supabase
            .from('profiles')
            .select('vision')
            .eq('id', userId)
            .single();

          if (profile && !profile.vision) {
            // Profile is empty in DB, migrate localStorage data
            set({ userId });
            await get().syncProfileToSupabase();
            await get().syncLeversToSupabase();
            return true;
          }
        }
        return false;
      },
    }),
    {
      name: 'identity-os-storage',
      partialize: (state) => ({
        // Only persist these fields to localStorage (as fallback)
        vision: state.vision,
        antiVision: state.antiVision,
        yearGoal: state.yearGoal,
        monthProject: state.monthProject,
        dailyLevers: state.dailyLevers,
        constraints: state.constraints,
        egoLevel: state.egoLevel,
        xp: state.xp,
        appState: state.appState,
        lens: state.lens,
      }),
    }
  )
);
