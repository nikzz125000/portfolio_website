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
              <div className="flex justify-end gap-3 text-gray-800">
                {resumeData.personalInfo.socials?.website && (
                  <a
                    href={resumeData.personalInfo.socials.website}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Website"
                    className="inline-flex items-center justify-center w-6 h-6"
                  >
                    <Icon.Globe width={20} height={20} />
                  </a>
                )}
                {resumeData.personalInfo.socials?.linkedin && (
                  <a
                    href={resumeData.personalInfo.socials.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                    className="inline-flex items-center justify-center w-6 h-6"
                  >
                    <Icon.LinkedIn width={20} height={20} />
                  </a>
                )}
                {resumeData.personalInfo.socials?.instagram && (
                  <a
                    href={resumeData.personalInfo.socials.instagram}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                    className="inline-flex items-center justify-center w-6 h-6"
                  >
                    <Icon.Instagram width={20} height={20} />
                  </a>
                )}
                {resumeData.personalInfo.socials?.behance && (
                  <a
                    href={resumeData.personalInfo.socials.behance}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Behance"
                    className="inline-flex items-center justify-center w-6 h-6"
                  >
                    <Icon.Behance width={20} height={20} />
                  </a>
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
