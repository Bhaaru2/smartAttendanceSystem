import { useQuery } from "@tanstack/react-query";
import classesApi from "../api/classesApi";

export const useClasses = () => {
  return useQuery({
    queryKey: ["classes"],
    queryFn: classesApi.get,
    staleTime: 1000 * 60 * 5,
  });
};
