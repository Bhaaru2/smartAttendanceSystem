import { useQuery } from "@tanstack/react-query";
import { supabase } from "../services/supabase";

const fetchFaculty = async () => {
  const { data, error } = await supabase
    .from("faculty")
    .select("id, profile:profile_id(name)");

  if (error) throw new Error(error.message);
  return data;
};

export const useFacultyList = () => {
  return useQuery({
    queryKey: ["facultyList"],
    queryFn: fetchFaculty,
    staleTime: 1000 * 60 * 5,
  });
};
