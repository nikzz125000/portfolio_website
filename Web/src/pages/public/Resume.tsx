import React, { useState, useEffect, useRef } from "react";
import { useResumeDetails } from "../../api/useResumeDetails";

// Types for the resume data structure
interface EducationEntry {
  period: string;
  institution: string;
  location: string;
  degree: string;
}

interface SkillCategory {
  title: string;
  items: string[];
}

interface ResumeData {
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

// Default empty model matching UI structure
const defaultResumeData: ResumeData = {
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

const DEFAULT_AVATAR =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 24 24"><rect width="24" height="24" fill="%23e5e7eb"/><circle cx="12" cy="8" r="4" fill="%239ca3af"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6" fill="%239ca3af"/></svg>';

const AnimatedResume: React.FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [visibleElements, setVisibleElements] = useState<Set<string>>(
    new Set()
  );
  const observerRef = useRef<IntersectionObserver | null>(null);
  const { data: resumeResponse } = useResumeDetails();

  useEffect(() => {
    // Initialize Intersection Observer for scroll animations
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    // Observe all animated elements
    const elements = document.querySelectorAll("[data-animate]");
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, []);

  // Re-observe animated elements whenever resume data changes (after API load)
  useEffect(() => {
    if (!observerRef.current) return;
    const elements = document.querySelectorAll("[data-animate]");
    elements.forEach((el) => observerRef.current?.observe(el));
  }, [resumeData]);

  // Map API response to UI model
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

    setResumeData(next);
  }, [resumeResponse]);

