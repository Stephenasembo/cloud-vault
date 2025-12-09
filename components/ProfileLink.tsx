import { View, Text, StyleSheet } from "react-native"

type ProfileLinkProps = {
  text: string
}

export default function ProfileLink({ text }: ProfileLinkProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.linkText}>{text}</Text>
    </View>
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