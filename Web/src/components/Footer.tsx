// import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useCustomerConnect } from "../api/useCustomerConnect";
// import { useResumeDetails } from "../api/useResumeDetails";
// import { createPortal } from "react-dom";

// const Icon = {
//   LinkedIn: (props: React.SVGProps<SVGSVGElement>) => (
//     <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
//       <path d="M4.983 3.5C4.983 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.483 1.12 2.483 2.5zM.3 8.1h4.4V24H.3V8.1zm7.2 0h4.215v2.17h.06c.587-1.113 2.022-2.29 4.163-2.29 4.452 0 5.273 2.93 5.273 6.737V24H16.5v-6.94c0-1.656-.03-3.784-2.307-3.784-2.31 0-2.664 1.805-2.664 3.668V24H7.5V8.1z" />
//     </svg>
//   ),
//   Instagram: (props: React.SVGProps<SVGSVGElement>) => (
//     <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
//       {/* Modern Instagram Icon - Updated 2024 */}
//       <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.07 1.645.07 4.849 0 3.205-.012 3.584-.07 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 3.266-.058 1.645-.07 4.849-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
//     </svg>
//   ),
//   Behance: (props: React.SVGProps<SVGSVGElement>) => (
//     <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
//       {/* Modern Behance Icon - Updated 2024 */}
//       <path d="M22 7h-6V5h6v2zm-6 10h6v-2h-6v2zm-6-7c.9-.4 1.4-1.1 1.4-2.2C11 6.9 9.9 6 8 6H3v12h5.2c2.3 0 3.8-1.1 3.8-3.2 0-1.4-.6-2.3-1.4-2.6zM6 8.5h2c.9 0 1.4.4 1.4 1.1S8.9 10.8 8 10.8H6V8.5zm2.2 7H6v-2.6h2.2c1 0 1.6.5 1.6 1.3s-.6 1.3-1.6 1.3zM21.9 13.5c-.2-1.9-1.6-3.3-3.9-3.3-2.6 0-4.2 1.8-4.2 4.3 0 2.6 1.7 4.3 4.4 4.3 2 0 3.4-1 3.8-2.7h-2.1c-.2.6-.8 1-1.7 1-1.1 0-1.9-.8-2-2h5.7c0-.2 0-.4 0-.6zm-5.7-1.1c.2-1 1-1.6 1.9-1.6 1 0 1.7.6 1.9 1.6h-3.8z" />
//     </svg>
//   ),
//   Globe: (props: React.SVGProps<SVGSVGElement>) => (
//     <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
//       <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm7.93 9h-3.18a15.9 15.9 0 00-1.2-5.01A8.02 8.02 0 0119.93 11zM12 4c.9 0 2.2 1.8 2.8 5H9.2c.6-3.2 1.9-5 2.8-5zM6.45 14a13.7 13.7 0 010-4h11.1a13.7 13.7 0 010 4H6.45zM8.45 18a15.9 15.9 0 01-1.2-5h9.5a15.9 15.9 0 01-1.2 5A8.02 8.02 0 0112 20a8.02 8.02 0 01-3.55-2zM8.45 5.99A15.9 15.9 0 007.25 11H4.07A8.02 8.02 0 018.45 6zM4.07 13h3.18a15.9 15.9 0 001.2 5.01A8.02 8.02 0 014.07 13z" />
//     </svg>
//   ),
//   ResumeDoc: (props: React.SVGProps<SVGSVGElement>) => (
//     <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
//       <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zm0 0v6h6" />
//     </svg>
//   ),
// };

// interface FooterProps {
//   deviceType?: "mobile" | "tablet" | "desktop";
//   variant?: "homepage" | "project-details";
//   onResumeClick?: () => void;
//   className?: string; // ADDED: Support for custom CSS classes
// }

// const Footer: React.FC<FooterProps> = ({
//   deviceType = "desktop",
//   variant = "homepage",
//   onResumeClick,
//   className, // ADDED: Extract className prop
// }) => {
//   const [showConnectForm, setShowConnectForm] = useState<boolean>(false);
//   // Refs for dynamic layout calculations
//   const footerRef = useRef<HTMLElement | null>(null);
//   const iconBoxRef = useRef<HTMLDivElement | null>(null);
//   const buttonRef = useRef<HTMLButtonElement | null>(null);
//   const [linePoints, setLinePoints] = useState<{
//     x1: number;
//     x2: number;
//     y: number;
//   }>({ x1: 0, x2: 0, y: 0 });
//   const [email, setEmail] = useState<string>("");
//   const [mobileNumber, setMobileNumber] = useState<string>("");
//   const [message, setMessage] = useState<string>("");
//   const [buttonYOffset, setButtonYOffset] = useState<number>(0);
//   // UI tweak offsets (px)
//   const LINE_Y_OFFSET = 8; // move the horizontal line down (+) or up (-)
//   const ICON_Y_OFFSET = 28; // move the left icon down (+) or up (-)
//   const LINE_TRIM_PX = 1; // reduce overall line length by this many pixels
//   const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
//   const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

