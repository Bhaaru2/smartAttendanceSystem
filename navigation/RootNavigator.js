import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

import AuthNavigator from "./AuthNavigator";
import AdminNavigator from "./AdminNavigator";
import TeacherNavigator from "./TeacherNavigator";
import StudentNavigator from "./StudentNavigator";

export default function RootNavigator() {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const checkSession = async () => {
    const { data } = await supabase.auth.getSession();

    if (data.session) {
      const user = data.session.user;

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile) {
        setRole(profile.role);
      }
    } else {
      setRole(null);
    }

    setLoading(false);
  };

  checkSession();

  const { data: listener } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      if (session) {
        checkSession();
      } else {
        setRole(null);
      }
    }
  );

  return () => {
    listener.subscription.unsubscribe();
  };
}, []);


  if (loading) return null;

  if (!role) return <AuthNavigator />;

  if (role === "admin") return <AdminNavigator />;
  if (role === "faculty") return <TeacherNavigator />;
  if (role === "student") return <StudentNavigator />;

  return <AuthNavigator />;
}
