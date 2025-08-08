
import { useQuery } from "@tanstack/react-query";
import api from "../utils/axios";


export const useContainerList = () => {
  return useQuery({
    queryKey: [
      "Banner/List",
    ],
    queryFn: async () => {
      const response = await api.get(
        `ProjectContainer/List`
      );
      return response.data;
    },
    enabled: true,
  });
};
