import { CameraView, useCameraPermissions } from "expo-camera";
import { View, Text, Alert, StyleSheet } from "react-native";
import { useState } from "react";
import attendanceRecordsApi from "../api/attendanceRecordsApi";

export default function StudentScannerScreen({ route, navigation }) {
  const { studentId } = route.params;
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>Camera permission required</Text>
        <Text onPress={requestPermission} style={styles.permissionBtn}>
          Grant Permission
        </Text>
      </View>
    );
  }

  const handleScan = async ({ data }) => {
    if (scanned) return;

    try {
      const parsed = JSON.parse(data);

      if (!parsed.session_id) {
        Alert.alert("Invalid QR Code");
        return;
      }

      const now = new Date();
      const expiry = new Date(parsed.expires_at);

      if (now > expiry) {
        Alert.alert("Session expired");
        return;
      }

      setScanned(true);

      await attendanceRecordsApi.markAttendance({
        session_id: parsed.session_id,
        student_id: studentId,
        marked_by: studentId,
      });

      Alert.alert("Success", "Attendance marked", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      Alert.alert("Error", e.message);
      setScanned(false);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={handleScan}
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
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 8,
  },
  scanButton: {
    backgroundColor: "#2563eb",
    padding: 12,
    alignItems: "center",
    borderRadius: 6,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  card: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    marginBottom: 8,
  },
});

