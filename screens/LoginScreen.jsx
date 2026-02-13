import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useState } from "react";
import { supabase } from "../services/supabase";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Please enter both email and password");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <View style={styles.container}>

      {/* Logo */}
      <Ionicons name="school" size={80} color="#4CA6A8" />
      <Text style={styles.title}>Login</Text>

      {/* Email */}
      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#999" />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          style={styles.input}
        />
      </View>

      {/* Password */}
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#999" />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
      </View>

      {/* Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Logging in..." : "Login"}
        </Text>
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
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
    width: "100%",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    padding: 12,
  },
  button: {
    backgroundColor: "#4CA6A8",
    paddingVertical: 14,
    width: "100%",
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
