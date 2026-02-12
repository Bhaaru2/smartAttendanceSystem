import { supabase } from "../services/supabase";

// Get only users with no role assigned
const getPendingUsers = async () => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, name")
    .is("role", null);

  if (error) throw new Error(error.message);
  return data;
};

// Update role only in profiles
const updateUserRole = async ({ id, role }) => {
  const { data, error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", id)
    .select();

  if (error) throw new Error(error.message);

  if (!data || data.length === 0) {
    throw new Error("Update failed. No rows affected.");
  }

  return data;
};



export default {
  getPendingUsers,
  updateUserRole,
};
