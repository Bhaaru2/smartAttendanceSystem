import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

export default function TeacherDashboard({ navigation }) {
  const [facultyId, setFacultyId] = useState(null);

  useEffect(() => {
    const fetchFaculty = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;

      if (!user) {
        Alert.alert("Error", "User not logged in");
        return;
      }

      const { data: faculty, error } = await supabase
        .from("faculty")
        .select("id")
        .eq("profile_id", user.id)
        .single();

      if (error) {
        Alert.alert("Error", "Faculty record not found");
        return;
      }

      setFacultyId(faculty.id);
    };

    fetchFaculty();
  }, []);

  const handleLogout = async () => {
  await supabase.auth.signOut();
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Teacher Dashboard</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (!facultyId) {
            Alert.alert("Loading", "Faculty data not loaded yet");
            return;
          }

          navigation.navigate("AttendanceSessions", {
            facultyId,
          });
        }}
      >
        <Text style={styles.buttonText}>Manage Attendance Sessions</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#ef4444',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});