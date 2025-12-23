import * as SplashScreen from 'expo-splash-screen';
import { PropsWithChildren, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useAuthContext } from "../context/AuthContext";

SplashScreen.preventAutoHideAsync();

export default function AppProvider({ children }: PropsWithChildren) {
  const [appStatus, setAppStatus] = useState<'booting' | 'ready'>('booting')
  const { authStatus } = useAuthContext();

  useEffect(() => {
    if(authStatus !== 'unknown') {
      setAppStatus('ready');
      SplashScreen.hideAsync();
    }
  }, [authStatus])

  return (
    <AppContext value={{
      appStatus,
    }}>
      {children}
    </AppContext>
  )
}