import { View, Text, StyleSheet } from "react-native"
import { Link } from 'expo-router'
import { ReactNode } from "react"
import { ChevronRight } from "lucide-react-native";
import { COLORS } from "../app/(auth)";

type ProfileLinkProps = {
  text: string;
  destination: string;
  icon: ReactNode;
}

export default function ProfileLink({ text, destination, icon }: ProfileLinkProps) {
  return (
    <Link
    href={destination}
    >
      <View style={styles.linkContainer}>
        <View style={styles.icon}>
          <View>{icon}</View>
          <Text style={styles.linkText}>{text}</Text>
        </View>
        <ChevronRight />
      </View>
    </Link>
  )
}

const styles = StyleSheet.create({
  linkText: {
    fontSize: 16,
  },

  linkContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  icon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
})