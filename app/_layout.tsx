import { Stack } from 'expo-router'
import AuthProvider from '../providers/AuthProvider';
import { useAuthContext } from '../context/AuthContext';
import Toast from 'react-native-toast-message'

function RootNavigation() {
  const {isLoggedIn} = useAuthContext();

  return (
    <Stack>
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name='(auth)' options={{ headerShown: false}}/>
      </Stack.Protected>
      <Stack.Protected guard={!!isLoggedIn}>
        <Stack.Screen name='(protected)' options={{ title: 'Cloud Vault'}}/>
      </Stack.Protected>
    </Stack>
  )
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigation />
      <Toast />
    </AuthProvider>
  )
}
