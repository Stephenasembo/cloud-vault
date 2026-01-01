import { PropsWithChildren, useState } from "react";
import { ThemeContext, lightPalette, darkPalette } from "../context/ThemeContext";
import { useColorScheme } from "react-native";

export default function ThemeProvider({children}: PropsWithChildren) {
  const colorScheme = useColorScheme();
  const [userTheme, setUserTheme] = useState<'light' | 'dark' | null>(null)

  const mode = userTheme ?? (colorScheme === 'light' ? 'light' : 'dark');

  const colors = mode === 'light' ? lightPalette : darkPalette;

  return (
    <ThemeContext value={{mode, colors, setUserTheme}}>
      {children}
    </ThemeContext>
  )
}