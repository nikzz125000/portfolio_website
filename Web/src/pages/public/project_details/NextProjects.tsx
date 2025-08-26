import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, type Variants } from 'framer-motion';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

// Define proper interfaces for type safety
interface ProjectData {
  projectId: number;
  projectImageUrl?: string;
  name: string;
  animation: string;
  animationSpeed: string;
}

interface ApiResponse {
  data: ProjectData[];
}

interface DynamicImageShowcaseProps {
  data?: ApiResponse | null;
  handleButtomScrollButtonClick?: () => void;
}

type DeviceType = 'mobile' | 'tablet' | 'desktop';

// Style interfaces for type safety
interface MotionDivStyle extends React.CSSProperties {
  background?: string;
}

interface MotionImgStyle extends React.CSSProperties {
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  objectPosition?: string;
}

const NextProjects: React.FC<DynamicImageShowcaseProps> = ({ 
  data,
}) => {
  
  // Sample fallback images for reliability
  const SAMPLE_SUB_IMAGE = "https://placehold.co/400x300/718096/ffffff?text=Project+Image";
   
  // Limit data to maximum 2 items
  const limitedData: ProjectData[] = data?.data ? data.data.slice(0, 2) : [];
  const navigate = useNavigate();
  
  // Ref for scroll detection
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { 
    once: false, // Animation triggers every time element comes into view
    amount: 0.3 // Trigger when 30% of the element is visible
  });
  
  // Get device type for responsive design
  const getDeviceType = (): DeviceType => {
    const width = window.innerWidth;
    if (width <= 768) return 'mobile';
    if (width <= 1024) return 'tablet';
    return 'desktop';
  };

  // Get fixed height based on device type
  const getFixedHeight = (): number => {
    const device = getDeviceType();
    return device === 'mobile' ? 360 : device === 'tablet' ? 400 : 440;
  };

  // Function to get grid classes based on image count (now max 2)
  const getGridClasses = (count: number): string => {
    if (count === 1) return 'grid grid-cols-1 place-items-center gap-4';
    if (count === 2) return 'grid grid-cols-2 gap-4';
    return 'grid grid-cols-2 gap-4';
  };

  // Function to get animation classes
  const getAnimationClasses = (animation: string, speed: string): string => {
    const baseClasses = 'transition-all duration-300';
    
    if (animation === 'pulse') {
      const speedClass = speed === 'very-slow' ? 'animate-pulse' : 
                        speed === 'slow' ? 'animate-pulse' : 
                        'animate-pulse';
      return `${baseClasses} ${speedClass}`;
    }
    
    return baseClasses;
  };

  const handleSubImageClick = (subImageId: number): void => {
    navigate(`/project_details/${subImageId}`);
  };

  // Handle image error with proper typing
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>): void => {
    const target = e.currentTarget as HTMLImageElement;
    if (target.src !== SAMPLE_SUB_IMAGE) {
      target.src = SAMPLE_SUB_IMAGE;
    }
  };

  const deviceType = getDeviceType();
  const fixedHeight = getFixedHeight();

  // Animation variants for container
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.2
      }
    }
  };

  // Animation variants for images coming from left
  const imageLeftVariants: Variants = {
    hidden: { 
      opacity: 0, 
      x: -100,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  // Animation variants for images coming from right
  const imageRightVariants: Variants = {
    hidden: { 
      opacity: 0, 
      x: 100,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  // Hover animation variants
  const hoverVariants: Variants = {
    rest: { 
      scale: 1,
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    hover: { 
      scale: 1.05,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  // Image hover variants (for the img element itself)
  const imageHoverVariants: Variants = {
    rest: { 
      scale: 1,
      filter: "brightness(1)",
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    hover: { 
      scale: 1.1,
      filter: "brightness(1.1)",
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  // Additional variants for inline usage
 
  const textVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: 0.3,
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const footerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        delay: 0.5,
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <>
      {/* Show loading spinner while data is being processed */}
      {!data && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            height: `${fixedHeight}px`,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: deviceType === 'mobile' ? '20px 16px' : '32px 16px'
          }}
        >
          <LoadingSpinner
            variant="gradient"
            size="medium"
            text="Loading next projects..."
            fullHeight={false}
          />
        </motion.div>
      )}
      
      {data?.data?.length && data.data.length > 0 ? (
        <motion.div 
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          style={{
            height: `${fixedHeight}px`,
            width: '100%',
            maxWidth: '1152px',
            margin: '0 auto',
            padding: deviceType === 'mobile' ? '20px 16px' : '32px 16px',
            // background: 'linear-gradient(135deg, #6e226e 0%, #a5206a 14%, #d31663 28%, #ed3176 42%, #fd336b 56%, #f23d64 70%, #f65d55 84%, #f5655d 100%)',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          } as MotionDivStyle}
        >
          {/* Dynamic grid based on image count (max 2) */}
          <div className={getGridClasses(limitedData.length)} style={{
            height: deviceType === 'mobile' ? '280px' : deviceType === 'tablet' ? '320px' : '380px',
            alignItems: 'center',
            width: '100%'
          }}>
            {limitedData.map((image: ProjectData, index: number) => {
              // Determine animation variant based on count and index
              let variants;
              if (limitedData.length === 1) {
                variants = imageLeftVariants; // Single image comes from left
              } else {
                variants = index === 0 ? imageLeftVariants : imageRightVariants; // First from left, second from right
              }

              return (
                <motion.div 
                  key={image.projectId} 
                  variants={variants}
                  style={{ 
                    width: '100%', 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  {/* Image container with fixed aspect ratio */}
                  <motion.div 
                    variants={hoverVariants}
                    initial="rest"
                    whileHover="hover"
                  
                    style={{
                      width: '100%',
                      height: limitedData.length === 1 ? 
                        (deviceType === 'mobile' ? '240px' : deviceType === 'tablet' ? '280px' : '320px') : 
                        (deviceType === 'mobile' ? '200px' : deviceType === 'tablet' ? '240px' : '280px'),
                      borderRadius: '6px',
                      overflow: 'hidden',
                      // cursor: 'pointer',
                      position: 'relative',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    } as MotionDivStyle}
                    onClick={() => handleSubImageClick(image.projectId)}
                  >
                    <motion.img
                      variants={imageHoverVariants}
                      src={
                        image.projectImageUrl &&
                        image.projectImageUrl.trim() !== ""
                          ? image.projectImageUrl
                          : SAMPLE_SUB_IMAGE
                      }
                      alt={image.name}
                      className={getAnimationClasses(image.animation, image.animationSpeed)}
                      id ='nextProjectImage'
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        width: 'auto',
                        height: 'auto',
                        objectFit: 'contain',
                        objectPosition: 'center',
                        display: 'block'
                      } as MotionImgStyle}
                      onError={handleImageError}
                    />
                  </motion.div>
                  
                  {/* Image name */}
                  <motion.div 
                    variants={textVariants}
                    style={{
                      marginTop: '8px',
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      textAlign: 'center',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '100%',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {image.name}
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* Count info */}
          <motion.div 
            variants={footerVariants}
            style={{
              marginTop: '8px',
              textAlign: 'center',
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.6)'
            }}
          >
            Next projects
          </motion.div>
        </motion.div>
      ) : (
        /* Show message when no next projects available */
        data && data.data && data.data.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              height: `${fixedHeight}px`,
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: deviceType === 'mobile' ? '20px 16px' : '32px 16px'
            }}
          >
            <div style={{ 
              maxWidth: '1152px',
              width: '100%',
              margin: '0 auto',
              textAlign: 'center'
            }}>
              <div style={{
                padding: deviceType === 'mobile' ? '20px' : '32px',
                backgroundColor: '#f7fafc',
                borderRadius: '8px',
                color: '#4a5568'
              }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: '600' }}>
                  No More Projects
                </h3>
                <p style={{ margin: '0', fontSize: '14px' }}>
                  You've reached the end of the project showcase.
                </p>
              </div>
            </div>
          </motion.div>
        ) : null
      )}
    </>
  );
};

export default NextProjects;