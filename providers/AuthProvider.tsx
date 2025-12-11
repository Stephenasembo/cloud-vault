import { AuthContext } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import type  { Session } from "@supabase/supabase-js";
import { PropsWithChildren, useEffect, useState } from "react";

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null | undefined>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchSession() {
      setIsLoading(true);
      const { data: {session}, error} = await supabase.auth.getSession()

      if(error) console.log(`Error fetching session: ${error}`)
      
      setSession(session)
      setIsLoading(false)
    }

    fetchSession();

    const {
      data: {subscription},
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log(`Auth state changed: {event: ${_event}, session: ${session}}`)
      setSession(session);
    });

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext value = {{
      session,
      isLoading,
      isLoggedIn: !!session
    }}>
      {children}
    </AuthContext>
  )
}
