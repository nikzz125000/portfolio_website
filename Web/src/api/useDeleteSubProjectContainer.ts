import { useMutation } from "@tanstack/react-query";
import api from "../utils/axios";

export const useDeleteProject= () => {
  return useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: async ({ containerId }: { containerId: number;}): Promise<any> => {
      const response = await api.delete(`SubProjectContainer/Delete/${containerId}`);
      return response.data;
    },
    
  });
};