//   const navigate = useNavigate();
//   const { mutate: customerConnect, isPending: isConnecting } =
//     useCustomerConnect();
//   const { data: resumeData } = useResumeDetails();

//   // State to track if modal should be rendered
//   const [modalContainer, setModalContainer] = useState<HTMLElement | null>(
//     null
//   );

//   // Handle connect form submission
//   const handleConnectSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     // Reset previous errors
//     setFormErrors({});

//     // Validation
//     const errors: { [key: string]: string } = {};

//     if (!email.trim()) {
//       errors.email = "Email is required";
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
//       errors.email = "Please enter a valid email address";
//     }

//     // Only validate mobile and message for homepage variant
//     if (variant === "homepage") {
//       if (!mobileNumber.trim()) {
//         errors.mobileNumber = "Mobile number is required";
//       } else if (!/^[0-9]{10,15}$/.test(mobileNumber.trim())) {
//         errors.mobileNumber = "Please enter a valid mobile number";
//       }

//       if (!message.trim()) {
//         errors.message = "Message is required";
//       } else if (message.trim().length < 10) {
//         errors.message = "Message must be at least 10 characters long";
//       }
//     }

//     if (Object.keys(errors).length > 0) {
//       setFormErrors(errors);
//       return;
//     }

//     // Submit form
//     const payload = {
//       mobileNumber: mobileNumber.trim(),
//       email: email.trim(),
//       message: message.trim(),
//     };

//     customerConnect(payload, {
//       onSuccess: (response) => {
//         if (response.isSuccess) {
//           setFormSubmitted(true);
//           // Reset form
//           setEmail("");
//           setMobileNumber("");
//           setMessage("");
//           setFormErrors({});

//           // Close form after 3 seconds
//           setTimeout(() => {
//             setShowConnectForm(false);
//             setFormSubmitted(false);
//           }, 3000);
//         }
//       },
//       onError: (error) => {
//         console.error("Connect API error:", error);
//         setFormErrors({ general: "Failed to send message. Please try again." });
//       },
//     });
//   };

//   // Handle connect button click
//   const handleConnectClick = () => {
//     setShowConnectForm(true);
//     // Pre-fill email if available from resume data
//     if (resumeData?.data?.email) {
//       setEmail(resumeData.data.email);
//     }
//     // Reset other fields
//     setMobileNumber("");
//     setMessage("");
//     setFormErrors({});
//     setFormSubmitted(false);
//   };

//   // Handle resume click
//   const handleResumeClick = () => {
//     if (onResumeClick) {
//       onResumeClick();
//     } else {
//       navigate("/resume");
//     }
//   };

//   // Set up modal container
//   useEffect(() => {
//     let container = document.getElementById("modal-root");
//     if (!container) {
//       container = document.createElement("div");
//       container.id = "modal-root";
//       document.body.appendChild(container);
//     }
//     setModalContainer(container);

//     return () => {
//       // Clean up if this is the last Footer component
//       if (container && container.childNodes.length === 0) {
//         document.body.removeChild(container);
//       }
//     };
//   }, []);

//   // Responsive dimensions
//   const getResponsiveDimensions = () => {
//     switch (deviceType) {
//       case "mobile":
//         return {
//           height: "340px",
//           padding: "56px 20px",
//           flexDirection: "column" as const,
//           justifyContent: "center" as const,
//           gap: "30px",
//           logoSize: "36px",
//           textSize: "12px",
//           buttonPadding: "10px 24px",
//           buttonFontSize: "14px",
//         };
//       case "tablet":
//         return {
//           height: "280px",
//           padding: "24px 40px",
//           flexDirection: "row" as const,
//           justifyContent: "space-between" as const,
//           gap: "0",
//           logoSize: "42px",
//           textSize: "13px",
//           buttonPadding: "11px 28px",
//           buttonFontSize: "15px",
//         };
//       default: // desktop
//         return {
//           height: "240px",
//           padding: "28px 60px",
//           flexDirection: "row" as const,
//           justifyContent: "space-between" as const,
//           gap: "0",
//           logoSize: "48px",
//           textSize: "14px",
//           buttonPadding: "12px 32px",
//           buttonFontSize: "16px",
//         };
//     }
//   };

//   const dimensions = getResponsiveDimensions();

