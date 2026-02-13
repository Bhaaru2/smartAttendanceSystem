import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from "react-native";

import ScreenHeader from "../components/ScreenHeader";
import AppCard from "../components/AppCard";
import PrimaryButton from "../components/PrimaryButton";
import SuccessModal from "../components/SuccessModal";

import {
  usePendingUsers,
  useAssignRole,
} from "../hooks/usePendingUsers";

export default function AdminAssignRoleScreen() {
  const { data: users = [], isLoading } = usePendingUsers();
  const assignMutation = useAssignRole();

  const [successVisible, setSuccessVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleAssign = (id, role) => {
    assignMutation.mutate(
      { id, role },
      {
        onSuccess: () => {
          setSuccessMessage(`Assigned as ${role}`);
          setSuccessVisible(true);
        },
      }
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F6F9FC" }}>

      {/* Header */}
      <ScreenHeader
        title="Assign Roles"
        subtitle="Admin Panel"
      />

      <FlatList
        contentContainerStyle={{ padding: 16 }}
        data={users}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          !isLoading && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No pending users to assign roles.
              </Text>
            </View>
          )
        }
        renderItem={({ item }) => (
          <AppCard>
            <Text style={styles.name}>
              {item.name}
            </Text>

            <View style={styles.buttonRow}>
              <PrimaryButton
                title="Make Student"
                onPress={() =>
                  handleAssign(item.id, "student")
                }
                style={{ flex: 1, marginRight: 8 }}
              />

              <PrimaryButton
                title="Make Faculty"
                onPress={() =>
                  handleAssign(item.id, "faculty")
                }
                style={{
                  flex: 1,
                  backgroundColor: "#2ECC71",
                }}
              />
            </View>
          </AppCard>
        )}
      />

      <SuccessModal
        visible={successVisible}
        message={successMessage}
        onClose={() => setSuccessVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  name: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 14,
  },

  buttonRow: {
    flexDirection: "row",
  },

  emptyContainer: {
    marginTop: 40,
    alignItems: "center",
  },

  emptyText: {
    color: "#777",
    fontSize: 16,
  },
});
