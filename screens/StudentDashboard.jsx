import { View, Text, ScrollView } from "react-native";
import { supabase } from "../services/supabase";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import attendanceRecordsApi from "../api/attendanceRecordsApi";

import AppContainer from "../components/AppContainer";
import ScreenHeader from "../components/ScreenHeader";
import AppCard from "../components/AppCard";
import DashboardButton from "../components/DashboardButton";
import AttendanceCircle from "../components/AttendanceCircle";
import StatCard from "../components/StatCard";

import { useStudentSubjects } from "../hooks/useStudentSubjects";
import { useActiveSessions } from "../hooks/useActiveSessions";

export default function StudentDashboard() {
  const navigation = useNavigation();

  /* ================= STUDENT PROFILE ================= */

  const {
    data: student,
    isLoading: studentLoading,
  } = useQuery({
    queryKey: ["studentProfile"],
    queryFn: async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;

      if (!user) return null;

      const { data, error } = await supabase
        .from("students")
        .select("id, roll_no, class, section")
        .eq("profile_id", user.id)
        .single();

      if (error) throw new Error(error.message);

      return data;
    },
  });

  const studentId = student?.id;

  /* ================= STUDENT STATS ================= */

  const {
    data: stats = { total: 0, present: 0 },
  } = useQuery({
    queryKey: ["studentStats", studentId],
    queryFn: () => attendanceRecordsApi.getStudentStats(studentId),
    enabled: !!studentId,
  });

  /* ================= SUBJECTS ================= */

  const { data: subjects = [] } = useStudentSubjects(studentId);
  const { data: activeSessions = [] } = useActiveSessions();

  /* ================= ATTENDANCE CALC ================= */

  const total = stats.total;
  const present = stats.present;
  const percentage = total
    ? ((present / total) * 100).toFixed(1)
    : 0;

  /* ================= LOGOUT ================= */

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  /* ================= LOADING STATE ================= */

  if (studentLoading) {
    return (
      <AppContainer>
        <ScreenHeader
          title="Student Dashboard"
          subtitle="Loading..."
        />
      </AppContainer>
    );
  }

  /* ================= UI ================= */

  return (
    <AppContainer>
      <ScreenHeader
        title="Student Dashboard"
        subtitle="Track your attendance"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "space-between",
        }}
      >
        <View>

          {/* ================= STUDENT INFO CARD ================= */}

          {student && (
            <View style={{ paddingHorizontal: 16, marginTop: 20 }}>
              <AppCard>
                <Text style={{ fontWeight: "600", fontSize: 16 }}>
                  Roll No: {student.roll_no}
                </Text>
                <Text style={{ marginTop: 4, color: "#666" }}>
                  Class: {student.class}
                </Text>
                <Text style={{ marginTop: 2, color: "#666" }}>
                  Section: {student.section}
                </Text>
              </AppCard>
            </View>
          )}

          {/* ================= ATTENDANCE CIRCLE ================= */}

          <View style={{ alignItems: "center", marginTop: 30 }}>
            <AttendanceCircle percentage={percentage} />
            <Text style={{ marginTop: 10, color: "#666" }}>
              Overall Attendance
            </Text>
          </View>

          {/* ================= STATS CARDS ================= */}

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 16,
              marginTop: 30,
            }}
          >
            <StatCard
              label="Total"
              value={total}
              icon="calendar-outline"
            />
            <StatCard
              label="Present"
              value={present}
              icon="checkmark-circle-outline"
            />
          </View>

          {/* ================= SUBJECTS ================= */}

          <View style={{ paddingHorizontal: 16, marginTop: 30 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 12,
              }}
            >
              My Subjects
            </Text>

            {subjects.map((item) => {
              const activeSession = activeSessions.find(
                (s) => s.subject_id === item.subject.id
              );

              return (
                <AppCard key={item.id}>
                  <Text
                    style={{
                      fontWeight: "600",
                      fontSize: 16,
                    }}
                  >
                    {item.subject.name}
                  </Text>

                  {activeSession && (
                    <View style={{ marginTop: 12 }}>
                      <DashboardButton
                        title="Scan QR (Live)"
                        icon="qr-code-outline"
                        onPress={() =>
                          navigation.navigate("StudentScanner", {
                            studentId,
                            sessionId: activeSession.id,
                          })
                        }
                      />
                    </View>
                  )}
                </AppCard>
              );
            })}
          </View>
        </View>

        {/* ================= LOGOUT ================= */}

        <View style={{ padding: 16 }}>
          <DashboardButton
            title="Logout"
            icon="log-out-outline"
            onPress={handleLogout}
          />
        </View>
      </ScrollView>
    </AppContainer>
  );
}
