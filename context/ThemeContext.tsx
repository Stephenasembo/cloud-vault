import { createContext, useContext, Dispatch, SetStateAction } from "react";

export type ColorTheme = {
  background: string;
  primary: string;
  secondary: string;
  mutedText: string;
  border: string;
  textSecondary: string;
}

export const lightPalette = {
  background: "#EEF7FF",
  primary: "#3A5874",
  secondary: "#6FAED9",
  mutedText: "#6B8AA4",
  border: "#D6E6F2",
  textSecondary: "#6B7280",
}

export const darkPalette = {
  background: "#0F172A",
  primary: "#93C5FD",
  secondary: "#60A5FA",
  mutedText: "#94A3B8",
  border: "#1E293B",
  textSecondary: "#CBD5E1",
}

type ThemeData = {
  mode: 'light' | 'dark';
  colors: ColorTheme;
  setUserTheme: Dispatch<SetStateAction<'light' | 'dark' | null>>;
}

export const ThemeContext = createContext<ThemeData>({
  mode: 'light',
  colors: lightPalette,
  setUserTheme: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);
