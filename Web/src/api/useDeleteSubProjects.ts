import { useMutation } from "@tanstack/react-query";
import api from "../utils/axios";

export const useDeleteProject= () => {
  return useMutation({
    mutationFn: async ({  projectId }: {  projectId: number }): Promise<any> => {
      const response = await api.delete(`SubProjectContainer/SubProject/Delete/${projectId}`);
      return response.data;
    },
    
  });
};