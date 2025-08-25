import { useQuery } from "@tanstack/react-query";
import api from "../../utils/axios";


export const useGetBackgroundColor = (pageName:string) => {
  return useQuery({
    queryKey: ["BackgroundColor/List",pageName],
    queryFn: async () => {
      const response = await api.get(`Settings/BackGroundColor/Details/${pageName}`);
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
