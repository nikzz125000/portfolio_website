import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCustomerConnect } from "../api/useCustomerConnect";
import { useResumeDetails } from "../api/useResumeDetails";
import { createPortal } from "react-dom";

const Icon = {
  LinkedIn: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M4.983 3.5C4.983 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.483 1.12 2.483 2.5zM.3 8.1h4.4V24H.3V8.1zm7.2 0h4.215v2.17h.06c.587-1.113 2.022-2.29 4.163-2.29 4.452 0 5.273 2.93 5.273 6.737V24H16.5v-6.94c0-1.656-.03-3.784-2.307-3.784-2.31 0-2.664 1.805-2.664 3.668V24H7.5V8.1z" />
    </svg>
  ),
  Instagram: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2.2c3.2 0 3.584.012 4.85.07 1.17.054 1.97.24 2.43.4a4.9 4.9 0 0 1 1.77 1.15 4.9 4.9 0 0 1 1.15 1.77c.16.46.346 1.26.4 2.43.058 1.266.07 1.65.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.24 1.97-.4 2.43a4.9 4.9 0 0 1-1.15 1.77 4.9 4.9 0 0 1-1.77 1.15c-.46.16-1.26.346-2.43.4-1.266.058-1.65.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.97-.24-2.43-.4a4.9 4.9 0 0 1-1.77-1.15 4.9 4.9 0 0 1-1.15-1.77c-.16-.46-.346-1.26-.4-2.43C2.212 15.584 2.2 15.2 2.2 12s.012-3.584.07-4.85c.054-1.17.24-1.97.4-2.43A4.9 4.9 0 0 1 3.82 2.95 4.9 4.9 0 0 1 5.59 1.8c.46-.16 1.26-.346 2.43-.4C9.284 1.342 9.668 1.33 12 1.33zm0 1.8c-3.16 0-3.535.012-4.78.07-.99.046-1.528.21-1.883.35-.474.184-.81.404-1.165.758-.354.355-.574.691-.758 1.165-.14.355-.304.893-.35 1.883-.058 1.245-.07 1.62-.07 4.78s.012 3.535.07 4.78c.046.99.21 1.528.35 1.883.184.474.404.81.758 1.165.355.354.691.574 1.165.758.355.14.893.304 1.883.35 1.245.058 1.62.07 4.78.07s3.535-.012 4.78-.07c.99-.046 1.528-.21 1.883-.35.474-.184.81-.404 1.165-.758.354-.355.574-.691.758-1.165.14-.355.304-.893.35-1.883.058-1.245.07-1.62.07-4.78s-.012-3.535-.07-4.78c-.046-.99-.21-1.528-.35-1.883a3.1 3.1 0 0 0-.758-1.165 3.1 3.1 0 0 0-1.165-.758c-.355-.14-.893-.304-1.883-.35-1.245-.058-1.62-.07-4.78-.07zm0 3.3a4.7 4.7 0 1 1 0 9.4 4.7 4.7 0 0 1 0-9.4zm0 1.8a2.9 2.9 0 1 0 0 5.8 2.9 2.9 0 0 0 0-5.8zm5.95-3.1a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2z" />
    </svg>
  ),
  Behance: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M22 7h-5V5h5v2zM9.6 11.2c.9-.4 1.4-1.1 1.4-2.2C11 6.9 9.9 6 8 6H3v12h5.2c2.3 0 3.8-1.1 3.8-3.2 0-1.4-.6-2.3-1.4-2.6zM6 8.5h2c.9 0 1.4.4 1.4 1.1S8.9 10.8 8 10.8H6V8.5zm2.2 7H6v-2.6h2.2c1 0 1.6.5 1.6 1.3s-.6 1.3-1.6 1.3zM21.9 13.5c-.2-1.9-1.6-3.3-3.9-3.3-2.6 0-4.2 1.8-4.2 4.3 0 2.6 1.7 4.3 4.4 4.3 2 0 3.4-1 3.8-2.7h-2.1c-.2.6-.8 1-1.7 1-1.1 0-1.9-.8-2-2h5.7c0-.2 0-.4 0-.6zm-5.7-1.1c.2-1 1-1.6 1.9-1.6 1 0 1.7.6 1.9 1.6h-3.8z" />
    </svg>
  ),
  Globe: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm7.93 9h-3.18a15.9 15.9 0 00-1.2-5.01A8.02 8.02 0 0119.93 11zM12 4c.9 0 2.2 1.8 2.8 5H9.2c.6-3.2 1.9-5 2.8-5zM6.45 14a13.7 13.7 0 010-4h11.1a13.7 13.7 0 010 4H6.45zM8.45 18a15.9 15.9 0 01-1.2-5h9.5a15.9 15.9 0 01-1.2 5A8.02 8.02 0 0112 20a8.02 8.02 0 01-3.55-2zM8.45 5.99A15.9 15.9 0 007.25 11H4.07A8.02 8.02 0 018.45 6zM4.07 13h3.18a15.9 15.9 0 001.2 5.01A8.02 8.02 0 014.07 13z" />
    </svg>
  ),
  ResumeDoc: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zm0 0v6h6" />
    </svg>
  ),
};

