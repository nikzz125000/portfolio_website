import { useQuery } from "@tanstack/react-query";
import api from "../utils/axios";

export const useHomeImagesDetail = () => {
  return useQuery({
    queryKey: ['HomeImagesDetail'],
    queryFn: async (): Promise<{ data: unknown[] }> => {
      const response = await api.get(`/ec1108ee-fa1b-4623-bc6c-7fc419fda864`);
      return response.data;
    },
    enabled: true,
  });
};