//   // Compute connecting line so it touches icon and button precisely
//   useLayoutEffect(() => {
//     const computeLine = () => {
//       if (!footerRef.current || !iconBoxRef.current || !buttonRef.current)
//         return;
//       const footerRect = footerRef.current.getBoundingClientRect();
//       const iconRect = iconBoxRef.current.getBoundingClientRect();
//       const buttonRect = buttonRef.current.getBoundingClientRect();

//       // Anchor inside the icon (lower-right quadrant) so the line seems to start from it
//       const anchorXRatio = 0.66; // ~two-thirds from left → near right side
//       const anchorYRatio = 0.68; // ~lower third for that tangent feel
//       const iconAnchorXAbs = iconRect.left + iconRect.width * anchorXRatio;
//       const iconAnchorYAbs = iconRect.top + iconRect.height * anchorYRatio;

//       // End slightly inside the button so the line visually tucks under its rounded edge
//       const endXAbs =
//         buttonRect.left + Math.max(6, Math.round(buttonRect.height * 0.2));

//       // Blend Y toward the button center a bit so the joint looks aligned, but keep bias toward icon
//       const buttonCenterYAbs2 = buttonRect.top + buttonRect.height / 2;
//       const blendedYAbs =
//         iconAnchorYAbs + (buttonCenterYAbs2 - iconAnchorYAbs) * 0.3; // 30% toward button

//       const startX = Math.max(iconAnchorXAbs - footerRect.left, 0);
//       let endX = Math.min(endXAbs - footerRect.left, footerRect.width);
//       // Trim the line length a bit from the end to match visual spec
//       endX = Math.max(
//         endX - LINE_TRIM_PX,
//         iconAnchorXAbs - footerRect.left + 6
//       );
//       const y = Math.round(blendedYAbs - footerRect.top + LINE_Y_OFFSET);

//       setLinePoints({ x1: startX, x2: endX, y });

//       // Compute how much to vertically shift the button so its center aligns to the line
//       const lineAbsY = y + footerRect.top; // already includes LINE_Y_OFFSET
//       const btnCenterForOffset = buttonRect.top + buttonRect.height / 2;
//       setButtonYOffset(Math.round(lineAbsY - btnCenterForOffset));
//     };

//     computeLine();
//     const ro = new ResizeObserver(computeLine);
//     if (footerRef.current) ro.observe(footerRef.current);
//     if (iconBoxRef.current) ro.observe(iconBoxRef.current);
//     if (buttonRef.current) ro.observe(buttonRef.current);
//     window.addEventListener("resize", computeLine);
//     window.addEventListener("scroll", computeLine, { passive: true });
//     return () => {
//       ro.disconnect();
//       window.removeEventListener("resize", computeLine);
//       window.removeEventListener("scroll", computeLine);
//     };
//   }, [deviceType]);

//   return (
//     <>
//       {/* Footer Section */}
//       <footer
//         className={className}
//         ref={(el) => {
//           footerRef.current = el;
//         }}
//         style={{
//           position: "relative",
//           bottom: "auto",
//           left: 0,
//           width: "100%",
//           height: dimensions.height,
//           background:
//             "linear-gradient(90deg, #6e226e 0%, #a5206a 14%, #d31663 28%, #ed3176 42%, #fd336b 56%, #f23d64 70%, #f65d55 84%, #f5655d 100%)",
//           display: "flex",
//           flexDirection: dimensions.flexDirection,
//           alignItems: "center",
//           justifyContent: dimensions.justifyContent,
//           padding: dimensions.padding,
//           color: "white",
//           zIndex: 1000,
//           gap: dimensions.gap,
//           marginTop: "auto",
//           overflow: "hidden", // Prevent content from going outside footer
//         }}
//       >
//         {/* Left side - Font logo and text */}
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: deviceType === "mobile" ? "center" : "flex-start",
//             textAlign: deviceType === "mobile" ? "center" : "left",
//             flex: 1, // Take available space
//             maxWidth: deviceType === "mobile" ? "100%" : "40%", // Limit width to prevent overflow
//             position: "relative",
//             zIndex: 2,
//           }}
//         >
//           {/* Font Icon - Properly sized and positioned */}
//           <div
//             ref={iconBoxRef}
//             style={{
//               width:
//                 deviceType === "mobile"
//                   ? "50px"
//                   : deviceType === "tablet"
//                   ? "70px"
//                   : "90px",
//               height:
//                 deviceType === "mobile"
//                   ? "50px"
//                   : deviceType === "tablet"
//                   ? "70px"
//                   : "90px",
//               marginBottom: "15px",
//               marginTop: `${ICON_Y_OFFSET}px`,
//               filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.4))",
//               flexShrink: 0, // Prevent icon from shrinking
//             }}
//           >
//             <img
//               src="/logo/font.png"
//               alt="Font Logo"
//               style={{
//                 width: "100%",
//                 height: "100%",
//                 objectFit: "contain",
//                 filter: "brightness(0) invert(1)", // Make icon white
//               }}
//               onError={(e) => {
//                 e.currentTarget.style.display = "none";
//                 const fallbackText = document.createElement("div");
//                 fallbackText.textContent = "B";
//                 fallbackText.style.cssText = `
//                   width: 100%;
//                   height: 100%;
//                   display: flex;
//                   align-items: center;
//                   justify-content: center;
//                   font-size: ${
//                     deviceType === "mobile"
//                       ? "30px"
//                       : deviceType === "tablet"
//                       ? "40px"
//                       : "50px"
//                   }px;
//                   font-weight: bold;
//                   color: white;
//                   background: rgba(255, 255, 255, 0.1);
//                   border-radius: 50%;
//                 `;
//                 e.currentTarget.parentNode?.appendChild(fallbackText);
//               }}
//             />
//           </div>

