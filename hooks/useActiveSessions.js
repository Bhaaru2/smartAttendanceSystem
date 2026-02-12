import { useQuery } from "@tanstack/react-query";
import { supabase } from "../services/supabase";

export const useActiveSessions = () => {
  return useQuery({
    queryKey: ["active-sessions"],
    queryFn: async () => {
      const now = new Date().toISOString();

      const { data, error } = await supabase
        .from("attendance_sessions")
        .select("id, subject_id, expires_at")
        .eq("is_active", true)
        .gt("expires_at", now);

      if (error) throw new Error(error.message);

      return data || [];
    },
    refetchInterval: 5000, // auto refresh every 5s
  });
};
