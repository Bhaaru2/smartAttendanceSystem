import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../theme/colors";

export default function AppHeader({ title }) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
});
