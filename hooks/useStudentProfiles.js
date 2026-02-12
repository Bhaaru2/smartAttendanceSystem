import { useQuery } from "@tanstack/react-query";
import { supabase } from "../services/supabase";

const fetchStudentProfiles = async () => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, name")
    .eq("role", "student");

  if (error) throw new Error(error.message);
  return data;
};

export const useStudentProfiles = () => {
  return useQuery({
    queryKey: ["available-student-profiles"],
    queryFn: async () => {

      const { data: students } = await supabase
        .from("students")
        .select("profile_id");

      const usedIds = students?.map(s => s.profile_id) || [];

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "student")
        .not("id", "in", `(${usedIds.join(",") || "null"})`);

      if (error) throw error;
      return data;
    },
  });
};
