import { useQuery } from "@tanstack/react-query";
import api from "../utils/axios";


export const useScrollerSpeedSettings = () => {
  return useQuery({
    queryKey: [
      "Settings/Scroll/Details"
    ],
    queryFn: async () => {
      const response = await api.get(
        `Settings/Scroll/Details` // Assuming the endpoint is like this
      );
      return response.data;
    },
   enabled: true,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
};