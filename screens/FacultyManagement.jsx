import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
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
import facultyApi from "../api/facultyApi";

export default function FacultyManagement() {
    const [profileId, setProfileId] = useState("");
    const [employeeId, setEmployeeId] = useState("");
    const [department, setDepartment] = useState("");

    const [faculty, setFaculty] = useState([]);
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchFaculty = async () => {
        try {
            setLoading(true);
            const data = await facultyApi.get();
            setFaculty(data || []);
        } catch (e) {
            Alert.alert("Error", e.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchFacultyProfiles = async () => {
        try {
            const { data, error } = await supabase
                .from("profiles")
                .select("id, name")
                .eq("role", "faculty");

            if (error) throw error;
            setProfiles(data || []);
        } catch (e) {
            Alert.alert("Error", e.message);
        }
    };

    useEffect(() => {
        fetchFaculty();
        fetchFacultyProfiles();
    }, []);

    const handleCreateFaculty = async () => {
        if (!profileId || !employeeId) {
            Alert.alert("Validation", "Profile and Employee ID required");
            return;
        }

        try {
            await facultyApi.create({
                profile_id: profileId,
                employee_id: employeeId,
                department,
            });

            Alert.alert("Success", "Faculty created");

            setProfileId("");
            setEmployeeId("");
            setDepartment("");

            fetchFaculty();
        } catch (e) {
            Alert.alert("Error", e.message);
        }
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

                <TouchableOpacity style={styles.button} onPress={handleCreateFaculty}>
                    <Text style={styles.buttonText}>Create Faculty</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.subtitle}>Faculty List</Text>

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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center"
    },
    subtitle: {
        fontSize: 16,
        fontWeight: "600",
        marginVertical: 8
    },
    card: {
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 16,
        marginBottom: 16
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        marginBottom: 10
    },
    button: {
        backgroundColor: "#2563eb",
        padding: 12,
        alignItems: "center"
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold"
    },
    listItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderColor: "#eee"
    },
    listText: {
        fontWeight: "600"
    },
    listSub: {
        color: "#555"
    },
});
