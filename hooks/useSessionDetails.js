import { useQuery } from "@tanstack/react-query";
import attendanceRecordsApi from "../api/attendanceRecordsApi";

export const useSessionDetails = (sessionId) => {
  return useQuery({
    queryKey: ["session-details", sessionId],
    queryFn: () => attendanceRecordsApi.getBySession(sessionId),
    enabled: !!sessionId,
  });
};
