/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "@tanstack/react-query";
import api from "../utils/axios";

// Create or modify a sub project container
export const useSaveSubProjectContainer = () => {
  return useMutation({
    mutationFn: async (payload: FormData): Promise<any> => {
      const response = await api.post("SubProjectContainer/CreateOrModify", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    
  });
};