import { View, Text, Switch } from "react-native";
import { useThemeContext } from "../../../context/ThemeContext";

export default function SettingsScreen() {
  const { mode, setUserTheme, colors } = useThemeContext();

  const isDark = mode === "dark";

  return (
    <View style={{ padding: 16 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ color: colors.primary, fontSize: 16 }}>
          Dark mode
        </Text>

        <Switch
          value={isDark}
          onValueChange={(value) =>
            setUserTheme(value ? "dark" : "light")
          }
        />
      </View>
    </View>
  );
}
