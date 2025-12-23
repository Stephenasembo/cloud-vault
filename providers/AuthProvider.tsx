import { AuthContext, AuthStatusType } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import type  { Session } from "@supabase/supabase-js";
import { PropsWithChildren, useEffect, useState } from "react";

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null | undefined>(null);
  const [authStatus, setAuthStatus] = useState<AuthStatusType>('unknown');

  const userId = session?.user?.id ?? null;

  useEffect(() => {
    async function fetchSession() {
      const { data: {session}, error} = await supabase.auth.getSession()

      if(error) {
        console.log(`Error fetching session: ${error}`);
        setSession(null);
        setAuthStatus('unauthenticated');
        
      } else {
        setSession(session);
        setAuthStatus(session? 'authenticated': 'unauthenticated')
      }
      
    }

    fetchSession();

    const {
      data: {subscription},
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log(`Auth state changed: {event: ${_event}, session: ${session}}`)
      setSession(session);
      setAuthStatus(session? 'authenticated' : 'unauthenticated');
    });

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext value = {{
      session,
      isLoggedIn: !!session,
      userId,
      authStatus,
    }}>
      {children}
    </AuthContext>
  )
}
