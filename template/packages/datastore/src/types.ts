import type { Generated, Insertable, Selectable, Updateable } from 'kysely';

// Database table interfaces
export interface UserTable {
  id: Generated<string>;
  email: string;
  name: string | null;
  picture: string | null;
  email_verified: Generated<boolean>;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

export interface SessionTable {
  id: Generated<string>;
  user_id: string;
  expires_at: Date;
  created_at: Generated<Date>;
}

// Database schema
export interface Database {
  users: UserTable;
  sessions: SessionTable;
}

// Helper types for each table
export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;

export type Session = Selectable<SessionTable>;
export type NewSession = Insertable<SessionTable>;
export type SessionUpdate = Updateable<SessionTable>;
