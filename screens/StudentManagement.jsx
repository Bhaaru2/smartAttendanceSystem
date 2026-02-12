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
import studentApi from "../api/studentApi";
import { useStudents } from "../hooks/useStudents";
import { useStudentProfiles } from "../hooks/useStudentProfiles";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useNavigation } from "@react-navigation/native";
import { useStudentAttendanceSummary } from "../hooks/useStudentAttendanceSummary";


function StudentListItem({
    item,
    navigation,
    setEditingStudent,
    setProfileId,
    setRollNo,
    setClassName,
    setSection,
    deleteMutation,
}) {
    const { data: summary } = useStudentAttendanceSummary(item.id);

    return (
        <TouchableOpacity
            style={styles.listItem}
            onPress={() =>
                Alert.alert("Student Options", "What would you like to do?", [
                    {
                        text: "View Attendance",
                        onPress: () =>
                            navigation.navigate("StudentAttendanceAdmin", {
                                studentId: item.id,
                                name: item.profile?.name,
                                roll: item.roll_no,
                            }),
                    },
                    {
                        text: "Update",
                        onPress: () => {
                            setEditingStudent(item);
                            setProfileId(item.profile_id);
                            setRollNo(item.roll_no);
                            setClassName(item.class);
                            setSection(item.section || "");
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
            <View style={styles.row}>
                <View>
                    <Text style={styles.listText}>
                        {item.profile?.name || "No Name"} | Roll: {item.roll_no}
                    </Text>
                    <Text style={styles.listSub}>
                        Class: {item.class} {item.section || ""}
                    </Text>
                </View>

                <View style={styles.percentageBox}>
                    <Text style={styles.percentageText}>
                        {summary?.percentage ?? 0}%
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

export default function StudentManagement() {
    const navigation = useNavigation();

    const [profileId, setProfileId] = useState("");
    const [rollNo, setRollNo] = useState("");
    const [className, setClassName] = useState("");
    const [section, setSection] = useState("");

    const { data: students = [], isLoading } = useStudents();
    const { data: profiles = [] } = useStudentProfiles();
    const [editingStudent, setEditingStudent] = useState(null);


    const queryClient = useQueryClient();


    // 🔁 Fetch students
    const createMutation = useMutation({
        mutationFn: studentApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries(["students"]);

            Alert.alert("Success", "Student created successfully");

            setProfileId("");
            setRollNo("");
            setClassName("");
            setSection("");
        },
        onError: (error) => {
            Alert.alert("Error", error.message);
        },
    });

    const handleCreateStudent = () => {
        if (!profileId || !rollNo || !className) {
            Alert.alert(
                "Validation",
                "Profile ID, Roll No, and Class are required"
            );
            return;
        }

        createMutation.mutate({
            profile_id: profileId,
            roll_no: rollNo,
            class: className,
            section,
        });
    };

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => studentApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(["students"]);
            Alert.alert("Success", "Student updated successfully");
            setEditingStudent(null);
            setProfileId("");
            setRollNo("");
            setClassName("");
            setSection("");
        },
        onError: (error) => {
            Alert.alert("Error", error.message);
        },
    });


    const deleteMutation = useMutation({
        mutationFn: studentApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries(["students"]);
        },
        onError: (error) => {
            Alert.alert("Error", error.message);
        },
    });

    const resetForm = () => {
        setEditingStudent(null);
        setProfileId("");
        setRollNo("");
        setClassName("");
        setSection("");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Student Management (Admin)</Text>

            {/* Create Student */}
            <View style={styles.card}>
                <Text style={styles.subtitle}>Add Student</Text>

                <Text style={{ marginBottom: 6 }}>Select Student Profile</Text>

                {editingStudent ? (
                    // 🔒 UPDATE MODE → Just show name, no dropdown
                    <View style={styles.input}>
                        <Text>{editingStudent.profile?.name}</Text>
                    </View>
                ) : profiles.length === 0 ? (
                    // 🚫 No profiles left
                    <Text style={{ color: "red", marginBottom: 10 }}>
                        No student profiles left to create
                    </Text>
                ) : (
                    // ➕ CREATE MODE → Show dropdown
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
                )}



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

                <TouchableOpacity
                    style={[
                        styles.button,
                        !editingStudent && profiles.length === 0 && { backgroundColor: "#999" },
                    ]}
                    disabled={!editingStudent && profiles.length === 0}

                    onPress={() => {
                        if (editingStudent) {
                            updateMutation.mutate({
                                id: editingStudent.id,
                                data: {
                                    roll_no: rollNo,
                                    class: className,
                                    section,
                                },
                            });
                        } else {
                            handleCreateStudent();
                        }
                    }}
                >
                    <Text style={styles.buttonText}>
                        {editingStudent ? "Update Student" : "Create Student"}
                    </Text>
                </TouchableOpacity>

            </View>

            {/* List Students */}
            <Text style={styles.subtitle}>Students List</Text>

            {isLoading ? (
                <Text>Loading...</Text>
            ) : (
                <FlatList
                    data={students}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <StudentListItem
                            item={item}
                            navigation={navigation}
                            setEditingStudent={setEditingStudent}
                            setProfileId={setProfileId}
                            setRollNo={setRollNo}
                            setClassName={setClassName}
                            setSection={setSection}
                            deleteMutation={deleteMutation}
                        />
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
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    percentageBox: {
        backgroundColor: "#e0f2fe",
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 20,
    },

    percentageText: {
        fontWeight: "bold",
        color: "#2563eb",
    },

});