//           <div
//             style={{
//               fontSize: dimensions.textSize,
//               lineHeight: "1.5",
//               color: "rgba(255,255,255,0.95)",
//               width: "100%", // Use full width of container
//             }}
//           >
//             {resumeData?.data ? (
//               <>
//                 {/* Display Name, Email, and Phone */}
//                 <div
//                   style={{
//                     fontWeight: "500",
//                     fontSize: deviceType === "mobile" ? "13px" : "15px",
//                   }}
//                 >
//                   {resumeData.data.name || "Name not available"}
//                 </div>
//                 <div
//                   style={{
//                     fontSize: deviceType === "mobile" ? "12px" : "14px",
//                   }}
//                 >
//                   {resumeData.data.email || "Email not available"}
//                 </div>
//                 <div
//                   style={{
//                     marginBottom: "12px",
//                     fontSize: deviceType === "mobile" ? "12px" : "14px",
//                   }}
//                 >
//                   {resumeData.data.phone || "Phone not available"}
//                 </div>

//                 {/* Social Media Icons - Properly contained */}
//                 {/* <div
//                   style={{
//                     display: "flex",
//                     gap: deviceType === "mobile" ? "8px" : "10px",
//                     flexWrap: "wrap", // Allow wrapping on small screens
//                     justifyContent:
//                       deviceType === "mobile" ? "center" : "flex-start",
//                   }}
//                 >
//                   <a
//                     href="/resume"
//                     onClick={(e) => {
//                       e.preventDefault();
//                       handleResumeClick();
//                     }}
//                     aria-label="Resume"
//                     title="View Resume"
//                     style={{
//                       display: "inline-flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       width: deviceType === "mobile" ? "20px" : "24px",
//                       height: deviceType === "mobile" ? "20px" : "24px",
//                       color: "#ffffff",
//                       position: "relative",
//                       flexShrink: 0,
//                     }}
//                   >
//                     <Icon.ResumeDoc
//                       width={deviceType === "mobile" ? "16" : "20"}
//                       height={deviceType === "mobile" ? "16" : "20"}
//                     />
//                     <span
//                       style={{
//                         position: "absolute",
//                         top: -6,
//                         right: -8,
//                         background: "rgba(255,255,255,0.95)",
//                         color: "#111827",
//                         borderRadius: 8,
//                         padding: "1px 4px",
//                         fontSize: deviceType === "mobile" ? "6px" : "8px",
//                         fontWeight: 800,
//                         lineHeight: "10px",
//                         letterSpacing: 0.4,
//                         boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
//                         textTransform: "uppercase",
//                         pointerEvents: "none",
//                         userSelect: "none",
//                       }}
//                     >
//                       CV
//                     </span>
//                   </a>
//                   {resumeData.data.websiteUrl && (
//                     <a
//                       href={resumeData.data.websiteUrl}
//                       target="_blank"
//                       rel="noreferrer"
//                       aria-label="Website"
//                       style={{
//                         display: "inline-flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         width: deviceType === "mobile" ? "20px" : "24px",
//                         height: deviceType === "mobile" ? "20px" : "24px",
//                         color: "#ffffff",
//                         flexShrink: 0,
//                       }}
//                     >
//                       <Icon.Globe
//                         width={deviceType === "mobile" ? "16" : "20"}
//                         height={deviceType === "mobile" ? "16" : "20"}
//                       />
//                     </a>
//                   )}
//                   {resumeData.data.linkedinUrl && (
//                     <a
//                       href={resumeData.data.linkedinUrl}
//                       target="_blank"
//                       rel="noreferrer"
//                       aria-label="LinkedIn"
//                       style={{
//                         display: "inline-flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         width: deviceType === "mobile" ? "20px" : "24px",
//                         height: deviceType === "mobile" ? "20px" : "24px",
//                         color: "#ffffff",
//                         flexShrink: 0,
//                       }}
//                     >
//                       <Icon.LinkedIn
//                         width={deviceType === "mobile" ? "16" : "20"}
//                         height={deviceType === "mobile" ? "16" : "20"}
//                       />
//                     </a>
//                   )}
//                   {resumeData.data.instagramUrl && (
//                     <a
//                       href={resumeData.data.instagramUrl}
//                       target="_blank"
//                       rel="noreferrer"
//                       aria-label="Instagram"
//                       style={{
//                         display: "inline-flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         width: deviceType === "mobile" ? "20px" : "24px",
//                         height: deviceType === "mobile" ? "20px" : "24px",
//                         color: "#ffffff",
//                         flexShrink: 0,
//                       }}
//                     >
//                       <Icon.Instagram
//                         width={deviceType === "mobile" ? "16" : "20"}
//                         height={deviceType === "mobile" ? "16" : "20"}
//                       />
//                     </a>
//                   )}
//                   {resumeData.data.behanceUrl && (
//                     <a
//                       href={resumeData.data.behanceUrl}
//                       target="_blank"
//                       rel="noreferrer"
//                       aria-label="Behance"
//                       style={{
//                         display: "inline-flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         width: deviceType === "mobile" ? "20px" : "24px",
//                         height: deviceType === "mobile" ? "20px" : "24px",
//                         color: "#ffffff",
//                         flexShrink: 0,
//                       }}
//                     >
//                       <Icon.Behance
//                         width={deviceType === "mobile" ? "16" : "20"}
//                         height={deviceType === "mobile" ? "16" : "20"}
//                       />
//                     </a>
//                   )}
//                 </div> */}
//               </>
//             ) : (
//               <>
//                 <div>Loading contact information...</div>
//                 <div>Please wait...</div>
//                 <div>...</div>
//               </>
//             )}
//           </div>
//         </div>

