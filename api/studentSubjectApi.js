import { supabase } from "../services/supabase";

const TABLE = "student_subjects";

const createStudentSubject = async ({ student_id, subject_id }) => {
  if (!student_id || !subject_id) {
    throw new Error("Student and subject are required");
  }

  const { data, error } = await supabase
    .from(TABLE)
    .insert([{
      student_id,
      subject_id,
      joined_at: new Date().toISOString(),
    }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};
const getSubjectsByStudent = async (studentId) => {
  const { data, error } = await supabase
    .from(TABLE)
    .select(`
      id,
      joined_at,
      subject:subject_id (
        id,
        name
      )
    `)
    .eq("student_id", studentId);

  if (error) throw new Error(error.message);
  return data;
};
const getStudentsBySubject = async (subjectId) => {
  const { data, error } = await supabase
    .from(TABLE)
    .select(`
      id,
      joined_at,
      student:student_id (
        id,
        roll_no,
        profile:profile_id ( name )
      )
    `)
    .eq("subject_id", subjectId);

  if (error) throw new Error(error.message);
  return data;
};
export default {
  create: createStudentSubject,
  getSubjectsByStudent,
  getStudentsBySubject,
};
