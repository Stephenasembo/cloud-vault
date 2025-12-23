import { useState } from "react";
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";
import { COLORS } from "./index";
import { styles } from "./signup";
import { useDeviceContext } from "../../context/DeviceContext";

export default function Login() {
  const { networkStatus } = useDeviceContext();  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function loginUser() {
    if(networkStatus === 'offline') {
      Alert.alert(
        'No internet connection',
        'Please connect to the internet to login.'
      );
      return;
    }
    try{
      setLoading(true);
      const {
        data: { session },
        error
      } = await supabase.auth.signInWithPassword({
        email, password
      })

      if (error) {
        Alert.alert('Login failed', error.message);
        return;
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaProvider>
      <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.heading}>Welcome back</Text>
            <Text style={styles.subHeading}>Sign in to your CloudVault</Text>
          </View>
          {networkStatus === 'offline' && (
            <View style={styles.networkInfoContainer}>
              <Text style={styles.networkInfoText}>You are offline. Please connect to the internet to sign in.</Text>
            </View>
          )}
          <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="johndoe@gmail.com"
                  placeholderTextColor={COLORS.mutedText}
                  onChangeText={setEmail}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor={COLORS.mutedText}
                  secureTextEntry
                  onChangeText={setPassword}
                />
            </View>
            <Pressable
            style={({ pressed }) => [
              styles.button,
              loading && {opacity: 0.7},
              networkStatus === 'offline' && {opacity: 0.7},
              pressed && styles.primaryButtonPressed
            ]}
            onPress={loginUser}
            disabled={networkStatus === 'offline' || loading}
            >
              <Text style={styles.buttonText}>
                {networkStatus === 'offline' ? 'You are offline' :
                loading ? 'Logging you in...' : 'Login'}
              </Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  )
}