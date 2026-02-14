import { View, Text, FlatList, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import attendanceRecordsApi from "../api/attendanceRecordsApi";
import { useSessionDetails } from "../hooks/useSessionDetails";


export default function SessionDetailsScreen() {
    const route = useRoute();
    const { sessionId } = route.params;

const { data = [], isLoading, error } = useSessionDetails(sessionId);

    if (isLoading) return <Text style={{ padding: 20 }}>Loading...</Text>;
    if (error) return <Text style={{ padding: 20 }}>Error loading data</Text>;
    console.log("SESSION ID:", sessionId);
console.log("DATA:", data);


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Session Details</Text>

            <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.name}>{item.student.profile.name}</Text>
                        <Text>Roll No: {item.student.roll_no}</Text>
                        <Text>
                            Marked At:{" "}
                            {new Date(item.marked_at).toLocaleTimeString()}
                        </Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 16,
    },
    card: {
        padding: 12,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        marginBottom: 10,
    },
    name: {
        fontSize: 16,
        fontWeight: "600",
    },
});
