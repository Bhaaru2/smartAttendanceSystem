import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { supabase } from "../services/supabase";
import attendanceSessionApi from "../api/attendanceSessionApi";
import { useRoute } from "@react-navigation/native";


export default function AttendanceSessionScreen() {
    const route = useRoute();
    const { facultyId } = route.params;
    const [subjects, setSubjects] = useState([]);
    const [subjectId, setSubjectId] = useState("");
    const [sessions, setSessions] = useState([]);

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

    const handleCreateSession = async () => {
        try {
            const today = new Date();
            const isoDate = today.toISOString().split("T")[0];

            await attendanceSessionApi.create({
                subject_id: subjectId,
                faculty_id: facultyId,
                conducted_on: isoDate,
                started_at: new Date().toISOString(),
            });

            Alert.alert("Success", "Attendance session started");
            fetchData();
        } catch (e) {
            Alert.alert("Error", e.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Attendance Sessions</Text>

            <Picker
                selectedValue={subjectId}
                onValueChange={setSubjectId}
                style={styles.input}
            >
                <Picker.Item label="Select Subject" value="" />
                {subjects.map(s => (
                    <Picker.Item key={s.id} label={s.name} value={s.id} />
                ))}
            </Picker>

            <TouchableOpacity style={styles.button} onPress={handleCreateSession}>
                <Text style={styles.buttonText}>Start Session</Text>
            </TouchableOpacity>

            <FlatList
                data={sessions}
                keyExtractor={i => i.id}
                renderItem={({ item }) => (
                    <View style={styles.listItem}>
                        <Text>{item.subject?.name}</Text>
                        <Text>{item.conducted_on}</Text>
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
    input: {
        borderWidth: 1,
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
        padding: 10,
        borderBottomWidth: 1
    }
});
