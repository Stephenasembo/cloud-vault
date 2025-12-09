import { Tabs } from 'expo-router';

export default function RootTabNavigator() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ tabBarLabel: "Home" }}/>
      <Tabs.Screen name="profile" options={{ tabBarLabel: "Profile" }}/>
      <Tabs.Screen name="splash" options={{ tabBarLabel: "Splash" }}/>
    </Tabs>
  )
}