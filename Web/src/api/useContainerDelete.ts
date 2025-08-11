import { useMutation } from "@tanstack/react-query";
import api from "../utils/axios";

export const useDeleteContainer= () => {
  return useMutation({
    mutationFn: async ({ containerId, }: { containerId:number }): Promise<any> => {
      const response = await api.delete(`ProjectContainer/Delete/${containerId}`)
      return response.data;
    },
    
  });
};