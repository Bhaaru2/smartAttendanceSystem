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
import studentApi from "../api/studentApi";
import { useStudents } from "../hooks/useStudents";
import { useStudentProfiles } from "../hooks/useStudentProfiles";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useNavigation } from "@react-navigation/native";
import { useStudentAttendanceSummary } from "../hooks/useStudentAttendanceSummary";
import ActionModal from "../components/ActionModal";
import ScreenHeader from "../components/ScreenHeader";
import SuccessModal from "../components/SuccessModal";



function StudentListItem({
  item,
  navigation,
  setEditingStudent,
  setProfileId,
  setRollNo,
  setClassName,
  setSection,
  deleteMutation,
  setSelectedStudent,     // 👈 ADD
  setModalVisible,
}) {
  const { data: summary } = useStudentAttendanceSummary(item.id);

  return (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => {
        setSelectedStudent(item);
        setModalVisible(true);
      }}

    >
      <View style={styles.row}>
        <View>
          <Text style={styles.listText}>
            {item.profile?.name || "No Name"} | Roll: {item.roll_no}
          </Text>
          <Text style={styles.listSub}>
            Class: {item.class} {item.section || ""}
          </Text>
        </View>

        <View style={styles.percentageBox}>
          <Text style={styles.percentageText}>
            {summary?.percentage ?? 0}%
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function StudentManagement() {
  const navigation = useNavigation();

  const [profileId, setProfileId] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");

  const { data: students = [], isLoading } = useStudents();
  const { data: profiles = [] } = useStudentProfiles();
  const [editingStudent, setEditingStudent] = useState(null);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [modalType, setModalType] = useState("success");





  const queryClient = useQueryClient();


  // 🔁 Fetch students
  const createMutation = useMutation({
    mutationFn: studentApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries(["students"]);

      setSuccessMessage("Student updated successfully");
      setSuccessVisible(true);

      setProfileId("");
      setRollNo("");
      setClassName("");
      setSection("");
    },
    onError: (error) => {
      Alert.alert("Error", error.message);
    },
  });

  const handleCreateStudent = () => {
    if (!profileId || !rollNo || !className) {
      setSuccessMessage("Profile, Roll No, and Class are required");
      setSuccessVisible(true);
      setModalType("error");

      return;

    }

    createMutation.mutate({
      profile_id: profileId,
      roll_no: rollNo,
      class: className,
      section,
    });
  };

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => studentApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["students"]);

      setSuccessMessage("Student updated successfully");
      setSuccessVisible(true);

      resetForm();
    },
  });


  const deleteMutation = useMutation({
    mutationFn: studentApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(["students"]);
    },
    onError: (error) => {
      Alert.alert("Error", error.message);
    },
  });

  const resetForm = () => {
    setEditingStudent(null);
    setProfileId("");
    setRollNo("");
    setClassName("");
    setSection("");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F6F9FC" }}>

      {/* Header */}
      <ScreenHeader
        title="Student Management"
        subtitle="Admin Panel"
      />


      <FlatList
        ListHeaderComponent={
          <>
            {/* Add / Update Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                {editingStudent ? "Update Student" : "Add Student"}
              </Text>

              {editingStudent ? (
                <View style={styles.input}>
                  <Text>{editingStudent.profile?.name}</Text>
                </View>
              ) : profiles.length === 0 ? (
                <Text style={{ color: "red", marginBottom: 10 }}>
                  No student profiles left to create
                </Text>
              ) : (
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => setProfileModalVisible(true)}
                >
                  <Text style={{ color: profileId ? "#000" : "#999" }}>
                    {profileId
                      ? profiles.find((p) => p.id === profileId)?.name
                      : "Select Student"}
                  </Text>
                </TouchableOpacity>


              )}

              <TextInput
                placeholder="Roll Number"
                value={rollNo}
                onChangeText={setRollNo}
                style={styles.input}
              />

              <TextInput
                placeholder="Class"
                value={className}
                onChangeText={setClassName}
                style={styles.input}
              />

              <TextInput
                placeholder="Section"
                value={section}
                onChangeText={setSection}
                style={styles.input}
              />

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => {
                  if (editingStudent) {
                    updateMutation.mutate({
                      id: editingStudent.id,
                      data: {
                        roll_no: rollNo,
                        class: className,
                        section,
                      },
                    });
                  } else {
                    handleCreateStudent();
                  }
                }}
              >
                <Text style={styles.primaryButtonText}>
                  {editingStudent ? "Update Student" : "Create Student"}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Students</Text>
          </>
        }
        data={students}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <StudentListItem
            item={item}
            navigation={navigation}
            setEditingStudent={setEditingStudent}
            setProfileId={setProfileId}
            setRollNo={setRollNo}
            setClassName={setClassName}
            setSection={setSection}
            deleteMutation={deleteMutation}
            setSelectedStudent={setSelectedStudent}   // 👈 ADD THIS
            setModalVisible={setModalVisible}
          />
        )}
        contentContainerStyle={{ padding: 16 }}
      />
      <ActionModal
        visible={modalVisible}
        title="Student Options"
        onClose={() => setModalVisible(false)}
        actions={[
          {
            label: "View Attendance",
            onPress: () => {
              setModalVisible(false);
              navigation.navigate("StudentAttendanceAdmin", {
                studentId: selectedStudent?.id,
                name: selectedStudent?.profile?.name,
                roll: selectedStudent?.roll_no,
              });
            },
          },
          {
            label: "Update",
            onPress: () => {
              setModalVisible(false);
              setEditingStudent(selectedStudent);
              setProfileId(selectedStudent.profile_id);
              setRollNo(selectedStudent.roll_no);
              setClassName(selectedStudent.class);
              setSection(selectedStudent.section || "");
            },
          },
          {
            label: "Delete",
            type: "danger",
            onPress: () => {
              setModalVisible(false);
              setDeleteTarget(selectedStudent);
              setDeleteModalVisible(true);
            },
          },
        ]}
      />
      <Modal
        visible={profileModalVisible}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Select Student</Text>

            <FlatList
              data={profiles}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => {
                    setProfileId(item.id);
                    setProfileModalVisible(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              onPress={() => setProfileModalVisible(false)}
              style={styles.modalCancel}
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


      <Modal transparent visible={deleteModalVisible} animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.title}>Delete Student?</Text>
            <Text style={{ marginTop: 10, textAlign: "center" }}>
              This action cannot be undone.
            </Text>

            <View style={{ flexDirection: "row", marginTop: 20 }}>
              <TouchableOpacity
                style={[styles.cancelBtn]}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.deleteBtn]}
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalCard: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },

  modalOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  modalOptionText: {
    fontSize: 16,
  },

  modalCancel: {
    marginTop: 15,
    alignItems: "center",
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
