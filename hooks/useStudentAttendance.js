import { useQuery } from "@tanstack/react-query";
import attendanceRecordsApi from "../api/attendanceRecordsApi";

export const useStudentAttendance = (studentId) => {
  return useQuery({
    queryKey: ["student-attendance", studentId],
    queryFn: () => attendanceRecordsApi.getStudentAttendance(studentId),
    enabled: !!studentId,
  });
};
