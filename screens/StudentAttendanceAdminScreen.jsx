import { View, Text, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useStudentAttendanceSummary } from "../hooks/useStudentAttendanceSummary";

import AttendanceCircle from "../components/AttendanceCircle";
import ScreenHeader from "../components/ScreenHeader";


export default function StudentAttendanceAdminScreen() {
  const route = useRoute();
  const { studentId, name, roll } = route.params;

  const { data, isLoading } = useStudentAttendanceSummary(studentId);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <Text>Loading attendance...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F6F9FC" }}>

      {/* Header */}
      <ScreenHeader
        title="Attendance Details"
        subtitle="Admin View"
      />


      <View style={{ padding: 16 }}>

        {/* Student Info Card */}
        <View style={styles.card}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.roll}>Roll No: {roll}</Text>
        </View>


        {/* Percentage Circle */}
        <View style={styles.percentageContainer}>
          <AttendanceCircle percentage={data?.percentage ?? 0} size={120} />
          <Text style={styles.percentageLabel}>
            Overall Attendance
          </Text>
        </View>


        {/* Stats Card */}
        <View style={styles.card}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Total Classes</Text>
            <Text style={styles.statValue}>{data.total}</Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Present</Text>
            <Text style={[styles.statValue, { color: "#2ECC71" }]}>
              {data.present}
            </Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Absent</Text>
            <Text style={[styles.statValue, { color: "#E74C3C" }]}>
              {data.absent}
            </Text>
          </View>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },

  name: {
    fontSize: 18,
    fontWeight: "bold",
  },

  roll: {
    marginTop: 4,
    color: "#666",
  },

  percentageContainer: {
    alignItems: "center",
    marginBottom: 25,
  },

  percentageLabel: {
    marginTop: 10,
    color: "#666",
  },

  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  statLabel: {
    fontSize: 15,
    color: "#555",
  },

  statValue: {
    fontSize: 16,
    fontWeight: "bold",
  },

});
