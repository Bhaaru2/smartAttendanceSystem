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
                data: { profile_id: profileId, employee_id: employeeId, department },
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
        <View style={styles.container}>
            <Text style={styles.title}>Faculty Management (Admin)</Text>

            <View style={styles.card}>
                <Picker
                    selectedValue={profileId}
                    onValueChange={setProfileId}
                    style={styles.input}
                >
                    <Picker.Item label="-- Select Faculty --" value="" />
                    {profiles.map((p) => (
                        <Picker.Item key={p.id} label={p.name} value={p.id} />
                    ))}
                </Picker>

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

                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>
                        {editingFaculty ? "Update Faculty" : "Create Faculty"}
                    </Text>
                </TouchableOpacity>
            </View>

            {isLoading ? (
                <Text>Loading...</Text>
            ) : (
                <FlatList
                    data={faculty}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.listItem}
                            onPress={() =>
                                Alert.alert("Faculty Options", "", [
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
                                    { text: "Cancel", style: "cancel" },
                                ])
                            }
                        >
                            <Text style={styles.listText}>
                                {item.profile?.name} | {item.employee_id}
                            </Text>
                            <Text style={styles.listSub}>{item.department}</Text>
                        </TouchableOpacity>
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
