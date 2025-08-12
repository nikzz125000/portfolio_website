import React from "react";

interface LoadingSpinnerProps {
  variant?: "default" | "gradient" | "wave" | "dots";
  size?: "small" | "medium" | "large";
  text?: string;
  showText?: boolean;
  fullHeight?: boolean;
}

export default function LoadingSpinner({
  variant = "default",
  size = "medium",
  text = "Loading...",
  showText = true,
  fullHeight = false,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    small: "w-6 h-6",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  };

  const textSizes = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  };

  const renderSpinner = () => {
    switch (variant) {
      case "gradient":
        return (
          <div
            className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-200 border-t-blue-600`}
          />
        );
      case "wave":
        return (
          <div className="flex space-x-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`${sizeClasses[size]} bg-blue-600 rounded-full animate-pulse`}
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: "1s",
                }}
              />
            ))}
          </div>
        );
      case "dots":
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`${sizeClasses[size]} bg-gray-600 rounded-full animate-bounce`}
                style={{
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        );
      default:
        return (
          <div
            className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-blue-600`}
          />
        );
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center space-y-4 ${
        fullHeight ? "min-h-screen" : ""
      }`}
    >
      {renderSpinner()}
      {showText && (
        <p className={`text-gray-600 ${textSizes[size]} font-medium`}>{text}</p>
      )}
    </div>
  );
}

// Named export for backward compatibility
export { LoadingSpinner };
