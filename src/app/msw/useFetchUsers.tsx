import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "./fetchUsers";

export const useFetchUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });
};
