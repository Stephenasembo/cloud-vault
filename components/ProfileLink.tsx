import { View, Text, StyleSheet } from "react-native"
import { Link } from 'expo-router'

type ProfileLinkProps = {
  text: string;
  destination: string;
}

export default function ProfileLink({ text, destination }: ProfileLinkProps) {
  return (
    <Link
    style={styles.container}
    href={destination}
    >
      <View>
        <Text style={styles.linkText}>{text}</Text>
      </View>
    </Link>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 10
  },
  linkText: {
    fontSize: 16,
  }
})