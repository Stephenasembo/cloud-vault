import { View, Text, StyleSheet, Image } from "react-native" 
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import ProfileLink from "../../components/ProfileLink";

export default function Profile() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.information}>
          <Image
          source={require('../../assets/avatar.png')}
          style={styles.avatar}
          />
          <Text style={styles.avatarText}>John Doe</Text>
        </View>
        <View style={styles.linksContainer}>
          <ProfileLink
          text='Terms & Conditions'
          />
          <ProfileLink
          text='FAQ & Help'
          />
          <ProfileLink
          text='Settings'
          />
          <ProfileLink
          text='Logout'
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  information: {
    backgroundColor: '#F2FDFF',
    width: '100%',
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatar: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  avatarText: {
    textAlign: 'center',
    marginTop: 10,
    fontWeight: 700,
    fontSize: 24,
  },
  linksContainer: {
    marginVertical: 10,
  },
})