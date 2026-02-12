import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import adminApi from "../api/adminApi";

export const usePendingUsers = () => {
  return useQuery({
    queryKey: ["pending-users"],
    queryFn: adminApi.getPendingUsers,
  });
};

export const useAssignRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminApi.updateUserRole,
    onSuccess: () => {
      queryClient.invalidateQueries(["pending-users"]);
    },
  });
};