  return (
    <div className="min-h-screen bg-white font-sans">
      <style>{`
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
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

        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-left {
          opacity: 0;
          transform: translateX(-50px);
          transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .animate-right {
          opacity: 0;
          transform: translateX(50px);
          transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .animate-up {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .animate-zoom {
          opacity: 0;
          transform: scale(0.8);
          transition: all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .visible {
          opacity: 1;
          transform: translateX(0) translateY(0) scale(1);
        }

        .photo-container {
          overflow: hidden;
          border-radius: 8px;
        }

        .photo-container img {
          transition: transform 0.3s ease;
        }

        .photo-container:hover img {
          transform: scale(1.1);
        }
      `}</style>

      {/* Header Section */}
      <div className="max-w-6xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left Side - Photo and Name */}
          <div className="flex flex-col">
            <div
              id="photo"
              data-animate
              className={`photo-container w-80 h-96 mb-8 animate-zoom ${
                visibleElements.has("photo") ? "visible" : ""
              }`}
            >
              <img
                src={resumeData.personalInfo.photo || DEFAULT_AVATAR}
                alt={resumeData.personalInfo.name}
                className="w-full h-full object-cover grayscale"
                onError={(e) => {
                  if (e.currentTarget.src !== DEFAULT_AVATAR) {
                    e.currentTarget.src = DEFAULT_AVATAR;
                  }
                }}
              />
            </div>

            <h1
              id="name"
              data-animate
              className={`text-6xl font-bold mb-4 animate-left ${
                visibleElements.has("name") ? "visible" : ""
              }`}
            >
              {resumeData.personalInfo.name}
            </h1>
            {resumeData.personalInfo.location && (
              <div className="text-gray-600 text-lg">
                {resumeData.personalInfo.location}
              </div>
            )}
          </div>

          {/* Right Side - Contact Info and Bio */}
          <div className="flex flex-col justify-center">
            <div
              id="contact"
              data-animate
              className={`text-right mb-8 animate-right ${
                visibleElements.has("contact") ? "visible" : ""
              }`}
            >
              <div className="text-xl font-semibold mb-2">
                {resumeData.personalInfo.phone}
              </div>
              <div className="text-lg mb-4">
                {resumeData.personalInfo.email}
              </div>
              <div className="flex justify-end gap-3">
                {resumeData.personalInfo.socials?.website && (
                  <a
                    href={resumeData.personalInfo.socials.website}
                    target="_blank"
                    rel="noreferrer"
                    className="w-6 h-6 bg-black rounded-full inline-block"
                    title="Website"
                  />
                )}
                {resumeData.personalInfo.socials?.linkedin && (
                  <a
                    href={resumeData.personalInfo.socials.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="w-6 h-6 bg-black rounded-full inline-block"
                    title="LinkedIn"
                  />
                )}
                {resumeData.personalInfo.socials?.instagram && (
                  <a
                    href={resumeData.personalInfo.socials.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="w-6 h-6 bg-black rounded-full inline-block"
                    title="Instagram"
                  />
                )}
                {resumeData.personalInfo.socials?.behance && (
                  <a
                    href={resumeData.personalInfo.socials.behance}
                    target="_blank"
                    rel="noreferrer"
                    className="w-6 h-6 bg-black rounded-full inline-block"
                    title="Behance"
                  />
                )}
              </div>
            </div>

            <div
              id="bio"
              data-animate
              className={`text-lg leading-relaxed animate-right ${
                visibleElements.has("bio") ? "visible" : ""
              }`}
            >
              {resumeData.personalInfo.bio
                .split(". ")
                .map((sentence, index) => {
                  if (sentence.includes(resumeData.personalInfo.focus)) {
                    const parts = sentence.split(resumeData.personalInfo.focus);
                    return (
                      <span key={index}>
                        {parts[0]}
                        <em className="italic">
                          {resumeData.personalInfo.focus}
                        </em>
                        {parts[1]}
                        {index <
                        resumeData.personalInfo.bio.split(". ").length - 1
                          ? ". "
                          : ""}
                      </span>
                    );
                  }
                  return (
                    sentence +
                    (index < resumeData.personalInfo.bio.split(". ").length - 1
                      ? ". "
                      : "")
                  );
                })}
            </div>
          </div>
        </div>

        {/* Education Section */}
        {resumeData.education && resumeData.education.length > 0 && (
          <div className="mb-16">
            <h2
              id="education-title"
              data-animate
              className={`text-5xl font-bold mb-12 animate-left ${
                visibleElements.has("education-title") ? "visible" : ""
              }`}
            >
              education
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative">
              {/* Vertical divider line */}
              <div className="hidden lg:block absolute left-1/2 top-0 h-full w-0.5 bg-gray-400 transform -translate-x-1/2"></div>

              <div
                id="education-left"
                data-animate
                className={`pr-8 animate-left ${
                  visibleElements.has("education-left") ? "visible" : ""
                }`}
              >
                {resumeData.education.map((ed, i) => (
                  <div key={i} className="mb-6">
                    <div className="text-lg font-semibold mb-2">
                      {ed.period}
                    </div>
                    <div className="text-lg">{ed.institution}</div>
                    <div className="text-lg text-gray-600">{ed.location}</div>
                  </div>
                ))}
              </div>

              <div
                id="education-right"
                data-animate
                className={`pl-8 animate-right ${
                  visibleElements.has("education-right") ? "visible" : ""
                }`}
              >
                {resumeData.education.map((ed, i) => (
                  <div key={i} className="mb-6">
                    <div className="text-lg">{ed.degree}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Experience Section */}
        {resumeData.experience && resumeData.experience.length > 0 && (
          <div>
            <h2
              id="experience-title"
              data-animate
              className={`text-5xl font-bold mb-12 animate-left ${
                visibleElements.has("experience-title") ? "visible" : ""
              }`}
            >
              experience
            </h2>

            {resumeData.experience.map((exp, index) => (
              <div
                key={index}
                className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-12 relative"
              >
                {/* Vertical divider line */}
                <div className="hidden lg:block absolute left-1/2 top-0 h-full w-0.5 bg-gray-400 transform -translate-x-1/2"></div>

                <div
                  id={`exp-left-${index}`}
                  data-animate
                  className={`pr-8 animate-left ${
                    visibleElements.has(`exp-left-${index}`) ? "visible" : ""
                  }`}
                >
                  <div className="text-lg font-semibold mb-2">{exp.period}</div>
                  <div className="text-lg italic mb-1">{exp.title}</div>
                  <div className="text-lg font-semibold">{exp.company}</div>
                  {exp.location && (
                    <div className="text-lg text-gray-600">{exp.location}</div>
                  )}
                </div>

                <div
                  id={`exp-right-${index}`}
                  data-animate
                  className={`pl-8 animate-right ${
                    visibleElements.has(`exp-right-${index}`) ? "visible" : ""
                  }`}
                >
                  <div className="text-lg leading-relaxed">
                    {exp.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skills Section */}
        {resumeData.skills && resumeData.skills.length > 0 && (
          <div className="mt-16">
            <h2
              id="skills-title"
              data-animate
              className={`text-5xl font-bold mb-12 animate-left ${
                visibleElements.has("skills-title") ? "visible" : ""
              }`}
            >
              skills
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {resumeData.skills.map((cat, idx) => (
                <div key={idx}>
                  {cat.title && (
                    <div className="text-xl font-semibold mb-3">
                      {cat.title}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 items-start">
                    {(cat.items || []).map((it, j) => (
                      <div
                        key={j}
                        className="inline-block h-7 leading-[28px] px-3 rounded-full bg-gray-200 text-gray-800 text-xs font-medium text-center align-middle whitespace-nowrap"
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
    </div>
  );
};

export default AnimatedResume;
