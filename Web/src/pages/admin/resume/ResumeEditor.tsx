/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Typography,
  Button,
  IconButton,
  Paper,
  Divider,
  Stack,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useResumeDetails } from "../../../api/useResumeDetails";
import type { SaveResumePayload } from "../../../api/useSaveResume";
import { useSaveResume } from "../../../api/useSaveResume";
import type { SaveResumeResponse } from "../../../api/useSaveResume";
import { homepageStyles } from "../../../components/Const";

// Keep this aligned with the public resume view
export interface EducationEntry {
  period: string;
  institution: string;
  location: string;
  degree: string;
}

export interface SkillCategory {
  title: string;
  items: string[];
}

export interface ResumeData {
  personalInfo: {
    name: string;
    phone: string;
    email: string;
    photo: string;
    bio: string;
    location: string;
    focus: string;
    socials?: {
      linkedin?: string;
      instagram?: string;
      behance?: string;
      website?: string;
    };
  };
  education: EducationEntry[];
  experience: {
    period: string;
    title: string;
    company: string;
    location?: string;
    description: string;
  }[];
  skills?: SkillCategory[];
}

const LOCAL_STORAGE_KEY = "resumeData"; // kept as a local draft fallback
const LOCAL_STORAGE_RESUME_ID = "resumeId";
const DEFAULT_AVATAR =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 24 24"><rect width="24" height="24" fill="%23e5e7eb"/><circle cx="12" cy="8" r="4" fill="%239ca3af"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6" fill="%239ca3af"/></svg>';

const defaultResume: ResumeData = {
  personalInfo: {
    name: "",
    phone: "",
    email: "",
    photo: "",
    bio: "",
    location: "",
    focus: "",
    socials: {
      linkedin: "",
      instagram: "",
      behance: "",
      website: "",
    },
  },
  education: [],
  experience: [],
  skills: [],
};

