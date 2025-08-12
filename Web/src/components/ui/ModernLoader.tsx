import React from "react";

interface ModernLoaderProps {
  size?: "small" | "medium" | "large";
  variant?: "default" | "pulse" | "wave" | "dots" | "gradient";
  className?: string;
}

const ModernLoader: React.FC<ModernLoaderProps> = ({
  size = "medium",
  variant = "default",
  className = "",
}) => {
  const sizeMap = {
    small: { width: "32px", height: "32px", border: "2px", inner: "4px" },
    medium: { width: "48px", height: "48px", border: "3px", inner: "6px" },
    large: { width: "64px", height: "64px", border: "4px", inner: "8px" },
  };

  const renderLoader = () => {
    switch (variant) {
      case "pulse":
        return (
          <div style={{ ...sizeMap[size], position: "relative" }}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, #9f4f96 0%, #ff6b6b 30%, #ff8e53 100%)",
                animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: sizeMap[size].inner,
                borderRadius: "50%",
                background: "white",
                animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: `calc(${sizeMap[size].inner} * 2)`,
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, #9f4f96 0%, #ff6b6b 30%, #ff8e53 100%)",
                animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
              }}
            />
          </div>
        );

      case "wave":
        return (
          <div
            style={{
              ...sizeMap[size],
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
            }}
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  width: "3px",
                  height:
                    size === "small"
                      ? "12px"
                      : size === "medium"
                      ? "16px"
                      : "20px",
                  background:
                    "linear-gradient(135deg, #9f4f96 0%, #ff6b6b 30%, #ff8e53 100%)",
                  borderRadius: "2px",
                  animation: "wave 1.2s ease-in-out infinite",
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        );

      case "dots":
        return (
          <div
            style={{
              ...sizeMap[size],
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: "8px",
                  height: "8px",
                  background:
                    "linear-gradient(135deg, #9f4f96 0%, #ff6b6b 30%, #ff8e53 100%)",
                  borderRadius: "50%",
                  animation: "bounce 1.4s ease-in-out infinite",
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        );

      case "gradient":
        return (
          <div style={{ ...sizeMap[size], position: "relative" }}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background:
                  "conic-gradient(from 0deg, #9f4f96, #ff6b6b, #ff8e53, #9f4f96)",
                animation: "rotate 2s linear infinite",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: "4px",
                borderRadius: "50%",
                background: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #9f4f96 0%, #ff6b6b 30%, #ff8e53 100%)",
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
            </div>
          </div>
        );

      default:
        return (
          <div style={{ ...sizeMap[size], position: "relative" }}>
            {/* Outer ring */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: `${sizeMap[size].border} solid transparent`,
                borderTop: `${sizeMap[size].border} solid #9f4f96`,
                borderRight: `${sizeMap[size].border} solid #ff6b6b`,
                borderBottom: `${sizeMap[size].border} solid #ff8e53`,
                borderLeft: `${sizeMap[size].border} solid #9f4f96`,
                animation: "spin 1s linear infinite",
              }}
            />

            {/* Inner ring */}
            <div
              style={{
                position: "absolute",
                inset: sizeMap[size].inner,
                borderRadius: "50%",
                border: `${sizeMap[size].border} solid transparent`,
                borderTop: `${sizeMap[size].border} solid #ff6b6b`,
                borderRight: `${sizeMap[size].border} solid #ff8e53`,
                borderBottom: `${sizeMap[size].border} solid #9f4f96`,
                borderLeft: `${sizeMap[size].border} solid #ff6b6b`,
                animation: "spin 1.5s linear infinite reverse",
              }}
            />

            {/* Center dot */}
            <div
              style={{
                position: "absolute",
                inset: `calc(${sizeMap[size].inner} * 2)`,
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, #9f4f96 0%, #ff6b6b 30%, #ff8e53 100%)",
                animation: "pulse 2s ease-in-out infinite",
              }}
            />
          </div>
        );
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      className={className}
    >
      {renderLoader()}
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          @keyframes wave {
            0%, 40%, 100% { transform: scaleY(0.4); }
            20% { transform: scaleY(1); }
          }
          @keyframes bounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
          }
          @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default ModernLoader;
