import { createContext, useContext } from 'react';
import { Session } from '@supabase/supabase-js';

export type AuthStatusType = 'unknown' | 'authenticated' | 'unauthenticated';

export type AuthData = {
  session?: Session | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  userId: string | null;
  authStatus: AuthStatusType;
}

export const AuthContext = createContext<AuthData>({
  session: null,
  isLoading: false,
  isLoggedIn: false,
  userId: null,
  authStatus: 'unknown',
})

export const useAuthContext = () => useContext(AuthContext)