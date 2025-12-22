import { View, Text, StyleSheet, Image, Button, Alert, Pressable } from "react-native" 
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import ProfileLink from "../../../components/ProfileLink";
import { Link } from "expo-router";
import { supabase } from "../../../lib/supabase";
import { FileText, HelpCircle, Settings, LogOut } from "lucide-react-native";
import { COLORS } from "../../(auth)";
import LogoutModal from "../../../components/LogoutModal";
import { useState } from "react";

export default function Profile() {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  async function logoutUser() {
    const { error } = await supabase.auth.signOut()
    if (error) console.log(`Error on signing out: ${error}`)
      console.log('User signing out...')
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>

        <Text style={styles.sectionTitle}>Account</Text>

        <View style={styles.linksContainer}>
          <ProfileLink
          text='Terms & Conditions'
          destination='/profile/terms'
          icon={<FileText/>}
          />
          <ProfileLink
          text='FAQ & Help'
          destination='/profile/faq'
          icon={<HelpCircle />}
          />
          <ProfileLink
          text='Settings'
          destination='/profile/settings'
          icon={<Settings />}
          />
          <Pressable
          onPress={() => setModalVisible(true)}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16}}>
              <Text style={{ fontSize: 18, color: 'red', fontWeight: '500' }}>Logout</Text>
              <LogOut />
            </View>
          </Pressable>
        </View>
        <LogoutModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onConfirm={logoutUser}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
  },

  sectionTitle: {
    textAlign: 'center',
    marginVertical: 20,
    fontWeight: '600',
    fontSize: 24,
    color: COLORS.primary,
  },
  
  linksContainer: {
    marginVertical: 10,
    flex: 1,
    justifyContent: 'space-evenly',
    paddingHorizontal: 16,
  },
})