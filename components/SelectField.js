import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function SelectField({ value, placeholder, onPress }) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text
        style={[
          styles.text,
          { color: value ? "#000" : "#999" },
        ]}
      >
        {value || placeholder}
      </Text>

      <Text style={styles.arrow}>▼</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F8FAFC",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  text: {
    fontSize: 15,
    fontWeight: "500",
  },

  arrow: {
    fontSize: 12,
    color: "#666",
  },
});
