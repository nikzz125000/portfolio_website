import { useMutation } from "@tanstack/react-query";
import api from "../../utils/axios";


export const useSaveBackGroundColor= () => {
  return useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: async (payload: any): Promise<any> => {
         
      const response = await api.post("Settings/BackGroundColor/CreateOrModify", payload, {
        
      })
      return response.data;
    },
   
  });
};