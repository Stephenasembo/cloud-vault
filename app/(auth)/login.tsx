import { useState } from "react";
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";
import { COLORS } from "./index";
import { styles } from "./signup";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function loginUser() {
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
              pressed && styles.primaryButtonPressed
            ]}
            onPress={loginUser}
            disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Logging you in...' : 'Login'}
              </Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  )
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F9FAFB',
//     justifyContent: 'center',
//     paddingHorizontal: 20,
//   },
//   headerContainer: {
//     marginBottom: 40,
//     alignItems: 'center',
//   },
//   heading: {
//     fontSize: 32,
//     fontWeight: '800',
//     color: '#1F2937',
//     marginBottom: 8,
//   },
//   subHeading: {
//     fontSize: 16,
//     color: '#6B7280',
//   },
//   formContainer: {
//     width: '100%',
//   },
//   inputContainer: {
//     marginVertical: 10,
//   },
//   label: {
//     fontSize: 16,
//     marginBottom: 8,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//     fontSize: 16,
//     width: '100%',
//   },
//   button: {
//     marginTop: 24,
//     borderRadius: 20,
//     paddingVertical: 15,
//     paddingHorizontal: 100,
//     borderWidth: 2,
//     textAlign: 'center',
//     backgroundColor: '#BDC2BF',
//     width: '100%',
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
// })