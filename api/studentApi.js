import { supabase } from "../services/supabase";

const STUDENT_TABLE = "students";

const createStudent = async (body) => {
  const { profile_id, roll_no, class: className, section } = body;

  if (!profile_id || !roll_no || !className) {
    throw new Error("Missing required fields");
  }

  const { data, error } = await supabase
    .from(STUDENT_TABLE)
    .insert([{ profile_id, roll_no, class: className, section }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

const getStudents = async () => {
  const { data, error } = await supabase
    .from(STUDENT_TABLE)
    .select(`
      id,
      roll_no,
      class,
      section,
      profile:profile_id (
        id,
        name
      )
    `);

  if (error) throw new Error(error.message);
  return data;
};

export default {
  create: createStudent,
  get: getStudents,
};
