// lib/types.ts
export type UserRole = 'USER' | 'MODERATOR' | 'ADMIN';

export const UserRoleValues = {
  USER: 'USER' as const,
  MODERATOR: 'MODERATOR' as const,
  ADMIN: 'ADMIN' as const,
} as const;

export type User = {
  id: string;
  name: string | null;
  username: string | null;
  email: string | null;
  image: string | null;
  role: UserRole;
  suspended: boolean;
  bio?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
};