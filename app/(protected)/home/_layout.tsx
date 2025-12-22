import { Stack } from "expo-router";

export default function HomeScreenNavigation() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{
        headerTitle: 'CloudVault',
        headerTitleAlign: 'center',
        }}/>
      <Stack.Screen name="folder"/>
    </Stack>
  )
}