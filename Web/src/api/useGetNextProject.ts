import { useQuery } from "@tanstack/react-query";
import api from "../utils/axios";


export const useNextProjectDetails = (projectId:number) => {
  return useQuery({
    queryKey: [
      "Customer/NextProject",projectId
    ],
    queryFn: async () => {
      const response = await api.get(
        `Customer/NextProject/${projectId}` // Assuming the endpoint is like this
      );
      return response.data;
    },
   enabled: true,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
};