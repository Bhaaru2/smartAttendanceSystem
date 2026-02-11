import { useQuery } from "@tanstack/react-query";
import studentApi from "../api/studentApi";

export const useStudents = () => {
  return useQuery({
    queryKey: ["students"],
    queryFn: studentApi.get,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
};
