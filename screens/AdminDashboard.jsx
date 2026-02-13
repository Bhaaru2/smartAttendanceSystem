import { View, Text, FlatList, ScrollView } from "react-native";
import { supabase } from "../services/supabase";

import AppContainer from "../components/AppContainer";
import ScreenHeader from "../components/ScreenHeader";
import StatCard from "../components/StatCard";
import DashboardButton from "../components/DashboardButton";

import { useStudents } from "../hooks/useStudents";
import { useFaculty } from "../hooks/useFaculty";
import { useClasses } from "../hooks/useClasses";
import { useSubjects } from "../hooks/useSubjects";

export default function AdminDashboard({ navigation }) {
  const { data: students = [] } = useStudents();
  const { data: faculty = [] } = useFaculty();
  const { data: classes = [] } = useClasses();
  const { data: subjects = [] } = useSubjects();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AppContainer>
      <ScreenHeader
        title="Admin Dashboard"
        subtitle="Overview & Management"
      />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ===== STATS SECTION ===== */}
        <View style={{ flexDirection: "row", padding: 10 }}>
          <StatCard
            label="Students"
            value={students.length}
            icon="people-outline"
          />

          <StatCard
            label="Faculty"
            value={faculty.length}
            icon="person-outline"
          />
        </View>

        <View style={{ flexDirection: "row", padding: 10 }}>
          <StatCard
            label="Classes"
            value={classes.length}
            icon="school-outline"
          />

          <StatCard
            label="Subjects"
            value={subjects.length}
            icon="book-outline"
          />
        </View>

        {/* ===== ACTIONS SECTION ===== */}
        <View style={{ padding: 16 }}>
          <DashboardButton
            title="Manage Students"
            icon="people-outline"
            onPress={() => navigation.navigate("StudentManagement")}
          />

          <DashboardButton
            title="Manage Faculty"
            icon="person-outline"
            onPress={() => navigation.navigate("FacultyManagement")}
          />

          <DashboardButton
            title="Manage Classes"
            icon="school-outline"
            onPress={() => navigation.navigate("ClassManagement")}
          />

          <DashboardButton
            title="Manage Subjects"
            icon="book-outline"
            onPress={() => navigation.navigate("SubjectManagement")}
          />

          <DashboardButton
            title="Assign Roles"
            icon="key-outline"
            onPress={() => navigation.navigate("AssignRole")}
          />

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
