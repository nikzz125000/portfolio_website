import { useMutation } from "@tanstack/react-query";
import api from "../utils/axios";

export const useDeleteProject= () => {
  return useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: async ({ containerId, projectId }: { containerId: number; projectId: number }): Promise<any> => {
      const response = await api.post(`ProjectContainer/Project/Delete/${projectId}?ProjectId=${containerId}`)
      return response.data;
    },
    
  });
};