import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function StatCard({ label, value, icon }) {
  return (
    <View style={styles.card}>
      <Ionicons name={icon} size={26} color="#4CA6A8" />
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 20,
    margin: 8,
    alignItems: "center",
    elevation: 4,
  },

  value: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 8,
  },

  label: {
    marginTop: 4,
    color: "#666",
  },
});
