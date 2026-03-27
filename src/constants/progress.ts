import type { ProgressData } from '../types';

export const INIT_PROGRESS: ProgressData = {
  userId: '',
  userAchievements: [],
  progress: {
    javascript: 0,
    typescript: 0,
    react: 0,
    nodejs: 0,
  },
  solvedWidgets: {
    quiz: [],
    matchGame: [],
  },
  updatedAt: Date.now(),
};
