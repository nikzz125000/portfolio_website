import { useMutation } from "@tanstack/react-query";
import api from "../utils/axios";

export const useSaveContainer= () => {
  return useMutation({
    mutationFn: async (payload: any): Promise<any> => {
           console.log(502, payload);
      const response = await api.post("ProjectContainer/CreateOrModify", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return response.data;
    },
    onSuccess: (data:any) => {
      console.log(501,data)

    },
  });
};