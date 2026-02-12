import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StudentDashboard from "../screens/StudentDashboard";
import StudentScannerScreen from "../screens/StudentScannerScreen";

const StudentStack = createNativeStackNavigator();

export default function StudentNavigator() {
  return (
    <StudentStack.Navigator>
      <StudentStack.Screen
        name="StudentDashboard"
        component={StudentDashboard}
        options={{ title: "Dashboard" }}
      />

      <StudentStack.Screen
        name="StudentScanner"
        component={StudentScannerScreen}
        options={{ title: "Scan QR" }}
      />
    </StudentStack.Navigator>
  );
}
