import { useQuery } from "@tanstack/react-query";
import api from "../utils/axios";

// Fetch list of sub project containers
export const useSubProjectContainerList = () => {
  return useQuery({
    queryKey: ["SubProjectContainer/List"],
    queryFn: async () => {
      const response = await api.get(`SubProjectContainer/List`);
      return response.data;
    },
    enabled: true,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
};
