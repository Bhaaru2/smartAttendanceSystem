import { useQuery } from "@tanstack/react-query";
import studentSubjectApi from "../api/studentSubjectApi";

export const useStudentSubjects = (studentId) => {
  return useQuery({
    queryKey: ["student-subjects", studentId],
    queryFn: () => studentSubjectApi.getSubjectsByStudent(studentId),
    enabled: !!studentId,
  });
};
