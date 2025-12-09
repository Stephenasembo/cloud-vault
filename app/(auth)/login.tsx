import { View, Text, TextInput, StyleSheet, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
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
                <Text style={styles.label}>Username</Text>
                <TextInput
                  style={styles.input}
                  placeholder="John Doe"
                  placeholderTextColor="#A0A0A0"
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#A0A0A0"
                  secureTextEntry
                />
            </View>
            <Pressable style={styles.button}>
              <Text style={styles.buttonText}>Create Account</Text>
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
  },
})