//         {/* Connecting Line - dynamically sized to touch icon and button */}
//         {deviceType !== "mobile" && linePoints.x2 - linePoints.x1 > 6 && (
//           <svg
//             width="100%"
//             height="100%"
//             viewBox={`0 0 ${Math.max(
//               footerRef.current?.clientWidth || 0,
//               1
//             )} ${Math.max(footerRef.current?.clientHeight || 0, 1)}`}
//             style={{
//               position: "absolute",
//               inset: 0,
//               zIndex: 1,
//               pointerEvents: "none",
//             }}
//           >
//             <line
//               x1={linePoints.x1}
//               y1={linePoints.y}
//               x2={linePoints.x2}
//               y2={linePoints.y}
//               stroke="rgba(255,255,255,0.92)"
//               strokeWidth={0.4}
//               strokeLinecap="round"
//             />
//           </svg>
//         )}

//         {/* Right side - Connect button */}
//         <div
//           style={{
//             position: "relative",
//             zIndex: 2,
//             flexShrink: 0, // Prevent button from shrinking
//             marginLeft: deviceType === "mobile" ? "0" : "auto",
//             transform: `translateY(${buttonYOffset}px)`,
//           }}
//         >
//           <button
//             ref={buttonRef}
//             className="connect-button"
//             onClick={handleResumeClick}
//             style={{}}
//           >
//             CONNECT
//           </button>
//         </div>
//       </footer>

//       {/* Connect Form Modal - Rendered via Portal */}
//       {showConnectForm &&
//         modalContainer &&
//         createPortal(
//           <div
//             className="connect-modal"
//             style={{
//               position: "fixed",
//               top: 0,
//               left: 0,
//               width: "100vw",
//               height: "100vh",
//               zIndex: 9999,
//             }}
//             onClick={(e) => {
//               if (e.target === e.currentTarget) {
//                 setShowConnectForm(false);
//               }
//             }}
//           >
//             <div
//               className="connect-form"
//               style={{
//                 position: "relative",
//                 zIndex: 10000,
//                 margin: "auto",
//               }}
//             >
//               {!formSubmitted ? (
//                 <form onSubmit={handleConnectSubmit}>
//                   <h2>Let's Connect!</h2>
//                   <p>
//                     {variant === "homepage"
//                       ? "Fill out the form below and we'll get back to you soon."
//                       : "Enter your email address and we'll get in touch with you soon."}
//                   </p>

//                   {formErrors.general && (
//                     <div className="error-message general-error">
//                       {formErrors.general}
//                     </div>
//                   )}

