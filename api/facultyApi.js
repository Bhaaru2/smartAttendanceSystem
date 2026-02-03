import { supabase } from "../services/supabase";

const FACULTY_TABLE = "faculty";

const createFaculty = async (body) => {
  const { profile_id, employee_id, department } = body;

  if (!profile_id || !employee_id) {
    throw new Error("Profile and Employee ID are required");
  }

  const { data, error } = await supabase
    .from(FACULTY_TABLE)
    .insert([{ profile_id, employee_id, department }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

const getFaculty = async () => {
  const { data, error } = await supabase
    .from(FACULTY_TABLE)
    .select(`
      id,
      employee_id,
      department,
      profile:profile_id (
        id,
        name
      )
    `);

  if (error) throw new Error(error.message);
  return data;
};

export default {
  create: createFaculty,
  get: getFaculty,
};
