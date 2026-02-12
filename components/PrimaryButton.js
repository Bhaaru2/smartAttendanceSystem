import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { COLORS } from "../theme/colors";

export default function PrimaryButton({ title, onPress, disabled }) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        disabled && { backgroundColor: "#A1A1AA" },
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
