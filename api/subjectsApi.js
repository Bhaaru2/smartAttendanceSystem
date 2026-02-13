import { supabase } from "../services/supabase";

const TABLE = "subjects";

const createSubject = async (body) => {
  const { name, faculty_id, class_id, section } = body;

  if (!name || !faculty_id || !class_id || !section) {
    throw new Error("All fields are required");
  }

  // 1️⃣ Get class name from classes table
  const { data: classData, error: classError } = await supabase
    .from("classes")
    .select("name")
    .eq("id", class_id)
    .single();

  if (classError) throw new Error(classError.message);

  const className = classData.name;

  // 2️⃣ Insert subject
  const { data: subject, error: subjectError } = await supabase
    .from("subjects")
    .insert([{
      name,
      faculty_id,
      class_id,
      section,
    }])
    .select()
    .single();

  if (subjectError) throw new Error(subjectError.message);

  // 3️⃣ Get students of same class + section
  const { data: students, error: studentError } = await supabase
    .from("students")
    .select("id")
    .eq("class", className)
    .eq("section", section);

  if (studentError) throw new Error(studentError.message);

  // 4️⃣ Insert into student_subjects
  if (students.length > 0) {
    const enrollments = students.map((student) => ({
      student_id: student.id,
      subject_id: subject.id,
      joined_at: new Date().toISOString(),
    }));

    const { error: enrollError } = await supabase
      .from("student_subjects")
      .insert(enrollments);

    if (enrollError) throw new Error(enrollError.message);
  }

  return subject;
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
