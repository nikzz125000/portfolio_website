import React from 'react';
import { useNavigate } from 'react-router-dom';
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

const NextProjects: React.FC<DynamicImageShowcaseProps> = ({ 
  data,
}) => {
  
  // Sample fallback images for reliability
  const SAMPLE_SUB_IMAGE = "https://placehold.co/400x300/718096/ffffff?text=Project+Image";
   
  // Limit data to maximum 2 items
  const limitedData: ProjectData[] = data?.data ? data.data.slice(0, 2) : [];
  const navigate = useNavigate();
  
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
    // If no scroll handler, navigate immediately
    navigate(`/project_details/${subImageId}`);
  };

  // Handle mouse events with proper typing
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>): void => {
    (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.02)';
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>): void => {
    (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
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

  return (
    <>
      {/* Show loading spinner while data is being processed */}
      {!data && (
        <div 
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
        </div>
      )}
      
      {data?.data?.length && data.data.length > 0 ? (
        <div 
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
            margin: '0 auto'
          }}>
            {/* Container */}
            <div style={{
              padding: deviceType === 'mobile' ? '10px' : '12px',
              backgroundColor: '#e5e7eb',
              borderRadius: '8px',
              height: deviceType === 'mobile' ? '320px' : deviceType === 'tablet' ? '350px' : '390px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              {/* Dynamic grid based on image count (max 2) */}
              <div className={getGridClasses(limitedData.length)} style={{
                height: deviceType === 'mobile' ? '280px' : deviceType === 'tablet' ? '320px' : '380px',
                alignItems: 'center'
              }}>
                {limitedData.map((image: ProjectData) => (
                  <div key={image.projectId} style={{ 
                    width: '100%', 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    {/* Image container with fixed aspect ratio */}
                    <div style={{
                      width: '100%',
                      height: limitedData.length === 1 ? 
                        (deviceType === 'mobile' ? '240px' : deviceType === 'tablet' ? '280px' : '320px') : 
                        (deviceType === 'mobile' ? '200px' : deviceType === 'tablet' ? '240px' : '280px'),
                      borderRadius: '6px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      position: 'relative',
                      backgroundColor: '#f3f4f6',
                      transition: 'transform 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onClick={() => handleSubImageClick(image.projectId)}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    >
                      <img
                        src={
                          image.projectImageUrl &&
                          image.projectImageUrl.trim() !== ""
                            ? image.projectImageUrl
                            : SAMPLE_SUB_IMAGE
                        }
                        alt={image.name}
                        className={getAnimationClasses(image.animation, image.animationSpeed)}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          width: 'auto',
                          height: 'auto',
                          objectFit: 'contain', // Changed from 'cover' to 'contain'
                          objectPosition: 'center',
                          display: 'block'
                        }}
                        onError={handleImageError}
                      />
                    </div>
                    
                    {/* Image name */}
                    <div style={{
                      marginTop: '8px',
                      fontSize: '12px',
                      color: '#6b7280',
                      textAlign: 'center',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '100%',
                      height: '20px', // Fixed height for consistent layout
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {image.name}
                    </div>
                  </div>
                ))}
              </div>

              {/* Count info */}
              <div style={{
                marginTop: '8px',
                textAlign: 'center',
                fontSize: '12px',
                color: '#9ca3af'
              }}>
                Next projects
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Show message when no next projects available */
        data && data.data && data.data.length === 0 ? (
          <div 
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
          </div>
        ) : null
      )}
    </>
  );
};

export default NextProjects;