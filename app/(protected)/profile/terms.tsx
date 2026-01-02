import { View, Text, StyleSheet } from 'react-native'
import { useThemeContext, ColorTheme } from '../../../context/ThemeContext'
import { useMemo } from 'react';

export default function Faq() {
  const { colors } = useThemeContext();

  const styles = useMemo(() => createThemedStyles(colors), [colors])

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem assumenda, repellendus nobis quam exercitationem dolor, corrupti obcaecati hic libero sit eveniet fugiat sunt est atque commodi dignissimos adipisci? Ipsum, at?
      </Text>
    </View>
  )
}

const createThemedStyles = (colors: ColorTheme) => (
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      alignItems: 'center',
    },
    text: {
      margin: 16,
      color: colors.primary,
    }
  })
)