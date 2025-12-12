import { createContext, useContext } from 'react';
import { Session } from '@supabase/supabase-js';

export type AuthData = {
  session?: Session | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  userId: string | null;
}

export const AuthContext = createContext<AuthData>({
  session: null,
  isLoading: false,
  isLoggedIn: false,
  userId: null,
})

export const useAuthContext = () => useContext(AuthContext)