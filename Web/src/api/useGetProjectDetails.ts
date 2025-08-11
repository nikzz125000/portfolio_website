import { useQuery } from "@tanstack/react-query";
import api from "../utils/axios";

// Fetch list of sub project containers
export const useGetProjectDetailsList = (id:number) => {
  return useQuery({
    queryKey: ["SubProjectContainer/List",id],
    queryFn: async () => {
      const response = await api.get(`SubProjectContainer/List/${id}`);
      return response.data;
    },
    enabled: true,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
};
