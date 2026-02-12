import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import QRCode from "react-native-qrcode-svg";
import attendanceSessionApi from "../api/attendanceSessionApi";
import { useRoute } from "@react-navigation/native";

export default function TeacherAttendanceScreen() {
  const route = useRoute();
  const { facultyId, subjectId } = route.params;

  const [session, setSession] = useState(null);
  const [timeLeft, setTimeLeft] = useState(120);

  const handleStartSession = async () => {
    try {
      const newSession = await attendanceSessionApi.create({
        subject_id: subjectId,
        faculty_id: facultyId,
      });

      setSession(newSession);
      startCountdown(newSession.expires_at);
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  };

  const handleEndSession = async () => {
    try {
      await attendanceSessionApi.end(session.id);
      setSession(null);
      Alert.alert("Session Ended");
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  };

  const startCountdown = (expiryTime) => {
    const expiry = new Date(expiryTime).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = Math.floor((expiry - now) / 1000);

      if (diff <= 0) {
        clearInterval(interval);
        setSession(null);
      } else {
        setTimeLeft(diff);
      }
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Live Attendance</Text>

      {!session ? (
        <TouchableOpacity style={styles.button} onPress={handleStartSession}>
          <Text style={styles.buttonText}>Start Attendance</Text>
        </TouchableOpacity>
      ) : (
        <>
          <QRCode
            value={JSON.stringify({
              session_id: session.id,
              expires_at: session.expires_at,
            })}
            size={250}
            // logo={require("../assets/logo.png")}
            // logoSize={40}
            ecl="H"
          />

          <Text style={styles.timer}>
            Expires in: {timeLeft}s
          </Text>

          <TouchableOpacity style={styles.endButton} onPress={handleEndSession}>
            <Text style={styles.buttonText}>End Session</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 15,
    borderRadius: 8,
  },
  endButton: {
    backgroundColor: "#ef4444",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  timer: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: "600",
  },
});
