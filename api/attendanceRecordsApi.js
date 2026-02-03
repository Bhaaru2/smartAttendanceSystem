import { supabase } from "../services/supabase";

const TABLE = "attendance_records";

const markAttendance = async ({
  session_id,
  student_id,
  marked_by,
}) => {
  if (!session_id || !student_id || !marked_by) {
    throw new Error("Session, student and marker are required");
  }

  const { data, error } = await supabase
    .from(TABLE)
    .insert([{
      session_id,
      student_id,
      status: "present",
      method: "qr",
      marked_at: new Date().toISOString(),
      marked_by,
    }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};
const getSessionAttendance = async (sessionId) => {
  const { data, error } = await supabase
    .from("attendance_records")
    .select(`
      id,
      status,
      marked_at,
      student:student_id (
        id,
        roll_no,
        profile:profile_id ( name )
      )
    `)
    .eq("session_id", sessionId);

  if (error) throw new Error(error.message);
  return data;
};
const getStudentAttendance = async (studentId) => {
  const { data, error } = await supabase
    .from("attendance_records")
    .select(`
      id,
      status,
      marked_at,
      session:session_id (
        conducted_on,
        subject:subject_id ( name )
      )
    `)
    .eq("student_id", studentId)
    .order("marked_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};
export default {
  markAttendance,
  getSessionAttendance,
  getStudentAttendance,
};
