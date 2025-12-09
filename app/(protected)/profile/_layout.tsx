import { Stack } from 'expo-router'

export default function ProfileNavigation() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index"/>
      <Stack.Screen name="terms"/>
      <Stack.Screen name="faq"/>
      <Stack.Screen name="settings"/>
    </Stack>
  )
}