export type User = {
  readonly id: string;
  name: string;
  login: string;
  password: string;
  session: Session[];
  settings: Settings;
  createdAt: string;
  updatedAt: string;
};

type Settings = unknown;
type Session = unknown;

export type NewUser = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type LoginUser = Pick<User, 'login' | 'password'>;
export type UserProfile = Omit<User, 'password'>;
