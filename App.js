import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { supabase } from './services/supabase';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


import LoginScreen from './screens/LoginScreen';
import StudentDashboard from './screens/StudentDashboard';
import TeacherDashboard from './screens/TeacherDashboard';
import AdminDashboard from './screens/AdminDashboard';
import StudentManagement from './screens/StudentManagement';
import FacultyManagement from './screens/FacultyManagement';
import ClassManagement from "./screens/ClassManagement";
import SubjectManagement from "./screens/SubjectManagement";
import AttendanceSessionScreen from "./screens/AttendanceSessionScreen";

const queryClient = new QueryClient();


const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState('Login');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        const user = data.session.user;

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (!error && profile) {
          if (profile.role === 'student') {
            setInitialRoute('StudentDashboard');
          } else if (profile.role === 'faculty') {
            setInitialRoute('TeacherDashboard');
          } else if (profile.role === 'admin') {
            setInitialRoute('AdminDashboard');
          }
        }
      }

      setLoading(false);
    };

    checkSession();
  }, []);

  if (loading) {
    return null;
  }

  return (
  <QueryClientProvider client={queryClient}>
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="StudentDashboard" component={StudentDashboard} />
        <Stack.Screen name="TeacherDashboard" component={TeacherDashboard} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        <Stack.Screen name="StudentManagement" component={StudentManagement} />
        <Stack.Screen name="FacultyManagement" component={FacultyManagement} />
        <Stack.Screen name="ClassManagement" component={ClassManagement} />
        <Stack.Screen name="SubjectManagement" component={SubjectManagement} />
        <Stack.Screen name="AttendanceSessions" component={AttendanceSessionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  </QueryClientProvider>
);
a
}
