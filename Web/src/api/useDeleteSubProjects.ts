import { useMutation } from "@tanstack/react-query";
import api from "../utils/axios";

export const useDeleteProject= () => {
  return useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: async ({  projectId }: {  projectId: number }): Promise<any> => {
      const response = await api.post(`SubProjectContainer/SubProject/Delete/${projectId}`);
      return response.data;
    },
    
  });
};