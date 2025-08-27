/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useHomePageList } from "../../api/useHomePage";
import { useResumeDetails } from "../../api/useResumeDetails";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import Footer from "../../components/Footer";
import {
  getDeviceType,
  homepageStyles,
  SAMPLE_BACKGROUND_IMAGE,
  SAMPLE_SUB_IMAGE,
  type MenuItem,
  type SectionData,
} from "../../components/Const";
import HomePageLogo from "../../components/HomePageLogo";
import { useScrollerSpeedSettings } from "../../api/useScrollSpeedSettings";
import { useGetBackgroundColor } from "../../api/webSettings/useGetBackgroundColor";
// import { CustomCursor } from "../../components/CustomCursor";

// Helper: extract average color from image
const getAverageColor = (imageUrl: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageUrl;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve("rgba(255,255,255,0.6)");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);
      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      let r = 0, g = 0, b = 0;
      const total = imageData.data.length / 4;
      for (let i = 0; i < imageData.data.length; i += 4) {
        r += imageData.data[i];
        g += imageData.data[i + 1];
        b += imageData.data[i + 2];
      }
      r = Math.floor(r / total);
      g = Math.floor(g / total);
      b = Math.floor(b / total);
      resolve(`rgba(${r}, ${g}, ${b}, 0.75)`);
    };
    img.onerror = () => resolve("rgba(255,255,255,0.6)");
  });
};

interface SectionGlowColor {
  [sectionId: string]: string;
}

interface SectionCarouselState {
  [sectionId: string]: number; // current project index for each section
}

// ENHANCED: Scroll speed settings interface
interface ScrollSpeedSettings {
  wheel: number;
  touch: number;
  keyboard: number;
  momentum: number;
  smoothness: number;
}

// ENHANCED: Default fallback settings if API fails
const DEFAULT_SCROLL_SETTINGS: ScrollSpeedSettings = {
  wheel: 0.2,
  touch: 0.6,
  keyboard: 1.0,
  momentum: 0.3,
  smoothness: 0.08,
};

// ENHANCED: Mobile-first unified coordinate system


