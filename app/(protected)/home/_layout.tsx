import { Stack } from "expo-router";
import { useThemeContext } from "../../../context/ThemeContext";

export default function HomeScreenNavigation() {
  const { colors } = useThemeContext();

  return (
    <Stack>
      <Stack.Screen name="index" options={{
        headerTitle: 'CloudVault',
        headerTitleAlign: 'center',
        headerTintColor: colors.navBar.text,
        headerStyle: {
          backgroundColor: colors.navBar.background,
        }
        }}/>
      <Stack.Screen name="folder"/>
    </Stack>
  )
}