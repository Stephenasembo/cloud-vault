import { Tabs } from 'expo-router';
import FoldersProvider from '../../providers/FoldersProvider';
import { Home, User } from "lucide-react-native"
import { useThemeContext } from '../../context/ThemeContext';

function RootTabNavigation() {
  const { colors } = useThemeContext();

  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#2563EB',
      tabBarInactiveTintColor: '#9CA3AF',
      tabBarStyle: {
        backgroundColor: colors.navBar.background,
        borderTopColor: colors.navBar.border,
      }
    }}>
      <Tabs.Screen name="home" options={{
        tabBarLabel: "Home",
        tabBarIcon: ({ color, size }) => (
        <Home color={color} size={size} />)
      }}/>
      <Tabs.Screen name="profile" options={{
        tabBarLabel: "Profile",
        tabBarIcon: ({ color, size }) => (
        <User color={color} size={size} />)
      }}/>
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