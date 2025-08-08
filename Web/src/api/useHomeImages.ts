import { useQuery } from "@tanstack/react-query";
import api from "../utils/axios";

export const useHomeImages = (counterId: string) => {
  return useQuery({
    queryKey: ['HomeImages', counterId],
    queryFn: async (): Promise<{ data: unknown[] }> => {
      const response = await api.get(`/f4e4b291-1104-495f-aeab-bed5bb98d676`);
      return response.data;
    },
    enabled: !!counterId,
  });
};