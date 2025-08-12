import { useMutation } from "@tanstack/react-query";
import api from "../utils/axios";

export interface CustomerConnectPayload {
  mobileNumber: string;
  email: string;
  message: string;
}

export interface CustomerConnectResponse {
  entityId: number;
  message: string;
  type: number;
  isSuccess: boolean;
  code: number;
}

export const useCustomerConnect = () => {
  return useMutation({
    mutationFn: async (
      payload: CustomerConnectPayload
    ): Promise<CustomerConnectResponse> => {
      const response = await api.post("Customer/Connect", payload);
      return response.data;
    },
  });
};