interface FooterProps {
  deviceType?: "mobile" | "tablet" | "desktop";
  variant?: "homepage" | "project-details";
  onResumeClick?: () => void;
}

const Footer: React.FC<FooterProps> = ({
  deviceType = "desktop",
  variant = "homepage",
  onResumeClick,
}) => {
  const [showConnectForm, setShowConnectForm] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const navigate = useNavigate();
  const { mutate: customerConnect, isPending: isConnecting } =
    useCustomerConnect();
  const { data: resumeData } = useResumeDetails();

  // State to track if modal should be rendered
  const [modalContainer, setModalContainer] = useState<HTMLElement | null>(
    null
  );

  // Handle connect form submission
  const handleConnectSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Reset previous errors
    setFormErrors({});

    // Validation
    const errors: { [key: string]: string } = {};

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Please enter a valid email address";
    }

    // Only validate mobile and message for homepage variant
    if (variant === "homepage") {
      if (!mobileNumber.trim()) {
        errors.mobileNumber = "Mobile number is required";
      } else if (!/^[0-9]{10,15}$/.test(mobileNumber.trim())) {
        errors.mobileNumber = "Please enter a valid mobile number";
      }

      if (!message.trim()) {
        errors.message = "Message is required";
      } else if (message.trim().length < 10) {
        errors.message = "Message must be at least 10 characters long";
      }
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Submit form
    const payload = {
      mobileNumber: mobileNumber.trim(),
      email: email.trim(),
      message: message.trim(),
    };

    customerConnect(payload, {
      onSuccess: (response) => {
        if (response.isSuccess) {
          setFormSubmitted(true);
          // Reset form
          setEmail("");
          setMobileNumber("");
          setMessage("");
          setFormErrors({});

          // Close form after 3 seconds
          setTimeout(() => {
            setShowConnectForm(false);
            setFormSubmitted(false);
          }, 3000);
        }
      },
      onError: (error) => {
        console.error("Connect API error:", error);
        setFormErrors({ general: "Failed to send message. Please try again." });
      },
    });
  };

  // Handle connect button click
  const handleConnectClick = () => {
    setShowConnectForm(true);
    // Pre-fill email if available from resume data
    if (resumeData?.data?.email) {
      setEmail(resumeData.data.email);
    }
    // Reset other fields
    setMobileNumber("");
    setMessage("");
    setFormErrors({});
    setFormSubmitted(false);
  };

  // Handle resume click
  const handleResumeClick = () => {
    if (onResumeClick) {
      onResumeClick();
    } else {
      navigate("/resume");
    }
  };

  // Set up modal container
  useEffect(() => {
    let container = document.getElementById("modal-root");
    if (!container) {
      container = document.createElement("div");
      container.id = "modal-root";
      document.body.appendChild(container);
    }
    setModalContainer(container);

    return () => {
      // Clean up if this is the last Footer component
      if (container && container.childNodes.length === 0) {
        document.body.removeChild(container);
      }
    };
  }, []);

  // Responsive dimensions
  const getResponsiveDimensions = () => {
    switch (deviceType) {
      case "mobile":
        return {
          height: "340px",
          padding: "56px 20px",
          flexDirection: "column" as const,
          justifyContent: "center" as const,
          gap: "30px",
          logoSize: "36px",
          textSize: "12px",
          buttonPadding: "10px 24px",
          buttonFontSize: "14px",
        };
      case "tablet":
        return {
          height: "280px",
          padding: "24px 40px",
          flexDirection: "row" as const,
          justifyContent: "space-between" as const,
          gap: "0",
          logoSize: "42px",
          textSize: "13px",
          buttonPadding: "11px 28px",
          buttonFontSize: "15px",
        };
      default: // desktop
        return {
          height: "240px",
          padding: "28px 60px",
          flexDirection: "row" as const,
          justifyContent: "space-between" as const,
          gap: "0",
          logoSize: "48px",
          textSize: "14px",
          buttonPadding: "12px 32px",
          buttonFontSize: "16px",
        };
    }
  };

  const dimensions = getResponsiveDimensions();

  return (
    <>
      {/* Footer Section */}
      <footer
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100vw",
          height: dimensions.height,
          background:
            "linear-gradient(135deg, #9f4f96 0%, #ff6b6b 30%, #ff8e53 100%)",
          display: "flex",
          flexDirection: dimensions.flexDirection,
          alignItems: "center",
          justifyContent: dimensions.justifyContent,
          padding: dimensions.padding,
          color: "white",
          zIndex: 1000,
          gap: dimensions.gap,
        }}
      >
        {/* Left side - Heart logo and text */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: deviceType === "mobile" ? "center" : "flex-start",
            textAlign: deviceType === "mobile" ? "center" : "left",
            paddingBottom: 20,
          }}
        >
          <div
            style={{
              fontSize: dimensions.logoSize,
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
            }}
          >
            ♥
          </div>
          <div
            style={{
              fontSize: dimensions.textSize,
              lineHeight: "1.4",
              color: "rgba(255,255,255,0.9)",
              maxWidth: "200px",
            }}
          >
            <div style={{ fontWeight: "600", marginBottom: "2px" }}>
              Get in Touch
            </div>
            {resumeData?.data ? (
              <>
                <div>
                  {resumeData.data.location || "Location not available"}
                </div>
                <div>{resumeData.data.phone || "Phone not available"}</div>
                <div>{resumeData.data.email || "Email not available"}</div>
                <div
                  style={{ display: "flex", gap: "10px", marginTop: "10px" }}
                >
                  <a
                    href="/resume"
                    onClick={(e) => {
                      e.preventDefault();
                      handleResumeClick();
                    }}
                    aria-label="Resume"
                    title="View Resume"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 24,
                      height: 24,
                      color: "#ffffff",
                      position: "relative",
                    }}
                  >
                    <Icon.ResumeDoc width={20} height={20} />
                    <span
                      style={{
                        position: "absolute",
                        top: -6,
                        right: -8,
                        background: "rgba(255,255,255,0.95)",
                        color: "#111827",
                        borderRadius: 8,
                        padding: "1px 4px",
                        fontSize: 8,
                        fontWeight: 800,
                        lineHeight: "10px",
                        letterSpacing: 0.4,
                        boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
                        textTransform: "uppercase",
                        pointerEvents: "none",
                        userSelect: "none",
                      }}
                    >
                      CV
                    </span>
                  </a>
                  {resumeData.data.websiteUrl && (
                    <a
                      href={resumeData.data.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Website"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 24,
                        height: 24,
                        color: "#ffffff",
                      }}
                    >
                      <Icon.Globe width={20} height={20} />
                    </a>
                  )}
                  {resumeData.data.linkedinUrl && (
                    <a
                      href={resumeData.data.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="LinkedIn"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 24,
                        height: 24,
                        color: "#ffffff",
                      }}
                    >
                      <Icon.LinkedIn width={20} height={20} />
                    </a>
                  )}
                  {resumeData.data.instagramUrl && (
                    <a
                      href={resumeData.data.instagramUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Instagram"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 24,
                        height: 24,
                        color: "#ffffff",
                      }}
                    >
                      <Icon.Instagram width={20} height={20} />
                    </a>
                  )}
                  {resumeData.data.behanceUrl && (
                    <a
                      href={resumeData.data.behanceUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Behance"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 24,
                        height: 24,
                        color: "#ffffff",
                      }}
                    >
                      <Icon.Behance width={20} height={20} />
                    </a>
                  )}
                </div>
              </>
            ) : (
              <>
                <div>Loading contact information...</div>
                <div>Please wait...</div>
                <div>...</div>
              </>
            )}
          </div>
        </div>

        {/* Right side - Connect button */}
        <div>
          <button
            className="connect-button"
            onClick={handleConnectClick}
            style={{
              padding: dimensions.buttonPadding,
              fontSize: dimensions.buttonFontSize,
              background: "rgba(255, 255, 255, 0.2)",
              border: "2px solid rgba(255, 255, 255, 0.8)",
              borderRadius: "25px",
              color: "white",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              backdropFilter: "blur(10px)",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.2)";
            }}
          >
            CONNECT
          </button>
        </div>
      </footer>

      {/* Connect Form Modal - Rendered via Portal */}
      {showConnectForm &&
        modalContainer &&
        createPortal(
          <div
            className="connect-modal"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              zIndex: 9999,
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowConnectForm(false);
              }
            }}
          >
            <div
              className="connect-form"
              style={{
                position: "relative",
                zIndex: 10000,
                margin: "auto",
              }}
            >
              {!formSubmitted ? (
                <form onSubmit={handleConnectSubmit}>
                  <h2>Let's Connect!</h2>
                  <p>
                    {variant === "homepage"
                      ? "Fill out the form below and we'll get back to you soon."
                      : "Enter your email address and we'll get in touch with you soon."}
                  </p>

                  {formErrors.general && (
                    <div className="error-message general-error">
                      {formErrors.general}
                    </div>
                  )}

                  <div className="form-group">
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`email-input ${
                        formErrors.email ? "error" : ""
                      }`}
                      required
                    />
                    {formErrors.email && (
                      <div className="error-message">{formErrors.email}</div>
                    )}
                  </div>

                  {
                    <>
                      <div className="form-group">
                        <input
                          type="tel"
                          placeholder="Enter your mobile number"
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value)}
                          className={`mobile-input ${
                            formErrors.mobileNumber ? "error" : ""
                          }`}
                          required
                        />
                        {formErrors.mobileNumber && (
                          <div className="error-message">
                            {formErrors.mobileNumber}
                          </div>
                        )}
                      </div>

                      <div className="form-group">
                        <textarea
                          placeholder="Enter your message (minimum 10 characters)"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className={`message-input ${
                            formErrors.message ? "error" : ""
                          }`}
                          rows={4}
                          required
                        />
                        {formErrors.message && (
                          <div className="error-message">
                            {formErrors.message}
                          </div>
                        )}
                      </div>
                    </>
                  }

                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={isConnecting}
                  >
                    {isConnecting ? "Sending..." : "Send Message"}
                  </button>

                  <button
                    type="button"
                    className="close-btn"
                    onClick={() => setShowConnectForm(false)}
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <div className="success-container">
                  <div className="success-icon">✓</div>
                  <h2>Message Sent Successfully!</h2>
                  <p className="success-message">
                    Thank you for your message. We'll get back to you soon!
                  </p>
                  <p className="closing-note">
                    This form will close automatically in a few seconds.
                  </p>
                </div>
              )}
            </div>
          </div>,
          modalContainer
        )}

      <style>
        {`
          .connect-button {
            background: rgba(255, 255, 255, 0.2) !important;
            border: 2px solid rgba(255, 255, 255, 0.8) !important;
            border-radius: 25px !important;
            color: white !important;
            font-weight: 600 !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
            backdrop-filter: blur(10px) !important;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2) !important;
            text-transform: uppercase !important;
            letter-spacing: 1px !important;
          }

          .connect-button:hover {
            background: rgba(255, 255, 255, 0.3) !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3) !important;
          }

          .connect-modal {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            background: rgba(0, 0, 0, 0.8) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            z-index: 9999 !important;
            animation: fadeIn 0.3s ease-out !important;
            backdrop-filter: blur(5px) !important;
          }

          .connect-form {
            background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.9)) !important;
            backdrop-filter: blur(20px) !important;
            border-radius: 20px !important;
            padding: 40px !important;
            max-width: 400px !important;
            width: 90% !important;
            text-align: center !important;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3) !important;
            animation: zoomIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
            position: relative !important;
            z-index: 10000 !important;
            margin: auto !important;
          }

          .connect-form h2 {
            margin: 0 0 20px 0;
            color: #2d3748;
            font-size: 28px;
            font-weight: 700;
          }

          .connect-form p {
            margin: 0 0 30px 0;
            color: #4a5568;
            font-size: 16px;
            line-height: 1.5;
          }

          .form-group {
            margin-bottom: 20px;
          }

          .email-input,
          .mobile-input,
          .message-input {
            width: 100%;
            padding: 15px 20px;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            font-size: 16px;
            transition: all 0.3s ease;
            box-sizing: border-box;
          }

          .email-input:focus,
          .mobile-input:focus,
          .message-input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          }

          .email-input.error,
          .mobile-input.error,
          .message-input.error {
            border-color: #e53e3e;
          }

          .submit-btn {
            width: 100%;
            padding: 15px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-bottom: 15px;
          }

          .submit-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
          }

          .submit-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
          }

          .close-btn {
            background: none;
            border: none;
            color: #718096;
            cursor: pointer;
            font-size: 14px;
            padding: 10px;
            transition: color 0.3s ease;
          }

          .close-btn:hover {
            color: #2d3748;
          }

          .error-message {
            color: #e53e3e;
            font-size: 14px;
            margin-top: 5px;
            text-align: left;
          }

          .success-container {
            text-align: center;
          }

          .success-icon {
            font-size: 48px;
            color: #38a169;
            margin-bottom: 20px;
          }

          .success-message {
            color: #38a169;
            font-weight: 600;
            margin-bottom: 10px;
          }

          .closing-note {
            color: #718096;
            font-size: 14px;
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes zoomIn {
            from { 
              opacity: 0;
              transform: scale(0.9);
            }
            to { 
              opacity: 1;
              transform: scale(1);
            }
          }

          @media (max-width: 768px) {
            .connect-modal {
              padding: 20px !important;
            }
            
            .connect-form {
              padding: 30px 20px !important;
              margin: 0 10px !important;
              max-width: 90vw !important;
              width: 95% !important;
            }
            
            .connect-form h2 {
              font-size: 24px !important;
            }
            
            .connect-form p {
              font-size: 14px !important;
            }
            
            .email-input,
            .mobile-input,
            .message-input {
              padding: 12px 16px !important;
              font-size: 14px !important;
            }
            
            .submit-btn {
              padding: 12px !important;
              font-size: 14px !important;
            }
          }

          /* Ensure modal is always on top and properly positioned */
          .connect-modal {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            width: 100% !important;
            height: 100% !important;
            z-index: 9999 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            overflow: hidden !important;
            transform: none !important;
            will-change: auto !important;
          }

          /* Ensure form is properly centered */
          .connect-form {
            position: relative !important;
            z-index: 10000 !important;
            margin: auto !important;
            max-height: 90vh !important;
            overflow-y: auto !important;
            transform: none !important;
          }

          /* Additional positioning fixes for different browsers */
          @supports (-webkit-overflow-scrolling: touch) {
            .connect-modal {
              -webkit-overflow-scrolling: touch !important;
            }
          }

          /* Fix for iOS Safari */
          @media screen and (-webkit-min-device-pixel-ratio: 0) {
            .connect-modal {
              position: fixed !important;
              -webkit-transform: translateZ(0) !important;
            }
          }

          /* Ensure modal container is properly positioned */
          #modal-root {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            z-index: 9999 !important;
            pointer-events: none !important;
          }

          #modal-root .connect-modal {
            pointer-events: auto !important;
          }
        `}
      </style>
    </>
  );
};

export default Footer;
