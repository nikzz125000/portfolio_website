/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useHomePageList } from "../../api/useHomePage";
import { useResumeDetails } from "../../api/useResumeDetails";
// import { useScrollSpeedSettings } from "../../api/useScrollSpeedSettings"; // New API hook
import LoadingSpinner from "../../components/ui/LoadingSpinner";
// import SideMenu from "../../components/SideMenu";
import Footer from "../../components/Footer";
import {
  continuousAnimations,
  getAnimationDuration,
  getAnimationVariants,
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
const createResponsiveCoordinateSystem = (aspectRatio: number | undefined) => {
  const getImageDimensions = (containerWidth: number) => {
    const deviceType = getDeviceType();

    if (!aspectRatio || aspectRatio <= 0) {
      const defaultRatios = {
        mobile: 0.75,
        tablet: 1.33,
        desktop: 1.78,
      };
      aspectRatio = defaultRatios[deviceType];
    }

    let adjustedAspectRatio = aspectRatio;
    if (deviceType === "mobile") {
      adjustedAspectRatio = Math.max(aspectRatio, 0.6);
      adjustedAspectRatio = Math.min(adjustedAspectRatio, 2.0);
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
  
  // ENHANCED: API-based scroll speed settings
  const [apiScrollSettings, setApiScrollSettings] = useState<ScrollSpeedSettings>(DEFAULT_SCROLL_SETTINGS);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const targetScrollY = useRef<number>(0);
  const currentScrollY = useRef<number>(0);
  const animationFrameId = useRef<number | null>(null);
  const isScrolling = useRef<boolean>(false);
  const [totalHeight, setTotalHeight] = useState<number>(0);
  const navigate = useNavigate();
  const [showLoader, setShowLoader] = useState(false);

  const { data, isPending } = useHomePageList();
  const { isPending: isResumePending } = useResumeDetails();
  
  // ENHANCED: Fetch scroll speed settings from API
  // const { 
  //   data: scrollSpeedData, 
  //   isPending: isScrollSpeedPending,
  //   error: scrollSpeedError 
  // } = useScrollSpeedSettings();
  const { data: scrollSpeedData} = useScrollerSpeedSettings();
  // const scrollSpeedData = { data: {    wheel: 0.2, touch: 0.6, keyboard: 1.0, momentum: 0.3, smoothness: 0.08 } }; // Mock data 
const scrollSpeedError = null; // Mock error
const isScrollSpeedPending = false; // Mock pending state
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
      // Fallback to default settings if API fails
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

  useEffect(() => {
  const handleMouseMove = (e: MouseEvent) => {
    // Update CSS variables for cursor position
    document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
  };

  // Only track mouse on clickable elements
  const clickableElements = document.querySelectorAll('.clickable-sub-image');
  
  clickableElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
      document.addEventListener('mousemove', handleMouseMove);
    });
    
    element.addEventListener('mouseleave', () => {
      document.removeEventListener('mousemove', handleMouseMove);
      // Hide cursor when not hovering
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
      deviceMultiplier = 1.5; // Higher sensitivity for mobile
    } else if (device === "tablet") {
      deviceMultiplier = 1.25; // Medium sensitivity for tablet
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
      backgroundSize: "cover",
      backgroundPosition: "center center",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "scroll",
      imageRendering: "auto",
      WebkitBackdropFilter: "cover",
      MozBackgroundSize: "cover",
    } as React.CSSProperties;
  };

  // Responsive section dimension calculation
  const getResponsiveSectionDimensions = (section: SectionData) => {
    const containerWidth = window.innerWidth;
    const device = getDeviceType();
    const coordinateSystem = createResponsiveCoordinateSystem(
      section.backgroundImageAspectRatio
    );
    const { height, adjustedAspectRatio } =
      coordinateSystem.getImageDimensions(containerWidth);

    let sectionHeight = Math.ceil(height);

    if (device === "mobile") {
      const maxMobileHeight = Math.ceil(window.innerHeight * 1.2);
      const minMobileHeight = Math.ceil(window.innerHeight * 0.8);
      sectionHeight = Math.max(
        Math.min(sectionHeight, maxMobileHeight),
        minMobileHeight
      );
    } else if (device === "tablet") {
      const maxTabletHeight = Math.ceil(window.innerHeight * 1.5);
      const minTabletHeight = Math.ceil(window.innerHeight * 0.9);
      sectionHeight = Math.max(
        Math.min(sectionHeight, maxTabletHeight),
        minTabletHeight
      );
    } else {
      sectionHeight = Math.max(Math.ceil(height), window.innerHeight);
    }

    return {
      width: containerWidth,
      height: sectionHeight,
      imageHeight: Math.ceil(height),
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
        deviceType === "mobile" ? 340 : deviceType === "tablet" ? 280 : 240;
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

    // Dynamic easing based on scroll distance and API smoothness setting
    let easingFactor = scrollSettings.smoothness;

    if (Math.abs(difference) > 100) {
      easingFactor = scrollSettings.smoothness * 1.5; // Faster for long distances
    } else if (Math.abs(difference) < 10) {
      easingFactor = scrollSettings.smoothness * 0.5; // Slower for fine-tuning
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
      
      // Use API-driven wheel speed
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
      
      // Use API-driven keyboard speed
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

        // Use API-driven touch speed
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
  }, [totalHeight, deviceType, apiScrollSettings]); // Now depends on apiScrollSettings

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

  // Responsive image dimensions calculation
  const calculateResponsiveImageDimensions = (
    containerWidth: number,
    heightPercent: number,
    aspectRatio: number | undefined
  ) => {
    const device = getDeviceType();
    const coordinateSystem = createResponsiveCoordinateSystem(aspectRatio);
    const { width: imageWidth } =
      coordinateSystem.getImageDimensions(containerWidth);

    let scaleFactor = 1;
    if (device === "mobile") {
      scaleFactor = 0.8;
    } else if (device === "tablet") {
      scaleFactor = 0.9;
    }

    const adjustedHeightPercent = heightPercent * scaleFactor;
    const height = (adjustedHeightPercent / 100) * imageWidth;

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
        {/* Responsive sections with NO gaps */}
        {sections?.map((section, sectionIndex) => {
          const dimensions = getResponsiveSectionDimensions(section);
          const bgStyle = getResponsiveBackgroundStyle(section);
          const coordinateSystem = createResponsiveCoordinateSystem(
            section.backgroundImageAspectRatio
          );

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
                        cursor: "pointer",
                        height: logoSizes.centeredLogo,
                      }}
                    />
                  </div>
                )}

                {/* Responsive sub-images positioned using coordinate system */}
                <AnimatePresence>
                  {section.projects?.map((subImage) => {
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

                    const animationVariants = getAnimationVariants(
                      subImage.animation,
                      subImage.animationTrigger
                    );
                    const duration = getAnimationDuration(
                      subImage.animationSpeed
                    );

                    const transition: any = { duration };

                    if (subImage.animationTrigger === "continuous") {
                      if (continuousAnimations.includes(subImage.animation)) {
                        transition.repeat = Infinity;
                      }

                      if (
                        ["rotate", "flip", "flipX", "flipY"].includes(
                          subImage.animation
                        )
                      ) {
                        transition.ease = "linear";
                      }
                    }

                    if (subImage.animationTrigger === "once") {
                      const attentionAnimations = [
                        "bounce",
                        "shake",
                        "shakeY",
                        "pulse",
                        "heartbeat",
                        "flash",
                        "headShake",
                        "swing",
                        "rubberBand",
                        "wobble",
                        "jello",
                        "tada",
                      ];

                      if (attentionAnimations.includes(subImage.animation)) {
                        const repeatCounts: { [key: string]: number } = {
                          bounce: 3,
                          shake: 3,
                          shakeY: 3,
                          pulse: 2,
                          heartbeat: 2,
                          flash: 3,
                          headShake: 2,
                          swing: 1,
                          rubberBand: 1,
                          wobble: 1,
                          jello: 1,
                          tada: 1,
                        };
                        transition.repeat =
                          repeatCounts[subImage.animation] || 1;
                      }
                    }

                    if (subImage.animation === "hinge") {
                      transition.duration = duration * 1.5;
                    }

                    if (
                      [
                        "elasticIn",
                        "elasticInUp",
                        "elasticInDown",
                        "elasticInLeft",
                        "elasticInRight",
                      ].includes(subImage.animation)
                    ) {
                      transition.duration = duration * 1.2;
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
                          // className="clickable-sub-image"
                           className="clickable-sub-image-gradient"
                          variants={animationVariants}
                          initial={
                            subImage.animation !== "none" ? "initial" : {}
                          }
                          animate={
                            subImage.animation !== "none" &&
                            subImage.animationTrigger !== "hover"
                              ? "animate"
                              : "initial"
                          }
                          whileHover={
                            subImage.animation !== "none" &&
                            subImage.animationTrigger === "hover"
                              ? "animate"
                              : {}
                          }
                          transition={transition}
                          onClick={() =>
                            handleSubImageClick(subImage.projectId)
                          }
                          onMouseEnter={() =>
                            setHoveredImageId(subImage.projectId)
                          }
                          onMouseLeave={() => setHoveredImageId(null)}
                          onError={(e) => {
                            if (e.currentTarget.src !== SAMPLE_SUB_IMAGE) {
                              e.currentTarget.src = SAMPLE_SUB_IMAGE;
                            }
                          }}
                          style={{
                            ...imageDimensions,
                            display: "block",
                            borderRadius: "8px",
                            // cursor: "pointer",
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
              cursor: "pointer",
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

export default Homepage;