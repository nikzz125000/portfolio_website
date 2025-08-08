import React, { useState, useEffect, useRef } from "react";

// Types for the resume data structure
interface ResumeData {
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

// Sample data - replace this with your API call
const sampleData: ResumeData = {
  personalInfo: {
    name: "glen george",
    phone: "6263752727",
    email: "glenkgeorge@gmail.com",
    photo:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
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
    {
      period: "Summer 2022",
      title: "Meyers Manx - Sponsored Project",
      company: "ArtCenter College of Design",
      description:
        "Tasked with creating a concept that introduces the Iconic brand to a new generation with lifestyle experiences.",
    },
    {
      period: "Spring 2022",
      title: "Teacher's Assistant - VISCOM 2",
      company: "ArtCenter College of Design",
      description:
        "Weekly demos for students introducing new photoshop techniques.",
    },
    {
      period: "Summer - Fall 2021",
      title: "Teacher's Assistant - Design Fundamentals 2",
      company: "ArtCenter College of Design",
      description:
        "Helped students through critiques on understanding the fundamentals of type, color theory and composition.",
    },
  ],
};

const AnimatedResume: React.FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData>(sampleData);
  const [visibleElements, setVisibleElements] = useState<Set<string>>(
    new Set()
  );
  const observerRef = useRef<IntersectionObserver | null>(null);

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

  // Function to fetch data from API
  const fetchResumeData = async () => {
    try {
      // Replace with your actual API endpoint
      // const response = await fetch('/api/resume');
      // const data = await response.json();
      // setResumeData(data);
    } catch (error) {
      console.error("Error fetching resume data:", error);
    }
  };

  useEffect(() => {
    fetchResumeData();
    try {
      const raw = localStorage.getItem("resumeData");
      if (raw) setResumeData(JSON.parse(raw));
    } catch {}
  }, []);

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
                src={resumeData.personalInfo.photo}
                alt={resumeData.personalInfo.name}
                className="w-full h-full object-cover grayscale"
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
              <div className="flex justify-end space-x-3">
                <div className="w-6 h-6 bg-black rounded-full"></div>
                <div className="w-6 h-6 bg-black rounded-full"></div>
                <div className="w-6 h-6 bg-black rounded-full"></div>
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
              <div className="text-lg font-semibold mb-2">
                {resumeData.education.period}
              </div>
              <div className="text-lg">{resumeData.education.institution}</div>
              <div className="text-lg text-gray-600">
                {resumeData.education.location}
              </div>
            </div>

            <div
              id="education-right"
              data-animate
              className={`pl-8 animate-right ${
                visibleElements.has("education-right") ? "visible" : ""
              }`}
            >
              <div className="text-lg">{resumeData.education.degree}</div>
            </div>
          </div>
        </div>

        {/* Experience Section */}
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
                <div className="text-lg leading-relaxed">{exp.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimatedResume;
