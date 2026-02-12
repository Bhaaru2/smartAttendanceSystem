import { supabase } from "../services/supabase";

const TABLE = "attendance_sessions";

// ✅ CREATE Attendance Session (Professional Version)
const createSession = async ({ subject_id, faculty_id }) => {
  // if (!subject_id || !faculty_id) {
  //   throw new Error("Subject and faculty are required");
  // }

  const now = new Date();
  const expiresAt = new Date(now.getTime() + 2 * 60 * 1000); // 2 minutes

  const { data, error } = await supabase
    .from(TABLE)
    .insert([
      {
        subject_id,
        faculty_id,
        conducted_on: now.toISOString().split("T")[0],
        started_at: now.toISOString(),
        ended_at: null,
        is_active: true,
        expires_at: expiresAt.toISOString(),
      },
    ])
    .select()
    .maybeSingle();

  if (error) throw new Error(error.message);
    if (!data) throw new Error("Session creation failed");

  return data;
};

// ✅ READ Sessions
const getSessions = async (facultyId = null) => {
  let query = supabase
    .from(TABLE)
    .select(`
      id,
      conducted_on,
      started_at,
      ended_at,
      is_active,
      expires_at,
      subject:subject_id (
        id,
        name
      )
    `)
    .order("conducted_on", { ascending: false });

  if (facultyId) {
    query = query.eq("faculty_id", facultyId);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);
  return data;
};

const getActiveSessionForClass = async (className, section) => {
  const { data, error } = await supabase
    .from("attendance_sessions")
    .select(`
      id,
      subject:subject_id (
        id,
        class,
        section
      )
    `)
    .eq("is_active", true);

  if (error) throw new Error(error.message);

  const active = data.find(
    (s) =>
      s.subject.class === className &&
      s.subject.section === section
  );

  return active || null;
};


// ✅ MANUAL END SESSION
const endSession = async (sessionId) => {
  const { data, error } = await supabase
    .from(TABLE)
    .update({
      is_active: false,
      ended_at: new Date().toISOString(),
    })
    .eq("id", sessionId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export default {
  create: createSession,
  get: getSessions,
  end: endSession,
getActiveForClass: getActiveSessionForClass,
};
