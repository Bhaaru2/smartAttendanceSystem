import { useQuery } from "@tanstack/react-query";
import { supabase } from "../services/supabase";

const fetchStudentAttendance = async (studentId) => {
  const { data, error } = await supabase
    .from("attendance_records")
    .select("status")
    .eq("student_id", studentId);

  if (error) throw new Error(error.message);

  const total = data.length;
  const present = data.filter(r => r.status === "present").length;
  const absent = total - present;
  const percentage = total ? ((present / total) * 100).toFixed(1) : 0;

  return { total, present, absent, percentage };
};

export const useStudentAttendanceSummary = (studentId) => {
  return useQuery({
    queryKey: ["student-attendance", studentId],
    queryFn: () => fetchStudentAttendance(studentId),
    enabled: !!studentId,
  });
};
