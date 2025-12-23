import { PropsWithChildren, useState, useMemo } from "react";
import { DeviceContext } from "../context/DeviceContext";
import * as Network from 'expo-network';

export default function DeviceProvider({children}: PropsWithChildren) {
  const networkState = Network.useNetworkState();

  const networkStatus = useMemo<'offline' | 'online'>(() => {
    if(networkState.isConnected && networkState.isInternetReachable) return 'online'
    return 'offline'
  }, [networkState.isConnected, networkState.isInternetReachable])

  return (
    <DeviceContext value={{
      networkStatus,
    }}>
      {children}
    </DeviceContext>
  )
}