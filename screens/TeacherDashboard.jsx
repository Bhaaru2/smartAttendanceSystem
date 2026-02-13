import { useEffect, useState } from "react";
import { View, ScrollView, ActivityIndicator, Alert } from "react-native";
import { supabase } from "../services/supabase";

import AppContainer from "../components/AppContainer";
import ScreenHeader from "../components/ScreenHeader";
import DashboardButton from "../components/DashboardButton";
import StatCard from "../components/StatCard";

export default function TeacherDashboard({ navigation }) {
  const [facultyId, setFacultyId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [facultyName, setFacultyName] = useState("");


  useEffect(() => {
    const fetchFaculty = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;

      if (!user) {
        Alert.alert("Error", "User not logged in");
        setLoading(false);
        return;
      }

      // Get name from auth metadata
      setFacultyName(user.user_metadata?.full_name || "Teacher");

      const { data: faculty, error } = await supabase
        .from("faculty")
        .select("id")
        .eq("profile_id", user.id)
        .single();

      if (error || !faculty) {
        setFacultyId(null);
        setLoading(false);
        return;
      }

      setFacultyId(faculty.id);
      setLoading(false);
    };

    fetchFaculty();
  }, []);


  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <AppContainer>
        <ScreenHeader title="Teacher Dashboard" subtitle="Loading..." />
        <ActivityIndicator size="large" style={{ marginTop: 40 }} />
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      <ScreenHeader
        title="Teacher Dashboard"
        subtitle="Attendance Management"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "space-between"
        }}
      >
        <View>

          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 16,
              marginTop: 20,
              marginBottom: 30,
              justifyContent: "space-between"
            }}
          >
            <StatCard
              label="Welcome"
              value={facultyName}
              icon="person-outline"
            />

            <StatCard
              label="Status"
              value={facultyId ? "Active" : "Not Assigned"}
              icon={
                facultyId
                  ? "checkmark-circle-outline"
                  : "alert-circle-outline"
              }
            />
          </View>

          <View style={{ paddingHorizontal: 16 }}>
            <DashboardButton
              title="Manage Attendance Sessions"
              icon="qr-code-outline"
              disabled={!facultyId}
              onPress={() => {
                if (!facultyId) {
                  Alert.alert(
                    "Not Assigned",
                    "You are not assigned as faculty yet. Contact admin."
                  );
                  return;
                }

                navigation.navigate("AttendanceSessions", {
                  facultyId,
                });
              }}
            />
          </View>

        </View>

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