//                   <div className="form-group">
//                     <input
//                       type="email"
//                       placeholder="Enter your email address"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       className={`email-input ${
//                         formErrors.email ? "error" : ""
//                       }`}
//                       required
//                     />
//                     {formErrors.email && (
//                       <div className="error-message">{formErrors.email}</div>
//                     )}
//                   </div>

//                   {
//                     <>
//                       <div className="form-group">
//                         <input
//                           type="tel"
//                           placeholder="Enter your mobile number"
//                           value={mobileNumber}
//                           onChange={(e) => setMobileNumber(e.target.value)}
//                           className={`mobile-input ${
//                             formErrors.mobileNumber ? "error" : ""
//                           }`}
//                           required
//                         />
//                         {formErrors.mobileNumber && (
//                           <div className="error-message">
//                             {formErrors.mobileNumber}
//                           </div>
//                         )}
//                       </div>

//                       <div className="form-group">
//                         <textarea
//                           placeholder="Enter your message (minimum 10 characters)"
//                           value={message}
//                           onChange={(e) => setMessage(e.target.value)}
//                           className={`message-input ${
//                             formErrors.message ? "error" : ""
//                           }`}
//                           rows={4}
//                           required
//                         />
//                         {formErrors.message && (
//                           <div className="error-message">
//                             {formErrors.message}
//                           </div>
//                         )}
//                       </div>
//                     </>
//                   }

//                   <button
//                     type="submit"
//                     className="submit-btn"
//                     disabled={isConnecting}
//                   >
//                     {isConnecting ? "Sending..." : "Send Message"}
//                   </button>

//                   <button
//                     type="button"
//                     className="close-btn"
//                     onClick={() => setShowConnectForm(false)}
//                   >
//                     Cancel
//                   </button>
//                 </form>
//               ) : (
//                 <div className="success-container">
//                   <div className="success-icon">✓</div>
//                   <h2>Message Sent Successfully!</h2>
//                   <p className="success-message">
//                     Thank you for your message. We'll get back to you soon!
//                   </p>
//                   <p className="closing-note">
//                     This form will close automatically in a few seconds.
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>,
//           modalContainer
//         )}

//       <style>
//         {`
//           /* Ensure footer is properly positioned in content flow */
//           footer {
//             flex-shrink: 0 !important;
//             margin-top: auto !important;
//           }

//           /* Enforce brand font in footer regardless of component styles */
//           footer, .connect-button {
//             font-family: var(--brand-font) !important;
//           }

//           .connect-button {
//             background: #ffffff !important;
//             border: none !important;
//             border-radius: 15px !important;
//             color: #9b1242 !important;
//             font-weight: 900 !important;
//             text-transform: uppercase !important;
//             letter-spacing: 1px !important;
//             padding: 5px 40px 5px 25px !important;
//             font-size: 16px !important;
//             min-width: 140px !important;
//             height: auto !important;
//             white-space: nowrap !important;
//             transition: all 0.2s ease !important;
//             box-shadow: 0 10px 18px rgba(0,0,0,0.18), inset 0 0 0 1px rgba(255,255,255,0.9) !important;
//           }

//           @media (max-width: 768px) {
//             .connect-button {
//               padding: 8px 20px !important;
//               font-size: 14px !important;
//               min-width: 120px !important;
//             }
//           }

//           @media (min-width: 769px) and (max-width: 1024px) {
//             .connect-button {
//               padding: 9px 22px !important;
//               font-size: 15px !important;
//               min-width: 130px !important;
//             }
//           }

//           .connect-button:hover { transform: translateY(-2px) !important; }

//           .connect-modal {
//             position: fixed !important;
//             top: 0 !important;
//             left: 0 !important;
//             width: 100vw !important;
//             height: 100vh !important;
//             background: rgba(0, 0, 0, 0.8) !important;
//             display: flex !important;
//             align-items: center !important;
//             justify-content: center !important;
//             z-index: 9999 !important;
//             animation: fadeIn 0.3s ease-out !important;
//             backdrop-filter: blur(5px) !important;
//           }

//           .connect-form {
//             background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.9)) !important;
//             backdrop-filter: blur(20px) !important;
//             border-radius: 20px !important;
//             padding: 40px !important;
//             max-width: 400px !important;
//             width: 90% !important;
//             text-align: center !important;
//             box-shadow: 0 20px 40px rgba(0,0,0,0.3) !important;
//             animation: zoomIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
//             position: relative !important;
//             z-index: 10000 !important;
//             margin: auto !important;
//           }

//           .connect-form h2 {
//             margin: 0 0 20px 0;
//             color: #2d3748;
//             font-size: 28px;
//             font-weight: 700;
//           }

