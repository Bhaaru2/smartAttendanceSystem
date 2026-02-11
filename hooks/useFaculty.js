import { useQuery } from "@tanstack/react-query";
import facultyApi from "../api/facultyApi";

export const useFaculty = () => {
  return useQuery({
    queryKey: ["faculty"],
    queryFn: facultyApi.get,
    staleTime: 1000 * 60 * 5,
  });
};
