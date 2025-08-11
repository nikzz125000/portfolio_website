import { useQuery } from "@tanstack/react-query";
import api from "../utils/axios";

export interface ResumeDetailsResponse {
  data: {
    id: number;
    name: string;
    phone: string;
    email: string;
    photo: string;
    bio: string;
    location: string;
    focus: string;
    linkedinUrl?: string;
    instagramUrl?: string;
    behanceUrl?: string;
    websiteUrl?: string;
    educationJson: string; // JSON string array
    experienceJson: string; // JSON string array
    skillsJson?: string; // JSON string array
  };
  isSuccess: boolean;
  message: string;
  code: number;
  type: number;
  entityId: number;
}

export const useResumeDetails = () => {
  return useQuery<ResumeDetailsResponse>({
    queryKey: ["Resume", "Details"],
    queryFn: async () => {
      const response = await api.get(`Resume/Details`);
      return response.data as ResumeDetailsResponse;
    },
    enabled: true,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
};
