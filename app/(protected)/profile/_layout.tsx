import { Stack } from 'expo-router'
import { useThemeContext } from '../../../context/ThemeContext'

export default function ProfileNavigation() {
  const { colors } = useThemeContext();
  return (
    <Stack>
      <Stack.Screen name="index"  options={{
        headerTitle: 'CloudVault',
        headerTitleAlign: 'center',
        headerTintColor: colors.navBar.text,
        headerStyle: {
          backgroundColor: colors.navBar.background,
        }
      }}/>
      <Stack.Screen name="terms"  options={{
        headerTitle: 'Terms & Conditions',
        headerTitleAlign: 'center',
        headerTintColor: colors.navBar.text,
        headerStyle: {
          backgroundColor: colors.navBar.background,
        }
      }}/>
      <Stack.Screen name="faq"  options={{
        headerTitle: 'FAQ & Help',
        headerTitleAlign: 'center',
        headerTintColor: colors.navBar.text,
        headerStyle: {
          backgroundColor: colors.navBar.background,
        }
      }}/>
      <Stack.Screen name="settings"  options={{
        headerTitle: 'Settings',
        headerTitleAlign: 'center',
        headerTintColor: colors.navBar.text,
        headerStyle: {
          backgroundColor: colors.navBar.background,
        }
      }}/>
    </Stack>
  )
}