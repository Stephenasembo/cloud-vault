import { Stack } from 'expo-router'

export const isLoggedIn = true;

export default function RootNavigation() {
  return (
    <Stack>
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name='(auth)' options={{ headerShown: false}}/>
      </Stack.Protected>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name='(protected)' options={{ title: 'Cloud Vault'}}/>
      </Stack.Protected>

    </Stack>
  )
}