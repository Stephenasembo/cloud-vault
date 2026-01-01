import { useState, useMemo } from "react";
import { View, Text, TextInput, StyleSheet, Pressable, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";
import { useDeviceContext } from "../../context/DeviceContext";
import { ColorTheme, useThemeContext } from "../../context/ThemeContext";

export default function SignUp() {
  const { networkStatus } = useDeviceContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { colors } = useThemeContext();

  const styles = useMemo(() => createThemedStyles(colors), [colors]);

  async function signUpUser() {
    if(networkStatus === 'offline') {
      Alert.alert(
        'No internet connection',
        'Please connect to the internet to sign up.'
      );
      return;
    }
    try{
      setLoading(true);
      const {
        data: { session },
        error
      } = await supabase.auth.signUp({
        email, password
      })

      if (error) {
        Alert.alert('Sign up failed', error.message);
        return;
      }
      if (!session) Alert.alert(
        'Check your inbox',
        'Please verify your email to continue.'
      )
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
            <Text style={styles.heading}>Create your CloudVault</Text>
            <Text style={styles.subHeading}>Store your files securely</Text>
          </View>
          {networkStatus === 'offline' && (
            <View style={styles.networkInfoContainer}>
              <Text style={styles.networkInfoText}>You are offline. Please connect to the internet to sign up.</Text>
            </View>
          )}
          <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="johndoe@gmail.com"
                  placeholderTextColor={colors.mutedText}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.mutedText}
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
            onPress={signUpUser}
            disabled={networkStatus === 'offline' || loading}
            >
              <Text style={styles.buttonText}>
                {networkStatus === 'offline' ? 'You are offline' :
                loading ? 'Creating account...' : 'Create Account'}
              </Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  )
}

export const createThemedStyles = (colors: ColorTheme) => (
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    headerContainer: {
      marginBottom: 40,
      alignItems: 'center',
    },
    heading: {
      fontSize: 28,
      fontWeight: '800',
      color: colors.primary,
      marginBottom: 8,
    },
    subHeading: {
      fontSize: 16,
      color: colors.mutedText,
    },
    networkInfoContainer: {
      alignItems: 'center',
      marginBottom: 24,
    },
    networkInfoText: {
      color: colors.mutedText,
      fontWeight: '600',
      textAlign: 'center',
    },
    formContainer: {
      width: '100%',
    },
    inputContainer: {
      marginVertical: 16,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.primary,
      marginBottom: 8,
    },
    input: {
      backgroundColor: 'white',
      borderWidth: 1,
      borderColor: '#D6E6F2',
      borderRadius: 14,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 16,
      color: colors.primary,
    },
    button: {
      marginTop: 20,
      borderRadius: 20,
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderWidth: 1,
      alignItems: 'center',
      borderColor: '#D6E6F2',
      backgroundColor: colors.primary,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '700',
    },
    primaryButtonPressed: {
      transform: [{ scale: 0.9 }],
      shadowOpacity: 0.1,
      elevation: 2,
    },
  })
)