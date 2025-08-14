/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import { useGetProjectDetailsList } from "../../../api/useGetProjectDetails";
import Footer from "../../../components/Footer";
import SideMenu from "../../../components/SideMenu";
import NextProjects from "./NextProjects";
import { useNextProjectDetails } from "../../../api/useGetNextProject";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import { getAnimationVariants, projectDetailsStyles } from "../../../components/Const";

interface MenuItem {
  name: string;
  icon: string;
  link: string;
  action?: () => void | Promise<void>;
}

interface SubProject {
  subProjectId: number;
  name: string;
  imageFileName?: string;
  projectImageUrl: string;
  xPosition: number;
  yPosition: number;
  heightPercent: number;
  animation: string;
  animationSpeed: string;
  animationTrigger: string;
  isExterior: boolean;
}

interface ProjectContainer {
  subProjectContainerId: number;
  projectId: number;
  title: string;
  sortOrder: number;
  backgroundImageAspectRatio?: number;
  backgroundImageUrl?: string;
  backgroundImageFileName?: string;
  backgroundType: number; // 0 = general, 1 = interior, 2 = exterior
  subProjects?: SubProject[];
}

// Enhanced responsive breakpoints
const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1200,
};

// Get current device type
const getDeviceType = () => {
  const width = window.innerWidth;
  if (width <= BREAKPOINTS.mobile) return "mobile";
  if (width <= BREAKPOINTS.tablet) return "tablet";
  return "desktop";
};

// Get animation duration based on speed - EXACT COPY FROM HOMEPAGE
const getAnimationDuration = (speed: string): number => {
  const speedMap: { [key: string]: number } = {
    'very-slow': 4,
    'slow': 2.5,
    'normal': 1.5,
    'fast': 0.8,
    'very-fast': 0.4
  };
  return speedMap[speed] || 1.5;
};

// ENHANCED: Mobile-first unified coordinate system
const createResponsiveCoordinateSystem = (aspectRatio: number | undefined) => {
  const getImageDimensions = (containerWidth: number) => {
    const deviceType = getDeviceType();

    if (!aspectRatio || aspectRatio <= 0) {
      // Default responsive aspect ratios
      const defaultRatios = {
        mobile: 0.75, // 3:4 - more portrait for mobile
        tablet: 1.33, // 4:3 - better for tablets
        desktop: 1.78, // 16:9 - standard for desktop
      };
      aspectRatio = defaultRatios[deviceType];
    }

    // MOBILE-FIRST: Adjust aspect ratio for better mobile experience
    let adjustedAspectRatio = aspectRatio;
    if (deviceType === "mobile") {
      // Prevent extremely tall images on mobile
      adjustedAspectRatio = Math.max(aspectRatio, 0.6); // Minimum 0.6 ratio (3:5)
      adjustedAspectRatio = Math.min(adjustedAspectRatio, 2.0); // Maximum 2.0 ratio
    } else if (deviceType === "tablet") {
      adjustedAspectRatio = Math.max(aspectRatio, 0.8);
      adjustedAspectRatio = Math.min(adjustedAspectRatio, 2.2);
    }

    const imageHeight = containerWidth / adjustedAspectRatio;
    return {
      width: containerWidth,
      height: imageHeight,
      originalAspectRatio: aspectRatio,
      adjustedAspectRatio,
    };
  };

  const getPixelFromPercent = (
    xPercent: number,
    yPercent: number,
    containerWidth: number
  ) => {
    const { width: imageWidth, height: imageHeight } =
      getImageDimensions(containerWidth);
    return {
      x: (xPercent / 100) * imageWidth,
      y: (yPercent / 100) * imageHeight,
      imageWidth,
      imageHeight,
    };
  };

  const getPercentFromPixel = (
    x: number,
    y: number,
    containerWidth: number
  ) => {
    const { width: imageWidth, height: imageHeight } =
      getImageDimensions(containerWidth);
    return {
      xPercent: imageWidth > 0 ? (x / imageWidth) * 100 : 0,
      yPercent: imageHeight > 0 ? (y / imageHeight) * 100 : 0,
    };
  };

  return { getImageDimensions, getPixelFromPercent, getPercentFromPixel };
};

const ProjectDetailsPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [sections, setSections] = useState<ProjectContainer[]>([]);
  const [exteriorSections, setExteriorSections] = useState<ProjectContainer[]>(
    []
  );
  const [interiorSections, setInteriorSections] = useState<ProjectContainer[]>(
    []
  );
  const [viewportHeight, setViewportHeight] = useState<number>(
    window.innerHeight
  );
  const [hasTypedSections, setHasTypedSections] = useState<boolean>(false); // Track if we have typed sections
  const [viewportWidth, setViewportWidth] = useState<number>(window.innerWidth);
  const [deviceType, setDeviceType] = useState<string>(getDeviceType());
  const [scrollY, setScrollY] = useState<number>(0);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [hoveredImageId, setHoveredImageId] = useState<number | null>(null);
  const [exteriorStartY, setExteriorStartY] = useState<number>(0);
  const [interiorStartY, setInteriorStartY] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const nextProjectsRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const targetScrollY = useRef<number>(0);
  const currentScrollY = useRef<number>(0);
  const animationFrameId = useRef<number | null>(null);
  const isScrolling = useRef<boolean>(false);
  const [totalHeight, setTotalHeight] = useState<number>(0);
  const [nextProjectsHeight, setNextProjectsHeight] = useState<number>(0);
  const navigate = useNavigate();
  const { data: nextProjects } = useNextProjectDetails(
    projectId ? parseInt(projectId, 10) : 0
  );

  const { data, isPending } = useGetProjectDetailsList(
    projectId ? parseInt(projectId, 10) : 0
  );

  // Ensure page starts at top when navigating to a new project
  useEffect(() => {
    // Reset window scroll (backup)
    window.scrollTo(0, 0);
    // Reset custom scrolling state
    targetScrollY.current = 0;
    currentScrollY.current = 0;
    setScrollY(0);
    if (containerRef.current) {
      containerRef.current.style.transform = "translateY(0px)";
    }
  }, [projectId]);

  // Sample fallback images using placehold.co for reliability
  const SAMPLE_BACKGROUND_IMAGE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080"><rect width="1920" height="1080" fill="%232d3748"/><text x="960" y="100" text-anchor="middle" fill="white" font-family="Arial" font-size="48">Portfolio Background</text><text x="960" y="160" text-anchor="middle" fill="%23a0aec0" font-family="Arial" font-size="24">with Project Placeholders</text><rect x="200" y="300" width="300" height="200" fill="%234a5568" stroke="%23a0aec0" stroke-width="2" rx="8"/><text x="350" y="420" text-anchor="middle" fill="white" font-family="Arial" font-size="16">Project 1</text><rect x="800" y="400" width="280" height="180" fill="%234a5568" stroke="%23a0aec0" stroke-width="2" rx="8"/><text x="940" y="510" text-anchor="middle" fill="white" font-family="Arial" font-size="16">Project 2</text><rect x="1400" y="350" width="320" height="220" fill="%234a5568" stroke="%23a0aec0" stroke-width="2" rx="8"/><text x="1560" y="480" text-anchor="middle" fill="white" font-family="Arial" font-size="16">Project 3</text></svg>`;
  const SAMPLE_SUB_IMAGE =
    "https://placehold.co/400x300/718096/ffffff?text=Project+Image";

  // Handle centered logo click - navigate to /resume
  const handleCenteredLogoClick = () => {
    navigate("/resume");
  };

  // Handle logo click
  const handleLogoClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // ENHANCED: Responsive background strategy
  const getResponsiveBackgroundStyle = (section: ProjectContainer) => {
    // Use fallback image if the URL is invalid or empty
    const backgroundUrl =
      section.backgroundImageUrl && section.backgroundImageUrl.trim() !== ""
        ? section.backgroundImageUrl
        : SAMPLE_BACKGROUND_IMAGE;

    // Force exact fill of the section box to avoid any visible seams or gaps
    return {
      backgroundImage: `url(${backgroundUrl})`,
      backgroundSize: "100% 100%",
      backgroundPosition: "center top",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "scroll",
    };
  };

  // ENHANCED: Responsive section dimension calculation
  const getResponsiveSectionDimensions = (section: ProjectContainer) => {
    const containerWidth = window.innerWidth;
    const coordinateSystem = createResponsiveCoordinateSystem(
      section.backgroundImageAspectRatio
    );
    const { height, adjustedAspectRatio } =
      coordinateSystem.getImageDimensions(containerWidth);
    // Exact, pixel-snapped height to perfectly stack sections without seams
    const sectionHeight = Math.max(1, Math.round(height));

    return {
      width: containerWidth,
      height: sectionHeight,
      imageHeight: height,
      adjustedAspectRatio,
      device: getDeviceType(),
    };
  };

  // Enhanced window resize handling
  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      const newDeviceType = getDeviceType();

      setViewportHeight(newHeight);
      setViewportWidth(newWidth);
      setDeviceType(newDeviceType);

      // Close menu on resize to prevent positioning issues
      if (isMenuOpen && newDeviceType !== deviceType) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [deviceType, isMenuOpen]);

  // Measure NextProjects block height whenever layout changes
  useEffect(() => {
    const measureNext = () => {
      if (nextProjectsRef.current) {
        setNextProjectsHeight(nextProjectsRef.current.offsetHeight || 0);
      }
    };
    measureNext();
    const handle = () => measureNext();
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, [sections, viewportWidth, viewportHeight]);

  // ENHANCED: Calculate total height and section positions using responsive system
  useEffect(() => {
    if (sections.length > 0) {
      let height = 0;
      const exteriorStart = 0;
      let interiorStart = 0;
      let foundInterior = false;

      sections.forEach((section) => {
        const dimensions = getResponsiveSectionDimensions(section);

        // Only track exterior/interior if we have typed sections
        if (hasTypedSections) {
          // Track where exterior ends and interior begins
          if (section.backgroundType === 2 && !foundInterior) {
            // exterior
            // Still in exterior sections
          } else if (section.backgroundType === 1 && !foundInterior) {
            // interior
            interiorStart = height;
            foundInterior = true;
          }
        }

        height += dimensions.height;
      });

      // Include NextProjects measured height (if present)
      height += nextProjectsHeight;

      // Responsive footer height
      const footerHeight =
        deviceType === "mobile" ? 300 : deviceType === "tablet" ? 250 : 200;
      height += footerHeight;

      setTotalHeight(height);
      if (hasTypedSections) {
        setExteriorStartY(exteriorStart);
        setInteriorStartY(interiorStart);
      }

      // Reset scroll if it's beyond the new bounds
      if (targetScrollY.current > height - window.innerHeight) {
        targetScrollY.current = Math.max(0, height - window.innerHeight);
      }
    }
  }, [
    sections,
    viewportHeight,
    viewportWidth,
    deviceType,
    nextProjectsHeight,
    hasTypedSections,
  ]);

  // Custom smooth scroll animation
  const smoothScrollStep = () => {
    const difference = targetScrollY.current - currentScrollY.current;
    const step = difference * 0.05; // Slow scroll speed

    if (Math.abs(difference) < 0.5) {
      currentScrollY.current = targetScrollY.current;
      isScrolling.current = false;
      setScrollY(currentScrollY.current);
      return;
    }

    currentScrollY.current += step;
    setScrollY(currentScrollY.current);

    if (containerRef.current) {
      containerRef.current.style.transform = `translateY(-${currentScrollY.current}px)`;
    }

    animationFrameId.current = requestAnimationFrame(smoothScrollStep);
  };

  // Handle wheel events for custom scrolling
  useEffect(() => {
    if (totalHeight === 0) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const scrollAmount = e.deltaY * 0.3;
      const maxScroll = Math.max(0, totalHeight - window.innerHeight);

      const newScrollY = targetScrollY.current + scrollAmount;
      targetScrollY.current = Math.max(0, Math.min(maxScroll, newScrollY));

      if (!isScrolling.current) {
        isScrolling.current = true;
        smoothScrollStep();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const scrollAmount = deviceType === "mobile" ? 30 : 50;
      const maxScroll = Math.max(0, totalHeight - window.innerHeight);

      switch (e.key) {
        case "ArrowDown":
        case "PageDown":
        case " ":
          if (e.target === document.body) {
            e.preventDefault();
            targetScrollY.current = Math.min(
              maxScroll,
              targetScrollY.current + scrollAmount
            );
          }
          break;
        case "ArrowUp":
        case "PageUp":
          if (e.target === document.body) {
            e.preventDefault();
            targetScrollY.current = Math.max(
              0,
              targetScrollY.current - scrollAmount
            );
          }
          break;
        case "Home":
          e.preventDefault();
          targetScrollY.current = 0;
          break;
        case "End":
          e.preventDefault();
          targetScrollY.current = maxScroll;
          break;
        default:
          return;
      }

      if (!isScrolling.current) {
        isScrolling.current = true;
        smoothScrollStep();
      }
    };

    let startY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        e.preventDefault();
        const currentY = e.touches[0].clientY;
        const deltaY = (startY - currentY) * 0.5;
        const maxScroll = Math.max(0, totalHeight - window.innerHeight);

        targetScrollY.current = Math.max(
          0,
          Math.min(maxScroll, targetScrollY.current + deltaY)
        );
        startY = currentY;

        if (!isScrolling.current) {
          isScrolling.current = true;
          smoothScrollStep();
        }
      }
    };

    document.body.style.overflow = "hidden";

    window.addEventListener("wheel", handleWheel, { passive: false });
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("wheel", handleWheel);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [totalHeight, deviceType]);

  // Handle click outside menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen) {
        const target = event.target as HTMLElement;
        const logoElement = document.getElementById("main-logo");
        const menuElement = document.getElementById("logo-menu");

        if (logoElement && menuElement) {
          if (!logoElement.contains(target) && !menuElement.contains(target)) {
            setIsMenuOpen(false);
          }
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  // Load data from API and separate exterior/interior
  useEffect(() => {
    if (data?.data) {
      const sortedData = data.data.sort(
        (a: { sortOrder: number }) => a.sortOrder - a.sortOrder
      );

      // Check if we have typed sections (backgroundType 1 or 2)
      const hasTyped = sortedData.some(
        (section: { backgroundType: number }) =>
          section.backgroundType === 1 || section.backgroundType === 2
      );
      setHasTypedSections(hasTyped);

      if (hasTyped) {
        // Separate exterior and interior sections
        const exterior = sortedData
          .filter(
            (section: { backgroundType: number }) =>
              section.backgroundType === 2
          )
          .sort((a: { sortOrder: number }) => a.sortOrder - a.sortOrder);
        const interior = sortedData
          .filter(
            (section: { backgroundType: number }) =>
              section.backgroundType === 1
          )
          .sort(
            (a: { sortOrder: number }, b: { sortOrder: number }) =>
              a.sortOrder - b.sortOrder
          );

        // Combine exterior first, then interior
        const combinedSections = [...exterior, ...interior];

        setTimeout(() => {
          setSections(combinedSections);
          setExteriorSections(exterior);
          setInteriorSections(interior);
        }, 500);
      } else {
        // No typed sections, just use original sort order
        setTimeout(() => {
          setSections(sortedData);
          setExteriorSections([]);
          setInteriorSections([]);
        }, 500);
      }
    }
  }, [data]);

  // Debug API data structure
  useEffect(() => {
    if (data?.data && data.data.length > 0) {
      if (data.data[0].subProjects && data.data[0].subProjects.length > 0) {
        /* empty */
      }
    }
  }, [data, hasTypedSections]);

  // Handle menu item click
  const handleMenuItemClick = (item: MenuItem) => {
    if (item.link.startsWith("http")) {
      window.open(item.link, "_blank");
    } else {
      navigate(item.link);
    }
    setIsMenuOpen(false);
  };

  // Handle section navigation (only if we have typed sections)
  const handleSectionNavigation = (sectionType: "exterior" | "interior") => {
    if (!hasTypedSections) return;

    const targetY =
      sectionType === "exterior" ? exteriorStartY : interiorStartY;
    const maxScroll = Math.max(0, totalHeight - window.innerHeight);

    targetScrollY.current = Math.min(maxScroll, targetY);

    if (!isScrolling.current) {
      isScrolling.current = true;
      smoothScrollStep();
    }
  };

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    const elements = document.querySelectorAll(
      ".fade-in-on-scroll:not(.sub-project-container)"
    );
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [sections]);

  // ENHANCED: Responsive image dimensions calculation
  const calculateResponsiveImageDimensions = (
    containerWidth: number,
    heightPercent: number,
    aspectRatio: number | undefined
  ) => {
    const device = getDeviceType();
    const coordinateSystem = createResponsiveCoordinateSystem(aspectRatio);
    const { width: imageWidth } =
      coordinateSystem.getImageDimensions(containerWidth);

    // Device-specific sizing adjustments
    let scaleFactor = 1;
    if (device === "mobile") {
      scaleFactor = 0.8; // Slightly smaller on mobile for better touch targets
    } else if (device === "tablet") {
      scaleFactor = 0.9; // Slightly smaller on tablet
    }

    const adjustedHeightPercent = heightPercent * scaleFactor;
    const height = (adjustedHeightPercent / 100) * imageWidth;

    // Responsive maximum constraints
    const maxWidths = {
      mobile: containerWidth * 0.85,
      tablet: containerWidth * 0.9,
      desktop: containerWidth * 0.9,
    };

    const maxHeights = {
      mobile: window.innerHeight * 0.6,
      tablet: window.innerHeight * 0.8,
      desktop: window.innerHeight * 0.9,
    };

    return {
      width: "auto",
      height: `${height}px`,
      maxWidth: `${maxWidths[device]}px`,
      maxHeight: `${maxHeights[device]}px`,
    };
  };

  // Get responsive logo and menu sizes
  const getResponsiveLogoSizes = () => {
    const device = getDeviceType();
    return {
      fixedLogo:
        device === "mobile" ? "100px" : device === "tablet" ? "120px" : "150px",
      centeredLogo:
        device === "mobile" ? "80px" : device === "tablet" ? "100px" : "120px",
      menuItemSize:
        device === "mobile" ? "8px" : device === "tablet" ? "10px" : "11px",
      menuPadding:
        device === "mobile"
          ? "4px 8px"
          : device === "tablet"
          ? "5px 10px"
          : "6px 12px",
    };
  };

  // Get current active section for navigation buttons (only if typed sections exist)
  const getCurrentActiveSection = () => {
    if (!hasTypedSections) return null;

    if (scrollY < interiorStartY) {
      return "exterior";
    } else {
      return "interior";
    }
  };

  // Get section type info for display
  // const getSectionTypeInfo = (backgroundType: number) => {
  //   if (!hasTypedSections) return null;

  //   switch (backgroundType) {
  //     case 1:
  //       return { label: "INTERIOR", color: "#ff9800" };
  //     case 2:
  //       return { label: "EXTERIOR", color: "#4caf50" };
  //     default:
  //       return null;
  //   }
  // };

  // Handle scroll to top
  const handleButtomScrollButtonClick = () => {
    targetScrollY.current = 0;
    if (!isScrolling.current) {
      isScrolling.current = true;
      smoothScrollStep();
    }
  };

  const logoSizes = getResponsiveLogoSizes();
  const currentActiveSection = getCurrentActiveSection();

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <style>{projectDetailsStyles}</style>

      {/* Section Navigation Buttons - Only show if we have typed sections */}
      {hasTypedSections && (
        <div
          className="section-nav-buttons"
          style={{
            top: deviceType === "mobile" ? "15px" : "20px",
            right: deviceType === "mobile" ? "40px" : "45px",
          }}
        >
          <button
            className={`section-nav-btn ${
              currentActiveSection === "exterior" ? "active" : ""
            }`}
            onClick={() => handleSectionNavigation("exterior")}
            style={{
              padding:
                deviceType === "mobile"
                  ? "6px 12px"
                  : deviceType === "tablet"
                  ? "7px 14px"
                  : "8px 16px",
              fontSize:
                deviceType === "mobile"
                  ? "10px"
                  : deviceType === "tablet"
                  ? "11px"
                  : "12px",
            }}
          >
            EXTERIOR
            {exteriorSections.length > 0 && (
              <span className="exterior-badge">{exteriorSections.length}</span>
            )}
          </button>
          <button
            className={`section-nav-btn ${
              currentActiveSection === "interior" ? "active" : ""
            }`}
            onClick={() => handleSectionNavigation("interior")}
            style={{
              padding:
                deviceType === "mobile"
                  ? "6px 12px"
                  : deviceType === "tablet"
                  ? "7px 14px"
                  : "8px 16px",
              fontSize:
                deviceType === "mobile"
                  ? "10px"
                  : deviceType === "tablet"
                  ? "11px"
                  : "12px",
            }}
          >
            INTERIOR
            {interiorSections.length > 0 && (
              <span className="interior-badge">{interiorSections.length}</span>
            )}
          </button>
        </div>
      )}

      {/* Fixed Logo with Menu - Responsive positioning */}
      <div
        style={{
          position: "fixed",
          top: deviceType === "mobile" ? "60px" : "80px",
          left: deviceType === "mobile" ? "15px" : "20px",
          zIndex: 1000,
          transform: `translateY(${Math.min(scrollY * 0.05, 20)}px)`,
          transition: "transform 0.3s ease-out",
          opacity: scrollY > 100 ? 0.9 : 1,
        }}
      >
        {/* Logo */}
        <div
          id="main-logo"
          onClick={handleLogoClick}
          className="logo-container"
          style={{
            cursor: "pointer",
            position: "relative",
            borderRadius: "12px",
            padding: "8px",
            transition: "all 0.3s ease",
          }}
        >
          <img
            src="/logo/font 2_.png"
            alt="Fixed Logo"
            style={{
              height: logoSizes.fixedLogo,
              width: "auto",
              filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))",
              transition: "transform 0.2s ease, filter 0.2s ease",
            }}
          />
        </div>

        {/* Side Menu Component */}
        <SideMenu
          isMenuOpen={isMenuOpen}
          deviceType={deviceType as "mobile" | "tablet" | "desktop"}
          variant="project-details"
          onMenuItemClick={handleMenuItemClick}
        />
      </div>

      {/* Main Content Container */}
      <div
        ref={containerRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          transition: "transform 0.1s ease-out",
          willChange: "transform",
        }}
      >
        {/* Loading state */}
        {isPending && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0, 0, 0, 0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
            }}
          >
            <LoadingSpinner
              variant="gradient"
              size="large"
              text="Loading project details..."
              fullHeight={true}
            />
          </div>
        )}

        {/* ENHANCED: Responsive sections with background blur effect */}
        {sections?.map((section, sectionIndex) => {
          // ENHANCED: Calculate proper dimensions using responsive system
          const dimensions = getResponsiveSectionDimensions(section);
          const bgStyle = getResponsiveBackgroundStyle(section);
          const coordinateSystem = createResponsiveCoordinateSystem(
            section.backgroundImageAspectRatio
          );

          // Get section type info (null if backgroundType is 0)
          // const sectionTypeInfo = getSectionTypeInfo(section.backgroundType);

          return (
            <section
              key={section.subProjectContainerId}
              style={{
                position: "relative",
                width: "100vw",
                height: `${dimensions.height}px`,
                overflow: "hidden",
              }}
            >
              {/* Separate Background Layer with Blur Effect */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  ...bgStyle,
                  filter: hoveredImageId !== null ? "blur(3px)" : "none",
                  transition: "filter 0.3s ease",
                  zIndex: 1,
                }}
              />

              {/* Content Layer - Sub-projects and other content */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  zIndex: 10,
                }}
              >
                {/* Section Type Badge - Only show if we have typed sections */}
                {/* {sectionTypeInfo && (
                  <div
                    style={{
                      position: "absolute",
                      top: "20px",
                      left: "20px",
                      background: sectionTypeInfo.color,
                      color: "white",
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontSize: deviceType === "mobile" ? "10px" : "12px",
                      fontWeight: "600",
                      zIndex: 100,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                    }}
                  >
                    {/* {sectionTypeInfo.label} */}
                  {/* </div>
                )}  */}

                {/* Responsive Centered Top Logo - Only show on first section */}
                {sectionIndex === 0 && (
                  <div
                    className="centered-logo"
                    onClick={handleCenteredLogoClick}
                    style={{
                      top:
                        deviceType === "mobile"
                          ? "20px"
                          : deviceType === "tablet"
                          ? "30px"
                          : "40px",
                    }}
                  >
                    <img
                      src="/logo/logo.webp"
                      alt="Centered Logo"
                      style={{
                        cursor: "pointer",
                        height: logoSizes.centeredLogo,
                      }}
                    />
                  </div>
                )}

                {/* ENHANCED: Responsive sub-projects positioned using coordinate system with Framer Motion */}
                <AnimatePresence>
                  {section.subProjects?.map((subProject) => {
                    // ENHANCED: Use responsive coordinate system for positioning
                    const containerWidth = window.innerWidth;
                    const { x: pixelX, y: pixelY } =
                      coordinateSystem.getPixelFromPercent(
                        subProject.xPosition,
                        subProject.yPosition,
                        containerWidth
                      );

                    const imageDimensions = calculateResponsiveImageDimensions(
                      containerWidth,
                      subProject.heightPercent,
                      section.backgroundImageAspectRatio
                    );

                    const isHovered = hoveredImageId === subProject.subProjectId;

                    // Get animation variants for this sub-project
                    const animationVariants = getAnimationVariants(subProject.animation, subProject.animationTrigger);
                    const duration = getAnimationDuration(subProject.animationSpeed);

                    // Build proper transition with duration and repeat logic
                    const transition: any = { duration };

                    // Handle repeat logic based on trigger and animation type
                    if (subProject.animationTrigger === 'continuous') {
                      // Animations that should repeat infinitely on continuous
                      const continuousAnimations = [
                        'bounce', 'shake', 'shakeY', 'pulse', 'heartbeat', 'rotate', 'flip', 'flipX', 'flipY',
                        'flash', 'swing', 'rubberBand', 'wobble', 'jello', 'tada', 'rollOut', 'zoomOut', 'headShake',
                        'fadeIn', 'fadeInUp', 'fadeInDown', 'fadeInLeft', 'fadeInRight', 'fadeInUpBig', 'fadeInDownBig', 
                        'fadeInLeftBig', 'fadeInRightBig', 'slideInLeft', 'slideInRight', 'slideInUp', 'slideInDown',
                        'zoomIn', 'zoomInUp', 'zoomInDown', 'zoomInLeft', 'zoomInRight', 'bounceIn', 'bounceInUp', 
                        'bounceInDown', 'bounceInLeft', 'bounceInRight', 'elasticIn', 'elasticInUp', 'elasticInDown',
                        'elasticInLeft', 'elasticInRight', 'rotateIn', 'rotateInUpLeft', 'rotateInUpRight', 
                        'rotateInDownLeft', 'rotateInDownRight', 'flipInX', 'flipInY', 'lightSpeedInLeft', 
                        'lightSpeedInRight', 'rollIn', 'jackInTheBox', 'hinge', 'backInUp', 'backInDown', 
                        'backInLeft', 'backInRight'
                      ];
                      
                      if (continuousAnimations.includes(subProject.animation)) {
                        transition.repeat = Infinity;
                      }

                      // Linear easing for rotation animations
                      if (['rotate', 'flip', 'flipX', 'flipY'].includes(subProject.animation)) {
                        transition.ease = 'linear';
                      }
                    }

                    if (subProject.animationTrigger === 'once') {
                      // Attention seeking animations that should repeat a few times for "once" trigger
                      const attentionAnimations = [
                        'bounce', 'shake', 'shakeY', 'pulse', 'heartbeat', 'flash', 'headShake', 'swing', 
                        'rubberBand', 'wobble', 'jello', 'tada'
                      ];
                      
                      if (attentionAnimations.includes(subProject.animation)) {
                        // Different repeat counts for different animation types
                        const repeatCounts: { [key: string]: number } = {
                          'bounce': 3,
                          'shake': 3,
                          'shakeY': 3,
                          'pulse': 2,
                          'heartbeat': 2,
                          'flash': 3,
                          'headShake': 2,
                          'swing': 1,
                          'rubberBand': 1,
                          'wobble': 1,
                          'jello': 1,
                          'tada': 1
                        };
                        transition.repeat = repeatCounts[subProject.animation] || 1;
                      }
                    }

                    // Special duration adjustments for specific animations
                    if (subProject.animation === 'hinge') {
                      transition.duration = duration * 1.5; // Hinge needs more time
                    }

                    if (['elasticIn', 'elasticInUp', 'elasticInDown', 'elasticInLeft', 'elasticInRight'].includes(subProject.animation)) {
                      transition.duration = duration * 1.2; // Elastic animations need more time
                    }

                    return (
                      <motion.div
                        key={subProject.subProjectId}
                        className="sub-project-visible sub-project-container"
                        style={{
                          position: "absolute",
                          left: `${pixelX}px`,
                          top: `${pixelY}px`,
                          zIndex: isHovered ? 50 : 20,
                        }}
                      >
                        <motion.img
                          src={
                            subProject.projectImageUrl &&
                            subProject.projectImageUrl.trim() !== ""
                              ? subProject.projectImageUrl
                              : SAMPLE_SUB_IMAGE
                          }
                          alt={subProject.name || subProject.imageFileName}
                          data-sub-project-id={subProject.subProjectId}
                          data-animation={subProject.animation}
                          data-animation-speed={subProject.animationSpeed}
                          data-animation-trigger={subProject.animationTrigger}
                          data-device-type={deviceType}
                          data-is-exterior={subProject.isExterior}
                          data-has-typed-sections={hasTypedSections}
                          className="clickable-sub-project"
                          variants={animationVariants}
                          initial={subProject.animation !== 'none' ? 'initial' : {}}
                          animate={subProject.animation !== 'none' && subProject.animationTrigger !== 'hover' ? 'animate' : 'initial'}
                          whileHover={subProject.animation !== 'none' && subProject.animationTrigger === 'hover' ? 'animate' : {}}
                          transition={transition}
                          onClick={() => {}}
                          onMouseEnter={() =>
                            setHoveredImageId(subProject.subProjectId)
                          }
                          onMouseLeave={() => setHoveredImageId(null)}
                          onError={(e) => {
                            // Fallback to sample image if the original fails to load
                            if (e.currentTarget.src !== SAMPLE_SUB_IMAGE) {
                              e.currentTarget.src = SAMPLE_SUB_IMAGE;
                            }
                          }}
                          style={{
                            ...imageDimensions,
                            display: "block",
                            borderRadius: "8px",
                            cursor: "pointer",
                            backfaceVisibility: "hidden",
                            perspective: "1000px",
                            // Enhanced touch targets for mobile
                            minWidth: deviceType === "mobile" ? "44px" : "auto",
                            minHeight: deviceType === "mobile" ? "44px" : "auto",
                          }}
                        />
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {/* Section Title (Hidden but can be used for SEO) */}
                <h1
                  style={{
                    position: "absolute",
                    left: "-9999px",
                    visibility: "hidden",
                  }}
                >
                  {section.title}{" "}
                  {/* {sectionTypeInfo ? ` - ${sectionTypeInfo.label}` : ""} */}
                </h1>
              
              </div> {/* End Content Layer */}
            </section>
          );
        })}

        {nextProjects?.data?.length > 0 && (
          <div ref={nextProjectsRef}>
            <NextProjects
              data={nextProjects}
              handleButtomScrollButtonClick={handleButtomScrollButtonClick}
            />
          </div>
        )}

        {/* Footer Component */}
        <Footer
          deviceType={deviceType as "mobile" | "tablet" | "desktop"}
          variant="project-details"
        />

        {/* Bottom padding to prevent content from being hidden behind fixed footer */}
        <div
          style={{
            height:
              deviceType === "mobile"
                ? "340px"
                : deviceType === "tablet"
                ? "280px"
                : "240px",
            width: "100%",
          }}
        />
      </div>

      {/* Responsive Scroll to Top Button */}
      <AnimatePresence>
        {scrollY > 500 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleButtomScrollButtonClick}
            style={{
              position: "fixed",
              bottom: deviceType === "mobile" ? "20px" : "30px",
              right: deviceType === "mobile" ? "20px" : "30px",
              width: deviceType === "mobile" ? "45px" : "50px",
              height: deviceType === "mobile" ? "45px" : "50px",
              borderRadius: "50%",
              background: "linear-gradient(45deg, #667eea, #764ba2)",
              border: "none",
              color: "white",
              fontSize: deviceType === "mobile" ? "16px" : "20px",
              cursor: "pointer",
              zIndex: 1000,
              boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
            }}
          >
            ↑
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectDetailsPage;