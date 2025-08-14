/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import { useHomePageList } from "../../api/useHomePage";
import { useResumeDetails } from "../../api/useResumeDetails";

import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ModernLoader from "../../components/ui/ModernLoader";
import SideMenu from "../../components/SideMenu";
import Footer from "../../components/Footer";
import { getAnimationVariants, homepageStyles } from "../../components/Const";

interface MenuItem {
  name: string;
  icon: string;
  link: string;
  action?: () => void | Promise<void>;
}

interface SubImage {
  projectId: number;
  name: string;
  projectImageUrl: string;
  imageFileName?: string;
  xPosition: number;
  yPosition: number;
  heightPercent: number;
  animation: string;
  animationSpeed: string;
  animationTrigger: string;
}

interface BackgroundImage {
  name: string;
  url: string;
  aspectRatio?: number;
}

interface SectionData {
  id: number;
  title: string;
  sortOrder: number;
  backgroundImageUrl?: string;
  backgroundImageAspectRatio?: number;
  backgroundImage?: BackgroundImage | null;
  projects?: SubImage[];
  subImages?: SubImage[];
  projectContainerId: number;
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

// Get animation duration based on speed
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

const Homepage: React.FC = () => {
  const [sections, setSections] = useState<SectionData[]>([]);
  const [viewportHeight, setViewportHeight] = useState<number>(
    window.innerHeight
  );
  const [viewportWidth, setViewportWidth] = useState<number>(window.innerWidth);
  const [deviceType, setDeviceType] = useState<string>(getDeviceType());
  const [scrollY, setScrollY] = useState<number>(0);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [hoveredImageId, setHoveredImageId] = useState<number | null>(null);

  const [isNavigating, setIsNavigating] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const targetScrollY = useRef<number>(0);
  const currentScrollY = useRef<number>(0);
  const animationFrameId = useRef<number | null>(null);
  const isScrolling = useRef<boolean>(false);
  const [totalHeight, setTotalHeight] = useState<number>(0);
  const navigate = useNavigate();

  const { data, isPending } = useHomePageList();
  const { isPending: isResumePending } = useResumeDetails();

  // Sample fallback images using placehold.co for reliability
  const SAMPLE_BACKGROUND_IMAGE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080"><rect width="1920" height="1080" fill="%232d3748"/><text x="960" y="100" text-anchor="middle" fill="white" font-family="Arial" font-size="48">Portfolio Background</text><text x="960" y="160" text-anchor="middle" fill="%23a0aec0" font-family="Arial" font-size="24">with Project Placeholders</text><rect x="200" y="300" width="300" height="200" fill="%234a5568" stroke="%23a0aec0" stroke-width="2" rx="8"/><text x="350" y="420" text-anchor="middle" fill="white" font-family="Arial" font-size="16">Project 1</text><rect x="800" y="400" width="280" height="180" fill="%234a5568" stroke="%23a0aec0" stroke-width="2" rx="8"/><text x="940" y="510" text-anchor="middle" fill="white" font-family="Arial" font-size="16">Project 2</text><rect x="1400" y="350" width="320" height="220" fill="%234a5568" stroke="%23a0aec0" stroke-width="2" rx="8"/><text x="1560" y="480" text-anchor="middle" fill="white" font-family="Arial" font-size="16">Project 3</text></svg>`;
  const SAMPLE_SUB_IMAGE =
    "https://placehold.co/400x300/718096/ffffff?text=Project+Image";

  // Navigation handler for sub-images
  const handleSubImageClick = (subImageId: number) => {
    setIsNavigating(true);

    // Simulate navigation delay and then navigate
    setTimeout(() => {
      setIsNavigating(false);
      navigate(`/project_details/${subImageId}`);
    }, 500);
  };

  // Handle centered logo click - navigate to /resume
  const handleCenteredLogoClick = () => {
    navigate("/resume");
  };

  // Handle logo click
  const handleLogoClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // ENHANCED: Responsive background strategy
  const getResponsiveBackgroundStyle = (section: SectionData) => {
    if (!section.backgroundImageUrl) return {};

    // Use fallback image if the URL is invalid or empty
    const backgroundUrl =
      section.backgroundImageUrl && section.backgroundImageUrl.trim() !== ""
        ? section.backgroundImageUrl
        : SAMPLE_BACKGROUND_IMAGE;

    return {
      backgroundImage: `url(${backgroundUrl})`,
      backgroundSize: "100% 100%",
      backgroundPosition: "center top",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "scroll",
    } as React.CSSProperties;
  };

  // ENHANCED: Responsive section dimension calculation
  const getResponsiveSectionDimensions = (section: SectionData) => {
    const containerWidth = window.innerWidth;
    const device = getDeviceType();
    const coordinateSystem = createResponsiveCoordinateSystem(
      section.backgroundImageAspectRatio
    );
    const { height, adjustedAspectRatio } =
      coordinateSystem.getImageDimensions(containerWidth);

    // Device-specific height calculation to reduce gaps
    let sectionHeight;

    if (device === "mobile") {
      // Mobile: Use responsive height, avoid huge gaps
      const maxMobileHeight = window.innerHeight * 1.2; // Max 120% of viewport
      const minMobileHeight = window.innerHeight * 0.8; // Min 80% of viewport
      sectionHeight = Math.min(
        Math.max(height, minMobileHeight),
        maxMobileHeight
      );
    } else if (device === "tablet") {
      // Tablet: Balanced approach
      const maxTabletHeight = window.innerHeight * 1.5;
      const minTabletHeight = window.innerHeight * 0.9;
      sectionHeight = Math.min(
        Math.max(height, minTabletHeight),
        maxTabletHeight
      );
    } else {
      // Desktop: Original behavior
      sectionHeight = Math.max(height, window.innerHeight);
    }

    return {
      width: containerWidth,
      height: sectionHeight,
      imageHeight: height,
      adjustedAspectRatio,
      device,
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

  // ENHANCED: Calculate total height using responsive system
  useEffect(() => {
    if (sections.length > 0) {
      let height = 0;
      sections.forEach((section) => {
        const dimensions = getResponsiveSectionDimensions(section);
        height += dimensions.height;
      });

      // Responsive footer height
      const footerHeight =
        deviceType === "mobile" ? 300 : deviceType === "tablet" ? 250 : 200;
      height += footerHeight;

      setTotalHeight(height);

      // Reset scroll if it's beyond the new bounds
      if (targetScrollY.current > height - window.innerHeight) {
        targetScrollY.current = Math.max(0, height - window.innerHeight);
      }
    }
  }, [sections, viewportHeight, viewportWidth, deviceType]);

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

  // Load data from API
  useEffect(() => {
    if (data?.data) {
      setTimeout(() => {
        setSections(
          data.data.sort((a: any, b: any) => a.sortOrder - b.sortOrder)
        );
      }, 500);
    }
  }, [data]);

  // Handle menu item click
  const handleMenuItemClick = (item: MenuItem) => {
    if (item.action) {
      item.action();
    } else if (item.link.startsWith("http")) {
      window.open(item.link, "_blank");
    } else {
      navigate(item.link);
    }
    setIsMenuOpen(false);
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
      ".fade-in-on-scroll:not(.sub-image-container)"
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

  const logoSizes = getResponsiveLogoSizes();

  return (
    <div
      style={{
        position: "relative",
        top: 0,
        left: 0,
        width: "100%",
        minHeight: "100vh",
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
        paddingBottom: "200px", // Space for fixed footer
      }}
    >
      {/* Show loading spinner while data is being fetched */}
      {(isPending || isResumePending) && (
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
            text="Loading your portfolio..."
            fullHeight={true}
          />
        </div>
      )}
      <style>{homepageStyles}</style>

      {/* Menu Item Animations */}
      <style>
        {`
          .menu-item-enter {
            opacity: 0;
            transform: translate(-50%, -50%) rotate(0deg) scale(0.9);
            animation: menuItemEnter 0.6s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
          }
          
          @keyframes menuItemEnter {
            0% {
              opacity: 0;
              transform: translate(-50%, -50%) rotate(0deg) scale(0.9);
            }
            100% {
              opacity: 1;
              transform: translate(-50%, -50%) rotate(var(--final-rotation, 0deg)) scale(1);
            }
          }
          
          .menu-item-clean:hover {
            transform: translate(-50%, -50%) rotate(var(--final-rotation, 0deg)) scale(1.05);
            background: rgba(255, 255, 255, 0.95);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
            border-color: rgba(255, 255, 255, 0.5);
          }
        `}
      </style>

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
          variant="homepage"
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
        {/* ENHANCED: Responsive sections with background blur effect */}
        {sections?.map((section, sectionIndex) => {
          // ENHANCED: Calculate proper dimensions using responsive system
          const dimensions = getResponsiveSectionDimensions(section);
          const bgStyle = getResponsiveBackgroundStyle(section);
          const coordinateSystem = createResponsiveCoordinateSystem(
            section.backgroundImageAspectRatio
          );

          return (
            <section
              key={section.projectContainerId}
              style={{
                position: "relative",
                width: "100vw",
                height: `${dimensions.height}px`,
                minHeight:
                  deviceType === "mobile"
                    ? "80vh"
                    : deviceType === "tablet"
                    ? "90vh"
                    : "100vh",
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

              {/* Content Layer - Sub-images and other content */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  zIndex: 10,
                }}
              >
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

              {/* ENHANCED: Responsive sub-images positioned using coordinate system with Framer Motion */}
              <AnimatePresence>
                {section.projects?.map((subImage) => {
                  // ENHANCED: Use responsive coordinate system for positioning
                  const containerWidth = window.innerWidth;
                  const { x: pixelX, y: pixelY } =
                    coordinateSystem.getPixelFromPercent(
                      subImage.xPosition,
                      subImage.yPosition,
                      containerWidth
                    );

                  const imageDimensions = calculateResponsiveImageDimensions(
                    containerWidth,
                    subImage.heightPercent,
                    section.backgroundImageAspectRatio
                  );

                  const isHovered = hoveredImageId === subImage.projectId;

                  // Get animation variants for this image
                  const animationVariants = getAnimationVariants(subImage.animation, subImage.animationTrigger);
                  const duration = getAnimationDuration(subImage.animationSpeed);

                  // Build proper transition with duration and repeat logic
                  const transition: any = { duration };

                  // Handle repeat logic based on trigger and animation type
                  if (subImage.animationTrigger === 'continuous') {
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
                    
                    if (continuousAnimations.includes(subImage.animation)) {
                      transition.repeat = Infinity;
                    }

                    // Linear easing for rotation animations
                    if (['rotate', 'flip', 'flipX', 'flipY'].includes(subImage.animation)) {
                      transition.ease = 'linear';
                    }
                  }

                  if (subImage.animationTrigger === 'once') {
                    // Attention seeking animations that should repeat a few times for "once" trigger
                    const attentionAnimations = [
                      'bounce', 'shake', 'shakeY', 'pulse', 'heartbeat', 'flash', 'headShake', 'swing', 
                      'rubberBand', 'wobble', 'jello', 'tada'
                    ];
                    
                    if (attentionAnimations.includes(subImage.animation)) {
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
                      transition.repeat = repeatCounts[subImage.animation] || 1;
                    }
                  }

                  // Special duration adjustments for specific animations
                  if (subImage.animation === 'hinge') {
                    transition.duration = duration * 1.5; // Hinge needs more time
                  }

                  if (['elasticIn', 'elasticInUp', 'elasticInDown', 'elasticInLeft', 'elasticInRight'].includes(subImage.animation)) {
                    transition.duration = duration * 1.2; // Elastic animations need more time
                  }

                  return (
                    <motion.div
                      key={subImage.projectId}
                      className="sub-image-visible sub-image-container"
                      style={{
                        position: "absolute",
                        left: `${pixelX}px`,
                        top: `${pixelY}px`,
                        zIndex: isHovered ? 50 : 20,
                      }}
                    >
                      <motion.img
                        src={
                          subImage.projectImageUrl &&
                          subImage.projectImageUrl.trim() !== ""
                            ? subImage.projectImageUrl
                            : SAMPLE_SUB_IMAGE
                        }
                        alt={subImage.name || subImage.imageFileName}
                        data-project-id={subImage.projectId}
                        data-animation={subImage.animation}
                        data-animation-speed={subImage.animationSpeed}
                        data-animation-trigger={subImage.animationTrigger}
                        className="clickable-sub-image"
                        variants={animationVariants}
                        initial={subImage.animation !== 'none' ? 'initial' : {}}
                        animate={subImage.animation !== 'none' && subImage.animationTrigger !== 'hover' ? 'animate' : 'initial'}
                        whileHover={subImage.animation !== 'none' && subImage.animationTrigger === 'hover' ? 'animate' : {}}
                        transition={transition}
                        onClick={() => handleSubImageClick(subImage.projectId)}
                        onMouseEnter={() => setHoveredImageId(subImage.projectId)}
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
                {section.title}
              </h1>
              
              </div> {/* End Content Layer */}
            </section>
          );
        })}

        {/* Navigation Loading Overlay */}
        <AnimatePresence>
          {isNavigating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0, 0, 0, 0.8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999,
              }}
            >
              <div style={{ textAlign: "center", color: "white" }}>
                <ModernLoader variant="gradient" size="large" />
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  style={{ marginTop: "20px", fontSize: "18px" }}
                >
                  Loading project details...
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Section */}
        <Footer deviceType={deviceType as "mobile" | "tablet" | "desktop"} />

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
            onClick={() => {
              targetScrollY.current = 0;
              if (!isScrolling.current) {
                isScrolling.current = true;
                smoothScrollStep();
              }
            }}
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

export default Homepage;