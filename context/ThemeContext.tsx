import { createContext, useContext, Dispatch, SetStateAction } from "react";

export type ColorTheme = {
  background: string;
  primary: string;
  secondary: string;
  mutedText: string;
  border: string;
  textSecondary: string;
  linkText: string;
  title: string;
  cardBackground: string;
  textPrimary: string;
  menuBorder: string;
  navBar: {
    background: string;
    text: string;
    border: string;
  }
}

export const lightPalette = {
  background: "#EEF7FF",
  primary: "#3A5874",
  secondary: "#6FAED9",
  mutedText: "#6B8AA4",
  border: "#D6E6F2",
  textPrimary: '#243E57',
  textSecondary: "#6B7280",
  linkText: '#121824',
  title: '#121824',
  cardBackground: '#DCEAF6',
  menuBorder: '#9FBAD3',
  navBar: {
    background: '#F7FBFF',
    text: '#3A5874',
    border: '#C7DBEE',
  }
}

export const darkPalette = {
  background: "#0F172A",
  primary: "#93C5FD",
  secondary: "#60A5FA",
  mutedText: "#94A3B8",
  border: "#1E293B",
  textPrimary: '#282c5c',
  textSecondary: "#CBD5E1",
  linkText: '#fffbf6',
  title: '#fffbf6',
  cardBackground: '#e4eef4',
  menuBorder: "#475569",
  navBar: {
    background: '#162238',
    text: '#93C5FD',
    border: '#22304A',
  }
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
