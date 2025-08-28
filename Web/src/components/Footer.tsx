


import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { useCustomerConnect } from "../api/useCustomerConnect";
import { useResumeDetails } from "../api/useResumeDetails";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { useGetBackgroundColor } from "../api/webSettings/useGetBackgroundColor";

interface FooterProps {
  deviceType?: "mobile" | "tablet" | "desktop";
  variant?: "homepage" | "project-details";
  onResumeClick?: () => void;
  className?: string;
}

const Footer: React.FC<FooterProps> = ({
  deviceType = "desktop",
  variant = "homepage",
  // onResumeClick,
  className,
}) => {
  const [showConnectForm, setShowConnectForm] = useState<boolean>(false);
  const [animationComplete, setAnimationComplete] = useState<boolean>(false);
  const [isInView, setIsInView] = useState<boolean>(false);
  
  // Refs for dynamic layout calculations
  const footerRef = useRef<HTMLElement | null>(null);
  const iconBoxRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [linePoints, setLinePoints] = useState<{
    x1: number;
    x2: number;
    y: number;
  }>({ x1: 0, x2: 0, y: 0 });
  const [email, setEmail] = useState<string>("");
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [buttonYOffset, setButtonYOffset] = useState<number>(0);
  
  // UI tweak offsets (px)
  const LINE_Y_OFFSET = 8;
  const ICON_Y_OFFSET = 28;
  const LINE_TRIM_PX = 1;
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // const navigate = useNavigate();
  const { mutate: customerConnect, isPending: isConnecting } = useCustomerConnect();
  const { data: resumeData } = useResumeDetails();

  // State to track if modal should be rendered
  const [modalContainer, setModalContainer] = useState<HTMLElement | null>(null);

  // Animation variants
  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const logoVariants = {
    initial: {
      x: deviceType === "mobile" ? 0 : "200%",
      y: deviceType === "mobile" ? 0 : 0,
      opacity: 0,
      scale: 0.8,
    },
    animate: {
      x: 0,
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 20,
        duration: 1.2,
      },
    },
  };

  const buttonVariants = {
    initial: {
      x: deviceType === "mobile" ? 0 : "-200%",
      y: deviceType === "mobile" ? 0 : 0,
      opacity: 0,
      scale: 0.8,
    },
    animate: {
      x: 0,
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 20,
        duration: 1.2,
      },
    },
  };

  const lineVariants = {
    initial: {
      pathLength: 0,
      opacity: 0,
    },
    animate: {
      pathLength: 1,
      opacity: 0.92,
      transition: {
        delay: 0.1,
        duration: 0.2,
         type: "tween" as const,
      },
    },
  };

   const [backgroundColors, setBackgroundColors] = useState('linear-gradient(90deg, #6e226e 0%, #a5206a 14%, #d31663 28%, #ed3176 42%, #fd336b 56%, #f23d64 70%, #f65d55 84%, #f5655d 100%)')

 const { data: backgroundColor } = useGetBackgroundColor('footer');

     useEffect(() => {
      if(backgroundColor?.data){
        setBackgroundColors(backgroundColor?.data?.backgroundColor)
      }
     }, [backgroundColor])

  // Handle email click - opens email client with prefilled address
  const handleEmailClick = (emailAddress: string) => {
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${emailAddress}`, "_blank");
  };

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

  // Handle resume click
  // const handleResumeClick = () => {
  //   if (onResumeClick) {
  //     onResumeClick();
  //   } else {
  //     navigate("/resume");
  //   }
  // };

  // Set up intersection observer for scroll-triggered animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          // Footer is entering the viewport
          setIsInView(true);
          setAnimationComplete(false); // Reset animation state
        } else {
          // Footer is leaving the viewport
          setIsInView(false);
          setAnimationComplete(false); // Reset for next time
        }
      },
      {
        threshold: 0.2, // Trigger when 20% of the footer is visible
        rootMargin: '0px 0px -10% 0px' // Start animation slightly before footer is fully visible
      }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
    };
  }, []);

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
// Replace the getResponsiveDimensions function in your Footer component with this:

const getResponsiveDimensions = () => {
  switch (deviceType) {
    case "mobile":
      return {
        height: "240px", // Reduced from 340px
        padding: "20px 20px", // Reduced from 56px 20px
        flexDirection: "column" as const,
        justifyContent: "center" as const,
        gap: "15px", // Reduced from 30px
        logoSize: "36px",
        textSize: "12px",
        buttonPadding: "10px 24px",
        buttonFontSize: "14px",
      };
    case "tablet":
      return {
        height: "150px", // Reduced from 280px
        padding: "16px 40px", // Reduced from 24px 40px
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
        height: "240px", // Reduced from 240px
        padding: "28px 60px", // Reduced from 28px 60px
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

  // Compute connecting line so it touches icon and button precisely
  useLayoutEffect(() => {
    if (!animationComplete || !isInView) return; // Only compute after animation and when in view

    const computeLine = () => {
      if (!footerRef.current || !iconBoxRef.current || !buttonRef.current)
        return;
      const footerRect = footerRef.current.getBoundingClientRect();
      const iconRect = iconBoxRef.current.getBoundingClientRect();
      const buttonRect = buttonRef.current.getBoundingClientRect();

      // Anchor inside the icon (lower-right quadrant) so the line seems to start from it
      const anchorXRatio = 0.66;
      const anchorYRatio = 0.68;
      const iconAnchorXAbs = iconRect.left + iconRect.width * anchorXRatio;
      const iconAnchorYAbs = iconRect.top + iconRect.height * anchorYRatio;

      // End slightly inside the button so the line visually tucks under its rounded edge
      const endXAbs =
        buttonRect.left + Math.max(6, Math.round(buttonRect.height * 0.2));

      // Blend Y toward the button center a bit so the joint looks aligned, but keep bias toward icon
      const buttonCenterYAbs2 = buttonRect.top + buttonRect.height / 2;
      const blendedYAbs =
        iconAnchorYAbs + (buttonCenterYAbs2 - iconAnchorYAbs) * 0.3;

      const startX = Math.max(iconAnchorXAbs - footerRect.left, 0);
      let endX = Math.min(endXAbs - footerRect.left, footerRect.width);
      // Trim the line length a bit from the end to match visual spec
      endX = Math.max(
        endX - LINE_TRIM_PX,
        iconAnchorXAbs - footerRect.left + 6
      );
      const y = Math.round(blendedYAbs - footerRect.top + LINE_Y_OFFSET);

      setLinePoints({ x1: startX, x2: endX, y });

      // Compute how much to vertically shift the button so its center aligns to the line
      const lineAbsY = y + footerRect.top;
      const btnCenterForOffset = buttonRect.top + buttonRect.height / 2;
      setButtonYOffset(Math.round(lineAbsY - btnCenterForOffset));
    };

    computeLine();
    const ro = new ResizeObserver(computeLine);
    if (footerRef.current) ro.observe(footerRef.current);
    if (iconBoxRef.current) ro.observe(iconBoxRef.current);
    if (buttonRef.current) ro.observe(buttonRef.current);
    window.addEventListener("resize", computeLine);
    window.addEventListener("scroll", computeLine, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", computeLine);
      window.removeEventListener("scroll", computeLine);
    };
  }, [deviceType, animationComplete, isInView]);

  return (
    <>
      {/* Footer Section */}
      <motion.footer
        className={className}
        ref={(el) => {
          footerRef.current = el;
        }}
        variants={containerVariants}
        initial="initial"
        animate={isInView ? "animate" : "initial"}
        style={{
          position: "relative",
          bottom: "auto",
          left: 0,
          width: "100%",
          height: dimensions.height,
          background:backgroundColors,
            // "linear-gradient(90deg, #6e226e 0%, #a5206a 14%, #d31663 28%, #ed3176 42%, #fd336b 56%, #f23d64 70%, #f65d55 84%, #f5655d 100%)",
          display: "flex",
          flexDirection: dimensions.flexDirection,
          alignItems: "center",
          justifyContent: dimensions.justifyContent,
          padding: dimensions.padding,
          color: "white",
          zIndex: 1000,
          gap: dimensions.gap,
          marginTop: "auto",
          overflow: "hidden",
          
        }}
      >
        {/* Left side - Font logo and text */}
        <motion.div
          variants={logoVariants}
          onAnimationComplete={() => {
            if (isInView && deviceType !== "mobile") {
              setTimeout(() => setAnimationComplete(true), 500);
            } else if (isInView) {
              setAnimationComplete(true);
            }
          }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: deviceType === "mobile" ? "center" : "flex-start",
            textAlign: deviceType === "mobile" ? "center" : "left",
            flex: 1,
            maxWidth: deviceType === "mobile" ? "100%" : "40%",
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* Font Icon - Properly sized and positioned */}
          <div
            ref={iconBoxRef}
            style={{
              width:
                deviceType === "mobile"
                  ? "50px"
                  : deviceType === "tablet"
                  ? "70px"
                  : "90px",
              height:
                deviceType === "mobile"
                  ? "50px"
                  : deviceType === "tablet"
                  ? "70px"
                  : "90px",
              marginBottom: "15px",
              marginTop: `${ICON_Y_OFFSET}px`,
              filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.4))",
              flexShrink: 0,
            }}
          >
            <img
              src="/logo/font.png"
              alt="Font Logo"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                filter: "brightness(0) invert(1)",
              }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const fallbackText = document.createElement("div");
                fallbackText.textContent = "B";
                fallbackText.style.cssText = `
                  width: 100%;
                  height: 100%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: ${
                    deviceType === "mobile"
                      ? "30px"
                      : deviceType === "tablet"
                      ? "40px"
                      : "50px"
                  }px;
                  font-weight: bold;
                  color: white;
                  background: rgba(255, 255, 255, 0.1);
                  border-radius: 50%;
                `;
                e.currentTarget.parentNode?.appendChild(fallbackText);
              }}
            />
          </div>

          <div
            style={{
              fontSize: dimensions.textSize,
              lineHeight: "1.5",
              color: "rgba(255,255,255,0.95)",
              width: "100%",
            }}
          >
            {resumeData?.data ? (
              <>
                {/* Display Name, Email, and Phone */}
                <div
                  style={{
                    fontWeight: "500",
                    fontSize: deviceType === "mobile" ? "13px" : "15px",
                  }}
                >
                  {resumeData.data.name || "Name not available"}
                </div>
                
                {/* Email - Clickable to open email client */}
                {resumeData.data.email ? (
                  <div
                    onClick={() => handleEmailClick(resumeData.data.email)}
                    style={{
                      fontSize: deviceType === "mobile" ? "12px" : "14px",
                       cursor: "pointer",
                      textDecoration: "underline",
                      transition: "all 0.2s ease",
                      opacity: 0.95,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = "1";
                      e.currentTarget.style.textShadow = "0 0 8px rgba(255,255,255,0.5)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = "0.95";
                      e.currentTarget.style.textShadow = "none";
                    }}
                    title={`Send email to ${resumeData.data.email}`}
                  >
                    {resumeData.data.email}
                  </div>
                ) : (
                  <div
                    style={{
                      fontSize: deviceType === "mobile" ? "12px" : "14px",
                    }}
                  >
                    Email not available
                  </div>
                )}
                
                <div
                  style={{
                    marginBottom: "12px",
                    fontSize: deviceType === "mobile" ? "12px" : "14px",
                     cursor: "pointer",
                  }}
                  onClick={() => {  window.open("tel:+16265550134", "_self");
      }}
                >
                  {resumeData.data.phone || "Phone not available"}
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
        </motion.div>

        {/* Connecting Line - dynamically sized to touch icon and button */}
        {deviceType !== "mobile" && linePoints.x2 - linePoints.x1 > 6 && animationComplete && isInView && (
          <motion.svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${Math.max(
              footerRef.current?.clientWidth || 0,
              1
            )} ${Math.max(footerRef.current?.clientHeight || 0, 1)}`}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 1,
              pointerEvents: "none",
            }}
            initial="initial"
            animate={isInView ? "animate" : "initial"}
          >
            <motion.line
              variants={lineVariants}
              x1={linePoints.x1}
              y1={linePoints.y}
              x2={linePoints.x2}
              y2={linePoints.y}
              stroke="rgba(255,255,255,0.92)"
              strokeWidth={0.4}
              strokeLinecap="round"
            />
          </motion.svg>
        )}

        {/* Right side - Connect button */}
        <motion.div
          variants={buttonVariants}
          style={{
            position: "relative",
            zIndex: 2,
            flexShrink: 0,
            marginLeft: deviceType === "mobile" ? "0" : "auto",
            transform: `translateY(${buttonYOffset}px)`,
          }}
        >
          <button
            ref={buttonRef}
            className="connect-button"
            onClick={()=>setShowConnectForm(true)}
            style={{cursor:'none'}}
          >
            CONNECT
          </button>
        </motion.div>
      </motion.footer>

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
          /* Ensure footer is properly positioned in content flow */
          footer {
            flex-shrink: 0 !important;
            margin-top: auto !important;
          }

          /* Enforce brand font in footer regardless of component styles */
          footer, .connect-button {
            font-family: var(--brand-font) !important;
          }

          .connect-button {
            background: #ffffff !important;
            border: none !important;
            border-radius: 15px !important;
            color: #9b1242 !important;
            font-weight: 900 !important;
            text-transform: uppercase !important;
            letter-spacing: 1px !important;
            padding: 5px 40px 5px 25px !important;
            font-size: 16px !important;
            min-width: 140px !important;
            height: auto !important;
            white-space: nowrap !important;
            transition: all 0.2s ease !important;
            box-shadow: 0 10px 18px rgba(0,0,0,0.18), inset 0 0 0 1px rgba(255,255,255,0.9) !important;
          }

          @media (max-width: 768px) {
            .connect-button {
              padding: 8px 20px !important;
              font-size: 14px !important;
              min-width: 120px !important;
            }
          }

          @media (min-width: 769px) and (max-width: 1024px) {
            .connect-button {
              padding: 9px 22px !important;
              font-size: 15px !important;
              min-width: 130px !important;
            }
          }

          .connect-button:hover { transform: translateY(-2px) !important; }

          .connect-modal {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            /* Transparent glass background */
            background: rgba(255, 255, 255, 0.02) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            z-index: 9999 !important;
            animation: fadeInGlass 0.5s ease-out !important;
            // backdrop-filter: blur(15px) !important;
            // -webkit-backdrop-filter: blur(15px) !important;
          }

          .connect-form {
            /* Glass morphism effect */
            background: rgba(255, 255, 255, 0.15) !important;
            backdrop-filter: blur(25px) !important;
            -webkit-backdrop-filter: blur(25px) !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            border-radius: 25px !important;
            padding: 40px !important;
            max-width: 400px !important;
            width: 90% !important;
            text-align: center !important;
            box-shadow: 
              0 25px 45px rgba(0, 0, 0, 0.1),
              0 0 0 1px rgba(255, 255, 255, 0.1),
              inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
            /* Genie animation */
            // animation: genieEmerge 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards !important;
            position: relative !important;
            z-index: 10000 !important;
            margin: auto !important;
            overflow: hidden !important;
          }

          .connect-form::before {
            content: '' !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            background: linear-gradient(135deg, 
              rgba(255, 255, 255, 0.1) 0%, 
              rgba(255, 255, 255, 0.05) 50%, 
              rgba(255, 255, 255, 0.1) 100%) !important;
            border-radius: 25px !important;
            pointer-events: none !important;
            z-index: -1 !important;
          }

          .connect-form h2 {
            margin: 0 0 20px 0;
            color: rgba(0, 0, 0, 0.9);
            font-size: 28px;
            font-weight: 700;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }

          .connect-form p {
            margin: 0 0 30px 0;
            color: rgba(0, 0, 0, 0.8);
            font-size: 16px;
            line-height: 1.5;
            text-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
          }

          .form-group {
            margin-bottom: 20px;
          }

          .email-input,
          .mobile-input,
          .message-input {
            width: 100%;
            padding: 15px 20px;
            border: 1px solid rgba(255, 255, 255, 0.3);
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border-radius: 15px;
            font-size: 16px;
            transition: all 0.3s ease;
            box-sizing: border-box;
            color: rgba(0, 0, 0, 0.9);
          }

          .email-input::placeholder,
          .mobile-input::placeholder,
          .message-input::placeholder {
            color: rgba(0, 0, 0, 0.6);
          }

          .email-input:focus,
          .mobile-input:focus,
          .message-input:focus {
            outline: none;
            border-color: rgba(102, 126, 234, 0.5);
            background: rgba(255, 255, 255, 0.3);
            box-shadow: 0 0 20px rgba(102, 126, 234, 0.2);
          }

          .email-input.error,
          .mobile-input.error,
          .message-input.error {
            border-color: rgba(229, 62, 62, 0.6);
            background: rgba(255, 255, 255, 0.25);
          }

          .submit-btn {
            width: 100%;
            padding: 15px;
            background: rgba(102, 126, 234, 0.9);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 15px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-bottom: 15px;
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
          }

          .submit-btn:hover {
            background: rgba(102, 126, 234, 1);
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
          }

          .submit-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
          }

          .close-btn {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: rgba(0, 0, 0, 0.7);
            cursor: pointer;
            font-size: 14px;
            padding: 10px 20px;
            border-radius: 10px;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
          }

          .close-btn:hover {
            background: rgba(255, 255, 255, 0.2);
            color: rgba(0, 0, 0, 0.9);
          }

          .error-message {
            color: #e53e3e;
            font-size: 14px;
            margin-top: 5px;
            text-align: left;
            background: rgba(229, 62, 62, 0.1);
            padding: 5px 10px;
            border-radius: 8px;
            border-left: 3px solid #e53e3e;
          }

          .success-container {
            text-align: center;
            animation: successPulse 0.6s ease-out;
          }

          .success-icon {
            font-size: 48px;
            color: #38a169;
            margin-bottom: 20px;
            animation: checkmarkPop 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            display: inline-block;
          }

          .success-message {
            color: rgba(56, 161, 105, 0.9);
            font-weight: 600;
            margin-bottom: 10px;
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }

          .closing-note {
            color: rgba(0, 0, 0, 0.6);
            font-size: 14px;
          }

          /* Glass fade-in animation */
          @keyframes fadeInGlass {
            from { 
              opacity: 0;
              backdrop-filter: blur(0px);
              -webkit-backdrop-filter: blur(0px);
            }
            to { 
              opacity: 1;
              backdrop-filter: blur(15px);
              -webkit-backdrop-filter: blur(15px);
            }
          }

          /* Genie emerge animation - like coming out of a bottle */
          @keyframes genieEmerge {
            0% {
              opacity: 0;
              transform: scale(0.3) translateY(200px) rotate(10deg);
              filter: blur(5px);
            }
            30% {
              opacity: 0.7;
              transform: scale(0.6) translateY(100px) rotate(5deg);
              filter: blur(3px);
            }
            60% {
              opacity: 0.9;
              transform: scale(0.9) translateY(20px) rotate(-2deg);
              filter: blur(1px);
            }
            80% {
              opacity: 1;
              transform: scale(1.05) translateY(-10px) rotate(1deg);
              filter: blur(0px);
            }
            100% {
              opacity: 1;
              transform: scale(1) translateY(0px) rotate(0deg);
              filter: blur(0px);
            }
          }

          /* Success animations */
          @keyframes successPulse {
            0% {
              transform: scale(0.8);
              opacity: 0;
            }
            50% {
              transform: scale(1.1);
              opacity: 0.8;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }

          @keyframes checkmarkPop {
            0% {
              transform: scale(0) rotate(45deg);
              opacity: 0;
            }
            50% {
              transform: scale(1.3) rotate(45deg);
              opacity: 0.8;
            }
            100% {
              transform: scale(1) rotate(0deg);
              opacity: 1;
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
              border-radius: 20px !important;
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
              border-radius: 12px !important;
            }
            
            .submit-btn {
              padding: 12px !important;
              font-size: 14px !important;
              border-radius: 12px !important;
            }

            .close-btn {
              padding: 8px 16px !important;
              border-radius: 8px !important;
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

          /* Enhanced glass effects for modern browsers */
          @supports (backdrop-filter: blur(1px)) {
            .connect-modal {
              background: rgba(255, 255, 255, 0.02) !important;
            }
            
            .connect-form {
              background: rgba(255, 255, 255, 0.12) !important;
            }
          }

          /* Fallback for browsers without backdrop-filter support */
          @supports not (backdrop-filter: blur(1px)) {
            .connect-modal {
              background: rgba(0, 0, 0, 0.3) !important;
            }
            
            .connect-form {
              background: rgba(255, 255, 255, 0.95) !important;
            }
          }
        `}
      </style>
    </>
  );
};

export default Footer;