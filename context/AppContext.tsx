import { createContext, useContext } from "react";

export type AppContextData = {
  appStatus: 'booting' | 'ready';
}

export const AppContext = createContext<AppContextData>({
  appStatus: 'booting',
})

export const useAppContext = () => useContext(AppContext)