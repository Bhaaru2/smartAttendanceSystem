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

  // 1️⃣ Get session
  const { data: session, error: sessionError } = await supabase
    .from("attendance_sessions")
    .select("subject_id")
    .eq("id", session_id)
    .maybeSingle();

  if (sessionError || !session) {
    throw new Error("Invalid session");
  }

  // 2️⃣ Get subject
  const { data: subject, error: subjectError } = await supabase
    .from("subjects")
    .select("section")
    .eq("id", session.subject_id)
    .single();

  if (subjectError || !subject) {
    throw new Error("Subject not found");
  }

  // 3️⃣ Get student
  const { data: student, error: studentError } = await supabase
    .from("students")
    .select("class, section")
    .eq("id", student_id)
    .single();

  if (studentError || !student) {
    throw new Error("Student not found");
  }

  // 4️⃣ Validate section only (since you use text class)
  if (student.section !== subject.section) {
    throw new Error("You are not allowed to attend this session");
  }

  // 5️⃣ Insert attendance (NOT update)
  const { data, error } = await supabase
    .from("attendance_records")
    .insert([{
      session_id,
      student_id,
      status: "present",
      method: "manual",
      marked_at: new Date().toISOString(),
      marked_by: null, // OR remove this field completely
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

const getBySession = async (sessionId) => {
  const { data, error } = await supabase
    .from("attendance_records")
    .select(`
      id,
      marked_at,
      student:student_id (
        id,
        profile:profile_id ( name ),
        roll_no
      )
    `)
    .eq("session_id", sessionId)
    .order("marked_at", { ascending: true });

  if (error) throw new Error(error.message);

  return data;
};
const getStudentStats = async (studentId) => {
  // 1️⃣ Get subjects student enrolled in
  const { data: subjects } = await supabase
    .from("student_subjects")
    .select("subject_id")
    .eq("student_id", studentId);

  const subjectIds = subjects?.map(s => s.subject_id) || [];

  if (!subjectIds.length) {
    return { total: 0, present: 0 };
  }

  // 2️⃣ Get all sessions for those subjects
  const { data: sessions } = await supabase
    .from("attendance_sessions")
    .select("id")
    .in("subject_id", subjectIds);

  const sessionIds = sessions?.map(s => s.id) || [];

  // 3️⃣ Get present records
  const { data: records } = await supabase
    .from("attendance_records")
    .select("session_id, status")
    .eq("student_id", studentId)
    .eq("status", "present");

  return {
    total: sessionIds.length,
    present: records?.length || 0
  };
};



export default {
  markAttendance,
  getSessionAttendance,
  getStudentAttendance,
  getBySession,
  getStudentStats,

};
