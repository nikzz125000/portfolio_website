import { useQuery } from "@tanstack/react-query";
import api from "../utils/axios";

// Fetch list of sub project containers
export const useSubProjectContainerList = (projectId:number) => {
  return useQuery({
    queryKey: ["SubProjectContainer/List",projectId],
    queryFn: async () => {
      const response = await api.get(`SubProjectContainer/List/${projectId}`);
      return response.data;
    },
    enabled: true,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
};
