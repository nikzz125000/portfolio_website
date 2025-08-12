import React, { useState } from "react";
import ModernLoader from "../components/ui/ModernLoader";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const LoaderDemo: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<
    "default" | "pulse" | "wave" | "dots" | "gradient"
  >("default");
  const [selectedSize, setSelectedSize] = useState<
    "small" | "medium" | "large"
  >("medium");

  const simulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 3000);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "2rem",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1
          style={{
            textAlign: "center",
            marginBottom: "2rem",
            background:
              "linear-gradient(135deg, #9f4f96 0%, #ff6b6b 30%, #ff8e53 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontSize: "2.5rem",
          }}
        >
          Loader Components Demo
        </h1>

        {/* Interactive Demo */}
        <div
          style={{
            background: "white",
            padding: "2rem",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            marginBottom: "2rem",
          }}
        >
          <h2 style={{ marginBottom: "1rem", color: "#333" }}>
            Interactive Demo
          </h2>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              marginBottom: "1rem",
              flexWrap: "wrap",
            }}
          >
            <select
              value={selectedVariant}
              onChange={(e) => setSelectedVariant(e.target.value as any)}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
            >
              <option value="default">Default</option>
              <option value="pulse">Pulse</option>
              <option value="wave">Wave</option>
              <option value="dots">Dots</option>
              <option value="gradient">Gradient</option>
            </select>

            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value as any)}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>

            <button
              onClick={simulateLoading}
              disabled={isLoading}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                background:
                  "linear-gradient(135deg, #9f4f96 0%, #ff6b6b 30%, #ff8e53 100%)",
                color: "white",
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              {isLoading ? "Loading..." : "Simulate Loading"}
            </button>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "200px",
              background: "#f8f9fa",
              borderRadius: "12px",
              border: "2px dashed #dee2e6",
            }}
          >
            {isLoading ? (
              <div style={{ textAlign: "center" }}>
                <ModernLoader variant={selectedVariant} size={selectedSize} />
                <p style={{ marginTop: "1rem", color: "#666" }}>
                  Loading in progress...
                </p>
              </div>
            ) : (
              <div style={{ textAlign: "center", color: "#666" }}>
                <p>Click "Simulate Loading" to see the loader in action</p>
                <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
                  Current: {selectedVariant} - {selectedSize}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* All Variants Showcase */}
        <div
          style={{
            background: "white",
            padding: "2rem",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            marginBottom: "2rem",
          }}
        >
          <h2 style={{ marginBottom: "1.5rem", color: "#333" }}>
            All Loader Variants
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {(["default", "pulse", "wave", "dots", "gradient"] as const).map(
              (variant) => (
                <div
                  key={variant}
                  style={{
                    textAlign: "center",
                    padding: "1.5rem",
                    background: "#f8f9fa",
                    borderRadius: "12px",
                    border: "1px solid #e9ecef",
                  }}
                >
                  <h3
                    style={{
                      marginBottom: "1rem",
                      color: "#555",
                      textTransform: "capitalize",
                    }}
                  >
                    {variant}
                  </h3>
                  <ModernLoader variant={variant} size="medium" />
                </div>
              )
            )}
          </div>
        </div>

        {/* Size Variations */}
        <div
          style={{
            background: "white",
            padding: "2rem",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            marginBottom: "2rem",
          }}
        >
          <h2 style={{ marginBottom: "1.5rem", color: "#333" }}>
            Size Variations
          </h2>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "3rem",
              flexWrap: "wrap",
            }}
          >
            {(["small", "medium", "large"] as const).map((size) => (
              <div key={size} style={{ textAlign: "center" }}>
                <h3
                  style={{
                    marginBottom: "1rem",
                    color: "#555",
                    textTransform: "capitalize",
                  }}
                >
                  {size}
                </h3>
                <ModernLoader variant="default" size={size} />
              </div>
            ))}
          </div>
        </div>

        {/* LoadingSpinner Component */}
        <div
          style={{
            background: "white",
            padding: "2rem",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ marginBottom: "1.5rem", color: "#333" }}>
            LoadingSpinner Component
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1.5rem",
            }}
          >
            <div
              style={{
                textAlign: "center",
                padding: "1.5rem",
                background: "#f8f9fa",
                borderRadius: "12px",
              }}
            >
              <h3 style={{ marginBottom: "1rem", color: "#555" }}>With Text</h3>
              <LoadingSpinner
                variant="gradient"
                size="medium"
                text="Loading your content..."
              />
            </div>

            <div
              style={{
                textAlign: "center",
                padding: "1.5rem",
                background: "#f8f9fa",
                borderRadius: "12px",
              }}
            >
              <h3 style={{ marginBottom: "1rem", color: "#555" }}>
                Without Text
              </h3>
              <LoadingSpinner variant="wave" size="large" showText={false} />
            </div>

            <div
              style={{
                textAlign: "center",
                padding: "1.5rem",
                background: "#f8f9fa",
                borderRadius: "12px",
              }}
            >
              <h3 style={{ marginBottom: "1rem", color: "#555" }}>
                Small Size
              </h3>
              <LoadingSpinner
                variant="dots"
                size="small"
                text="Processing..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoaderDemo;
