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
      profile_id,
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

const updateFaculty = async (id, body) => {
  const { data, error } = await supabase
    .from(FACULTY_TABLE)
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

const deleteFaculty = async (id) => {
  const { error: subjectError } = await supabase
    .from("subjects")
    .delete()
    .eq("faculty_id", id);

  if (subjectError) throw new Error(subjectError.message);

  const { error } = await supabase
    .from(FACULTY_TABLE)
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);

  return true;
};



export default {
  create: createFaculty,
  get: getFaculty,
  update: updateFaculty,
  delete: deleteFaculty,
};
