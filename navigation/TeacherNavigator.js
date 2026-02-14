import { createNativeStackNavigator } from "@react-navigation/native-stack";

import TeacherDashboard from "../screens/TeacherDashboard";
import AttendanceSessionScreen from "../screens/AttendanceSessionScreen";
import TeacherAttendanceScreen from "../screens/TeacherAttendanceScreen";
import SessionDetailsScreen from "../screens/SessionDetailsScreen";


const Stack = createNativeStackNavigator();

export default function TeacherNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="TeacherDashboard" component={TeacherDashboard} />
      <Stack.Screen name="AttendanceSessions" component={AttendanceSessionScreen} />
            <Stack.Screen name="TeacherAttendance" component={TeacherAttendanceScreen} />
            <Stack.Screen name="SessionDetails" component={SessionDetailsScreen} />
            

    </Stack.Navigator>
  );
}
