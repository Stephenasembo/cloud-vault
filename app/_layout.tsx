import { Stack } from 'expo-router'
import AuthProvider from '../providers/AuthProvider';
import { useAuthContext } from '../context/AuthContext';
import Toast from 'react-native-toast-message'
import AppProvider from '../providers/AppProvider';
import { useAppContext } from '../context/AppContext';

function RootNavigation() {
  const { authStatus } = useAuthContext();
  const { appStatus } = useAppContext();

  if(appStatus === 'booting') return null;

  return (
    <Stack>
      <Stack.Protected guard={authStatus === 'unauthenticated'}>
        <Stack.Screen name='(auth)' options={{ headerShown: false}}/>
      </Stack.Protected>
      <Stack.Protected guard={authStatus === 'authenticated'}>
        <Stack.Screen name='(protected)' options={{headerShown: false}}/>
      </Stack.Protected>
    </Stack>
  )
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppProvider>
        <RootNavigation />
        <Toast />
      </AppProvider>
    </AuthProvider>
  )
}
