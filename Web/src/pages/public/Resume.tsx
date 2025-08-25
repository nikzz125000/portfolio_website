/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from "react";
import { useResumeDetails } from "../../api/useResumeDetails";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { homepageStyles } from "../../components/Const";
import { useGetBackgroundColor } from "../../api/webSettings/useGetBackgroundColor";

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
  const navigate = useNavigate();

  const fadeUp: any = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: "easeOut" },
    viewport: { once: true, amount: 0.2 },
  };


  const [backgroundColors, setBackgroundColors] = useState('linear-gradient(90deg, #6e226e 0%, #a5206a 14%, #d31663 28%, #ed3176 42%, #fd336b 56%, #f23d64 70%, #f65d55 84%, #f5655d 100%)')
        
         const { data: backgroundColor } = useGetBackgroundColor('resume');
        
             useEffect(() => {
              if(backgroundColor?.data){
                setBackgroundColors(backgroundColor?.data?.backgroundColor)
              }
             }, [backgroundColor])

  // Ensure natural page scrolling is enabled
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

  // Re-observe animated elements whenever resume data changes
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
      className="min-h-screen ff-brand"
      style={{
                background:backgroundColors,
        // background:
          // "linear-gradient(135deg, #ff6b35 0%, #f7931e 25%, #ff0080 50%, #8e44ad 75%, #3742fa 100%)",
        color: "#fff",
        overflowY: "auto",
      }}
    >
      {/* Reuse homepage gradient styles */}
      <style>{homepageStyles}</style>
      {/* Force-enable scrolling on this page */}
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

      {/* Main Layout Container */}
      <div className="max-w-7xl mx-auto p-8">
        <motion.div
          {...fadeUp}
          className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
            {/* Left Side - Profile Image */}
            <div className="lg:col-span-1 flex items-center justify-center">
              <div
                id="photo"
                data-animate
                className={`photo-container w-full max-w-sm aspect-square animate-up ${
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
            </div>

            {/* Right Side - Content */}
            <div className="lg:col-span-2 flex flex-col">
              {/* Name */}
              <h1
                id="name"
                data-animate
                className={`text-6xl font-bold mb-6 animate-up ${
                  visibleElements.has("name") ? "visible" : ""
                }`}
                style={{
                  color: "#fff",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                {resumeData.personalInfo.name}
              </h1>

              {/* Bio */}
              <div
                id="bio"
                data-animate
                className={`text-lg leading-relaxed mb-8 animate-up ${
                  visibleElements.has("bio") ? "visible" : ""
                }`}
                style={{ color: "#fff" }}
              >
                {resumeData.personalInfo.bio
                  .split(". ")
                  .map((sentence, index) => {
                    if (sentence.includes(resumeData.personalInfo.focus)) {
                      const parts = sentence.split(
                        resumeData.personalInfo.focus
                      );
                      return (
                        <span key={index}>
                          {parts[0]}
                          <em
                            className="italic font-medium"
                            style={{ color: "#ffeb3b" }}
                          >
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
                      (index <
                      resumeData.personalInfo.bio.split(". ").length - 1
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
                      {resumeData.education &&
                      resumeData.education.length > 0 ? (
                        resumeData.education.map((ed, i) => (
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
                      {resumeData.experience &&
                      resumeData.experience.length > 0 ? (
                        resumeData.experience.map((exp, i) => (
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
                                ? exp.description.substring(0, 100) + "..."
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
                      {resumeData.skills && resumeData.skills.length > 0 ? (
                        resumeData.skills.map((cat, idx) => (
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
                                    border: "1px solid rgba(255,255,255,0.2)",
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

              {/* Contact Info - Updated with clickable links */}
              <div className="mt-6 flex flex-wrap gap-4 text-sm">
                {resumeData.personalInfo.phone && (
                  <a
                    href={`tel:${resumeData.personalInfo.phone}`}
                    className="text-white hover:text-yellow-300 transition-colors duration-200 cursor-pointer flex items-center gap-1"
                    title="Call this number"
                  >
                    <span>📱</span>
                    <span className="underline decoration-transparent hover:decoration-current transition-all duration-200">
                      {resumeData.personalInfo.phone}
                    </span>
                  </a>
                )}
                {resumeData.personalInfo.email && (
                  <a
                    href={`https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(resumeData.personalInfo.email)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-yellow-300 transition-colors duration-200 cursor-pointer flex items-center gap-1"
                    title="Send an email via Gmail"
                  >
                    <span>✉️</span>
                    <span className="underline decoration-transparent hover:decoration-current transition-all duration-200">
                      {resumeData.personalInfo.email}
                    </span>
                  </a>
                )}
                {resumeData.personalInfo.location && (
                  <div className="text-white flex items-center gap-1">
                    <span>📍</span>
                    <span>{resumeData.personalInfo.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
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
