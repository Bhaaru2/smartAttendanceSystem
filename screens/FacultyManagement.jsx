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
import facultyApi from "../api/facultyApi";
import { useFaculty } from "../hooks/useFaculty";
import { useFacultyProfiles } from "../hooks/useFacultyProfiles";

export default function FacultyManagement() {
    const [profileId, setProfileId] = useState("");
    const [employeeId, setEmployeeId] = useState("");
    const [department, setDepartment] = useState("");
    const [editingFaculty, setEditingFaculty] = useState(null);

    const { data: faculty = [], isLoading } = useFaculty();
    const { data: profiles = [] } = useFacultyProfiles();

    const availableProfiles = profiles.filter(
        (profile) =>
            !faculty.some((f) => f.profile_id === profile.id)
    );

    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: facultyApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries(["faculty"]);
            Alert.alert("Success", "Faculty created");
            resetForm();
        },
        onError: (error) => Alert.alert("Error", error.message),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => facultyApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(["faculty"]);
            Alert.alert("Success", "Faculty updated");
            resetForm();
        },
        onError: (error) => Alert.alert("Error", error.message),
    });

    const deleteMutation = useMutation({
        mutationFn: facultyApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries(["faculty"]);
            Alert.alert("Success", "Faculty deleted successfully");
        },
        onError: (error) => Alert.alert("Error", error.message),
    });


    const resetForm = () => {
        setProfileId("");
        setEmployeeId("");
        setDepartment("");
        setEditingFaculty(null);
    };

    const handleSubmit = () => {
        if (!profileId || !employeeId) {
            Alert.alert("Validation", "Profile and Employee ID required");
            return;
        }

        if (editingFaculty) {
            updateMutation.mutate({
                id: editingFaculty.id,
                data: { employee_id: employeeId, department },
            });
        } else {
            createMutation.mutate({
                profile_id: profileId,
                employee_id: employeeId,
                department,
            });
        }

    };

    return (
  <View style={{ flex: 1, backgroundColor: "#F6F9FC" }}>

    {/* Header */}
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Faculty Management</Text>
      <Text style={styles.headerSubtitle}>Admin Panel</Text>
    </View>

    <FlatList
      ListHeaderComponent={
        <>
          {/* Add / Update Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {editingFaculty ? "Update Faculty" : "Add Faculty"}
            </Text>

            {editingFaculty ? (
              <View style={styles.input}>
                <Text>{editingFaculty.profile?.name}</Text>
              </View>
            ) : profiles.length === 0 ? (
              <Text style={{ color: "red", marginBottom: 10 }}>
                No faculty profiles left to create
              </Text>
            ) : (
              <View style={styles.input}>
                <Picker
                  selectedValue={profileId}
                  onValueChange={setProfileId}
                >
                  <Picker.Item label="Select Faculty" value="" />
                  {profiles.map((p) => (
                    <Picker.Item
                      key={p.id}
                      label={p.name}
                      value={p.id}
                    />
                  ))}
                </Picker>
              </View>
            )}

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
              style={styles.primaryButton}
              onPress={handleSubmit}
            >
              <Text style={styles.primaryButtonText}>
                {editingFaculty ? "Update Faculty" : "Create Faculty"}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Faculty List</Text>
        </>
      }

      data={faculty}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.listItem}
          onPress={() =>
            Alert.alert("Faculty Options", "What would you like to do?", [
              {
                text: "Update",
                onPress: () => {
                  setEditingFaculty(item);
                  setProfileId(item.profile_id);
                  setEmployeeId(item.employee_id);
                  setDepartment(item.department || "");
                },
              },
              {
                text: "Delete",
                style: "destructive",
                onPress: () =>
                  Alert.alert(
                    "Confirm Delete",
                    "Delete this faculty?",
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Yes, Delete",
                        style: "destructive",
                        onPress: () =>
                          deleteMutation.mutate(item.id),
                      },
                    ]
                  ),
              },
            ])
          }
        >
          <View style={styles.row}>
            <View>
              <Text style={styles.listText}>
                {item.profile?.name}
              </Text>
              <Text style={styles.listSub}>
                ID: {item.employee_id}
              </Text>
              <Text style={styles.listSub}>
                {item.department}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      )}

      contentContainerStyle={{ padding: 16 }}
    />
  </View>
);

}


const styles = StyleSheet.create({
  header: {
    backgroundColor: "#4CA6A8",
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  headerSubtitle: {
    color: "#E0F7F8",
    marginTop: 4,
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

  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },

  input: {
    borderWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },

  primaryButton: {
    backgroundColor: "#4CA6A8",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 6,
  },

  primaryButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  listItem: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 18,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },

  listText: {
    fontWeight: "600",
    fontSize: 15,
  },

  listSub: {
    color: "#666",
    marginTop: 4,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  percentageBox: {
    backgroundColor: "#E6F7F7",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },

  percentageText: {
    fontWeight: "bold",
    color: "#4CA6A8",
  },
});
