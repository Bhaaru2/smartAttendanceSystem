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
    Modal,
} from "react-native";

import { useQueryClient, useMutation } from "@tanstack/react-query";
import facultyApi from "../api/facultyApi";
import { useFaculty } from "../hooks/useFaculty";
import { useFacultyProfiles } from "../hooks/useFacultyProfiles";
import ActionModal from "../components/ActionModal";
import SuccessModal from "../components/SuccessModal";
import ScreenHeader from "../components/ScreenHeader";



export default function FacultyManagement() {
    const [profileId, setProfileId] = useState("");
    const [employeeId, setEmployeeId] = useState("");
    const [department, setDepartment] = useState("");
    const [editingFaculty, setEditingFaculty] = useState(null);
    const [selectedFaculty, setSelectedFaculty] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [successVisible, setSuccessVisible] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [profileModalVisible, setProfileModalVisible] = useState(false);
    const [modalType, setModalType] = useState("success");



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
            setSuccessMessage("Faculty created successfully");
            setSuccessVisible(true);
            resetForm();
        },
        onError: (error) => Alert.alert("Error", error.message),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => facultyApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(["faculty"]);
            setSuccessMessage("Faculty updated successfully");
            setSuccessVisible(true);
            resetForm();
        },
        onError: (error) => Alert.alert("Error", error.message),
    });

    const deleteMutation = useMutation({
        mutationFn: facultyApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries(["faculty"]);
            setSuccessMessage("Faculty deleted successfully");
            setSuccessVisible(true);
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
            setSuccessMessage("Profile and Employee ID required");
            setSuccessVisible(true);
            setModalType("error");

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
            <ScreenHeader
                title="Faculty Management"
                subtitle="Admin Panel"
            />



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
                            ) : availableProfiles.length === 0 ? (
                                <Text style={{ color: "red", marginBottom: 10 }}>
                                    No faculty profiles left to create
                                </Text>
                            ) : (
                                <TouchableOpacity
                                    style={styles.input}
                                    onPress={() => setProfileModalVisible(true)}
                                >
                                    <Text style={{ color: profileId ? "#000" : "#999" }}>
                                        {profileId
                                            ? availableProfiles.find((p) => p.id === profileId)?.name
                                            : "Select Faculty"}
                                    </Text>
                                </TouchableOpacity>

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
                        onPress={() => {
                            setSelectedFaculty(item);
                            setModalVisible(true);
                        }}

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

            <ActionModal
                visible={modalVisible}
                title="Faculty Options"
                onClose={() => setModalVisible(false)}
                actions={[
                    {
                        label: "Update",
                        onPress: () => {
                            setModalVisible(false);
                            setEditingFaculty(selectedFaculty);
                            setProfileId(selectedFaculty.profile_id);
                            setEmployeeId(selectedFaculty.employee_id);
                            setDepartment(selectedFaculty.department || "");
                        },
                    },
                    {
                        label: "Delete",
                        type: "danger",
                        onPress: () => {
                            setModalVisible(false);
                            setDeleteTarget(selectedFaculty);
                            setDeleteModalVisible(true);
                        },
                    },
                ]}
            />

            <Modal transparent visible={deleteModalVisible} animationType="fade">
                <View style={styles.overlay}>
                    <View style={styles.modal}>
                        <Text style={styles.modalTitle}>Delete Faculty?</Text>
                        <Text style={{ marginTop: 10, textAlign: "center" }}>
                            This action cannot be undone.
                        </Text>

                        <View style={{ flexDirection: "row", marginTop: 20 }}>
                            <TouchableOpacity
                                style={styles.cancelBtn}
                                onPress={() => setDeleteModalVisible(false)}
                            >
                                <Text>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.deleteBtn}
                                onPress={() => {
                                    if (deleteTarget) {
                                        deleteMutation.mutate(deleteTarget.id);
                                    }
                                    setDeleteModalVisible(false);
                                }}
                            >
                                <Text style={{ color: "#fff" }}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                visible={profileModalVisible}
                transparent
                animationType="fade"
            >
                <View style={styles.overlay}>
                    <View style={styles.modal}>
                        <Text style={styles.modalTitle}>Select Faculty</Text>

                        <FlatList
                            data={availableProfiles}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.modalOption}
                                    onPress={() => {
                                        setProfileId(item.id);
                                        setProfileModalVisible(false);
                                    }}
                                >
                                    <Text style={{ fontSize: 16 }}>
                                        {item.name}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />

                        <TouchableOpacity
                            style={{ marginTop: 15, alignItems: "center" }}
                            onPress={() => setProfileModalVisible(false)}
                        >
                            <Text style={{ color: "#4CA6A8", fontWeight: "bold" }}>
                                Cancel
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <SuccessModal
                visible={successVisible}
                message={successMessage}
                type={modalType}
                onClose={() => {
                    setSuccessVisible(false);
                    setModalType("success");
                }}
            />


        </View>
    );

}


const styles = StyleSheet.create({
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
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },

    modal: {
        backgroundColor: "#fff",
        width: "80%",
        borderRadius: 20,
        padding: 20,
    },

    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
    },

    cancelBtn: {
        flex: 1,
        padding: 12,
        backgroundColor: "#eee",
        borderRadius: 10,
        marginRight: 10,
        alignItems: "center",
    },

    deleteBtn: {
        flex: 1,
        padding: 12,
        backgroundColor: "#E74C3C",
        borderRadius: 10,
        alignItems: "center",
    },
    modalOption: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: "#eee",
    },


});
