import React from "react";

interface ModernLoaderProps {
  variant?: "default" | "gradient" | "pulse" | "bounce";
  size?: "small" | "medium" | "large";
  text?: string;
  showText?: boolean;
  fullHeight?: boolean;
}

export default function ModernLoader({
  variant = "default",
  size = "medium",
  text = "Loading...",
  showText = true,
  fullHeight = false,
}: ModernLoaderProps) {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-6 h-6",
    large: "w-8 h-8",
  };

  const textSizes = {
    small: "text-xs",
    medium: "text-sm",
    large: "text-base",
  };

  const renderLoader = () => {
    switch (variant) {
      case "gradient":
        return (
          <div className="relative">
            <div
              className={`${sizeClasses[size]} animate-spin rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500`}
            />
            <div
              className={`${sizeClasses[size]} animate-spin rounded-full bg-gradient-to-r from-transparent via-white to-transparent absolute inset-0`}
            />
          </div>
        );
      case "pulse":
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`${sizeClasses[size]} bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse`}
                style={{
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        );
      case "bounce":
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`${sizeClasses[size]} bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-bounce`}
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
            className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-gradient-to-r border-t-blue-500`}
          />
        );
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center space-y-3 ${
        fullHeight ? "min-h-screen" : ""
      }`}
    >
      {renderLoader()}
      {showText && (
        <p className={`text-gray-500 ${textSizes[size]} font-medium`}>{text}</p>
      )}
    </div>
  );
}
