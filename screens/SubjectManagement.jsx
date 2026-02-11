import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useQueryClient, useMutation } from "@tanstack/react-query";

import { useSubjects } from "../hooks/useSubjects";
import { useFacultyList } from "../hooks/useFacultyList";
import { useClassesList } from "../hooks/useClassesList";
import subjectsApi from "../api/subjectsApi";

export default function SubjectManagement() {
  const [name, setName] = useState("");
  const [facultyId, setFacultyId] = useState("");
  const [classId, setClassId] = useState("");
  const [section, setSection] = useState("");

  const { data: subjects = [], isLoading } = useSubjects();
  const { data: faculty = [] } = useFacultyList();
  const { data: classes = [] } = useClassesList();

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: subjectsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries(["subjects"]);

      Alert.alert("Success", "Subject created");

      setName("");
      setFacultyId("");
      setClassId("");
      setSection("");
    },
    onError: (error) => {
      Alert.alert("Error", error.message);
    },
  });

  const handleCreate = () => {
    if (!name || !facultyId || !classId || !section) {
      Alert.alert("Validation", "All fields required");
      return;
    }

    const selectedClass = classes.find((c) => c.id === classId);

    createMutation.mutate({
      name,
      faculty_id: facultyId,
      class_id: classId,
      classText: selectedClass?.name,
      section,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Subject Management (Admin)</Text>

      <TextInput
        placeholder="Subject Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <Picker
        selectedValue={facultyId}
        onValueChange={setFacultyId}
        style={styles.input}
      >
        <Picker.Item label="Select Faculty" value="" />
        {faculty.map((f) => (
          <Picker.Item
            key={f.id}
            label={f.profile?.name}
            value={f.id}
          />
        ))}
      </Picker>

      <Picker
        selectedValue={classId}
        onValueChange={setClassId}
        style={styles.input}
      >
        <Picker.Item label="Select Class" value="" />
        {classes.map((c) => (
          <Picker.Item key={c.id} label={c.name} value={c.id} />
        ))}
      </Picker>

      <TextInput
        placeholder="Section"
        value={section}
        onChangeText={setSection}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleCreate}>
        <Text style={styles.buttonText}>Create Subject</Text>
      </TouchableOpacity>

      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={subjects}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text>{item.name}</Text>
              <Text>
                {item.class?.name} | {item.faculty?.profile?.name}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center" },
  input: { borderWidth: 1, marginBottom: 10, padding: 10 },
  button: {
    backgroundColor: "#2563eb",
    padding: 12,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  listItem: { padding: 10, borderBottomWidth: 1 },
});
