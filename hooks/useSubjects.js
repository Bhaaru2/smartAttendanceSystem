import { useQuery } from "@tanstack/react-query";
import subjectsApi from "../api/subjectsApi";

export const useSubjects = () => {
  return useQuery({
    queryKey: ["subjects"],
    queryFn: subjectsApi.get,
    staleTime: 1000 * 60 * 5,
  });
};