//           .connect-form p {
//             margin: 0 0 30px 0;
//             color: #4a5568;
//             font-size: 16px;
//             line-height: 1.5;
//           }

//           .form-group {
//             margin-bottom: 20px;
//           }

//           .email-input,
//           .mobile-input,
//           .message-input {
//             width: 100%;
//             padding: 15px 20px;
//             border: 2px solid #e2e8f0;
//             border-radius: 12px;
//             font-size: 16px;
//             transition: all 0.3s ease;
//             box-sizing: border-box;
//           }

//           .email-input:focus,
//           .mobile-input:focus,
//           .message-input:focus {
//             outline: none;
//             border-color: #667eea;
//             box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
//           }

//           .email-input.error,
//           .mobile-input.error,
//           .message-input.error {
//             border-color: #e53e3e;
//           }

//           .submit-btn {
//             width: 100%;
//             padding: 15px;
//             background: linear-gradient(135deg, #667eea, #764ba2);
//             color: white;
//             border: none;
//             border-radius: 12px;
//             font-size: 16px;
//             font-weight: 600;
//             cursor: pointer;
//             transition: all 0.3s ease;
//             margin-bottom: 15px;
//           }

//           .submit-btn:hover {
//             transform: translateY(-2px);
//             box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
//           }

//           .submit-btn:disabled {
//             opacity: 0.6;
//             cursor: not-allowed;
//             transform: none;
//             box-shadow: none;
//           }

//           .close-btn {
//             background: none;
//             border: none;
//             color: #718096;
//             cursor: pointer;
//             font-size: 14px;
//             padding: 10px;
//             transition: color 0.3s ease;
//           }

//           .close-btn:hover {
//             color: #2d3748;
//           }

//           .error-message {
//             color: #e53e3e;
//             font-size: 14px;
//             margin-top: 5px;
//             text-align: left;
//           }

//           .success-container {
//             text-align: center;
//           }

//           .success-icon {
//             font-size: 48px;
//             color: #38a169;
//             margin-bottom: 20px;
//           }

//           .success-message {
//             color: #38a169;
//             font-weight: 600;
//             margin-bottom: 10px;
//           }

//           .closing-note {
//             color: #718096;
//             font-size: 14px;
//           }

//           @keyframes fadeIn {
//             from { opacity: 0; }
//             to { opacity: 1; }
//           }

//           @keyframes zoomIn {
//             from { 
//               opacity: 0;
//               transform: scale(0.9);
//             }
//             to { 
//               opacity: 1;
//               transform: scale(1);
//             }
//           }

//           @media (max-width: 768px) {
//             .connect-modal {
//               padding: 20px !important;
//             }
            
//             .connect-form {
//               padding: 30px 20px !important;
//               margin: 0 10px !important;
//               max-width: 90vw !important;
//               width: 95% !important;
//             }
            
//             .connect-form h2 {
//               font-size: 24px !important;
//             }
            
//             .connect-form p {
//               font-size: 14px !important;
//             }
            
//             .email-input,
//             .mobile-input,
//             .message-input {
//               padding: 12px 16px !important;
//               font-size: 14px !important;
//             }
            
//             .submit-btn {
//               padding: 12px !important;
//               font-size: 14px !important;
//             }
//           }

//           /* Ensure modal is always on top and properly positioned */
//           .connect-modal {
//             position: fixed !important;
//             top: 0 !important;
//             left: 0 !important;
//             right: 0 !important;
//             bottom: 0 !important;
//             width: 100% !important;
//             height: 100% !important;
//             z-index: 9999 !important;
//             display: flex !important;
//             align-items: center !important;
//             justify-content: center !important;
//             overflow: hidden !important;
//             transform: none !important;
//             will-change: auto !important;
//           }

//           /* Ensure form is properly centered */
//           .connect-form {
//             position: relative !important;
//             z-index: 10000 !important;
//             margin: auto !important;
//             max-height: 90vh !important;
//             overflow-y: auto !important;
//             transform: none !important;
//           }

//           /* Additional positioning fixes for different browsers */
//           @supports (-webkit-overflow-scrolling: touch) {
//             .connect-modal {
//               -webkit-overflow-scrolling: touch !important;
//             }
//           }

//           /* Fix for iOS Safari */
//           @media screen and (-webkit-min-device-pixel-ratio: 0) {
//             .connect-modal {
//               position: fixed !important;
//               -webkit-transform: translateZ(0) !important;
//             }
//           }

//           /* Ensure modal container is properly positioned */
//           #modal-root {
//             position: fixed !important;
//             top: 0 !important;
//             left: 0 !important;
//             width: 100% !important;
//             height: 100% !important;
//             z-index: 9999 !important;
//             pointer-events: none !important;
//           }

