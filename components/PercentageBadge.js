import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../theme/colors";

export default function PercentageBadge({ value }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{value}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: COLORS.accent,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  text: {
    fontWeight: "bold",
    color: "#fff",
  },
});
