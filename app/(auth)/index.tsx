import { Link, useRouter } from "expo-router"
import { View, Text, StyleSheet, ScrollView, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from "react-native"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useState, useMemo } from "react";
import { ColorTheme, useThemeContext } from "../../context/ThemeContext";

export default function Home() {
  const navigation = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const { colors } = useThemeContext();

  const styles = useMemo(() => createThemedStyles(colors), [colors]);

  const { width, height } = Dimensions.get("window");
  const messages = [
    "Your files. Always secure.",
    "Access anywhere, anytime.",
    "Simple. Fast. CloudVault."
  ];

  function handleScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.headingContainer}>
          <Text style={styles.headingText}>Welcome to CloudVault</Text>
        </View>
        <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        >
          {messages.map((message, index) => (
            <View
            key={index}
            style={[styles.slide, {width}]}
            >
              <Text style={styles.slideText}>{message}</Text>
            </View>
          ))
          }
        </ScrollView>
        <View style={styles.indicatorContainer}>
          {messages.map((_, index) => (
            <View key={index} style={[styles.indicator, {opacity: activeIndex === index ? 1 : 0.3}]}></View>
          ))}
        </View>

        <View style={styles.linkContainer}>
          <Link
          style={styles.link}
          href='/signup'
          >
            <Text style={styles.linkText}>Sign Up</Text>
          </Link>
          <Link
          style={styles.link}
          href='/login'
          >
            <Text style={styles.linkText}>Login</Text>
          </Link>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const createThemedStyles = (colors: ColorTheme) => (
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: colors.background
    },

    headingContainer: {
      padding: 24,
    },

    headingText: {
      fontSize: 26,
      fontWeight: '800',
      color: colors.primary,
    },

    textContainer: {
      flex: 1,
      justifyContent: 'flex-end'
    },

    indicator: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.primary,
      marginHorizontal: 6,
    },

    slide: {
      justifyContent: "center",
      alignItems: "center",
    },

    slideText: {
      fontSize: 20,
      fontWeight: "500",
      color: colors.mutedText,
      textAlign: "center",
      paddingHorizontal: 20,
    },

    indicatorContainer: {
      flexDirection: "row",
      marginVertical: 32,
    },

    linkContainer: {
      paddingBottom: 32,
    },

    link: {
      marginTop: 24,
      borderRadius: 20,
      paddingVertical: 16,
      paddingHorizontal: 100,
      borderWidth: 2,
      textAlign: 'center',
      backgroundColor: colors.primary,
      borderColor: '#D6E6F2',
    },

    linkText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '700',
    }
  })
)