const HomeMobileView: React.FC = () => {
  const [sections, setSections] = useState<SectionData[]>([]);
  const [viewportHeight, setViewportHeight] = useState<number>(window.innerHeight);
  const [viewportWidth, setViewportWidth] = useState<number>(window.innerWidth);
  const [deviceType, setDeviceType] = useState<string>(getDeviceType());
  const [scrollY, setScrollY] = useState<number>(0);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [hoveredImageId, setHoveredImageId] = useState<number | null>(null);
  const [glowColors, setGlowColors] = useState<SectionGlowColor>({});
  const [sectionCarousels, setSectionCarousels] = useState<SectionCarouselState>({});
  
  // ENHANCED: API-based scroll speed settings
  const [apiScrollSettings, setApiScrollSettings] = useState<ScrollSpeedSettings>(DEFAULT_SCROLL_SETTINGS);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const targetScrollY = useRef<number>(0);
  const currentScrollY = useRef<number>(0);
  const animationFrameId = useRef<number | null>(null);
  const isScrolling = useRef<boolean>(false);
  const [totalHeight, setTotalHeight] = useState<number>(0);
  const carouselTimersRef = useRef<{ [sectionId: string]: any }>({});
  const navigate = useNavigate();
  const [showLoader, setShowLoader] = useState(false);

  const { data, isPending } = useHomePageList();
  const { isPending: isResumePending } = useResumeDetails();
  const { data: scrollSpeedData} = useScrollerSpeedSettings();
  
  const scrollSpeedError = null;
  const isScrollSpeedPending = false;
  
  // ENHANCED: Update scroll settings when API data is available
  useEffect(() => {
    if (scrollSpeedData?.data) {
      const apiSettings: ScrollSpeedSettings = {
        wheel: scrollSpeedData.data.wheel ?? DEFAULT_SCROLL_SETTINGS.wheel,
        touch: scrollSpeedData.data.touch ?? DEFAULT_SCROLL_SETTINGS.touch,
        keyboard: scrollSpeedData.data.keyboard ?? DEFAULT_SCROLL_SETTINGS.keyboard,
        momentum: scrollSpeedData.data.momentum ?? DEFAULT_SCROLL_SETTINGS.momentum,
        smoothness: scrollSpeedData.data.smoothness ?? DEFAULT_SCROLL_SETTINGS.smoothness,
      };
      setApiScrollSettings(apiSettings);
    } else if (scrollSpeedError) {
      console.warn("Failed to load scroll speed settings, using defaults:", scrollSpeedError);
      setApiScrollSettings(DEFAULT_SCROLL_SETTINGS);
    }
  }, [scrollSpeedData, scrollSpeedError]);

  const [backgroundColors, setBackgroundColors] = useState('linear-gradient(90deg, #6e226e 0%, #a5206a 14%, #d31663 28%, #ed3176 42%, #fd336b 56%, #f23d64 70%, #f65d55 84%, #f5655d 100%)')
  const { data: backgroundColor } = useGetBackgroundColor('home');
  
  useEffect(() => {
    if(backgroundColor?.data){
      setBackgroundColors(backgroundColor?.data?.backgroundColor)
    }
  }, [backgroundColor])

  // Initialize carousel states for each section
  useEffect(() => {
    if (sections.length > 0) {
      const initialCarouselState: SectionCarouselState = {};
      sections.forEach(section => {
        if (section.projects && section.projects.length > 0) {
          initialCarouselState[section.projectContainerId] = 0;
        }
      });
      setSectionCarousels(initialCarouselState);
    }
  }, [sections]);

  // Setup carousel timers for each section
  useEffect(() => {
    // Clear existing timers
    Object.values(carouselTimersRef.current).forEach(timer => {
      if (timer) clearInterval(timer);
    });
    carouselTimersRef.current = {};

    // Setup new timers for each section with projects
  sections.forEach(section => {
  if (section.projects && section.projects.length > 1) {
    const projectsLength = section.projects.length; // Store the length
    
    carouselTimersRef.current[section.projectContainerId] = setInterval(() => {
      setSectionCarousels(prev => ({
        ...prev,
        [section.projectContainerId]: 
          (prev[section.projectContainerId] + 1) % projectsLength // Use stored length
      }));
    }, 4000);
  }
});

    return () => {
      Object.values(carouselTimersRef.current).forEach(timer => {
        if (timer) clearInterval(timer);
      });
    };
  }, [sections]);

  // Extract glow colors for sections
  useEffect(() => {
    if (sections) {
      sections.forEach((section) => {
        if (section.backgroundImageUrl) {
          getAverageColor(section.backgroundImageUrl).then((color) => {
            setGlowColors((prev) => ({ ...prev, [section.projectContainerId]: color }));
          });
        }
      });
    }
  }, [sections]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };

    const clickableElements = document.querySelectorAll('.clickable-sub-image');
    
    clickableElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        document.addEventListener('mousemove', handleMouseMove);
      });
      
      element.addEventListener('mouseleave', () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.documentElement.style.setProperty('--mouse-x', '-100px');
        document.documentElement.style.setProperty('--mouse-y', '-100px');
      });
    });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [sections]);

  // ENHANCED: Apply device-specific multipliers to API scroll settings
  const getDeviceAdjustedScrollSettings = (): ScrollSpeedSettings => {
    const device = getDeviceType();
    
    let deviceMultiplier = 1;
    if (device === "mobile") {
      deviceMultiplier = 1.5;
    } else if (device === "tablet") {
      deviceMultiplier = 1.25;
    }

    return {
      wheel: apiScrollSettings.wheel * deviceMultiplier,
      touch: apiScrollSettings.touch * deviceMultiplier,
      keyboard: apiScrollSettings.keyboard,
      momentum: apiScrollSettings.momentum,
      smoothness: apiScrollSettings.smoothness,
    };
  };

  // Navigation handlers
  const handleSubImageClick = (subImageId: number) => {
    navigate(`/project_details/${subImageId}`);
  };

  const handleCenteredLogoClick = () => {
    navigate("/resume");
  };

  const handleLogoClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Responsive background strategy
  const getResponsiveBackgroundStyle = (section: SectionData) => {
    if (!section.backgroundImageUrl) return {};

    const backgroundUrl =
      section.backgroundImageUrl && section.backgroundImageUrl.trim() !== ""
        ? section.backgroundImageUrl
        : SAMPLE_BACKGROUND_IMAGE;

    return {
      backgroundImage: `url(${backgroundUrl})`,
      backgroundSize: "100% auto", // Width 100%, height auto to maintain aspect ratio
      backgroundPosition: "center top",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "scroll",
      imageRendering: "auto",
      WebkitBackdropFilter: "none",
      MozBackgroundSize: "100% auto",
    } as React.CSSProperties;
  };

  // Responsive section dimension calculation based on background image
  const getResponsiveSectionDimensions = (section: SectionData) => {
    const containerWidth = window.innerWidth;
    
    // Use background image aspect ratio, fallback to default if not available
    let aspectRatio = section.backgroundImageAspectRatio;
    if (!aspectRatio || aspectRatio <= 0) {
      aspectRatio = 16 / 9; // Default aspect ratio
    }
    
    // Calculate height based on width and aspect ratio
    const sectionHeight = Math.ceil(containerWidth / aspectRatio);
    
    return {
      width: containerWidth,
      height: sectionHeight,
      imageHeight: sectionHeight,
      adjustedAspectRatio: aspectRatio,
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

      if (isMenuOpen && newDeviceType !== deviceType) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [deviceType, isMenuOpen]);

  useEffect(() => {
    if (isPending || isResumePending || isScrollSpeedPending) {
      setShowLoader(true);
    } else {
      const timeout = setTimeout(() => {
        setShowLoader(false);
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [isPending, isResumePending, isScrollSpeedPending]);

  // Calculate total height using responsive system
  useEffect(() => {
    if (sections.length > 0) {
      let height = 0;
      sections.forEach((section) => {
        const dimensions = getResponsiveSectionDimensions(section);
        height += dimensions.height;
      });

      const footerHeight =
        deviceType === "mobile" ? 140 : deviceType === "tablet" ? 280 : 240;
      height += footerHeight;

      setTotalHeight(height);

      if (targetScrollY.current > height - window.innerHeight) {
        targetScrollY.current = Math.max(0, height - window.innerHeight);
      }
    }
  }, [sections, viewportHeight, viewportWidth, deviceType]);

  // ENHANCED: Professional smooth scroll animation with API-driven dynamic speed
  const smoothScrollStep = () => {
    const scrollSettings = getDeviceAdjustedScrollSettings();
    const difference = targetScrollY.current - currentScrollY.current;

    let easingFactor = scrollSettings.smoothness;

    if (Math.abs(difference) > 100) {
      easingFactor = scrollSettings.smoothness * 1.5;
    } else if (Math.abs(difference) < 10) {
      easingFactor = scrollSettings.smoothness * 0.5;
    }

    const step = difference * easingFactor;

    if (Math.abs(difference) < 0.8) {
      currentScrollY.current = targetScrollY.current;
      isScrolling.current = false;
      setScrollY(currentScrollY.current);

      if (containerRef.current) {
        containerRef.current.style.transform = `translateY(-${currentScrollY.current}px)`;
        containerRef.current.style.transition = "transform 0.1s ease-out";

        setTimeout(() => {
          if (containerRef.current) {
            containerRef.current.style.transition = "none";
          }
        }, 100);
      }
      return;
    }

    currentScrollY.current += step;
    setScrollY(currentScrollY.current);

    if (containerRef.current) {
      containerRef.current.style.transform = `translateY(-${currentScrollY.current}px)`;
      containerRef.current.style.transition = "none";
    }

    animationFrameId.current = requestAnimationFrame(smoothScrollStep);
  };

  // ENHANCED: Handle wheel events with API-driven scroll speed
  useEffect(() => {
    if (totalHeight === 0) return;

    let momentumVelocity = 0;
    let isMomentumActive = false;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const scrollSettings = getDeviceAdjustedScrollSettings();
      
      const scrollAmount = e.deltaY * scrollSettings.wheel;
      const maxScroll = Math.max(0, totalHeight - window.innerHeight);

      if (Math.abs(scrollAmount) > 0) {
        momentumVelocity = scrollAmount * scrollSettings.momentum;
        isMomentumActive = true;
      }

      const newScrollY = targetScrollY.current + scrollAmount;
      targetScrollY.current = Math.max(0, Math.min(maxScroll, newScrollY));

      if (!isScrolling.current) {
        isScrolling.current = true;
        smoothScrollStep();
      }

      setTimeout(() => {
        isMomentumActive = false;
        momentumVelocity = 0;
      }, 150);
    };

    const applyMomentum = () => {
      if (isMomentumActive && Math.abs(momentumVelocity) > 0.1) {
        const maxScroll = Math.max(0, totalHeight - window.innerHeight);
        const newScrollY = targetScrollY.current + momentumVelocity;
        targetScrollY.current = Math.max(0, Math.min(maxScroll, newScrollY));

        if (!isScrolling.current) {
          isScrolling.current = true;
          smoothScrollStep();
        }

        momentumVelocity *= 0.95;
      }
    };

    const momentumInterval = setInterval(applyMomentum, 16);

    const handleKeyDown = (e: KeyboardEvent) => {
      const scrollSettings = getDeviceAdjustedScrollSettings();
      
      let scrollAmount = 80 * scrollSettings.keyboard;

      if (e.repeat) {
        scrollAmount *= 1.5;
      }

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
    let startTime = 0;
    let touchVelocity = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      startTime = Date.now();
      touchVelocity = 0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        e.preventDefault();
        const scrollSettings = getDeviceAdjustedScrollSettings();
        const currentY = e.touches[0].clientY;
        const currentTime = Date.now();
        const deltaY = startY - currentY;
        const timeDelta = currentTime - startTime;

        const scrollAmount = deltaY * scrollSettings.touch;

        if (timeDelta > 0) {
          touchVelocity = (deltaY / timeDelta) * 10;
        }

        const maxScroll = Math.max(0, totalHeight - window.innerHeight);

        targetScrollY.current = Math.max(
          0,
          Math.min(maxScroll, targetScrollY.current + scrollAmount)
        );
        startY = currentY;
        startTime = currentTime;

        if (!isScrolling.current) {
          isScrolling.current = true;
          smoothScrollStep();
        }
      }
    };

    const handleTouchEnd = () => {
      if (Math.abs(touchVelocity) > 0.5) {
        const scrollSettings = getDeviceAdjustedScrollSettings();
        const momentumScroll = touchVelocity * 50 * scrollSettings.momentum;
        const maxScroll = Math.max(0, totalHeight - window.innerHeight);

        targetScrollY.current = Math.max(
          0,
          Math.min(maxScroll, targetScrollY.current + momentumScroll)
        );

        if (!isScrolling.current) {
          isScrolling.current = true;
          smoothScrollStep();
        }
      }

      touchVelocity = 0;
    };

    document.body.style.overflow = "hidden";

    window.addEventListener("wheel", handleWheel, { passive: false });
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("wheel", handleWheel);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (momentumInterval) {
        clearInterval(momentumInterval);
      }
    };
  }, [totalHeight, deviceType, apiScrollSettings]);

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

  // Get responsive logo and menu sizes
  const getResponsiveLogoSizes = () => {
    const device = getDeviceType();
    return {
      fixedLogo:
        device === "mobile" ? "100px" : device === "tablet" ? "120px" : "154px",
      SecondLogo:
        device === "mobile" ? "80px" : device === "tablet" ? "100px" : "130px",
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
      bottomLogo:
        device === "mobile" ? "90px" : device === "tablet" ? "108px" : "148px",
    };
  };

  const logoSizes = getResponsiveLogoSizes();

  // Smooth scroll to top with easing
  const smoothScrollToTop = () => {
    targetScrollY.current = 0;
    if (!isScrolling.current) {
      isScrolling.current = true;
      smoothScrollStep();
    }
  };

  // Add smooth scroll behavior for better user experience
  useEffect(() => {
    const handleSmoothScroll = () => {
      if (containerRef.current) {
        containerRef.current.style.transition =
          "transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)";
      }
    };

    const removeSmoothTransition = () => {
      if (containerRef.current) {
        containerRef.current.style.transition = "none";
      }
    };

    if (targetScrollY.current !== currentScrollY.current) {
      handleSmoothScroll();
      setTimeout(removeSmoothTransition, 300);
    }
  }, [targetScrollY.current, currentScrollY.current]);

  // Track scroll direction for visual feedback
  const [, setScrollDirection] = useState<"up" | "down" | "none">("none");
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (Math.abs(scrollY - lastScrollY.current) > 5) {
      const direction = scrollY > lastScrollY.current ? "down" : "up";
      setScrollDirection(direction);
      lastScrollY.current = scrollY;

      setTimeout(() => setScrollDirection("none"), 1000);
    }
  }, [scrollY]);

  // Add scroll performance optimization
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.willChange = "transform";
      containerRef.current.style.transform = "translateZ(0)";
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.style.willChange = "auto";
      }
    };
  }, []);

  return (
    <div
      className="homepage-container homepage-gradient-bg"
      style={{
        position: "relative",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        background:backgroundColors
      }}
    >
        {/* <CustomCursor /> */}
      {/* Show loading spinner while data is being fetched */}
      {showLoader && (
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

      {/* Carousel Styles */}
      <style>
        {`
.mobile-carousel-slide {
  position: absolute;
  top: 30%;
  left: 35%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 30;
  width: 30vw;
  height: 20vh;
  max-width: 30vw;
  max-height: 20vh;
  margin: 0;
  padding: 0;
}

.mobile-carousel-image-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin: 0;
  padding: 0;
}

.mobile-carousel-image {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  border-radius: 14px !important;
  object-fit: contain !important;
  object-position: center !important;
  backface-visibility: hidden !important;
  perspective: 1000px !important;
  transition: all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
  animation: mobileImageGlow 6s ease-in-out infinite alternate !important;
  box-shadow: 
    0 8px 24px rgba(0, 0, 0, 0.3),
    0 0 25px var(--glow-color, rgba(255, 255, 255, 0.25)),
    0 0 50px var(--glow-color, rgba(255, 255, 255, 0.15));
  margin: 0;
  padding: 0;
  display: block;
}

.mobile-carousel-image:hover {
  transform: scale(1.07) rotate(0.5deg) !important;
  box-shadow: 
    0 12px 36px rgba(0, 0, 0, 0.4),
    0 0 35px var(--glow-color, rgba(255, 255, 255, 0.4)),
    0 0 70px var(--glow-color, rgba(255, 255, 255, 0.2)),
    0 0 100px var(--glow-color, rgba(102, 126, 234, 0.3)) !important;
  animation: pulseGlow 3s ease-in-out infinite alternate !important;
}

.mobile-carousel-image:active {
  transform: scale(0.96) !important;
}

@keyframes mobileImageGlow {
  0% { 
    box-shadow: 
      0 8px 24px rgba(0, 0, 0, 0.3),
      0 0 20px var(--glow-color, rgba(255, 255, 255, 0.2)),
      0 0 40px var(--glow-color, rgba(255, 255, 255, 0.1));
  }
  50% { 
    box-shadow: 
      0 12px 32px rgba(0, 0, 0, 0.35),
      0 0 30px var(--glow-color, rgba(255, 255, 255, 0.35)),
      0 0 60px var(--glow-color, rgba(255, 255, 255, 0.2));
  }
  100% { 
    box-shadow: 
      0 8px 24px rgba(0, 0, 0, 0.3),
      0 0 20px var(--glow-color, rgba(255, 255, 255, 0.25)),
      0 0 40px var(--glow-color, rgba(255, 255, 255, 0.15));
  }
}

@keyframes pulseGlow {
  0% {
    filter: drop-shadow(0 0 10px var(--glow-color)) drop-shadow(0 0 20px var(--glow-color));
  }
  100% {
    filter: drop-shadow(0 0 25px var(--glow-color)) drop-shadow(0 0 50px var(--glow-color));
  }
}
        `}
      </style>

      {/* Additional CSS to eliminate background gaps */}
      <style>
        {`
          section > div:first-child {
            margin-top: -1px !important;
            height: calc(100% + 2px) !important;
            transform: translateZ(0) !important;
            backface-visibility: hidden !important;
            image-rendering: -webkit-optimize-contrast !important;
            image-rendering: crisp-edges !important;
            will-change: auto !important;
            box-sizing: content-box !important;
            border-radius: 0 !important;
            overflow: hidden !important;
          }
          
          section:not(:first-child) > div:first-child {
            margin-top: -2px !important;
            height: calc(100% + 3px) !important;
          }
          
          section > div:nth-child(2) {
            margin-top: -1px !important;
            height: calc(100% + 2px) !important;
            transform: translateZ(0) !important;
            backface-visibility: hidden !important;
            box-sizing: content-box !important;
            border-radius: 0 !important;
            overflow: hidden !important;
          }
          
          section:not(:first-child) > div:nth-child(2) {
            margin-top: -2px !important;
            height: calc(100% + 3px) !important;
          }

          .scroll-to-top-btn {
            position: relative;
            overflow: hidden;
          }
          
          .scroll-to-top-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #6e226e 0%, #a5206a 14%, #d31663 28%, #ed3176 42%, #fd336b 56%, #f23d64 70%, #f65d55 84%, #f5655d 100%);
            border-radius: 50%;
            transform: scale(0);
            transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: -1;
          }
          
          .scroll-to-top-btn:hover::before {
            transform: scale(1);
          }
          
          .scroll-to-top-btn:hover {
            border-color: rgba(255, 255, 255, 0.8) !important;
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6) !important;
          }
        `}
      </style>

      {/* Gradient Pattern Overlay */}
      <div className="gradient-background-pattern" />

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
              
      <HomePageLogo 
        deviceType={deviceType} 
        handleLogoClick={handleLogoClick}  
        isMenuOpen={isMenuOpen} 
        handleMenuItemClick={handleMenuItemClick} 
        logoSizes={logoSizes} 
        scrollY={scrollY}
      />

      {/* Main Content Container */}
      <div
        ref={containerRef}
        className="homepage-content"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "block",
          fontSize: 0,
          lineHeight: 0,
          transition: "transform 0.1s ease-out",
          willChange: "transform",
        }}
      >
        {/* Responsive sections with carousel behavior */}
        {sections?.map((section, sectionIndex) => {
          const dimensions = getResponsiveSectionDimensions(section);
          const bgStyle = getResponsiveBackgroundStyle(section);
          const glowColor = glowColors[section.projectContainerId] || "rgba(255,255,255,0.6)";
          const currentProjectIndex = sectionCarousels[section.projectContainerId] || 0;
          const currentProject = section.projects?.[currentProjectIndex];

          return (
            <section
              key={section.projectContainerId}
              style={{
                display: "block",
                margin: 0,
                padding: 0,
                border: "none",
                outline: "none",
                verticalAlign: "top",
                fontSize: "16px",
                lineHeight: "normal",
                position: "relative",
                width: "100vw",
                height: `${dimensions.height}px`,
                minHeight: "0",
                maxHeight: "none",
                overflow: "hidden",
                ["--glow-color" as any]: glowColor,
              }}
            >
              {/* Separate Background Layer with Blur Effect */}
              <div
                style={{
                  position: "absolute",
                  top: "-2px",
                  left: "-2px",
                  right: "-2px",
                  bottom: "-2px",
                  width: "calc(100% + 4px)",
                  height: "calc(100% + 4px)",
                  margin: 0,
                  padding: 0,
                  border: "none",
                  outline: "none",
                  ...bgStyle,
                  filter: hoveredImageId !== null ? "blur(3px)" : "none",
                  transition: "filter 0.3s ease",
                  zIndex: 1,
                  inset: 0,
                }}
              />
              
              {/* Gradient Overlay */}
              <div
                style={{
                  position: "absolute",
                  top: "-2px",
                  left: "-2px",
                  right: "-2px",
                  bottom: "-2px",
                  width: "calc(100% + 4px)",
                  height: "calc(100% + 4px)",
                  margin: 0,
                  padding: 0,
                  border: "none",
                  outline: "none",
                  zIndex: 2,
                  pointerEvents: "none",
                }}
              />
              
              {/* Content Layer */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  zIndex: 10,
                  fontSize: "16px",
                  lineHeight: "normal",
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
                          : "80px",
                    }}
                  >
                    <img
                      src="/logo/logo.webp"
                      alt="Centered Logo"
                      style={{
                        height: logoSizes.centeredLogo,
                      }}
                    />
                  </div>
                )}

                {/* Carousel Project Display */}
                {currentProject && (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${section.projectContainerId}-${currentProject.projectId}`}
                      className="mobile-carousel-slide"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                      <div className="mobile-carousel-image-wrapper">
                        <img
                          src={currentProject.projectImageUrl || SAMPLE_SUB_IMAGE}
                          alt={currentProject.name || currentProject.imageFileName}
                          className="mobile-carousel-image clickable-sub-image"
                          onClick={() => handleSubImageClick(currentProject.projectId)}
                          onMouseEnter={() => setHoveredImageId(currentProject.projectId)}
                          onMouseLeave={() => setHoveredImageId(null)}
                          onError={(e) => {
                            if (e.currentTarget.src !== SAMPLE_SUB_IMAGE) {
                              e.currentTarget.src = SAMPLE_SUB_IMAGE;
                            }
                          }}
                        />
                      </div>
                    </motion.div>
                  </AnimatePresence>
                )}

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
              </div>
            </section>
          );
        })}

        {/* Footer Section */}
        <div
          style={{
            display: "block",
            margin: 0,
            padding: 0,
            border: "none",
            fontSize: "16px",
            lineHeight: "normal",
          }}
        >
          <Footer
            deviceType={deviceType as "mobile" | "tablet" | "desktop"}
            className="homepage-footer"
          />
        </div>
      </div>

      {/* Responsive Scroll to Top Button */}
      <AnimatePresence>
        {scrollY > 500 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{
              scale: 1.1,
              y: -2,
              transition: { duration: 0.2, ease: "easeOut" },
            }}
            whileTap={{
              scale: 0.95,
              y: 0,
              transition: { duration: 0.1, ease: "easeIn" },
            }}
            onClick={smoothScrollToTop}
            className="scroll-to-top-btn"
            style={{
              position: "fixed",
              bottom: deviceType === "mobile" ? "20px" : "30px",
              right: deviceType === "mobile" ? "20px" : "30px",
              width: deviceType === "mobile" ? "50px" : "55px",
              height: deviceType === "mobile" ? "50px" : "55px",
              borderRadius: "50%",
              background: "transparent",
              border: "2px solid rgba(255, 255, 255, 0.4)",
              color: "white",
              fontSize: deviceType === "mobile" ? "18px" : "22px",
              zIndex: 1000,
              boxShadow: "0 4px 15px rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              overflow: "hidden",
            }}
          >
            ↑
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomeMobileView;