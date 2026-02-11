import { useQuery } from "@tanstack/react-query";
import { supabase } from "../services/supabase";

const fetchClasses = async () => {
  const { data, error } = await supabase
    .from("classes")
    .select("id, name");

  if (error) throw new Error(error.message);
  return data;
};

export const useClassesList = () => {
  return useQuery({
    queryKey: ["classesList"],
    queryFn: fetchClasses,
    staleTime: 1000 * 60 * 5,
  });
};
