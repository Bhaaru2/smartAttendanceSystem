import { useState, useEffect, useRef } from "react";
import { View, Text } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useRoute } from "@react-navigation/native";

import attendanceSessionApi from "../api/attendanceSessionApi";

import AppContainer from "../components/AppContainer";
import ScreenHeader from "../components/ScreenHeader";
import AppCard from "../components/AppCard";
import PrimaryButton from "../components/PrimaryButton";
import SuccessModal from "../components/SuccessModal";

export default function TeacherAttendanceScreen() {
  const route = useRoute();
  const { facultyId, subjectId } = route.params;

  const [session, setSession] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");

  const intervalRef = useRef(null);

  /* ================= START SESSION ================= */

  const handleStartSession = async () => {
    try {
      const newSession = await attendanceSessionApi.create({
        subject_id: subjectId,
        faculty_id: facultyId,
      });

      setSession(newSession);
      startCountdown(newSession.expires_at);

      setModalMessage("Attendance session started successfully");
      setModalType("success");
      setModalVisible(true);

    } catch (e) {
      setModalMessage(e.message);
      setModalType("error");
      setModalVisible(true);
    }
  };

  /* ================= END SESSION ================= */

  const handleEndSession = async () => {
    try {
      await attendanceSessionApi.end(session.id);

      clearInterval(intervalRef.current);
      setSession(null);

      setModalMessage("Session ended successfully");
      setModalType("success");
      setModalVisible(true);

    } catch (e) {
      setModalMessage(e.message);
      setModalType("error");
      setModalVisible(true);
    }
  };

  /* ================= COUNTDOWN ================= */

  const startCountdown = (expiryTime) => {
    const expiry = new Date(expiryTime).getTime();

    intervalRef.current = setInterval(() => {
      const now = new Date().getTime();
      const diff = Math.floor((expiry - now) / 1000);

      if (diff <= 0) {
        clearInterval(intervalRef.current);
        setSession(null);
      } else {
        setTimeLeft(diff);
      }
    }, 1000);
  };

  /* Cleanup on unmount */
  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  /* ================= FORMAT TIME ================= */

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <AppContainer>
      <ScreenHeader
        title="Live Attendance"
        subtitle="QR Based Session"
      />

      <View style={{ padding: 16, marginTop: 20 }}>

        {!session ? (
          <AppCard>
            <PrimaryButton
              title="Start Attendance"
              onPress={handleStartSession}
            />
          </AppCard>
        ) : (
          <AppCard>

            <View style={{ alignItems: "center" }}>

              <QRCode
                value={JSON.stringify({
                  session_id: session.id,
                  expires_at: session.expires_at,
                })}
                size={220}
                ecl="H"
              />

              <Text
                style={{
                  marginTop: 16,
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "#4CA6A8"
                }}
              >
                Expires in: {formatTime(timeLeft)}
              </Text>

              <View style={{ marginTop: 20, width: "100%" }}>
                <PrimaryButton
                  title="End Session"
                  onPress={handleEndSession}
                />
              </View>

            </View>
          </AppCard>
        )}

      </View>

      <SuccessModal
        visible={modalVisible}
        message={modalMessage}
        type={modalType}
        onClose={() => {
          setModalVisible(false);
          setModalType("success");
        }}
      />

    </AppContainer>
  );
}
