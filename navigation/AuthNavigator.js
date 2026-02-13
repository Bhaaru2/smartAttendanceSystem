import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import WelcomeScreen from "../screens/WelcomeScreen";


const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>

  <Stack.Screen name="Welcome" component={WelcomeScreen} />
  <Stack.Screen name="Login" component={LoginScreen} />

</Stack.Navigator>
  );
}
