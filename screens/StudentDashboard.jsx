import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { supabase } from "../services/supabase";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useStudentSubjects } from "../hooks/useStudentSubjects";
import { useStudentAttendance } from "../hooks/useStudentAttendance";
import { useActiveSessions } from "../hooks/useActiveSessions";

export default function StudentDashboard() {
  const route = useRoute();
  const navigation = useNavigation();
  const studentId = route?.params?.studentId;

  const { data: subjects = [] } = useStudentSubjects(studentId);
  const { data: attendance = [] } = useStudentAttendance(studentId);
  const { data: activeSessions = [] } = useActiveSessions();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // Attendance Percentage
  const total = attendance.length;
  const present = attendance.filter(a => a.status === "present").length;
  const percentage = total ? ((present / total) * 100).toFixed(1) : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Student Dashboard</Text>

      {/* My Subjects */}
      <Text style={styles.sectionTitle}>My Subjects</Text>

      <FlatList
        data={subjects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const activeSession = activeSessions.find(
            (s) => s.subject_id === item.subject.id
          );

          return (
            <View style={styles.card}>
              <Text style={styles.subjectName}>
                {item.subject.name}
              </Text>

              {activeSession && (
                <TouchableOpacity
                  style={styles.scanButton}
                  onPress={() =>
                    navigation.navigate("StudentScanner", {
                      studentId,
                      sessionId: activeSession.id,
                    })
                  }
                >
                  <Text style={styles.buttonText}>
                    Scan QR (Live)
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          );
        }}
      />

      {/* Attendance Summary */}
      <Text style={styles.sectionTitle}>Attendance Summary</Text>

      <View style={styles.summaryCard}>
        <Text>Total Classes: {total}</Text>
        <Text>Present: {present}</Text>
        <Text>Attendance: {percentage}%</Text>
      </View>
      {/* Logout Button */}
      <TouchableOpacity
        style={[styles.scanButton, { backgroundColor: "#ef4444", marginTop: 20 }]}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>

    </View>
  );
}



const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  scanButton: {
    backgroundColor: "#2563eb",
    padding: 12,
    alignItems: "center",
    borderRadius: 6,
    marginBottom: 20,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 8,
  },
  card: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    marginBottom: 8,
  },
});
