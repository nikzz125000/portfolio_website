// import { useQuery } from "@tanstack/react-query";
// import { axiosInstance } from "../utils/axios";

// export interface ScrollSpeedSettings {
//   wheel: number;
//   touch: number;
//   keyboard: number;
//   momentum: number;
//   smoothness: number;
// }

// export const useScrollSpeedSettings = () => {
//   return useQuery({
//     queryKey: ["scrollSpeedSettings"],
//     queryFn: async (): Promise<ScrollSpeedSettings> => {
//       try {
//         const response = await axiosInstance.get("/api/scroll-speed-settings");
//         return response.data;
//       } catch (error) {
//         console.warn("Failed to fetch scroll speed settings, using defaults:", error);
//         // Return default settings if API fails
//         return {
//           wheel: 0.2,
//           touch: 0.6,
//           keyboard: 1.0,
//           momentum: 0.3,
//           smoothness: 0.08,
//         };
//       }
//     },
//     staleTime: 5 * 60 * 1000, // 5 minutes
//     cacheTime: 10 * 60 * 1000, // 10 minutes
//   });
// };

// export const useSaveScrollSpeedSettings = () => {
//   return useQuery({
//     queryKey: ["saveScrollSpeedSettings"],
//     queryFn: async (settings: ScrollSpeedSettings): Promise<void> => {
//       try {
//         await axiosInstance.post("/api/scroll-speed-settings", settings);
//       } catch (error) {
//         console.error("Failed to save scroll speed settings:", error);
//         throw error;
//       }
//     },
//     enabled: false, // Don't run automatically
//   });
// };
