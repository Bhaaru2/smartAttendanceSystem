import { CameraView } from "expo-camera";
import * as Camera from "expo-camera";
import { View, Text, Alert, StyleSheet } from "react-native";
import { useState } from "react";
import attendanceRecordsApi from "../api/attendanceRecordsApi";



export default function StudentScannerScreen({ route, navigation }) {
  const { studentId } = route.params;
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [scanned, setScanned] = useState(false);

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
    console.log("QR DATA:", parsed);

  };

  if (!permission) {
    return <View style={{ flex: 1 }} />;
  }

  if (!permission.granted) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Camera permission required</Text>
        <Text onPress={requestPermission} style={{ color: "blue", marginTop: 10 }}>
          Grant Permission
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        style={{ flex: 1 }}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={scanned ? undefined : handleScan}
      />
    </View>
  );
}
