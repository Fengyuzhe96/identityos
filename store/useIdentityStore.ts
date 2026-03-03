import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type EgoLevel = 1 | 2 | 3 | 4 | 5;

export interface Lever {
  id: number;
  text: string;
  completed: boolean;
  feeling: 'alive' | 'dead' | null;
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

  // Actions
  setProfile: (profile: Partial<IdentityState>) => void;
  setAppState: (state: 'onboarding' | 'dashboard' | 'forcefield') => void;
  setLens: (lens: 'macro' | 'micro') => void;
  completeTask: (taskId: number, feeling: 'alive' | 'dead') => void;
  resetLevers: () => void;
  addXp: (amount: number) => void;
  triggerOnboardingComplete: (data: any) => void;
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

      // Actions
      setProfile: (profile) => set((state) => ({ ...state, ...profile })),
      setAppState: (appState) => set({ appState }),
      setLens: (lens) => set({ lens }),
      
      completeTask: (taskId, feeling) => {
        const { dailyLevers, xp, egoLevel } = get();
        const updatedLevers = dailyLevers.map((l) =>
          l.id === taskId ? { ...l, completed: true, feeling } : l
        );

        let xpGained = feeling === 'alive' ? 20 : 5;
        let newXp = xp + xpGained;
        let newLevel = egoLevel;

        if (newXp >= newLevel * 50 && newLevel < 5) {
          newLevel = (newLevel + 1) as EgoLevel;
        }

        set({ dailyLevers: updatedLevers, xp: newXp, egoLevel: newLevel });
      },

      resetLevers: () => {
        set((state) => ({
          dailyLevers: state.dailyLevers.map((l) => ({ ...l, completed: false, feeling: null })),
        }));
      },

      addXp: (amount) => {
        const { xp, egoLevel } = get();
        let newXp = xp + amount;
        let newLevel = egoLevel;

        if (newXp >= newLevel * 50 && newLevel < 5) {
          newLevel = (newLevel + 1) as EgoLevel;
        }

        set({ xp: newXp, egoLevel: newLevel });
      },

      triggerOnboardingComplete: (data) => {
        set({
          ...data,
          egoLevel: 2,
          xp: 10,
          appState: 'dashboard',
        });
      },
    }),
    {
      name: 'identity-os-storage',
    }
  )
);
