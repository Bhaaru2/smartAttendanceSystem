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
import studentApi from "../api/studentApi";

export default function StudentManagement() {
    const [profileId, setProfileId] = useState("");
    const [rollNo, setRollNo] = useState("");
    const [className, setClassName] = useState("");
    const [section, setSection] = useState("");

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [profiles, setProfiles] = useState([]);


    // 🔁 Fetch students
    const fetchStudents = async () => {
        try {
            setLoading(true);
            const data = await studentApi.get();
            setStudents(data || []);
        } catch (error) {
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    };

    // useEffect(() => {
    //     fetchStudents();
    // }, []);

    const fetchStudentProfiles = async () => {
        try {
            const { data, error } = await supabase
                .from("profiles")
                .select("id, name")
                .eq("role", "student");

            if (error) throw error;
            setProfiles(data || []);
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };
    useEffect(() => {
        fetchStudents();
        fetchStudentProfiles();
    }, []);


    // ➕ Create student
    const handleCreateStudent = async () => {
        if (!profileId || !rollNo || !className) {
            Alert.alert("Validation", "Profile ID, Roll No, and Class are required");
            return;
        }

        try {
            await studentApi.create({
                profile_id: profileId,
                roll_no: rollNo,
                class: className,
                section,
            });

            Alert.alert("Success", "Student created successfully");

            // reset form
            setProfileId("");
            setRollNo("");
            setClassName("");
            setSection("");

            // refresh list
            fetchStudents();
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Student Management (Admin)</Text>

            {/* Create Student */}
            <View style={styles.card}>
                <Text style={styles.subtitle}>Add Student</Text>

                <Text style={{ marginBottom: 6 }}>Select Student Profile</Text>

                <View style={styles.input}>
                    <Picker
                        selectedValue={profileId}
                        onValueChange={(value) => setProfileId(value)}
                    >
                        <Picker.Item label="-- Select Student --" value="" />
                        {profiles.map((profile) => (
                            <Picker.Item
                                key={profile.id}
                                label={profile.name}
                                value={profile.id}
                            />
                        ))}
                    </Picker>
                </View>


                <TextInput
                    placeholder="Roll No"
                    value={rollNo}
                    onChangeText={setRollNo}
                    style={styles.input}
                />

                <TextInput
                    placeholder="Class"
                    value={className}
                    onChangeText={setClassName}
                    style={styles.input}
                />

                <TextInput
                    placeholder="Section (optional)"
                    value={section}
                    onChangeText={setSection}
                    style={styles.input}
                />

                <TouchableOpacity style={styles.button} onPress={handleCreateStudent}>
                    <Text style={styles.buttonText}>Create Student</Text>
                </TouchableOpacity>
            </View>

            {/* List Students */}
            <Text style={styles.subtitle}>Students List</Text>

            {loading ? (
                <Text>Loading...</Text>
            ) : (
                <FlatList
                    data={students}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.listItem}>
                            <Text style={styles.listText}>
                                {item.profile?.name || "No Name"} | Roll: {item.roll_no}
                            </Text>
                            <Text style={styles.listSub}>
                                Class: {item.class} {item.section || ""}
                            </Text>
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
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 16,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 8,
    },
    card: {
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ddd",
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 6,
        marginBottom: 10,
    },
    button: {
        backgroundColor: "#2563eb",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 8,
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
