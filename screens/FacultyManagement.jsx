import { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";

import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useFaculty } from "../hooks/useFaculty";
import { useFacultyProfiles } from "../hooks/useFacultyProfiles";
import facultyApi from "../api/facultyApi";

export default function FacultyManagement() {
  const [profileId, setProfileId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [department, setDepartment] = useState("");

  const { data: faculty = [], isLoading } = useFaculty();
  const { data: profiles = [] } = useFacultyProfiles();

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: facultyApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries(["faculty"]);

      Alert.alert("Success", "Faculty created");

      setProfileId("");
      setEmployeeId("");
      setDepartment("");
    },
    onError: (error) => {
      Alert.alert("Error", error.message);
    },
  });

  const handleCreateFaculty = () => {
    if (!profileId || !employeeId) {
      Alert.alert("Validation", "Profile and Employee ID required");
      return;
    }

    createMutation.mutate({
      profile_id: profileId,
      employee_id: employeeId,
      department,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Faculty Management (Admin)</Text>

      <View style={styles.card}>
        <Text style={styles.subtitle}>Add Faculty</Text>

        <View style={styles.input}>
          <Picker selectedValue={profileId} onValueChange={setProfileId}>
            <Picker.Item label="-- Select Faculty --" value="" />
            {profiles.map((p) => (
              <Picker.Item key={p.id} label={p.name} value={p.id} />
            ))}
          </Picker>
        </View>

        <TextInput
          placeholder="Employee ID"
          value={employeeId}
          onChangeText={setEmployeeId}
          style={styles.input}
        />

        <TextInput
          placeholder="Department"
          value={department}
          onChangeText={setDepartment}
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleCreateFaculty}
        >
          <Text style={styles.buttonText}>Create Faculty</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>Faculty List</Text>

      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={faculty}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text style={styles.listText}>
                {item.profile?.name} | {item.employee_id}
              </Text>
              <Text style={styles.listSub}>{item.department}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 8,
  },
  card: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 16,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  listItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  listText: {
    fontWeight: "600",
  },
  listSub: {
    color: "#555",
  },
});
