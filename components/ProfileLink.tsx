import { View, Text, StyleSheet } from "react-native"
import { Link } from 'expo-router'
import { ReactNode, useMemo } from "react"
import { ChevronRight } from "lucide-react-native";
import { ColorTheme, useThemeContext } from "../context/ThemeContext";

type ProfileLinkProps = {
  text: string;
  destination: string;
  icon: ReactNode;
}

export default function ProfileLink({ text, destination, icon }: ProfileLinkProps) {
  const { colors } = useThemeContext();

  const styles = useMemo(() => createThemedStyles(colors), [colors])
  return (
    <Link
    href={destination}
    >
      <View style={styles.linkContainer}>
        <View style={styles.icon}>
          <View>{icon}</View>
          <Text style={styles.linkText}>{text}</Text>
        </View>
        <ChevronRight color={colors.linkText}/>
      </View>
    </Link>
  )
}

const createThemedStyles = (colors: ColorTheme) => (
  StyleSheet.create({
    linkText: {
      fontSize: 16,
      color: colors.linkText
    },

    linkContainer: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },

    icon: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
  })
)