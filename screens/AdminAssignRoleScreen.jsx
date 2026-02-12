import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import {
  usePendingUsers,
  useAssignRole,
} from "../hooks/usePendingUsers";

export default function AdminAssignRoleScreen() {
  const { data: users = [], isLoading } = usePendingUsers();
  const assignMutation = useAssignRole();

  const handleAssign = (id, role) => {
    assignMutation.mutate(
      { id, role },
      {
        onSuccess: () =>
          Alert.alert("Success", `Assigned as ${role}`),
        onError: (e) =>
          Alert.alert("Error", e.message),
      }
    );
  };

  if (isLoading) return <Text style={{ padding: 20 }}>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assign Role</Text>

      {users.length === 0 && (
        <Text>No pending users</Text>
      )}

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.studentButton}
                onPress={() => handleAssign(item.id, "student")}
              >
                <Text style={styles.buttonText}>Make Student</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.facultyButton}
                onPress={() => handleAssign(item.id, "faculty")}
              >
                <Text style={styles.buttonText}>Make Faculty</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  card: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 12,
  },
  name: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  studentButton: {
    backgroundColor: "#2563eb",
    padding: 10,
    borderRadius: 6,
  },
  facultyButton: {
    backgroundColor: "#16a34a",
    padding: 10,
    borderRadius: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
