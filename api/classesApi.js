import { supabase } from "../services/supabase";

const TABLE = "classes";

const createClass = async (body) => {
  const { name, year, section } = body;

  if (!name || !year || !section) {
    throw new Error("Name, year and section are required");
  }

  const { data, error } = await supabase
    .from(TABLE)
    .insert([{ name, year, section }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

const getClasses = async () => {
  const { data, error } = await supabase
    .from(TABLE)
    .select("id, name, year, section")
    .order("year", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
};

export default {
  create: createClass,
  get: getClasses,
};
