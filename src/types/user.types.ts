import type { ObjectId } from 'mongodb';

export type User = {
  readonly _id: ObjectId;
  name: string;
  login: string;
  password: string;
  session: Session[];
  settings: Settings;
  createdAt: number;
  updatedAt: number;
};

type Settings = unknown;
type Session = unknown;

export type NewUser = Pick<User, 'login' | 'password' | 'name'>;
export type LoginUser = Pick<User, 'login' | 'password'>;
export type UserProfile = Omit<User, 'password'>;
