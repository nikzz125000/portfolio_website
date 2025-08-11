import { useMutation } from "@tanstack/react-query";
import api from "../utils/axios";

export interface SaveResumePayload {
  Id: number; // 0 for create, >0 for update
  Name: string;
  Phone: string;
  Email: string;
  Bio: string;
  Location: string;
  Focus: string;
  LinkedinUrl?: string;
  InstagramUrl?: string;
  BehanceUrl?: string;
  WebsiteUrl?: string;
  EducationJson: string; // stringified JSON array
  ExperienceJson: string; // stringified JSON array
  SkillsJson?: string; // stringified JSON array
  Photo?: File | null; // file input
}

export interface SaveResumeResponse {
  entityId: number;
  message: string;
  type: number;
  isSuccess: boolean;
  code: number;
}

export const useSaveResume = () => {
  return useMutation<SaveResumeResponse, unknown, SaveResumePayload>({
    mutationFn: async (payload: SaveResumePayload) => {
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") return;
        if (key === "Photo" && value instanceof File) {
          formData.append("Photo", value);
        } else {
          formData.append(key, String(value));
        }
      });

      const response = await api.post("Resume/CreateOrModify", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data as SaveResumeResponse;
    },
  });
};
