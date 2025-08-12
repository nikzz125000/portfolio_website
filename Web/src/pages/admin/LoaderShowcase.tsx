import React from "react";
import ModernLoader from "../../components/ui/ModernLoader";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

const LoaderShowcase: React.FC = () => {
  const loaderVariants = [
    {
      name: "Default",
      variant: "default",
      description: "Classic spinning rings with gradient borders",
    },
    {
      name: "Pulse",
      variant: "pulse",
      description: "Elegant pulsing circles with layered effect",
    },
    {
      name: "Wave",
      variant: "wave",
      description: "Smooth wave animation with gradient bars",
    },
    {
      name: "Dots",
      variant: "dots",
      description: "Bouncing dots with staggered timing",
    },
    {
      name: "Gradient",
      variant: "gradient",
      description: "Rotating gradient with pulsing center",
    },
  ];

  const sizes = ["small", "medium", "large"] as const;

  return (
    <div className="loader-showcase">
      <div
        style={{
          gridColumn: "1 / -1",
          textAlign: "center",
          marginBottom: "2rem",
          padding: "2rem",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            marginBottom: "1rem",
            background:
              "linear-gradient(135deg, #9f4f96 0%, #ff6b6b 30%, #ff8e53 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Modern Loader Components
        </h1>
        <p
          style={{
            fontSize: "1.1rem",
            color: "#666",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          Professional, modern, and creative loading animations that match your
          project's design aesthetic. Choose from multiple variants and sizes to
          fit any use case.
        </p>
      </div>

      {/* Individual Loader Variants */}
      {loaderVariants.map((loader) => (
        <div key={loader.variant} className="loader-item">
          <h3>{loader.name}</h3>
          <ModernLoader variant={loader.variant as any} size="medium" />
          <p>{loader.description}</p>
        </div>
      ))}

      {/* Size Variations */}
      <div style={{ gridColumn: "1 / -1", marginTop: "2rem" }}>
        <h2
          style={{
            textAlign: "center",
            marginBottom: "2rem",
            color: "#333",
          }}
        >
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
          {sizes.map((size) => (
            <div key={size} style={{ textAlign: "center" }}>
              <h3 style={{ marginBottom: "1rem", color: "#555" }}>
                {size.charAt(0).toUpperCase() + size.slice(1)}
              </h3>
              <ModernLoader variant="default" size={size} />
            </div>
          ))}
        </div>
      </div>

      {/* LoadingSpinner Component */}
      <div style={{ gridColumn: "1 / -1", marginTop: "2rem" }}>
        <h2
          style={{
            textAlign: "center",
            marginBottom: "2rem",
            color: "#333",
          }}
        >
          LoadingSpinner Component
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2rem",
            maxWidth: "900px",
            margin: "0 auto",
          }}
        >
          <div className="loader-item">
            <h3>With Text</h3>
            <LoadingSpinner
              variant="gradient"
              size="medium"
              text="Loading your content..."
            />
          </div>
          <div className="loader-item">
            <h3>Without Text</h3>
            <LoadingSpinner variant="wave" size="large" showText={false} />
          </div>
          <div className="loader-item">
            <h3>Small Size</h3>
            <LoadingSpinner variant="dots" size="small" text="Processing..." />
          </div>
        </div>
      </div>

      {/* Usage Examples */}
      <div style={{ gridColumn: "1 / -1", marginTop: "2rem", padding: "2rem" }}>
        <h2
          style={{
            textAlign: "center",
            marginBottom: "2rem",
            color: "#333",
          }}
        >
          Usage Examples
        </h2>
        <div
          style={{
            background: "#f8f9fa",
            padding: "2rem",
            borderRadius: "12px",
            fontFamily: "monospace",
            fontSize: "0.9rem",
            overflowX: "auto",
          }}
        >
          <pre style={{ margin: 0 }}>
            {`// Basic usage
<ModernLoader />

// With custom size and variant
<ModernLoader size="large" variant="gradient" />

// LoadingSpinner component
<LoadingSpinner 
  variant="wave" 
  size="medium" 
  text="Loading data..."
  fullHeight={true}
/>

// Inline loading
<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
  <ModernLoader size="small" variant="dots" />
  <span>Processing...</span>
</div>`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default LoaderShowcase;
