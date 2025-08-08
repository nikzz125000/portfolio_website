import { useQuery } from "@tanstack/react-query";
import api from "../utils/axios";


export const useContainerDetails = (containerId:number) => {
  return useQuery({
    queryKey: [
      "Container/List",
    ],
    queryFn: async () => {
      const response = await api.get(
        `ProjectContainer/Details/${containerId}` // Assuming the endpoint is like this
      );
      return response.data;
    },
    enabled: !!containerId,
      // ✅ Forces a refetch every time the component is mounted
    refetchOnMount: true,
    // ✅ Also refetch if the window is focused
    refetchOnWindowFocus: true,
    // ✅ Disable cache or set short cache time
    staleTime: 0,
  });
};