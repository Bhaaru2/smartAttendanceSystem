import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from "react-native";

import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useClasses } from "../hooks/useClasses";
import classesApi from "../api/classesApi";

import AppContainer from "../components/AppContainer";
import ScreenHeader from "../components/ScreenHeader";
import AppCard from "../components/AppCard";
import PrimaryButton from "../components/PrimaryButton";
import ActionModal from "../components/ActionModal";
import SuccessModal from "../components/SuccessModal";

export default function ClassManagement() {
    const [name, setName] = useState("");
    const [year, setYear] = useState("");
    const [section, setSection] = useState("");

    const [selectedClass, setSelectedClass] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [deleteVisible, setDeleteVisible] = useState(false);

    const [successVisible, setSuccessVisible] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [modalType, setModalType] = useState("success");


    const { data: classes = [], isLoading } = useClasses();
    const queryClient = useQueryClient();

    /* =========================
       CREATE
    ========================== */

    const createMutation = useMutation({
        mutationFn: classesApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries(["classes"]);
            setSuccessMessage("Class created successfully");
            setSuccessVisible(true);
            resetForm();
        },
        onError: (error) => {
            Alert.alert("Error", error.message);
        },
    });

    /* =========================
       DELETE
    ========================== */

    const deleteMutation = useMutation({
        mutationFn: classesApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries(["classes"]);
            setSuccessMessage("Class deleted successfully");
            setSuccessVisible(true);
        },
        onError: (error) => {
            Alert.alert("Error", error.message);
        },
    });

    const resetForm = () => {
        setName("");
        setYear("");
        setSection("");
    };

    const handleCreate = () => {
        if (!name || !year || !section) {
            setSuccessMessage("All fields are required");
            setSuccessVisible(true);
            setModalType("error");

            return;
        }

        createMutation.mutate({
            name,
            year: Number(year),
            section,
        });
    };

    return (
        <AppContainer>
            <ScreenHeader
                title="Class Management"
                subtitle="Admin Panel"
            />

            <FlatList
                ListHeaderComponent={
                    <>
                        {/* ================= ADD CLASS ================= */}
                        <AppCard title="Add Class">

                            <TextInput
                                placeholder="Class Name"
                                value={name}
                                onChangeText={setName}
                                style={{ marginBottom: 12 }}
                            />

                            <TextInput
                                placeholder="Year (1-4)"
                                value={year}
                                onChangeText={setYear}
                                keyboardType="numeric"
                                style={{ marginBottom: 12 }}
                            />

                            <TextInput
                                placeholder="Section (A/B)"
                                value={section}
                                onChangeText={setSection}
                                style={{ marginBottom: 16 }}
                            />

                            <PrimaryButton
                                title="Create Class"
                                onPress={handleCreate}
                            />

                        </AppCard>

                        <View style={{ height: 20 }} />

                        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>
                            Classes
                        </Text>
                    </>
                }
                data={classes}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <AppCard
                        onPress={() => {
                            setSelectedClass(item);
                            setModalVisible(true);
                        }}
                    >
                        <Text style={{ fontWeight: "600", fontSize: 16 }}>
                            {item.name}
                        </Text>
                        <Text style={{ marginTop: 4, color: "#666" }}>
                            Year {item.year} | Section {item.section}
                        </Text>
                    </AppCard>
                )}
            />

            {/* ================= ACTION MODAL ================= */}
            <ActionModal
                visible={modalVisible}
                title="Class Options"
                onClose={() => setModalVisible(false)}
                actions={[
                    {
                        label: "Delete",
                        type: "danger",
                        onPress: () => {
                            setModalVisible(false);
                            setDeleteVisible(true);
                        },
                    },
                ]}
            />

            {/* ================= DELETE CONFIRMATION ================= */}
            <ActionModal
                visible={deleteVisible}
                title="Delete Class?"
                onClose={() => setDeleteVisible(false)}
                actions={[
                    {
                        label: "Cancel",
                        onPress: () => setDeleteVisible(false),
                    },
                    {
                        label: "Confirm Delete",
                        type: "danger",
                        onPress: () => {
                            if (selectedClass) {
                                deleteMutation.mutate(selectedClass.id);
                            }
                            setDeleteVisible(false);
                        },
                    },
                ]}
            />

            {/* ================= SUCCESS MODAL ================= */}
            <SuccessModal
                visible={successVisible}
                message={successMessage}
                type={modalType}
                onClose={() => {
                    setSuccessVisible(false);
                    setModalType("success");
                }}
            />


        </AppContainer>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 20,
        marginBottom: 20,
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
});