const Icon = {
  LinkedIn: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M4.983 3.5C4.983 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.483 1.12 2.483 2.5zM.3 8.1h4.4V24H.3V8.1zm7.2 0h4.215v2.17h.06c.587-1.113 2.022-2.29 4.163-2.29 4.452 0 5.273 2.93 5.273 6.737V24H16.5v-6.94c0-1.656-.03-3.784-2.307-3.784-2.31 0-2.664 1.805-2.664 3.668V24H7.5V8.1z" />
    </svg>
  ),
  Instagram: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2.2c3.2 0 3.584.012 4.85.07 1.17.054 1.97.24 2.43.4a4.9 4.9 0 0 1 1.77 1.15 4.9 4.9 0 0 1 1.15 1.77c.16.46.346 1.26.4 2.43.058 1.266.07 1.65.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.24 1.97-.4 2.43a4.9 4.9 0 0 1-1.15 1.77 4.9 4.9 0 0 1-1.77 1.15c-.46.16-1.26.346-2.43.4-1.266.058-1.65.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.97-.24-2.43-.4a4.9 4.9 0 0 1-1.77-1.15 4.9 4.9 0 0 1-1.15-1.77c-.16-.46-.346-1.26-.4-2.43C2.212 15.584 2.2 15.2 2.2 12s.012-3.584.07-4.85c.054-1.17.24-1.97.4-2.43A4.9 4.9 0 0 1 3.82 2.95 4.9 4.9 0 0 1 5.59 1.8c.46-.16 1.26-.346 2.43-.4C9.284 1.342 9.668 1.33 12 1.33zm0 1.8c-3.16 0-3.535.012-4.78.07-.99.046-1.528.21-1.883.35-.474.184-.81.404-1.165.758-.354.355-.574.691-.758 1.165-.14.355-.304.893-.35 1.883-.058 1.245-.07 1.62-.07 4.78s.012 3.535.07 4.78c.046.99.21 1.528.35 1.883.184.474.404.81.758 1.165.355.354.691.574 1.165.758.355.14.893.304 1.883.35 1.245.058 1.62.07 4.78.07s3.535-.012 4.78-.07c.99-.046 1.528-.21 1.883-.35.474-.184.81-.404 1.165-.758.354-.355.574-.691.758-1.165.14-.355.304-.893.35-1.883.058-1.245.07-1.62.07-4.78s-.012-3.535-.07-4.78c-.046-.99-.21-1.528-.35-1.883a3.1 3.1 0 0 0-.758-1.165 3.1 3.1 0 0 0-1.165-.758c-.355-.14-.893-.304-1.883-.35-1.245-.058-1.62-.07-4.78-.07zm0 3.3a4.7 4.7 0 1 1 0 9.4 4.7 4.7 0 0 1 0-9.4zm0 1.8a2.9 2.9 0 1 0 0 5.8 2.9 2.9 0 0 0 0-5.8zm5.95-3.1a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2z" />
    </svg>
  ),
  Behance: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M22 7h-5V5h5v2zM9.6 11.2c.9-.4 1.4-1.1 1.4-2.2C11 6.9 9.9 6 8 6H3v12h5.2c2.3 0 3.8-1.1 3.8-3.2 0-1.4-.6-2.3-1.4-2.6zM6 8.5h2c.9 0 1.4.4 1.4 1.1S8.9 10.8 8 10.8H6V8.5zm2.2 7H6v-2.6h2.2c1 0 1.6.5 1.6 1.3s-.6 1.3-1.6 1.3zM21.9 13.5c-.2-1.9-1.6-3.3-3.9-3.3-2.6 0-4.2 1.8-4.2 4.3 0 2.6 1.7 4.3 4.4 4.3 2 0 3.4-1 3.8-2.7h-2.1c-.2.6-.8 1-1.7 1-1.1 0-1.9-.8-2-2h5.7c0-.2 0-.4 0-.6zm-5.7-1.1c.2-1 1-1.6 1.9-1.6 1 0 1.7.6 1.9 1.6h-3.8z" />
    </svg>
  ),
  Globe: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm7.93 9h-3.18a15.9 15.9 0 00-1.2-5.01A8.02 8.02 0 0119.93 11zM12 4c.9 0 2.2 1.8 2.8 5H9.2c.6-3.2 1.9-5 2.8-5zM6.45 14a13.7 13.7 0 010-4h11.1a13.7 13.7 0 010 4H6.45zM8.45 18a15.9 15.9 0 01-1.2-5h9.5a15.9 15.9 0 01-1.2 5A8.02 8.02 0 0112 20a8.02 8.02 0 01-3.55-2zM8.45 5.99A15.9 15.9 0 007.25 11H4.07A8.02 8.02 0 018.45 6zM4.07 13h3.18a15.9 15.9 0 001.2 5.01A8.02 8.02 0 014.07 13z" />
    </svg>
  ),
};

