import type { ObjectId } from 'mongodb';

export type UserProgress = {
  readonly _id: ObjectId;
  userId: string;
  userAchievements: string[];
  progress: {
    javascript: number;
    typescript: number;
    react: number;
    nodejs: number;
  };
  solvedWidgets: {
    quiz: string[];
    matchGame: string[];
  };
  updatedAt: number;
};

export type ProgressData = Omit<UserProgress, '_id'>;
