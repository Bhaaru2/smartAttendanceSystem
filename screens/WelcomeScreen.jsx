import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>

      {/* Logo */}
      <View style={styles.logoContainer}>
        <Text style={styles.logoIcon}>🎓</Text>
        <View style={styles.checkBadge}>
          <Text style={{ color: "#fff", fontWeight: "bold" }}>✓</Text>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>Smart Attendance</Text>
      <Text style={styles.subtitle}>
        Track • Manage • Verify
      </Text>

      {/* Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.replace("Login")}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  logoContainer: {
    position: "relative",
    marginBottom: 30,
  },
  logoIcon: {
    fontSize: 90,
    color: "#4CA6A8",
  },
  checkBadge: {
    position: "absolute",
    bottom: 10,
    right: -5,
    backgroundColor: "#E57373",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#777",
    marginBottom: 50,
  },
  button: {
    backgroundColor: "#4CA6A8",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
