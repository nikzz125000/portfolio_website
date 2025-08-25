import { useQuery } from "@tanstack/react-query";
import api from "../../utils/axios";


export const useGetPadding = (projectId:number) => {
  return useQuery({
    queryKey: ["Padding/Details",projectId],
    queryFn: async () => {
      const response = await api.get(`Settings/Padding/Details/${projectId}`);
      return response.data;
    },
    enabled: !!projectId,
    // ✅ Forces a refetch every time the component is mounted
    refetchOnMount: true,
    // ✅ Also refetch if the window is focused
    refetchOnWindowFocus: true,
    // ✅ Disable cache or set short cache time
    staleTime: 0,
  });
};
