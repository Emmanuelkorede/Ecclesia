import type { User, Session } from '@supabase/supabase-js';


export type AuthUser = User;
export type AuthSession = Session;

export interface SignUpPayload {
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}


export interface AuthContextType {
  user: User | null;
  session: Session | null;
  initialized : boolean
}


export interface UpdateProfilePayload {
  fullName: string;
  phone: string;
  avatarUrl?: string;
}