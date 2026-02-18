export type User = {
  id: string;
  name: string;
  login: string;
  password: string;
  createdAt: string;
};

export type NewUser = Omit<User, 'id' | 'createdAt'>;