const ResumeEditor: React.FC = () => {
  const [data, setData] = useState<ResumeData>(defaultResume);
  const [resumeId, setResumeId] = useState<number>(() => {
    const raw = localStorage.getItem(LOCAL_STORAGE_RESUME_ID);
    const parsed = raw ? Number(raw) : 0;
    return Number.isFinite(parsed) ? parsed : 0;
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);

  const { data: resumeResponse, isFetching, refetch } = useResumeDetails();
  const { mutate: saveResume, isPending: isSaving } = useSaveResume();

  useEffect(() => {
    if (!resumeResponse?.data) return;
    const api = resumeResponse.data;
    const parseArray = <T,>(json?: string): T[] => {
      if (!json) return [];
      try {
        return JSON.parse(json) as T[];
      } catch {
        return [] as T[];
      }
    };

    const next: ResumeData = {
      personalInfo: {
        name: api.name || "",
        phone: api.phone || "",
        email: api.email || "",
        photo: api.photo || "",
        bio: api.bio || "",
        location: api.location || "",
        focus: api.focus || "",
        socials: {
          linkedin: api.linkedinUrl || "",
          instagram: api.instagramUrl || "",
          behance: api.behanceUrl || "",
          website: api.websiteUrl || "",
        },
      },
      education: parseArray<EducationEntry>(api.educationJson),
      experience: parseArray<ResumeData["experience"][number]>(
        api.experienceJson
      ),
      skills: parseArray<SkillCategory>(api.skillsJson),
    };
    setData(next);
    if (typeof api.id === "number" && api.id > 0) {
      setResumeId(api.id);
      try {
        localStorage.setItem(LOCAL_STORAGE_RESUME_ID, String(api.id));
      } catch {}
    }
  }, [resumeResponse]);

  // Visual tokens to mirror public resume design
  const gradient8 =
    "linear-gradient(135deg, #6e226e 0%, #a5206a 14%, #d31663 28%, #ed3176 42%, #fd336b 56%, #f23d64 70%, #f65d55 84%, #f5655d 100%)";
  const cardStyle: React.CSSProperties = {
    background:
      "linear-gradient(135deg, rgba(110, 34, 110, 0.22) 0%, rgba(165, 32, 106, 0.18) 14%, rgba(211, 22, 99, 0.16) 28%, rgba(237, 49, 118, 0.14) 42%, rgba(253, 51, 107, 0.12) 56%, rgba(242, 61, 100, 0.10) 70%, rgba(246, 93, 85, 0.10) 84%, rgba(245, 101, 93, 0.10) 100%), rgba(10, 10, 14, 0.65)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 24,
    boxShadow:
      "0 8px 30px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.04)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
  };
  const sectionTitleStyle: React.CSSProperties = {
    background: gradient8,
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
  };

  const handleSave = () => {
    const payload: SaveResumePayload = {
      Id: resumeId || 0,
      Name: data.personalInfo.name,
      Phone: data.personalInfo.phone,
      Email: data.personalInfo.email,
      Bio: data.personalInfo.bio,
      Location: data.personalInfo.location,
      Focus: data.personalInfo.focus,
      LinkedinUrl: data.personalInfo.socials?.linkedin || undefined,
      InstagramUrl: data.personalInfo.socials?.instagram || undefined,
      BehanceUrl: data.personalInfo.socials?.behance || undefined,
      WebsiteUrl: data.personalInfo.socials?.website || undefined,
      EducationJson: JSON.stringify(data.education || []),
      ExperienceJson: JSON.stringify(data.experience || []),
      SkillsJson:
        data.skills && data.skills.length > 0
          ? JSON.stringify(data.skills)
          : undefined,
      Photo: photoFile,
    };
    // keep local draft
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch {}

    saveResume(payload, {
      onSuccess: (resp: SaveResumeResponse) => {
        if (resp?.entityId && resp.entityId > 0) {
          setResumeId(resp.entityId);
          localStorage.setItem(LOCAL_STORAGE_RESUME_ID, String(resp.entityId));
          refetch();
        }
      },
    });
  };

  const handleChange = (path: string, value: string) => {
    setData((prev) => {
      const clone: any = structuredClone(prev);
      const parts = path.split(".");
      let cursor: any = clone;
      for (let i = 0; i < parts.length - 1; i++) cursor = cursor[parts[i]];
      cursor[parts[parts.length - 1]] = value;
      return clone as ResumeData;
    });
  };

  const onPhotoUpload = (file?: File | null) => {
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      handleChange("personalInfo.photo", result);
    };
    reader.readAsDataURL(file);
  };

  const addExperience = () => {
    setData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { period: "", title: "", company: "", location: "", description: "" },
      ],
    }));
  };

  const updateExperience = (
    index: number,
    field: keyof ResumeData["experience"][number],
    value: string
  ) => {
    setData((prev) => {
      const next = [...prev.experience];
      next[index] = { ...next[index], [field]: value } as any;
      return { ...prev, experience: next };
    });
  };

  const removeExperience = (index: number) => {
    setData((prev) => {
      const next = prev.experience.filter((_, i) => i !== index);
      return { ...prev, experience: next };
    });
  };

  // Skills CRUD
  const addSkillCategory = () => {
    setData((prev) => ({
      ...prev,
      skills: [...(prev.skills || []), { title: "", items: [] }],
    }));
  };

  const updateSkillCategoryTitle = (categoryIndex: number, title: string) => {
    setData((prev) => {
      const categories = [...(prev.skills || [])];
      categories[categoryIndex] = { ...categories[categoryIndex], title };
      return { ...prev, skills: categories };
    });
  };

  const addSkillItem = (categoryIndex: number) => {
    setData((prev) => {
      const categories = [...(prev.skills || [])];
      const items = [...(categories[categoryIndex]?.items || []), ""];
      categories[categoryIndex] = { ...categories[categoryIndex], items };
      return { ...prev, skills: categories };
    });
  };

  const updateSkillItem = (
    categoryIndex: number,
    itemIndex: number,
    value: string
  ) => {
    setData((prev) => {
      const categories = [...(prev.skills || [])];
      const items = [...(categories[categoryIndex]?.items || [])];
      items[itemIndex] = value;
      categories[categoryIndex] = { ...categories[categoryIndex], items };
      return { ...prev, skills: categories };
    });
  };

  const removeSkillItem = (categoryIndex: number, itemIndex: number) => {
    setData((prev) => {
      const categories = [...(prev.skills || [])];
      const items = (categories[categoryIndex]?.items || []).filter(
        (_: string, i: number) => i !== itemIndex
      );
      categories[categoryIndex] = { ...categories[categoryIndex], items };
      return { ...prev, skills: categories };
    });
  };

  const removeSkillCategory = (categoryIndex: number) => {
    setData((prev) => {
      const categories = (prev.skills || []).filter(
        (_, i) => i !== categoryIndex
      );
      return { ...prev, skills: categories };
    });
  };

  // Download current resume as JSON
  // const downloadResume = () => {
  //   try {
  //     const blob = new Blob([JSON.stringify(data, null, 2)], {
  //       type: "application/json",
  //     });
  //     const url = URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = "resume.json";
  //     a.click();
  //     URL.revokeObjectURL(url);
  //   } catch (e) {
  //     console.error("Failed to download resume", e);
  //   }
  // };

  // Download current preview as PDF (fits on one A4 page)
  // const downloadPDF = async () => {
  //   if (!previewRef.current) return;
  //   try {
  //     const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
  //       import("html2canvas"),
  //       import("jspdf"),
  //     ]);

  //     const canvas = await html2canvas(previewRef.current, {
  //       scale: 2,
  //       useCORS: true,
  //       backgroundColor: "#ffffff",
  //     });
  //     const imgData = canvas.toDataURL("image/png");
  //     const pdf = new jsPDF("p", "mm", "a4");
  //     const pageW = pdf.internal.pageSize.getWidth();
  //     const pageH = pdf.internal.pageSize.getHeight();

  //     // Scale image to fit within A4 while preserving aspect ratio
  //     const imgW = pageW;
  //     const imgH = (canvas.height * imgW) / canvas.width;
  //     const fitsHeight = imgH <= pageH;
  //     const finalW = fitsHeight ? imgW : (canvas.width * pageH) / canvas.height;
  //     const finalH = fitsHeight ? imgH : pageH;
  //     const x = (pageW - finalW) / 2;
  //     const y = (pageH - finalH) / 2;

  //     pdf.addImage(imgData, "PNG", x, y, finalW, finalH);
  //     pdf.save("resume.pdf");
  //   } catch (e) {
  //     console.error(
  //       "Failed to generate PDF. Ensure html2canvas and jspdf are installed.",
  //       e
  //     );
  //   }
  // };

  // Education CRUD
  const addEducation = () => {
    setData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { period: "", institution: "", location: "", degree: "" },
      ],
    }));
  };

  const updateEducation = (
    index: number,
    field: keyof EducationEntry,
    value: string
  ) => {
    setData((prev) => {
      const next = [...prev.education];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, education: next };
    });
  };

  const removeEducation = (index: number) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
        <Typography variant="h5">My Resume</Typography>
        {resumeId > 0 && (
          <Typography variant="body2" color="text.secondary">
            ID: {resumeId}
          </Typography>
        )}
      </Stack>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Personal Information
            </Typography>
            <Stack spacing={2}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    width: 96,
                    height: 96,
                    borderRadius: 1,
                    overflow: "hidden",
                    bgcolor: "#eee",
                  }}
                >
                  <img
                    src={data.personalInfo.photo || DEFAULT_AVATAR}
                    alt="profile"
                    onError={(e) => {
                      if (e.currentTarget.src !== DEFAULT_AVATAR) {
                        e.currentTarget.src = DEFAULT_AVATAR;
                      }
                    }}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
                <Button variant="outlined" component="label">
                  Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => onPhotoUpload(e.target.files?.[0])}
                  />
                </Button>
              </Stack>
              <TextField
                label="Name"
                value={data.personalInfo.name}
                onChange={(e) =>
                  handleChange("personalInfo.name", e.target.value)
                }
                fullWidth
              />
              <TextField
                label="Phone"
                value={data.personalInfo.phone}
                onChange={(e) =>
                  handleChange("personalInfo.phone", e.target.value)
                }
                fullWidth
              />
              <TextField
                label="Email"
                value={data.personalInfo.email}
                onChange={(e) =>
                  handleChange("personalInfo.email", e.target.value)
                }
                fullWidth
              />
              <TextField
                label="Photo URL"
                value={data.personalInfo.photo}
                onChange={(e) =>
                  handleChange("personalInfo.photo", e.target.value)
                }
                fullWidth
              />
              <TextField
                label="Location"
                value={data.personalInfo.location}
                onChange={(e) =>
                  handleChange("personalInfo.location", e.target.value)
                }
                fullWidth
              />
              <TextField
                label="Focus (emphasis)"
                value={data.personalInfo.focus}
                onChange={(e) =>
                  handleChange("personalInfo.focus", e.target.value)
                }
                fullWidth
              />
              <TextField
                label="Bio"
                value={data.personalInfo.bio}
                onChange={(e) =>
                  handleChange("personalInfo.bio", e.target.value)
                }
                fullWidth
                multiline
                minRows={4}
              />
              <Divider />
              <Typography variant="subtitle2">Social Links</Typography>
              <TextField
                label="LinkedIn URL"
                value={data.personalInfo.socials?.linkedin || ""}
                onChange={(e) =>
                  handleChange("personalInfo.socials.linkedin", e.target.value)
                }
                fullWidth
              />
              <TextField
                label="Instagram URL"
                value={data.personalInfo.socials?.instagram || ""}
                onChange={(e) =>
                  handleChange("personalInfo.socials.instagram", e.target.value)
                }
                fullWidth
              />
              <TextField
                label="Behance URL"
                value={data.personalInfo.socials?.behance || ""}
                onChange={(e) =>
                  handleChange("personalInfo.socials.behance", e.target.value)
                }
                fullWidth
              />
              <TextField
                label="Website URL"
                value={data.personalInfo.socials?.website || ""}
                onChange={(e) =>
                  handleChange("personalInfo.socials.website", e.target.value)
                }
                fullWidth
              />
            </Stack>

            <Divider sx={{ my: 3 }} />

            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: 1 }}
            >
              <Typography variant="subtitle1">Education</Typography>
              <Button
                startIcon={<Add />}
                onClick={addEducation}
                variant="outlined"
                size="small"
              >
                Add
              </Button>
            </Stack>
            <Stack spacing={2}>
              {data.education.map((ed, idx) => (
                <Paper key={idx} variant="outlined" sx={{ p: 2 }}>
                  <Stack spacing={1}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Entry {idx + 1}
                      </Typography>
                      <IconButton
                        color="error"
                        onClick={() => removeEducation(idx)}
                      >
                        <Delete />
                      </IconButton>
                    </Stack>
                    <TextField
                      label="Period"
                      value={ed.period}
                      onChange={(e) =>
                        updateEducation(idx, "period", e.target.value)
                      }
                      fullWidth
                    />
                    <TextField
                      label="Institution"
                      value={ed.institution}
                      onChange={(e) =>
                        updateEducation(idx, "institution", e.target.value)
                      }
                      fullWidth
                    />
                    <TextField
                      label="Location"
                      value={ed.location}
                      onChange={(e) =>
                        updateEducation(idx, "location", e.target.value)
                      }
                      fullWidth
                    />
                    <TextField
                      label="Degree/Notes"
                      value={ed.degree}
                      onChange={(e) =>
                        updateEducation(idx, "degree", e.target.value)
                      }
                      fullWidth
                    />
                  </Stack>
                </Paper>
              ))}
            </Stack>

            <Divider sx={{ my: 3 }} />

            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="subtitle1">Experience</Typography>
              <Button
                startIcon={<Add />}
                onClick={addExperience}
                variant="outlined"
                size="small"
              >
                Add
              </Button>
            </Stack>

            <Stack spacing={2} sx={{ mt: 2 }}>
              {data.experience.map((exp, idx) => (
                <Paper key={idx} variant="outlined" sx={{ p: 2 }}>
                  <Stack spacing={1}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Item {idx + 1}
                      </Typography>
                      <IconButton
                        color="error"
                        onClick={() => removeExperience(idx)}
                      >
                        <Delete />
                      </IconButton>
                    </Stack>
                    <TextField
                      label="Period"
                      value={exp.period}
                      onChange={(e) =>
                        updateExperience(idx, "period", e.target.value)
                      }
                      fullWidth
                    />
                    <TextField
                      label="Title"
                      value={exp.title}
                      onChange={(e) =>
                        updateExperience(idx, "title", e.target.value)
                      }
                      fullWidth
                    />
                    <TextField
                      label="Company"
                      value={exp.company}
                      onChange={(e) =>
                        updateExperience(idx, "company", e.target.value)
                      }
                      fullWidth
                    />
                    <TextField
                      label="Location (optional)"
                      value={exp.location || ""}
                      onChange={(e) =>
                        updateExperience(idx, "location", e.target.value)
                      }
                      fullWidth
                    />
                    <TextField
                      label="Description"
                      value={exp.description}
                      onChange={(e) =>
                        updateExperience(idx, "description", e.target.value)
                      }
                      fullWidth
                      multiline
                      minRows={3}
                    />
                  </Stack>
                </Paper>
              ))}
            </Stack>

            <Divider sx={{ my: 3 }} />

            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="subtitle1">Skills</Typography>
              <Button
                startIcon={<Add />}
                onClick={addSkillCategory}
                variant="outlined"
                size="small"
              >
                Add Category
              </Button>
            </Stack>

            <Stack spacing={2} sx={{ mt: 2 }}>
              {(data.skills || []).map((cat, cIdx) => (
                <Paper key={cIdx} variant="outlined" sx={{ p: 2 }}>
                  <Stack spacing={1}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Category {cIdx + 1}
                      </Typography>
                      <IconButton
                        color="error"
                        onClick={() => removeSkillCategory(cIdx)}
                      >
                        <Delete />
                      </IconButton>
                    </Stack>
                    <TextField
                      label="Title"
                      value={cat.title}
                      onChange={(e) =>
                        updateSkillCategoryTitle(cIdx, e.target.value)
                      }
                      fullWidth
                    />
                    <Stack spacing={1}>
                      {(cat.items || []).map((item, iIdx) => (
                        <Stack
                          key={iIdx}
                          direction="row"
                          spacing={1}
                          alignItems="center"
                        >
                          <TextField
                            label={`Item ${iIdx + 1}`}
                            value={item}
                            onChange={(e) =>
                              updateSkillItem(cIdx, iIdx, e.target.value)
                            }
                            fullWidth
                          />
                          <IconButton
                            color="error"
                            onClick={() => removeSkillItem(cIdx, iIdx)}
                          >
                            <Delete />
                          </IconButton>
                        </Stack>
                      ))}
                      <Button
                        startIcon={<Add />}
                        onClick={() => addSkillItem(cIdx)}
                        size="small"
                        variant="text"
                        sx={{ alignSelf: "flex-start" }}
                      >
                        Add Item
                      </Button>
                    </Stack>
                  </Stack>
                </Paper>
              ))}
            </Stack>

            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={isSaving}
              >
                {resumeId > 0
                  ? isSaving
                    ? "Saving..."
                    : "Update"
                  : isSaving
                  ? "Saving..."
                  : "Create"}
              </Button>
              {/* <Button variant="outlined" onClick={downloadResume}>
                Download
              </Button>
              <Button variant="outlined" onClick={downloadPDF}>
                Download PDF
              </Button> */}
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          {/* Live Preview */}
          <Paper sx={{ p: 2 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Typography variant="subtitle1">Live Preview</Typography>
              {(isFetching || isSaving) && (
                <Typography variant="caption" color="text.secondary">
                  {isFetching ? "Loading..." : "Saving..."}
                </Typography>
              )}
            </Stack>
            {/* Mirror public resume visual system exactly */}
            <Box
              className="min-h-screen ff-brand"
              sx={{
                color: "#fff",
                overflowY: "auto",
                background:
                  "linear-gradient(135deg, #ff6b35 0%, #f7931e 25%, #ff0080 50%, #8e44ad 75%, #3742fa 100%)",
                borderRadius: 1,
                overflow: "hidden",
              }}
            >
              <style>{homepageStyles}</style>
              {/* Force-enable scrolling in admin preview; do not adopt homepage scroll lock */}
              <style>{`
                html, body { overflow: auto !important; }
                #root, main { overflow: visible !important; }
                .smooth-scroll-container, .smooth-scroll-content {
                  overflow: visible !important;
                  transform: none !important;
                }

                @keyframes fadeInUp {
                  from {
                    opacity: 0;
                    transform: translateY(30px);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }

                .animate-up {
                  opacity: 0;
                  transform: translateY(30px);
                  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }

                .visible {
                  opacity: 1;
                  transform: translateY(0);
                }

                .photo-container {
                  overflow: hidden;
                  border-radius: 20px;
                }
              `}</style>

              <div ref={previewRef} className="max-w-7xl mx-auto p-8">
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
                    {/* Left Side - Profile Image */}
                    <div className="lg:col-span-1 flex items-center justify-center">
                      <div className="photo-container w-full max-w-sm aspect-square">
                        <img
                          src={data.personalInfo.photo || DEFAULT_AVATAR}
                          alt={data.personalInfo.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            if (e.currentTarget.src !== DEFAULT_AVATAR) {
                              e.currentTarget.src = DEFAULT_AVATAR;
                            }
                          }}
                        />
                      </div>
                    </div>

                    {/* Right Side - Content */}
                    <div className="lg:col-span-2 flex flex-col">
                      {/* Name */}
                      <h1
                        className="text-6xl font-bold mb-6"
                        style={{
                          color: "#fff",
                          textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                        }}
                      >
                        {data.personalInfo.name}
                      </h1>

                      {/* Bio */}
                      <div
                        className="text-lg leading-relaxed mb-8"
                        style={{ color: "#fff" }}
                      >
                        {data.personalInfo.bio
                          .split(". ")
                          .map((sentence, index) => {
                            if (sentence.includes(data.personalInfo.focus)) {
                              const parts = sentence.split(
                                data.personalInfo.focus
                              );
                              return (
                                <span key={index}>
                                  {parts[0]}
                                  <em
                                    className="italic font-medium"
                                    style={{ color: "#ffeb3b" }}
                                  >
                                    {data.personalInfo.focus}
                                  </em>
                                  {parts[1]}
                                  {index <
                                  data.personalInfo.bio.split(". ").length - 1
                                    ? ". "
                                    : ""}
                                </span>
                              );
                            }
                            return (
                              sentence +
                              (index <
                              data.personalInfo.bio.split(". ").length - 1
                                ? ". "
                                : "")
                            );
                          })}
                      </div>

                      {/* Three Column Box */}
                      <div
                        className="bg-black/60 backdrop-blur-lg rounded-2xl p-6 border border-white/10 flex-1"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(20,20,20,0.9) 100%)",
                        }}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
                          {/* Education Column */}
                          <div className="flex flex-col">
                            <h3 className="text-xl font-bold mb-4 text-white border-b border-white/20 pb-2">
                              Education
                            </h3>
                            <div className="space-y-4 flex-1">
                              {data.education && data.education.length > 0 ? (
                                data.education.map((ed, i) => (
                                  <div key={i} className="text-sm">
                                    <div className="font-semibold text-white mb-1">
                                      {ed.period}
                                    </div>
                                    <div className="text-gray-300 mb-1">
                                      {ed.degree}
                                    </div>
                                    <div className="text-gray-400 text-xs">
                                      {ed.institution}
                                    </div>
                                    <div className="text-gray-500 text-xs">
                                      {ed.location}
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="text-gray-400 text-sm">
                                  No education data
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Experience Column */}
                          <div className="flex flex-col">
                            <h3 className="text-xl font-bold mb-4 text-white border-b border-white/20 pb-2">
                              Experience
                            </h3>
                            <div className="space-y-4 flex-1">
                              {data.experience && data.experience.length > 0 ? (
                                data.experience.map((exp, i) => (
                                  <div key={i} className="text-sm">
                                    <div className="font-semibold text-white mb-1">
                                      {exp.period}
                                    </div>
                                    <div className="text-gray-300 mb-1 font-medium">
                                      {exp.title}
                                    </div>
                                    <div className="text-gray-400 text-xs mb-1">
                                      {exp.company}
                                    </div>
                                    {exp.location && (
                                      <div className="text-gray-500 text-xs mb-2">
                                        {exp.location}
                                      </div>
                                    )}
                                    <div className="text-gray-300 text-xs leading-relaxed">
                                      {exp.description.length > 100
                                        ? exp.description.substring(0, 100) +
                                          "..."
                                        : exp.description}
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="text-gray-400 text-sm">
                                  No experience data
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Skills Column */}
                          <div className="flex flex-col">
                            <h3 className="text-xl font-bold mb-4 text-white border-b border-white/20 pb-2">
                              Skills
                            </h3>
                            <div className="space-y-4 flex-1">
                              {data.skills && data.skills.length > 0 ? (
                                data.skills.map((cat, idx) => (
                                  <div key={idx}>
                                    {cat.title && (
                                      <div className="text-sm font-semibold mb-2 text-white">
                                        {cat.title}
                                      </div>
                                    )}
                                    <div className="flex flex-wrap gap-1">
                                      {(cat.items || []).map((it, j) => (
                                        <div
                                          key={j}
                                          className="inline-block px-2 py-1 rounded text-xs"
                                          style={{
                                            background: "rgba(255,255,255,0.1)",
                                            color: "#fff",
                                            border:
                                              "1px solid rgba(255,255,255,0.2)",
                                          }}
                                        >
                                          {it}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="text-gray-400 text-sm">
                                  No skills data
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="mt-6 flex flex-wrap gap-4 text-sm">
                        {data.personalInfo.phone && (
                          <div className="text-white">
                            📱 {data.personalInfo.phone}
                          </div>
                        )}
                        {data.personalInfo.email && (
                          <div className="text-white">
                            ✉️ {data.personalInfo.email}
                          </div>
                        )}
                        {data.personalInfo.location && (
                          <div className="text-white">
                            📍 {data.personalInfo.location}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ResumeEditor;
