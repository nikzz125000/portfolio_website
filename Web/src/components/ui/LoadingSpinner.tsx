import React, { useState, useEffect } from "react";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  variant?: "default" | "pulse" | "wave" | "dots" | "gradient";
  showText?: boolean;
  text?: string;
  className?: string;
  fullHeight?: boolean;
  typewriterEffect?: boolean;
  typewriterSpeed?: number; // milliseconds per character
  showCursor?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  showText = true,
  text = "Loading...",
  className = "",
  fullHeight = false,
  typewriterEffect = false,
  typewriterSpeed = 100,
  showCursor = true,
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [, setCurrentIndex] = useState(0);

  const BREAKPOINTS = {
    mobile: 768,
    tablet: 1024,
    desktop: 1200,
  };

  const getDeviceType = () => {
    const width = window.innerWidth;
    if (width <= BREAKPOINTS.mobile) return "mobile";
    if (width <= BREAKPOINTS.tablet) return "tablet";
    return "desktop";
  };

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

  // Typewriter effect logic
  useEffect(() => {
    if (!typewriterEffect || !text) {
      setDisplayedText(text);
      return;
    }

    // Reset when starting
    setDisplayedText("");
    setCurrentIndex(0);
    
    const typeText = () => {
      let index = 0;
      const interval = setInterval(() => {
        if (index <= text.length) {
          setDisplayedText(text.slice(0, index));
          index++;
        } else {
          clearInterval(interval);
        }
      }, typewriterSpeed);
      
      return () => clearInterval(interval);
    };

    const cleanup = typeText();
    return cleanup;
  }, [text, typewriterEffect, typewriterSpeed]);



  const logoSizes = getResponsiveLogoSizes();

  // CSS-only animations
  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: fullHeight ? "100vh" : "200px",
    gap: "16px",
    padding: "20px",
    animation: "fadeInUp 0.6s ease-out",
  };

  const logoStyle: React.CSSProperties = {
    height: logoSizes.fixedLogo,
    width: "auto",
    filter: "brightness(0) invert(1)",
    transition: "transform 0.2s ease, filter 0.2s ease",
    animation: "logoFadeIn 0.8s ease-out 0.2s both",
  };

  const textStyle: React.CSSProperties = {
    fontSize: "16px",
    color: "#666",
    fontWeight: "500",
    textAlign: "center",
    fontFamily: typewriterEffect ? "monospace" : "inherit",
    minHeight: "24px",
    animation: "textFadeIn 0.4s ease-out 0.5s both",
  };

  const cursorStyle: React.CSSProperties = {
    marginLeft: "2px",
    color: "#007bff",
    fontWeight: "bold",
    animation: showCursor ? "blink 1s infinite" : "none",
  };

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes logoFadeIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes textFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes blink {
          0%, 50% {
            opacity: 1;
          }
          51%, 100% {
            opacity: 0;
          }
        }
      `}</style>

      <div style={containerStyle} className={className}>
        <img
          src="/logo/font.png"
          alt="Fixed Logo"
          style={logoStyle}
        />

        {showText && (
          <div style={textStyle}>
            {typewriterEffect ? (
              <>
                <span style={{fontWeight: "bold"}}>{displayedText}</span>
                {showCursor && <span style={cursorStyle}>|</span>}
              </>
            ) : (
              text
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default LoadingSpinner;