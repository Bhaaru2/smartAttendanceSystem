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
    queryKey: ["studentProfiles"],
    queryFn: fetchStudentProfiles,
    staleTime: 1000 * 60 * 5,
  });
};
