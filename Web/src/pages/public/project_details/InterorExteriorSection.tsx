import { motion } from 'framer-motion'


interface SubProject {
  subProjectId: number;
  name: string;
  imageFileName?: string;
  projectImageUrl: string;
  xPosition: number;
  yPosition: number;
  heightPercent: number;
  animation: string;
  animationSpeed: string;
  animationTrigger: string;
  isExterior: boolean;
}

interface ProjectContainer {
  subProjectContainerId: number;
  projectId: number;
  title: string;
  sortOrder: number;
  backgroundImageAspectRatio?: number;
  backgroundImageUrl?: string;
  backgroundImageFileName?: string;
  backgroundType: number; // 0 = general, 1 = interior, 2 = exterior
  subProjects?: SubProject[];
}

const InterorExteriorSection = ({ 
  deviceType,
  currentActiveSection,
  handleSectionNavigation,
 
}: {
  deviceType: string,
  currentActiveSection: "exterior" | "interior" | null
  handleSectionNavigation: (section: "interior" | "exterior") => void,
  setHoveredButton: (button: "interior" | "exterior" | null) => void,
  hoveredButton: string | null,
  exteriorSections: ProjectContainer[],
  interiorSections: ProjectContainer[],
}) => {
  return (
    <div>
      {/* Full-width transparent navigation bar */}
      <motion.div
        className="full-width-nav-bar"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          width: "100%",
          height: deviceType === "mobile" ? "40px" : deviceType === "tablet" ? "50px" : "60px",
          background: "rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(3px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: deviceType === "mobile" ? "0 20px" : "0 40px",
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Navigation titles container */}
        <div
          className="nav-titles-container"
          style={{
            position: "absolute",
            left: "75%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: deviceType === "mobile" ? "24px" : "32px",
            alignItems: "center",
          }}
        >
          {/* EXTERIOR Title */}
          <motion.div
            className={`section-nav-title ${
              currentActiveSection === "exterior" ? "active" : ""
            }`}
            onClick={() => handleSectionNavigation("exterior")}
            style={{
              color: "#000000",
              fontSize:
                deviceType === "mobile"
                  ? "16px"
                  : deviceType === "tablet"
                  ? "18px"
                  : "20px",
              fontWeight: "600",
              letterSpacing: "1px",
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              textShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
            }}
            whileHover={{ 
              scale: 1.1,
            }}
            whileTap={{ 
              scale: 0.95,
            }}
          >
            EXTERIOR
          </motion.div>

          {/* INTERIOR Title */}
          <motion.div
            className={`section-nav-title ${
              currentActiveSection === "interior" ? "active" : ""
            }`}
            onClick={() => handleSectionNavigation("interior")}
            style={{
              color: "#000000",
              fontSize:
                deviceType === "mobile"
                  ? "16px"
                  : deviceType === "tablet"
                  ? "18px"
                  : "20px",
              fontWeight: "600",
              letterSpacing: "1px",
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              textShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
            }}
            whileHover={{ 
              scale: 1.1,
            }}
            whileTap={{ 
              scale: 0.95,
            }}
          >
            INTERIOR
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default InterorExteriorSection