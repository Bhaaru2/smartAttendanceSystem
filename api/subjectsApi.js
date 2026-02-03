import { supabase } from "../services/supabase";

const TABLE = "subjects";

const createSubject = async (body) => {
  const { name, faculty_id, class_id, classText, section } = body;

  if (!name || !faculty_id || !class_id) {
    throw new Error("Name, faculty and class are required");
  }

  const { data, error } = await supabase
    .from(TABLE)
    .insert([{
      name,
      faculty_id,
      class_id,
      class: classText,   // temporary, for compatibility
      section
    }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

const getSubjects = async () => {
  const { data, error } = await supabase
    .from(TABLE)
    .select(`
      id,
      name,
      section,
      class:class_id ( id, name ),
      faculty:faculty_id (
        id,
        profile:profile_id ( name )
      )
    `);

  if (error) throw new Error(error.message);
  return data;
};

export default {
  create: createSubject,
  get: getSubjects,
};
