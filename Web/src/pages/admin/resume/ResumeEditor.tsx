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
    name: "glen george",
    phone: "6263752727",
    email: "glenkgeorge@gmail.com",
    photo:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2000&q=80",
    bio: "I am a brown boy with a really white name. No, I am not lying, my name is actually Glen George. Originally from India, I grew up in the Middle-East and now currently in Los Angeles, California. I focus on experience driven design and creating a future that is also art.",
    location: "Los Angeles, California1",
    focus: "experience driven design",
    socials: {
      linkedin: "https://www.linkedin.com/in/your-profile",
      instagram: "https://www.instagram.com/your-handle",
      behance: "https://www.behance.net/your-handle",
      website: "https://your-portfolio.com",
    },
  },
  education: [
    {
      period: "2019 - 2023",
      institution: "ArtCenter College of Design",
      location: "Pasadena, CA",
      degree: "B.Sc in Transportation Design, 3.6 GPA with Scholarship.",
    },
  ],
  experience: [
    {
      period: "November 2023 - Present",
      title: "Junior Designer",
      company: "Pininfarina of America Corp.",
      description:
        "Sketch, design and development support for client projects and internal projects varying all across North America. Working on Automotive, Marine and Industrial Design projects.",
    },
    {
      period: "Spring 2023",
      title: "Industrial Design Intern",
      company: "Polaris, Minnesota",
      description:
        "Sketch, design and development support for current projects in development including snowmobiles. Working with clay modelers to bring designs to life.",
    },
  ],
  skills: [
    { title: "Languages", items: ["English", "Malayalam", "Hindi"] },
    {
      title: "Softwares",
      items: [
        "Adobe Creative Suite",
        "Autodesk Alias",
        "VRED",
        "Keyshot",
        "Blender",
        "Gravity Sketch",
      ],
    },
    {
      title: "Design & Presentation",
      items: [
        "Concept Development",
        "Sketch Exploration",
        "Storyboarding",
        "Graphic Layout",
        "Sketch Renderings",
        "Clay Modeling",
        "Verbal Presentation",
      ],
    },
  ],
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
  const downloadResume = () => {
    try {
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "resume.json";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Failed to download resume", e);
    }
  };

  // Download current preview as PDF (fits on one A4 page)
  const downloadPDF = async () => {
    if (!previewRef.current) return;
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();

      // Scale image to fit within A4 while preserving aspect ratio
      const imgW = pageW;
      const imgH = (canvas.height * imgW) / canvas.width;
      const fitsHeight = imgH <= pageH;
      const finalW = fitsHeight ? imgW : (canvas.width * pageH) / canvas.height;
      const finalH = fitsHeight ? imgH : pageH;
      const x = (pageW - finalW) / 2;
      const y = (pageH - finalH) / 2;

      pdf.addImage(imgData, "PNG", x, y, finalW, finalH);
      pdf.save("resume.pdf");
    } catch (e) {
      console.error(
        "Failed to generate PDF. Ensure html2canvas and jspdf are installed.",
        e
      );
    }
  };

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
              <Button variant="outlined" onClick={downloadResume}>
                Download
              </Button>
              <Button variant="outlined" onClick={downloadPDF}>
                Download PDF
              </Button>
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
            <Box className="bg-white">
              <div ref={previewRef} className="max-w-3xl mx-auto px-6 py-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  <div className="flex flex-col">
                    <div className="w-64 h-72 mb-6 overflow-hidden rounded-md">
                      <img
                        src={data.personalInfo.photo || DEFAULT_AVATAR}
                        alt={data.personalInfo.name}
                        className="w-full h-full object-cover grayscale"
                        onError={(e) => {
                          if (e.currentTarget.src !== DEFAULT_AVATAR) {
                            e.currentTarget.src = DEFAULT_AVATAR;
                          }
                        }}
                      />
                    </div>
                    <h1 className="text-4xl font-bold mb-2">
                      {data.personalInfo.name}
                    </h1>
                    <div className="text-gray-600">
                      {data.personalInfo.location}
                    </div>
                  </div>
                  <div className="flex flex-col justify-center text-right">
                    <div className="text-lg font-semibold mb-1">
                      {data.personalInfo.phone}
                    </div>
                    <div className="text-base">{data.personalInfo.email}</div>
                  </div>
                </div>

                <div className="mb-8">
                  <p className="text-base leading-relaxed">
                    {data.personalInfo.bio}
                  </p>
                </div>

                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-5">education</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4">
                    {data.education.map((ed, i) => (
                      <React.Fragment key={i}>
                        <div>
                          <div className="text-base font-semibold mb-1">
                            {ed.period}
                          </div>
                          <div className="text-base">{ed.institution}</div>
                          <div className="text-base text-gray-600">
                            {ed.location}
                          </div>
                        </div>
                        <div>
                          <div className="text-base">{ed.degree}</div>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-5">experience</h2>
                  <div className="space-y-5">
                    {data.experience.map((exp, i) => (
                      <div
                        key={i}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                      >
                        <div>
                          <div className="text-base font-semibold mb-1">
                            {exp.period}
                          </div>
                          <div className="text-base italic">{exp.title}</div>
                          <div className="text-base font-semibold">
                            {exp.company}
                          </div>
                          {exp.location && (
                            <div className="text-base text-gray-600">
                              {exp.location}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-base leading-relaxed">
                            {exp.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {data.skills && data.skills.length > 0 && (
                  <div className="mt-8">
                    <h2 className="text-3xl font-bold mb-5">skills</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4">
                      {data.skills.map((cat, idx) => (
                        <div key={idx}>
                          <div className="text-lg font-semibold mb-2">
                            {cat.title}
                          </div>
                          <div className="flex flex-wrap gap-x-2 gap-y-1.5 items-start">
                            {cat.items.map((it, j) => (
                              <div
                                key={j}
                                className="inline-block h-6 leading-[24px] px-3 rounded-full bg-gray-200 text-gray-800 text-xs font-medium text-center align-middle whitespace-nowrap"
                              >
                                {it}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ResumeEditor;
