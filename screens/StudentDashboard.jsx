import { View, Text, ScrollView } from "react-native";
import { supabase } from "../services/supabase";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";

import AppContainer from "../components/AppContainer";
import ScreenHeader from "../components/ScreenHeader";
import AppCard from "../components/AppCard";
import DashboardButton from "../components/DashboardButton";
import AttendanceCircle from "../components/AttendanceCircle";
import StatCard from "../components/StatCard";

import { useStudentSubjects } from "../hooks/useStudentSubjects";
import { useStudentAttendance } from "../hooks/useStudentAttendance";
import { useActiveSessions } from "../hooks/useActiveSessions";

export default function StudentDashboard() {
  const route = useRoute();
  const navigation = useNavigation();
const [studentId, setStudentId] = useState(null);
const [loading, setLoading] = useState(true);

  const { data: subjects = [] } = useStudentSubjects(studentId);
  const { data: attendance = [] } = useStudentAttendance(studentId);
  const { data: activeSessions = [] } = useActiveSessions();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  /* ================= Attendance Calculation ================= */

  const attendanceList = Array.isArray(attendance) ? attendance : [];

const total = attendanceList.length;
const present = attendanceList.filter(a => a.status === "present").length;
const percentage = total ? ((present / total) * 100).toFixed(1) : 0;


  useEffect(() => {
  const fetchStudent = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;

    if (!user) {
      setLoading(false);
      return;
    }

    const { data: student } = await supabase
      .from("students")
      .select("id")
      .eq("profile_id", user.id)
      .single();

    if (student) {
      setStudentId(student.id);
    }

    setLoading(false);
  };

  fetchStudent();
}, []);

if (loading) {
  return (
    <AppContainer>
      <ScreenHeader
        title="Student Dashboard"
        subtitle="Loading..."
      />
    </AppContainer>
  );
}

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
          justifyContent: "space-between"
        }}
      >
        <View>

          {/* ================= Attendance Circle ================= */}
          <View style={{ alignItems: "center", marginTop: 20 }}>
            <AttendanceCircle percentage={percentage} />
            <Text style={{ marginTop: 10, color: "#666" }}>
              Overall Attendance
            </Text>
          </View>

          {/* ================= Attendance Stats ================= */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 16,
              marginTop: 30
            }}
          >
            <StatCard label="Total" value={total} icon="calendar-outline" />
            <StatCard label="Present" value={present} icon="checkmark-circle-outline" />
          </View>

          {/* ================= Subjects ================= */}
          <View style={{ paddingHorizontal: 16, marginTop: 30 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>
              My Subjects
            </Text>

            {subjects.map((item) => {
              const activeSession = activeSessions.find(
                (s) => s.subject_id === item.subject.id
              );

              return (
                <AppCard key={item.id}>

                  <Text style={{ fontWeight: "600", fontSize: 16 }}>
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

        {/* ================= Logout ================= */}
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
