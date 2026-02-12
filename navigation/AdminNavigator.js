import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AdminDashboard from "../screens/AdminDashboard";
import StudentManagement from "../screens/StudentManagement";
import FacultyManagement from "../screens/FacultyManagement";
import ClassManagement from "../screens/ClassManagement";
import SubjectManagement from "../screens/SubjectManagement";
import AdminAssignRoleScreen from "../screens/AdminAssignRoleScreen";
import StudentAttendanceAdminScreen from "../screens/StudentAttendanceAdminScreen";

const Stack = createNativeStackNavigator();

export default function AdminNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
      <Stack.Screen name="StudentManagement" component={StudentManagement} />
      <Stack.Screen name="FacultyManagement" component={FacultyManagement} />
      <Stack.Screen name="ClassManagement" component={ClassManagement} />
      <Stack.Screen name="SubjectManagement" component={SubjectManagement} />
      <Stack.Screen name="AssignRole" component={AdminAssignRoleScreen} />
      <Stack.Screen
  name="StudentAttendanceAdmin"
  component={StudentAttendanceAdminScreen}
/>


    </Stack.Navigator>
  );
}
