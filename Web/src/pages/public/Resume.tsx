/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from "react";
import { useResumeDetails } from "../../api/useResumeDetails";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { homepageStyles } from "../../components/Const";

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
      {/* Modern Instagram Icon - Updated 2024 */}
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.07 1.645.07 4.849 0 3.205-.012 3.584-.07 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 3.266-.058 1.645-.07 4.849-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  ),
  Behance: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      {/* Modern Behance Icon - Updated 2024 */}
      <path d="M22 7h-6V5h6v2zm-6 10h6v-2h-6v2zm-6-7c.9-.4 1.4-1.1 1.4-2.2C11 6.9 9.9 6 8 6H3v12h5.2c2.3 0 3.8-1.1 3.8-3.2 0-1.4-.6-2.3-1.4-2.6zM6 8.5h2c.9 0 1.4.4 1.4 1.1S8.9 10.8 8 10.8H6V8.5zm2.2 7H6v-2.6h2.2c1 0 1.6.5 1.6 1.3s-.6 1.3-1.6 1.3zM21.9 13.5c-.2-1.9-1.6-3.3-3.9-3.3-2.6 0-4.2 1.8-4.2 4.3 0 2.6 1.7 4.3 4.4 4.3 2 0 3.4-1 3.8-2.7h-2.1c-.2.6-.8 1-1.7 1-1.1 0-1.9-.8-2-2h5.7c0-.2 0-.4 0-.6zm-5.7-1.1c.2-1 1-1.6 1.9-1.6 1 0 1.7.6 1.9 1.6h-3.8z" />
    </svg>
  ),
  Globe: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm7.93 9h-3.18a15.9 15.9 0 00-1.2-5.01A8.02 8.02 0 0119.93 11zM12 4c.9 0 2.2 1.8 2.8 5H9.2c.6-3.2 1.9-5 2.8-5zM6.45 14a13.7 13.7 0 010-4h11.1a13.7 13.7 0 010 4H6.45zM8.45 18a15.9 15.9 0 01-1.2-5h9.5a15.9 15.9 0 01-1.2 5A8.02 8.02 0 0112 20a8.02 8.02 0 01-3.55-2zM8.45 5.99A15.9 15.9 0 007.25 11H4.07A8.02 8.02 0 018.45 6zM4.07 13h3.18a15.9 15.9 0 001.2 5.01A8.02 8.02 0 014.07 13z" />
    </svg>
  ),
  ResumeDoc: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zm0 0v6h6" />
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
  const navigate = useNavigate();

  // Visual design tokens
  const gradient8 =
    "linear-gradient(135deg, #6e226e 0%, #a5206a 14%, #d31663 28%, #ed3176 42%, #fd336b 56%, #f23d64 70%, #f65d55 84%, #f5655d 100%)";
  const cardStyle: React.CSSProperties = {
    background:
      "linear-gradient(135deg, rgba(9, 9, 9, 0.71) 0%, rgba(60, 35, 49, 0.78) 14%, rgba(43, 5, 20, 0.5) 28%, rgba(50, 21, 32, 0.56) 42%, rgba(253, 51, 107, 0.12) 56%, rgba(242, 61, 100, 0.10) 70%, rgba(246, 93, 85, 0.10) 84%, rgba(245, 101, 93, 0.10) 100%), rgba(10, 10, 14, 0.65)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 24,
    boxShadow:
      "0 8px 30px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.04)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    // backgroundColor: "rgba(0, 0, 0, 0.74)",
  };
  const sectionTitleStyle: React.CSSProperties = {
    background: gradient8,
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
  };
  const fadeUp: any = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: "easeOut" },
    viewport: { once: true, amount: 0.2 },
  };

  // Ensure natural page scrolling is enabled even after visiting custom-scroll pages
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "auto";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

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
    <div
      className="min-h-screen homepage-gradient-bg ff-brand"
      style={{ color: "#e5e7eb", overflowY: "auto" }}
    >
      {/* Reuse homepage gradient styles */}
      <style>{homepageStyles}</style>
      {/* Force-enable scrolling on this page (override any global scroll lock) */}
      <style>{`
        html, body { overflow: auto !important; }
        #root, main { overflow: visible !important; }
        .smooth-scroll-container, .smooth-scroll-content { 
          overflow: visible !important; 
          transform: none !important; 
        }
      `}</style>
      {/* Subtle gradient pattern overlay */}
      <div className="gradient-background-pattern" />
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

      <button
        onClick={() => navigate(-1)}
        aria-label="Go back"
        className="fixed top-4 left-4 z-50 inline-flex items-center gap-2 px-3 py-2 rounded-full border border-white/20 shadow-md backdrop-blur transition"
        style={{
          background: "rgba(0,0,0,0.45)",
          color: "#fff",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className="w-4 h-4"
        >
          <path d="M15.5 19a1 1 0 0 1-.7-.3l-6-6a1 1 0 0 1 0-1.4l6-6a1 1 0 1 1 1.4 1.4L10.9 12l5.3 5.3A1 1 0 0 1 15.5 19z" />
        </svg>
        <span className="text-sm font-semibold">Back</span>
      </button>

      {/* Header Section */}
      <div className="max-w-6xl mx-auto p-8">
        <motion.div
          {...fadeUp}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16"
          style={cardStyle}
        >
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
                className="w-full h-full object-cover"
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
              style={sectionTitleStyle}
            >
              {resumeData.personalInfo.name}
            </h1>
            {resumeData.personalInfo.location && (
              <div className="text-gray-300 text-lg">
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
              <div className="flex justify-end gap-3 text-white/90">
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
              style={{ color: "#e5e7eb" }}
            >
              {resumeData.personalInfo.bio
                .split(". ")
                .map((sentence, index) => {
                  if (sentence.includes(resumeData.personalInfo.focus)) {
                    const parts = sentence.split(resumeData.personalInfo.focus);
                    return (
                      <span key={index}>
                        {parts[0]}
                        <em className="italic" style={{ color: "#fca5a5" }}>
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
        </motion.div>

        {/* Education Section */}
        {resumeData.education && resumeData.education.length > 0 && (
          <motion.div {...fadeUp} className="mb-16" style={cardStyle}>
            <h2
              id="education-title"
              data-animate
              className={`text-5xl font-bold mb-12 animate-left ${
                visibleElements.has("education-title") ? "visible" : ""
              }`}
              style={sectionTitleStyle}
            >
              education
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative">
              {/* Vertical divider line */}
              <div
                className="hidden lg:block absolute left-1/2 top-0 h-full w-0.5 transform -translate-x-1/2"
                style={{ background: "rgba(255,255,255,0.18)" }}
              ></div>

              <div
                id="education-left"
                data-animate
                className={`pr-8 animate-left ${
                  visibleElements.has("education-left") ? "visible" : ""
                }`}
              >
                {resumeData.education.map((ed, i) => (
                  <div key={i} className="mb-6">
                    <div className="text-lg font-semibold mb-2 text-white">
                      {ed.period}
                    </div>
                    <div className="text-lg text-white/90">
                      {ed.institution}
                    </div>
                    <div className="text-lg text-gray-300">{ed.location}</div>
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
                    <div className="text-lg text-white/90">{ed.degree}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Experience Section */}
        <motion.div {...fadeUp} style={cardStyle}>
          <h2
            id="experience-title"
            data-animate
            className={`text-5xl font-bold mb-12 animate-left ${
              visibleElements.has("experience-title") ? "visible" : ""
            }`}
            style={sectionTitleStyle}
          >
            experience
          </h2>

          {resumeData.experience && resumeData.experience.length > 0 ? (
            resumeData.experience.map((exp, index) => (
              <div
                key={index}
                className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-12 relative"
              >
                {/* Vertical divider line */}
                <div
                  className="hidden lg:block absolute left-1/2 top-0 h-full w-0.5 transform -translate-x-1/2"
                  style={{ background: "rgba(255,255,255,0.18)" }}
                ></div>

                <div
                  id={`exp-left-${index}`}
                  data-animate
                  className={`pr-8 animate-left ${
                    visibleElements.has(`exp-left-${index}`) ? "visible" : ""
                  }`}
                >
                  <div className="text-lg font-semibold mb-2 text-white">
                    {exp.period}
                  </div>
                  <div className="text-lg italic mb-1 text-white/90">
                    {exp.title}
                  </div>
                  <div className="text-lg font-semibold text-white">
                    {exp.company}
                  </div>
                  {exp.location && (
                    <div className="text-lg text-gray-300">{exp.location}</div>
                  )}
                </div>

                <div
                  id={`exp-right-${index}`}
                  data-animate
                  className={`pl-8 animate-right ${
                    visibleElements.has(`exp-right-${index}`) ? "visible" : ""
                  }`}
                >
                  <div className="text-lg leading-relaxed text-white/90">
                    {exp.description}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-white/80 text-base">No experience found.</div>
          )}
        </motion.div>

        {/* Skills Section */}
        <motion.div {...fadeUp} className="mt-16" style={cardStyle}>
          <h2
            id="skills-title"
            data-animate
            className={`text-5xl font-bold mb-12 animate-left ${
              visibleElements.has("skills-title") ? "visible" : ""
            }`}
            style={sectionTitleStyle}
          >
            skills
          </h2>
          {resumeData.skills && resumeData.skills.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {resumeData.skills.map((cat, idx) => (
                <div key={idx}>
                  {cat.title && (
                    <div className="text-xl font-semibold mb-3 text-white">
                      {cat.title}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 items-start">
                    {(cat.items || []).map((it, j) => (
                      <div
                        key={j}
                        className="inline-block h-7 leading-[28px] px-3 rounded-full text-xs font-medium text-center align-middle whitespace-nowrap"
                        style={{
                          background: "rgba(255,255,255,0.08)",
                          color: "#fff",
                          border: "1px solid rgba(255,255,255,0.12)",
                          boxShadow: "0 2px 10px rgba(0,0,0,0.25)",
                        }}
                      >
                        {it}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-white/80 text-base">No skills found.</div>
          )}
        </motion.div>

        {/* Soft spacing after content */}
        <div style={{ height: 80, width: "100%" }} />
      </div>
    </div>
  );
};

export default AnimatedResume;


// import React, { useState, useEffect, useRef } from "react";
// import { useResumeDetails } from "../../api/useResumeDetails";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { homepageStyles } from "../../components/Const";

// // Types for the resume data structure
// interface EducationEntry {
//   period: string;
//   institution: string;
//   location: string;
//   degree: string;
// }

// interface SkillCategory {
//   title: string;
//   items: string[];
// }

// interface ResumeData {
//   personalInfo: {
//     name: string;
//     phone: string;
//     email: string;
//     photo: string;
//     bio: string;
//     location: string;
//     focus: string;
//     socials?: {
//       linkedin?: string;
//       instagram?: string;
//       behance?: string;
//       website?: string;
//     };
//   };
//   education: EducationEntry[];
//   experience: {
//     period: string;
//     title: string;
//     company: string;
//     location?: string;
//     description: string;
//   }[];
//   skills?: SkillCategory[];
// }

// // Default empty model matching UI structure
// const defaultResumeData: ResumeData = {
//   personalInfo: {
//     name: "",
//     phone: "",
//     email: "",
//     photo: "",
//     bio: "",
//     location: "",
//     focus: "",
//     socials: {
//       linkedin: "",
//       instagram: "",
//       behance: "",
//       website: "",
//     },
//   },
//   education: [],
//   experience: [],
//   skills: [],
// };

// const DEFAULT_AVATAR =
//   'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 24 24"><rect width="24" height="24" fill="%23e5e7eb"/><circle cx="12" cy="8" r="4" fill="%239ca3af"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6" fill="%239ca3af"/></svg>';



// const AnimatedResume: React.FC = () => {
//   const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
//   const [visibleElements, setVisibleElements] = useState<Set<string>>(
//     new Set()
//   );
//   const observerRef = useRef<IntersectionObserver | null>(null);
//   const { data: resumeResponse } = useResumeDetails();
//   const navigate = useNavigate();

//   // Visual design tokens
//   // const gradient8 =
//   //   "linear-gradient(135deg, #6e226e 0%, #a5206a 14%, #d31663 28%, #ed3176 42%, #fd336b 56%, #f23d64 70%, #f65d55 84%, #f5655d 100%)";

//   const fadeUp: any = {
//     initial: { opacity: 0, y: 24 },
//     whileInView: { opacity: 1, y: 0 },
//     transition: { duration: 0.7, ease: "easeOut" },
//     viewport: { once: true, amount: 0.2 },
//   };

//   // Ensure natural page scrolling is enabled
//   useEffect(() => {
//     const previous = document.body.style.overflow;
//     document.body.style.overflow = "auto";
//     return () => {
//       document.body.style.overflow = previous;
//     };
//   }, []);

//   useEffect(() => {
//     // Initialize Intersection Observer for scroll animations
//     observerRef.current = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             setVisibleElements((prev) => new Set([...prev, entry.target.id]));
//           }
//         });
//       },
//       { threshold: 0.1, rootMargin: "50px" }
//     );

//     // Observe all animated elements
//     const elements = document.querySelectorAll("[data-animate]");
//     elements.forEach((el) => observerRef.current?.observe(el));

//     return () => observerRef.current?.disconnect();
//   }, []);

//   // Re-observe animated elements whenever resume data changes
//   useEffect(() => {
//     if (!observerRef.current) return;
//     const elements = document.querySelectorAll("[data-animate]");
//     elements.forEach((el) => observerRef.current?.observe(el));
//   }, [resumeData]);

//   // Map API response to UI model
//   useEffect(() => {
//     if (!resumeResponse?.data) return;
//     const api = resumeResponse.data;
//     const parseArray = <T,>(json?: string): T[] => {
//       if (!json) return [];
//       try {
//         return JSON.parse(json) as T[];
//       } catch {
//         return [] as T[];
//       }
//     };

//     const next: ResumeData = {
//       personalInfo: {
//         name: api.name || "",
//         phone: api.phone || "",
//         email: api.email || "",
//         photo: api.photo || "",
//         bio: api.bio || "",
//         location: api.location || "",
//         focus: api.focus || "",
//         socials: {
//           linkedin: api.linkedinUrl || "",
//           instagram: api.instagramUrl || "",
//           behance: api.behanceUrl || "",
//           website: api.websiteUrl || "",
//         },
//       },
//       education: parseArray<EducationEntry>(api.educationJson),
//       experience: parseArray<ResumeData["experience"][number]>(
//         api.experienceJson
//       ),
//       skills: parseArray<SkillCategory>(api.skillsJson),
//     };

//     setResumeData(next);
//   }, [resumeResponse]);

//   return (
//     <div
//       className="min-h-screen ff-brand"
//       style={{ 
//         background: "linear-gradient(135deg, #ff6b35 0%, #f7931e 25%, #ff0080 50%, #8e44ad 75%, #3742fa 100%)",
//         color: "#fff", 
//         overflowY: "auto" 
//       }}
//     >
//       {/* Reuse homepage gradient styles */}
//       <style>{homepageStyles}</style>
//       {/* Force-enable scrolling on this page */}
//       <style>{`
//         html, body { overflow: auto !important; }
//         #root, main { overflow: visible !important; }
//         .smooth-scroll-container, .smooth-scroll-content { 
//           overflow: visible !important; 
//           transform: none !important; 
//         }

//         @keyframes fadeInUp {
//           from {
//             opacity: 0;
//             transform: translateY(30px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         .animate-up {
//           opacity: 0;
//           transform: translateY(30px);
//           transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
//         }

//         .visible {
//           opacity: 1;
//           transform: translateY(0);
//         }

//         .photo-container {
//           overflow: hidden;
//           border-radius: 20px;
//         }
//       `}</style>

//       <button
//         onClick={() => navigate(-1)}
//         aria-label="Go back"
//         className="fixed top-4 left-4 z-50 inline-flex items-center gap-2 px-3 py-2 rounded-full border border-white/20 shadow-md backdrop-blur transition"
//         style={{
//           background: "rgba(0,0,0,0.45)",
//           color: "#fff",
//         }}
//       >
//         <svg
//           viewBox="0 0 24 24"
//           fill="currentColor"
//           aria-hidden="true"
//           className="w-4 h-4"
//         >
//           <path d="M15.5 19a1 1 0 0 1-.7-.3l-6-6a1 1 0 0 1 0-1.4l6-6a1 1 0 1 1 1.4 1.4L10.9 12l5.3 5.3A1 1 0 0 1 15.5 19z" />
//         </svg>
//         <span className="text-sm font-semibold">Back</span>
//       </button>

//       {/* Main Layout Container */}
//       <div className="max-w-7xl mx-auto p-8">
//         <motion.div {...fadeUp} className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
            
//             {/* Left Side - Profile Image */}
//             <div className="lg:col-span-1 flex items-center justify-center">
//               <div
//                 id="photo"
//                 data-animate
//                 className={`photo-container w-full max-w-sm aspect-square animate-up ${
//                   visibleElements.has("photo") ? "visible" : ""
//                 }`}
//               >
//                 <img
//                   src={resumeData.personalInfo.photo || DEFAULT_AVATAR}
//                   alt={resumeData.personalInfo.name}
//                   className="w-full h-full object-cover"
//                   onError={(e) => {
//                     if (e.currentTarget.src !== DEFAULT_AVATAR) {
//                       e.currentTarget.src = DEFAULT_AVATAR;
//                     }
//                   }}
//                 />
//               </div>
//             </div>

//             {/* Right Side - Content */}
//             <div className="lg:col-span-2 flex flex-col">
              
//               {/* Name */}
//               <h1
//                 id="name"
//                 data-animate
//                 className={`text-6xl font-bold mb-6 animate-up ${
//                   visibleElements.has("name") ? "visible" : ""
//                 }`}
//                 style={{ 
//                   color: "#fff",
//                   textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
//                 }}
//               >
//                 {resumeData.personalInfo.name}
//               </h1>

//               {/* Bio */}
//               <div
//                 id="bio"
//                 data-animate
//                 className={`text-lg leading-relaxed mb-8 animate-up ${
//                   visibleElements.has("bio") ? "visible" : ""
//                 }`}
//                 style={{ color: "#fff" }}
//               >
//                 {resumeData.personalInfo.bio
//                   .split(". ")
//                   .map((sentence, index) => {
//                     if (sentence.includes(resumeData.personalInfo.focus)) {
//                       const parts = sentence.split(resumeData.personalInfo.focus);
//                       return (
//                         <span key={index}>
//                           {parts[0]}
//                           <em className="italic font-medium" style={{ color: "#ffeb3b" }}>
//                             {resumeData.personalInfo.focus}
//                           </em>
//                           {parts[1]}
//                           {index <
//                           resumeData.personalInfo.bio.split(". ").length - 1
//                             ? ". "
//                             : ""}
//                         </span>
//                       );
//                     }
//                     return (
//                       sentence +
//                       (index < resumeData.personalInfo.bio.split(". ").length - 1
//                         ? ". "
//                         : "")
//                     );
//                   })}
//               </div>

//               {/* Three Column Box */}
//               <div 
//                 className="bg-black/60 backdrop-blur-lg rounded-2xl p-6 border border-white/10 flex-1"
//                 style={{
//                   background: "linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(20,20,20,0.9) 100%)",
//                 }}
//               >
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
                  
//                   {/* Education Column */}
//                   <div className="flex flex-col">
//                     <h3 className="text-xl font-bold mb-4 text-white border-b border-white/20 pb-2">
//                       Education
//                     </h3>
//                     <div className="space-y-4 flex-1">
//                       {resumeData.education && resumeData.education.length > 0 ? (
//                         resumeData.education.map((ed, i) => (
//                           <div key={i} className="text-sm">
//                             <div className="font-semibold text-white mb-1">
//                               {ed.period}
//                             </div>
//                             <div className="text-gray-300 mb-1">
//                               {ed.degree}
//                             </div>
//                             <div className="text-gray-400 text-xs">
//                               {ed.institution}
//                             </div>
//                             <div className="text-gray-500 text-xs">
//                               {ed.location}
//                             </div>
//                           </div>
//                         ))
//                       ) : (
//                         <div className="text-gray-400 text-sm">No education data</div>
//                       )}
//                     </div>
//                   </div>

//                   {/* Experience Column */}
//                   <div className="flex flex-col">
//                     <h3 className="text-xl font-bold mb-4 text-white border-b border-white/20 pb-2">
//                       Experience
//                     </h3>
//                     <div className="space-y-4 flex-1">
//                       {resumeData.experience && resumeData.experience.length > 0 ? (
//                         resumeData.experience.map((exp, i) => (
//                           <div key={i} className="text-sm">
//                             <div className="font-semibold text-white mb-1">
//                               {exp.period}
//                             </div>
//                             <div className="text-gray-300 mb-1 font-medium">
//                               {exp.title}
//                             </div>
//                             <div className="text-gray-400 text-xs mb-1">
//                               {exp.company}
//                             </div>
//                             {exp.location && (
//                               <div className="text-gray-500 text-xs mb-2">
//                                 {exp.location}
//                               </div>
//                             )}
//                             <div className="text-gray-300 text-xs leading-relaxed">
//                               {exp.description.length > 100 
//                                 ? exp.description.substring(0, 100) + "..."
//                                 : exp.description
//                               }
//                             </div>
//                           </div>
//                         ))
//                       ) : (
//                         <div className="text-gray-400 text-sm">No experience data</div>
//                       )}
//                     </div>
//                   </div>

//                   {/* Skills Column */}
//                   <div className="flex flex-col">
//                     <h3 className="text-xl font-bold mb-4 text-white border-b border-white/20 pb-2">
//                       Skills
//                     </h3>
//                     <div className="space-y-4 flex-1">
//                       {resumeData.skills && resumeData.skills.length > 0 ? (
//                         resumeData.skills.map((cat, idx) => (
//                           <div key={idx}>
//                             {cat.title && (
//                               <div className="text-sm font-semibold mb-2 text-white">
//                                 {cat.title}
//                               </div>
//                             )}
//                             <div className="flex flex-wrap gap-1">
//                               {(cat.items || []).map((it, j) => (
//                                 <div
//                                   key={j}
//                                   className="inline-block px-2 py-1 rounded text-xs"
//                                   style={{
//                                     background: "rgba(255,255,255,0.1)",
//                                     color: "#fff",
//                                     border: "1px solid rgba(255,255,255,0.2)",
//                                   }}
//                                 >
//                                   {it}
//                                 </div>
//                               ))}
//                             </div>
//                           </div>
//                         ))
//                       ) : (
//                         <div className="text-gray-400 text-sm">No skills data</div>
//                       )}
//                     </div>
//                   </div>

//                 </div>
//               </div>

//               {/* Contact Info */}
//               <div className="mt-6 flex flex-wrap gap-4 text-sm">
//                 {resumeData.personalInfo.phone && (
//                   <div className="text-white">📱 {resumeData.personalInfo.phone}</div>
//                 )}
//                 {resumeData.personalInfo.email && (
//                   <div className="text-white">✉️ {resumeData.personalInfo.email}</div>
//                 )}
//                 {resumeData.personalInfo.location && (
//                   <div className="text-white">📍 {resumeData.personalInfo.location}</div>
//                 )}
//               </div>

//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default AnimatedResume;
