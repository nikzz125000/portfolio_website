import React from "react";
import ModernLoader from "./ModernLoader";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  variant?: "default" | "pulse" | "wave" | "dots" | "gradient";
  showText?: boolean;
  text?: string;
  className?: string;
  fullHeight?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "medium",
  variant = "default",
  showText = true,
  text = "Loading...",
  className = "",
  fullHeight = false,
}) => {
  return (
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
      <ModernLoader size={size} variant={variant} />
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
  );
};

export default LoadingSpinner;
