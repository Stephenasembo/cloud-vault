import { Stack } from 'expo-router'

export const isLoggedIn = false;

export default function RootNavigation() {
  return (
    <Stack>
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name='(auth)'/>
      </Stack.Protected>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name='(protected)'/>
      </Stack.Protected>

    </Stack>
  )
}