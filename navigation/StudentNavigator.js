import { createNativeStackNavigator } from "@react-navigation/native-stack";

import StudentDashboard from "../screens/StudentDashboard";

const Stack = createNativeStackNavigator();

export default function StudentNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="StudentDashboard" component={StudentDashboard} />
    </Stack.Navigator>
  );
}
