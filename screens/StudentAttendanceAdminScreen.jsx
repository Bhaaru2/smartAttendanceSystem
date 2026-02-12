import { View, Text, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useStudentAttendanceSummary } from "../hooks/useStudentAttendanceSummary";


export default function StudentAttendanceAdminScreen() {
  const route = useRoute();
  const { studentId, name, roll } = route.params;

  const { data, isLoading } = useStudentAttendanceSummary(studentId);

  if (isLoading) return <Text style={{ padding: 20 }}>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{name}</Text>
      <Text>Roll No: {roll}</Text>

      <View style={styles.card}>
        <Text>Total Classes: {data.total}</Text>
        <Text>Present: {data.present}</Text>
        <Text>Absent: {data.absent}</Text>
        <Text>Attendance: {data.percentage}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  card: {
    marginTop: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
});
