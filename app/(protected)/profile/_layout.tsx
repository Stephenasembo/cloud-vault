import { Stack } from 'expo-router'

export default function ProfileNavigation() {
  return (
    <Stack>
      <Stack.Screen name="index"  options={{
        headerTitle: 'CloudVault',
        headerTitleAlign: 'center',
      }}/>
      <Stack.Screen name="terms"  options={{
        headerTitle: 'Terms & Conditions',
        headerTitleAlign: 'center',
      }}/>
      <Stack.Screen name="faq"  options={{
        headerTitle: 'FAQ & Help',
        headerTitleAlign: 'center',
      }}/>
      <Stack.Screen name="settings"  options={{
        headerTitle: 'Settings',
        headerTitleAlign: 'center',
      }}/>
    </Stack>
  )
}