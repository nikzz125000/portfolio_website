import React, { useEffect, useState } from "react";
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
export interface ResumeData {
  personalInfo: {
    name: string;
    phone: string;
    email: string;
    photo: string;
    bio: string;
    location: string;
    focus: string;
  };
  education: {
    period: string;
    institution: string;
    location: string;
    degree: string;
  };
  experience: {
    period: string;
    title: string;
    company: string;
    location?: string;
    description: string;
  }[];
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
  },
  education: {
    period: "2019 - 2023",
    institution: "ArtCenter College of Design",
    location: "Pasadena, CA",
    degree: "B.Sc in Transportation Design, 3.6 GPA with Scholarship.",
  },
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
};

const ResumeEditor: React.FC = () => {
  const [data, setData] = useState<ResumeData>(defaultResume);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) {
        setData(JSON.parse(raw));
      }
    } catch {}
  }, []);

  const handleSave = () => {
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
            </Stack>

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Education
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="Period"
                value={data.education.period}
                onChange={(e) =>
                  handleChange("education.period", e.target.value)
                }
                fullWidth
              />
              <TextField
                label="Institution"
                value={data.education.institution}
                onChange={(e) =>
                  handleChange("education.institution", e.target.value)
                }
                fullWidth
              />
              <TextField
                label="Location"
                value={data.education.location}
                onChange={(e) =>
                  handleChange("education.location", e.target.value)
                }
                fullWidth
              />
              <TextField
                label="Degree/Notes"
                value={data.education.degree}
                onChange={(e) =>
                  handleChange("education.degree", e.target.value)
                }
                fullWidth
              />
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
              <div className="max-w-3xl mx-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
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

                <div className="mb-10">
                  <p className="text-base leading-relaxed">
                    {data.personalInfo.bio}
                  </p>
                </div>

                <div className="mb-10">
                  <h2 className="text-3xl font-bold mb-6">education</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <div className="text-base font-semibold mb-1">
                        {data.education.period}
                      </div>
                      <div className="text-base">
                        {data.education.institution}
                      </div>
                      <div className="text-base text-gray-600">
                        {data.education.location}
                      </div>
                    </div>
                    <div>
                      <div className="text-base">{data.education.degree}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-6">experience</h2>
                  <div className="space-y-6">
                    {data.experience.map((exp, i) => (
                      <div
                        key={i}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
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
              </div>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ResumeEditor;
