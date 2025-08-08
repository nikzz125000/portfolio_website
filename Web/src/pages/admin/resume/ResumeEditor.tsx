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

const LOCAL_STORAGE_KEY = "resumeData";

const defaultResume: ResumeData = {
  personalInfo: {
    name: "glen george",
    phone: "6263752727",
    email: "glenkgeorge@gmail.com",
    photo:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2000&q=80",
    bio: "I am a brown boy with a really white name. No, I am not lying, my name is actually Glen George. Originally from India, I grew up in the Middle-East and now currently in Los Angeles, California. I focus on experience driven design and creating a future that is also art.",
    location: "Los Angeles, California",
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
  const previewRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) {
        setData(JSON.parse(raw));
      }
    } catch {}
  }, []);

  const handleSave = () => {
    console.log(JSON.stringify(data));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
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
      <Typography variant="h5" sx={{ mb: 2 }}>
        My Resume
      </Typography>
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
                  {data.personalInfo.photo && (
                    <img
                      src={data.personalInfo.photo}
                      alt="profile"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  )}
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

            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
              <Button variant="contained" color="primary" onClick={handleSave}>
                Update
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
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Live Preview
            </Typography>
            <Box className="bg-white">
              <div ref={previewRef} className="max-w-3xl mx-auto px-6 py-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  <div className="flex flex-col">
                    <div className="w-64 h-72 mb-6 overflow-hidden rounded-md">
                      <img
                        src={data.personalInfo.photo}
                        alt={data.personalInfo.name}
                        className="w-full h-full object-cover grayscale"
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
