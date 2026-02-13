import { supabase } from "../services/supabase";

const STUDENT_TABLE = "students";

const createStudent = async (body) => {
  const { profile_id, roll_no, class: className, section } = body;

  if (!profile_id || !roll_no || !className) {
    throw new Error("Missing required fields");
  }

  // 1️⃣ Insert student
  const { data: student, error } = await supabase
    .from(STUDENT_TABLE)
    .insert([{ profile_id, roll_no, class: className, section }])
    .select()
    .single();

  if (error) throw new Error(error.message);

  // 2️⃣ Get subjects of that class + section
  const { data: subjects } = await supabase
    .from("subjects")
    .select("id")
    .eq("class", className)
    .eq("section", section);

  // 3️⃣ Map them
  if (subjects && subjects.length > 0) {
    const mappings = subjects.map((s) => ({
      student_id: student.id,
      subject_id: s.id,
      joined_at: new Date().toISOString(),
    }));

    await supabase.from("student_subjects").insert(mappings);
  }

  return student;
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

const updateStudent = async (id, body) => {
  const { data, error } = await supabase
    .from("students")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};


const deleteStudent = async (id) => {
  const { error } = await supabase
    .from("students")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
};

export default {
  create: createStudent,
  get: getStudents,
  update: updateStudent,
  delete: deleteStudent,

};
