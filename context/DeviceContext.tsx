import { useContext, createContext } from "react";

export type DeviceData = {
  networkStatus: 'offline' | 'online';
}

export const DeviceContext = createContext<DeviceData>({
  networkStatus: 'offline',
})

export const useDeviceContext = () => useContext(DeviceContext)