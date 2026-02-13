import { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Modal,
    Alert,
} from "react-native";

import { supabase } from "../services/supabase";
import attendanceSessionApi from "../api/attendanceSessionApi";
import { useRoute, useNavigation } from "@react-navigation/native";

import AppContainer from "../components/AppContainer";
import ScreenHeader from "../components/ScreenHeader";
import AppCard from "../components/AppCard";
import PrimaryButton from "../components/PrimaryButton";
import SuccessModal from "../components/SuccessModal";

export default function AttendanceSessionScreen() {
    const route = useRoute();
    const { facultyId } = route.params;
    const navigation = useNavigation();

    const [subjects, setSubjects] = useState([]);
    const [subjectId, setSubjectId] = useState("");
    const [sessions, setSessions] = useState([]);
    const [subjectModalVisible, setSubjectModalVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalType, setModalType] = useState("success");


    const fetchData = async () => {
        const [{ data: s }, sessionData] = await Promise.all([
            supabase.from("subjects").select("id, name"),
            attendanceSessionApi.get(facultyId),
        ]);

        setSubjects(s || []);
        setSessions(sessionData || []);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <AppContainer>
            <ScreenHeader
                title="Attendance Sessions"
                subtitle="Manage your sessions"
            />

            {/* ================= SELECT SUBJECT ================= */}
            <AppCard>
                <TouchableOpacity
                    style={{
                        backgroundColor: "#F8FAFC",
                        padding: 14,
                        borderRadius: 14,
                        borderWidth: 1,
                        borderColor: "#4CA6A8",
                        marginBottom: 16,
                    }}
                    onPress={() => setSubjectModalVisible(true)}
                >
                    <Text
                        style={{
                            color: subjectId ? "#000" : "#999",
                            fontSize: 15,
                            fontWeight: "500",
                        }}
                    >
                        {subjectId
                            ? subjects.find((s) => s.id === subjectId)?.name
                            : "Select Subject"}
                    </Text>
                </TouchableOpacity>

                <PrimaryButton
                    title="Start Session"
                    onPress={() => {
                        if (!subjectId) {
                            setModalMessage("Please select a subject before starting the session.");
                            setModalType("error");
                            setModalVisible(true);
                            return;
                        }

                        navigation.navigate("TeacherAttendance", {
                            facultyId,
                            subjectId,
                        });
                    }}

                />

            </AppCard>

            {/* ================= SESSION LIST ================= */}
            <View style={{ paddingHorizontal: 16, marginTop: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>
                    Previous Sessions
                </Text>
            </View>

            <FlatList
                data={sessions}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
                renderItem={({ item }) => (
                    <AppCard
                        onPress={() =>
                            navigation.navigate("SessionDetails", {
                                sessionId: item.id,
                            })
                        }
                    >
                        <Text style={{ fontWeight: "600", fontSize: 16 }}>
                            {item.subject?.name}
                        </Text>

                        <Text style={{ marginTop: 4, color: "#666" }}>
                            {item.conducted_on}
                        </Text>

                        {item.started_at && (
                            <Text style={{ marginTop: 2, color: "#4CA6A8", fontSize: 13 }}>
                                Started at: {new Date(item.started_at).toLocaleTimeString()}
                            </Text>
                        )}
                    </AppCard>

                )}
            />

            {/* ================= SUBJECT MODAL ================= */}
            <Modal visible={subjectModalVisible} transparent animationType="fade">
                <View
                    style={{
                        flex: 1,
                        backgroundColor: "rgba(0,0,0,0.4)",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <View
                        style={{
                            width: "85%",
                            backgroundColor: "#fff",
                            borderRadius: 20,
                            padding: 20,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: "bold",
                                marginBottom: 12,
                            }}
                        >
                            Select Subject
                        </Text>

                        <FlatList
                            data={subjects}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={{ paddingVertical: 12 }}
                                    onPress={() => {
                                        setSubjectId(item.id);
                                        setSubjectModalVisible(false);
                                    }}
                                >
                                    <Text>{item.name}</Text>
                                </TouchableOpacity>
                            )}
                        />

                        <TouchableOpacity
                            onPress={() => setSubjectModalVisible(false)}
                        >
                            <Text
                                style={{
                                    textAlign: "center",
                                    marginTop: 10,
                                    color: "#4CA6A8",
                                }}
                            >
                                Cancel
                            </Text>
                        </TouchableOpacity>
                    </View>


                </View>
            </Modal>
            <SuccessModal
                visible={modalVisible}
                message={modalMessage}
                type={modalType}
                onClose={() => {
                    setModalVisible(false);
                    setModalType("success");
                }}
            />
        </AppContainer>
    );
}
