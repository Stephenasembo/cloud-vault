import { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";
import { useAuthContext } from "../../context/AuthContext";

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

      if (error) console.log(error.message)
      setLoading(false)
    } catch (error) {
      console.error(error)
    }
  }

  async function handleSubmit() {
    setLoading(true);
    await loginUser();
    setLoading(false);
  }

  return (
    <SafeAreaProvider>
      <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.heading}>Login</Text>
            <Text style={styles.subHeading}>Login back to your account</Text>
          </View>
          <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="johndoe@gmail.com"
                  placeholderTextColor="#A0A0A0"
                  onChangeText={(e) => setEmail(e)}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#A0A0A0"
                  secureTextEntry
                  onChangeText={(e) => setPassword(e)}
                />
            </View>
            <Pressable
            style={styles.button}
            onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>Login</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  headerContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  heading: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 8,
  },
  subHeading: {
    fontSize: 16,
    color: '#6B7280',
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    width: '100%',
  },
  button: {
    marginTop: 24,
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 100,
    borderWidth: 2,
    textAlign: 'center',
    backgroundColor: '#BDC2BF',
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
})