import { useMutation } from "@tanstack/react-query";
import api from "../utils/axios";

export const useSaveContainer= () => {
  return useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: async (payload: any): Promise<any> => {
         
      const response = await api.post("ProjectContainer/CreateOrModify", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return response.data;
    },
   
  });
};