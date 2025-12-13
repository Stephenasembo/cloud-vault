import { Tabs } from 'expo-router';
import FoldersProvider from '../../providers/FoldersProvider';

function RootTabNavigation() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="home" options={{ tabBarLabel: "Home" }}/>
      <Tabs.Screen name="profile" options={{ tabBarLabel: "Profile" }}/>
    </Tabs>
  )
}

export default function RootTabLayout() {
  return (
    <FoldersProvider>
      <RootTabNavigation />
    </FoldersProvider>
  )
}