
import { useQuery } from "@tanstack/react-query";
import api from "../utils/axios";


export const useProjectList = () => {
  return useQuery({
    queryKey: [
      "ProjectContainer/Project/List",
    ],
    queryFn: async () => {
      const response = await api.get(
        `ProjectContainer/Project/List`
      );
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
