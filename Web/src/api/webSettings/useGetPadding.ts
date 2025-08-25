import { useQuery } from "@tanstack/react-query";
import api from "../../utils/axios";


export const useGetPadding = () => {
  return useQuery({
    queryKey: ["Padding/List"],
    queryFn: async () => {
      const response = await api.get(`Settings/Padding`);
      return response.data;
    },
    enabled: true,
    // ✅ Forces a refetch every time the component is mounted
    refetchOnMount: true,
    // ✅ Also refetch if the window is focused
    refetchOnWindowFocus: true,
    // ✅ Disable cache or set short cache time
    staleTime: 0,
  });
};
