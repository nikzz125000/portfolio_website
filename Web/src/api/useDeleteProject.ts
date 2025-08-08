import { useMutation } from "@tanstack/react-query";
import api from "../utils/axios";

export const useDeleteProject= () => {
  return useMutation({
    mutationFn: async ({ containerId, projectId }: { containerId: number; projectId: number }): Promise<any> => {
      const response = await api.delete(`ProjectContainer/Project/Delete/${containerId}?ProjectId=${projectId}`)
      return response.data;
    },
    
  });
};