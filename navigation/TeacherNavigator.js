import { createNativeStackNavigator } from "@react-navigation/native-stack";

import TeacherDashboard from "../screens/TeacherDashboard";
import AttendanceSessionScreen from "../screens/AttendanceSessionScreen";

const Stack = createNativeStackNavigator();

export default function TeacherNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="TeacherDashboard" component={TeacherDashboard} />
      <Stack.Screen name="AttendanceSessions" component={AttendanceSessionScreen} />
    </Stack.Navigator>
  );
}
