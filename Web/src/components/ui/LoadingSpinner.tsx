import React from "react";


interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  variant?: "default" | "pulse" | "wave" | "dots" | "gradient";
  showText?: boolean;
  text?: string;
  className?: string;
  fullHeight?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
 
  showText = true,
  text = "Loading...",
  className = "",
  fullHeight = false,
}) => {

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

  const logoSizes = getResponsiveLogoSizes();
  return (
    <>
    
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: fullHeight ? "100vh" : "200px",
        gap: "16px",
        padding: "20px",
      }}
      className={className}
    >
      {/* <ModernLoader size={size} variant={variant} /> */}
      <img
            src="/logo/font.png"
            alt="Fixed Logo"
            style={{
              height: logoSizes.fixedLogo,
              width: "auto",
               filter: "brightness(0) invert(1)",
              transition: "transform 0.2s ease, filter 0.2s ease",
            }}
            
          />
      {showText && (
        <div
          style={{
            fontSize: "16px",
            color: "#666",
            fontWeight: "500",
            textAlign: "center",
          }}
        >
          {text}
        </div>
      )}
    </div>
    </>
  );
};

export default LoadingSpinner;
