import { AuthContext } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import type  { Session } from "@supabase/supabase-js";
import { PropsWithChildren, useEffect, useState } from "react";

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null | undefined>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSession() {
      setIsLoading(true);
      const { data: {session}, error} = await supabase.auth.getSession()

      if(error) console.log(`Error fetching session: ${error}`)
      
      setSession(session)
      setIsLoading(false)
    }

    async function getUserId() {
      const { data: { user } , error } = await supabase.auth.getUser();
      if(error) {
        setUserId(null);
      } else {
        const userId = user?.id ?? null
        setUserId(userId)
      }
    }

    fetchSession();
    getUserId();

    const {
      data: {subscription},
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log(`Auth state changed: {event: ${_event}, session: ${session}}`)
      setSession(session);
      getUserId();
    });

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext value = {{
      session,
      isLoading,
      isLoggedIn: !!session,
      userId,
    }}>
      {children}
    </AuthContext>
  )
}