//           #modal-root .connect-modal {
//             pointer-events: auto !important;
//           }
//         `}
//       </style>
//     </>
//   );
// };

// export default Footer;


import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCustomerConnect } from "../api/useCustomerConnect";
import { useResumeDetails } from "../api/useResumeDetails";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";

// const Icon = {
//   LinkedIn: (props: React.SVGProps<SVGSVGElement>) => (
//     <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
//       <path d="M4.983 3.5C4.983 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.483 1.12 2.483 2.5zM.3 8.1h4.4V24H.3V8.1zm7.2 0h4.215v2.17h.06c.587-1.113 2.022-2.29 4.163-2.29 4.452 0 5.273 2.93 5.273 6.737V24H16.5v-6.94c0-1.656-.03-3.784-2.307-3.784-2.31 0-2.664 1.805-2.664 3.668V24H7.5V8.1z" />
//     </svg>
//   ),
//   Instagram: (props: React.SVGProps<SVGSVGElement>) => (
//     <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
//       {/* Modern Instagram Icon - Updated 2024 */}
//       <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.07 1.645.07 4.849 0 3.205-.012 3.584-.07 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 3.266-.058 1.645-.07 4.849-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
//     </svg>
//   ),
//   Behance: (props: React.SVGProps<SVGSVGElement>) => (
//     <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
//       {/* Modern Behance Icon - Updated 2024 */}
//       <path d="M22 7h-6V5h6v2zm-6 10h6v-2h-6v2zm-6-7c.9-.4 1.4-1.1 1.4-2.2C11 6.9 9.9 6 8 6H3v12h5.2c2.3 0 3.8-1.1 3.8-3.2 0-1.4-.6-2.3-1.4-2.6zM6 8.5h2c.9 0 1.4.4 1.4 1.1S8.9 10.8 8 10.8H6V8.5zm2.2 7H6v-2.6h2.2c1 0 1.6.5 1.6 1.3s-.6 1.3-1.6 1.3zM21.9 13.5c-.2-1.9-1.6-3.3-3.9-3.3-2.6 0-4.2 1.8-4.2 4.3 0 2.6 1.7 4.3 4.4 4.3 2 0 3.4-1 3.8-2.7h-2.1c-.2.6-.8 1-1.7 1-1.1 0-1.9-.8-2-2h5.7c0-.2 0-.4 0-.6zm-5.7-1.1c.2-1 1-1.6 1.9-1.6 1 0 1.7.6 1.9 1.6h-3.8z" />
//     </svg>
//   ),
//   Globe: (props: React.SVGProps<SVGSVGElement>) => (
//     <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
//       <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm7.93 9h-3.18a15.9 15.9 0 00-1.2-5.01A8.02 8.02 0 0119.93 11zM12 4c.9 0 2.2 1.8 2.8 5H9.2c.6-3.2 1.9-5 2.8-5zM6.45 14a13.7 13.7 0 010-4h11.1a13.7 13.7 0 010 4H6.45zM8.45 18a15.9 15.9 0 01-1.2-5h9.5a15.9 15.9 0 01-1.2 5A8.02 8.02 0 0112 20a8.02 8.02 0 01-3.55-2zM8.45 5.99A15.9 15.9 0 007.25 11H4.07A8.02 8.02 0 018.45 6zM4.07 13h3.18a15.9 15.9 0 001.2 5.01A8.02 8.02 0 014.07 13z" />
//     </svg>
//   ),
//   ResumeDoc: (props: React.SVGProps<SVGSVGElement>) => (
//     <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
//       <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zm0 0v6h6" />
//     </svg>
//   ),
// };

interface FooterProps {
  deviceType?: "mobile" | "tablet" | "desktop";
  variant?: "homepage" | "project-details";
  onResumeClick?: () => void;
  className?: string;
}

const Footer: React.FC<FooterProps> = ({
  deviceType = "desktop",
  variant = "homepage",
  onResumeClick,
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

  const navigate = useNavigate();
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
  const handleResumeClick = () => {
    if (onResumeClick) {
      onResumeClick();
    } else {
      navigate("/resume");
    }
  };

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
          background:
            "linear-gradient(90deg, #6e226e 0%, #a5206a 14%, #d31663 28%, #ed3176 42%, #fd336b 56%, #f23d64 70%, #f65d55 84%, #f5655d 100%)",
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
                <div
                  style={{
                    fontSize: deviceType === "mobile" ? "12px" : "14px",
                  }}
                >
                  {resumeData.data.email || "Email not available"}
                </div>
                <div
                  style={{
                    marginBottom: "12px",
                    fontSize: deviceType === "mobile" ? "12px" : "14px",
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
            onClick={handleResumeClick}
            style={{}}
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