import { Link, useRouter } from "expo-router"
import { View, Text, StyleSheet, ImageBackground, Pressable } from "react-native"

export default function Home() {
  const navigation = useRouter();

  return (
    <View style={styles.container}>
      <ImageBackground
      source={require('../../assets/background.jpg')}
      style={styles.backgroundImage}
      >
        <View style={styles.textContainer}>
          <Text style={styles.backgroundText}>Splash screen</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Link
          style={styles.button}
          href='/signup'
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </Link>
          <Link
          style={styles.button}
          href='/login'
          >
            <Text style={styles.buttonText}>Login</Text>
          </Link>
        </View>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  backgroundImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backgroundText: {
    color: 'white',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  button: {
    marginTop: 10,
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 100,
    borderWidth: 2,
    textAlign: 'center',
    backgroundColor: '#BDC2BF',
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
  }
})