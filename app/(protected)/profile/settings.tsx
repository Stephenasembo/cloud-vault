import { View, Text, Switch } from "react-native";
import { useThemeContext } from "../../../context/ThemeContext";
import { saveThemePreference } from "../../../storage/preference";

export default function SettingsScreen() {
  const { mode, setUserTheme, colors } = useThemeContext();

  const isDark = mode === "dark";

  return (
    <View style={{ backgroundColor: colors.background ,padding: 16, flex: 1 }}>
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
          onValueChange={(value) => {
            saveThemePreference(value? 'dark' : 'light')
            setUserTheme(value ? "dark" : "light")
          }
          }
        />
      </View>
    </View>
  );
}
