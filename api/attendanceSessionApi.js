import { supabase } from "../services/supabase";

const TABLE = "attendance_sessions";

// CREATE attendance session
const createSession = async (body) => {
  const { subject_id, faculty_id, conducted_on, started_at, ended_at } = body;

  if (!subject_id || !faculty_id || !conducted_on) {
    throw new Error("Subject, faculty and date are required");
  }

  const { data, error } = await supabase
    .from(TABLE)
    .insert([{
      subject_id,
      faculty_id,
      conducted_on,
      started_at,
      ended_at,
    }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// READ attendance sessions
const getSessions = async (facultyId = null) => {
  let query = supabase
    .from(TABLE)
    .select(`
      id,
      conducted_on,
      started_at,
      ended_at,
      created_at,
      subject:subject_id (
        id,
        name
      )
    `)
    .order("conducted_on", { ascending: false });

  // Faculty-specific view
  if (facultyId) {
    query = query.eq("faculty_id", facultyId);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);
  return data;
};

export default {
  create: createSession,
  get: getSessions,
};
