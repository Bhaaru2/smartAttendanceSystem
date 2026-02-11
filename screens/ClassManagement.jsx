import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";

import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useClasses } from "../hooks/useClasses";
import classesApi from "../api/classesApi";

export default function ClassManagement() {
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [section, setSection] = useState("");

  const { data: classes = [], isLoading } = useClasses();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: classesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries(["classes"]);

      Alert.alert("Success", "Class created");

      setName("");
      setYear("");
      setSection("");
    },
    onError: (error) => {
      Alert.alert("Error", error.message);
    },
  });

  const handleCreate = () => {
    if (!name || !year || !section) {
      Alert.alert("Validation", "All fields required");
      return;
    }

    createMutation.mutate({
      name,
      year: Number(year),
      section,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Class Management (Admin)</Text>

      <View style={styles.card}>
        <TextInput
          placeholder="Class Name (e.g. BTech CSE 3rd Year A)"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <TextInput
          placeholder="Year (1-4)"
          value={year}
          onChangeText={setYear}
          keyboardType="numeric"
          style={styles.input}
        />

        <TextInput
          placeholder="Section (A/B)"
          value={section}
          onChangeText={setSection}
          style={styles.input}
        />

        <TouchableOpacity style={styles.button} onPress={handleCreate}>
          <Text style={styles.buttonText}>Create Class</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>Classes List</Text>

      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={classes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text style={styles.listText}>{item.name}</Text>
              <Text style={styles.listSub}>
                Year {item.year} | Section {item.section}
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
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 8,
  },
  card: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 16,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    padding: 10,
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 12,
    alignItems: "center",
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
