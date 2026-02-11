import { useQuery } from "@tanstack/react-query";
import { supabase } from "../services/supabase";

const fetchFacultyProfiles = async () => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, name")
    .eq("role", "faculty");

  if (error) throw new Error(error.message);
  return data;
};

export const useFacultyProfiles = () => {
  return useQuery({
    queryKey: ["facultyProfiles"],
    queryFn: fetchFacultyProfiles,
    staleTime: 1000 * 60 * 5,
  });
};
