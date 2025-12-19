import { View, Text, StyleSheet } from "react-native";

export type EmptyStateProps = {
  title: string;
  description: string;
  helperText: string;
};

export default function EmptyState({
  title,
  description,
  helperText,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.helper}>{helperText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: 32,
    marginTop: 48,
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },

  description: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 6,
  },

  helper: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
  },
});
