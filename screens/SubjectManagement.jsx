import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
} from "react-native";

import AppContainer from "../components/AppContainer";
import ScreenHeader from "../components/ScreenHeader";
import AppCard from "../components/AppCard";
import PrimaryButton from "../components/PrimaryButton";
import SuccessModal from "../components/SuccessModal";

import { useSubjects } from "../hooks/useSubjects";
import { useFacultyList } from "../hooks/useFacultyList";
import { useClassesList } from "../hooks/useClassesList";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import subjectsApi from "../api/subjectsApi";


export default function SubjectManagement() {
  const [name, setName] = useState("");
  const [facultyId, setFacultyId] = useState("");
  const [classId, setClassId] = useState("");
  const [section, setSection] = useState("");

  const [facultyModalVisible, setFacultyModalVisible] = useState(false);
  const [classModalVisible, setClassModalVisible] = useState(false);
  const [modalType, setModalType] = useState("success"); 
 

  const [successVisible, setSuccessVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const { data: subjects = [] } = useSubjects();
  const { data: faculty = [] } = useFacultyList();
  const { data: classes = [] } = useClassesList();

  const queryClient = useQueryClient();

  const createMutation = useMutation({
  mutationFn: subjectsApi.create,

  onSuccess: () => {
    queryClient.invalidateQueries(["subjects"]);
    setSuccessMessage("Subject created successfully");
    setModalType("success");
    setSuccessVisible(true);

    setName("");
    setFacultyId("");
    setClassId("");
    setSection("");
  },

  onError: (error) => {
    console.log("SUBJECT CREATE ERROR:", error);
    setSuccessMessage(error.message || "Failed to create subject");
    setModalType("error");
    setSuccessVisible(true);
  },
});


  const handleCreate = () => {
    if (!name || !facultyId || !classId || !section) {
      setSuccessMessage("All fields required");
      setSuccessVisible(true);
      setModalType("error"); 

      return;
    }

    createMutation.mutate({
      name,
      faculty_id: facultyId,
      class_id: classId,
      section,
    });
  };

  return (
    <AppContainer>
      <ScreenHeader
        title="Subject Management"
        subtitle="Admin Panel"
      />

      <AppCard>
        <TextInput
          placeholder="Subject Name"
          value={name}
          onChangeText={setName}
          style={{ marginBottom: 12 }}
        />

        {/* Faculty Dropdown */}
        <TouchableOpacity
  style={styles.selectBox}
  onPress={() => setFacultyModalVisible(true)}
>
  <Text
    style={[
      styles.selectText,
      { color: facultyId ? "#000" : "#999" },
    ]}
  >
    {facultyId
      ? faculty.find((f) => f.id === facultyId)?.profile?.name
      : "Select Faculty"}
  </Text>
</TouchableOpacity>


        {/* Class Dropdown */}
        <TouchableOpacity
  style={[styles.selectBox, { marginTop: 16 }]}
  onPress={() => setClassModalVisible(true)}
>
  <Text
    style={[
      styles.selectText,
      { color: classId ? "#000" : "#999" },
    ]}
  >
    {classId
      ? classes.find((c) => c.id === classId)?.name
      : "Select Class"}
  </Text>
</TouchableOpacity>


        <TextInput
          placeholder="Section"
          value={section}
          onChangeText={setSection}
          style={{ marginBottom: 12 }}
        />

        <PrimaryButton title="Create Subject" onPress={handleCreate} />
      </AppCard>

      {/* Faculty Modal */}
      <Modal visible={facultyModalVisible} transparent animationType="fade">
        <View style={{ flex:1, justifyContent:"center", alignItems:"center", backgroundColor:"rgba(0,0,0,0.4)" }}>
          <View style={{ backgroundColor:"#fff", width:"85%", borderRadius:20, padding:20 }}>
            <Text style={{ fontWeight:"bold", marginBottom:10 }}>Select Faculty</Text>

            <FlatList
              data={faculty}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{ paddingVertical:12 }}
                  onPress={() => {
                    setFacultyId(item.id);
                    setFacultyModalVisible(false);
                  }}
                >
                  <Text>{item.profile?.name}</Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity onPress={() => setFacultyModalVisible(false)}>
              <Text style={{ textAlign:"center", marginTop:10, color:"#4CA6A8" }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Class Modal */}
      <Modal visible={classModalVisible} transparent animationType="fade">
        <View style={{ flex:1, justifyContent:"center", alignItems:"center", backgroundColor:"rgba(0,0,0,0.4)" }}>
          <View style={{ backgroundColor:"#fff", width:"85%", borderRadius:20, padding:20 }}>
            <Text style={{ fontWeight:"bold", marginBottom:10 }}>Select Class</Text>

            <FlatList
              data={classes}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{ paddingVertical:12 }}
                  onPress={() => {
                    setClassId(item.id);
                    setClassModalVisible(false);
                  }}
                >
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity onPress={() => setClassModalVisible(false)}>
              <Text style={{ textAlign:"center", marginTop:10, color:"#4CA6A8" }}>
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
    </AppContainer>
  );
}
const styles = StyleSheet.create({
selectBox: {
  backgroundColor: "#F8FAFC",
  padding: 14,
  borderRadius: 14,
  borderWidth: 1,
  borderColor: "#4CA6A8",
  marginBottom: 12,
},

selectText: {
  fontSize: 15,
  fontWeight: "500",
},
});
