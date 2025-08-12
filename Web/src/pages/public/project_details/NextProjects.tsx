import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';


interface DynamicImageShowcaseProps {
  data: any;
  handleButtomScrollButtonClick?: () => void;
}

const NextProjects: React.FC<DynamicImageShowcaseProps> = ({ 
  data,
  handleButtomScrollButtonClick
}) => {
  
  // Sample fallback images for reliability
  const SAMPLE_BACKGROUND_IMAGE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080"><rect width="1920" height="1080" fill="%232d3748"/><text x="960" y="100" text-anchor="middle" fill="white" font-family="Arial" font-size="48">Portfolio Background</text><text x="960" y="160" text-anchor="middle" fill="%23a0aec0" font-family="Arial" font-size="24">with Project Placeholders</text><rect x="200" y="300" width="300" height="200" fill="%234a5568" stroke="%23a0aec0" stroke-width="2" rx="8"/><text x="350" y="420" text-anchor="middle" fill="white" font-family="Arial" font-size="16">Project 1</text><rect x="800" y="400" width="280" height="180" fill="%234a5568" stroke="%23a0aec0" stroke-width="2" rx="8"/><text x="940" y="510" text-anchor="middle" fill="white" font-family="Arial" font-size="16">Project 2</text><rect x="1400" y="350" width="320" height="220" fill="%234a5568" stroke="%23a0aec0" stroke-width="2" rx="8"/><text x="1560" y="480" text-anchor="middle" fill="white" font-family="Arial" font-size="16">Project 3</text></svg>`;
  const SAMPLE_SUB_IMAGE = "https://placehold.co/400x300/718096/ffffff?text=Project+Image";
   
  console.log("NextProjects data:", data);

  // Limit data to maximum 2 items
  const limitedData = data?.data ? data.data.slice(0, 2) : [];
   const navigate = useNavigate();
  // Get device type for responsive design
  const getDeviceType = () => {
    const width = window.innerWidth;
    if (width <= 768) return 'mobile';
    if (width <= 1024) return 'tablet';
    return 'desktop';
  };

  // FIXED: Get fixed height based on device type
  const getFixedHeight = () => {
    const device = getDeviceType();
    // Reduce overall section height; images will be taller inside
    return device === 'mobile' ? 360 : device === 'tablet' ? 400 : 440;
  };

  // Function to get grid classes based on image count (now max 2)
  const getGridClasses = (count: number) => {
    if (count === 1) return 'grid grid-cols-1 place-items-center gap-4';
    if (count === 2) return 'grid grid-cols-2 gap-4';
    return 'grid grid-cols-2 gap-4'; // fallback for any edge cases
  };

  // Function to get animation classes
  const getAnimationClasses = (animation: string, speed: string) => {
    const baseClasses = 'transition-all duration-300';
    
    if (animation === 'pulse') {
      const speedClass = speed === 'very-slow' ? 'animate-pulse' : 
                        speed === 'slow' ? 'animate-pulse' : 
                        'animate-pulse';
      return `${baseClasses} ${speedClass}`;
    }
    
    return baseClasses;
  };

  const handleSubImageClick = (subImageId: number) => {
    console.log(`Navigating to project ${subImageId}`);
    
    // Scroll to top before navigation if handler is provided
    if (handleButtomScrollButtonClick) {
      handleButtomScrollButtonClick();
    } else {
      // Fallback scroll to top
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }
    
    // Small delay to allow scroll to start, then navigate
    setTimeout(() => {
      navigate(`/project_details/${subImageId}`);
    }, 100);
  };

  const deviceType = getDeviceType();
  const fixedHeight = getFixedHeight();

  return (<>
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
    
    {data?.data?.length > 0 ? <div 
      style={{
        height: `${fixedHeight}px`, // FIXED: Use fixed height instead of py-16
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
          {/* Heading removed as requested */}

          {/* Dynamic grid based on image count (max 2) */}
          <div className={getGridClasses(limitedData.length)} style={{
            height: deviceType === 'mobile' ? '280px' : deviceType === 'tablet' ? '320px' : '380px',
            alignItems: 'center'
          }}>
            {limitedData.map((image) => (
              <div key={image.projectId} style={{ width: '100%', height: '100%' }}>
                <img
                  src={
                    image.projectImageUrl &&
                    image.projectImageUrl.trim() !== ""
                      ? image.projectImageUrl
                      : SAMPLE_SUB_IMAGE
                  }
                  alt={image.name}
                  className={`w-full object-cover rounded ${getAnimationClasses(image.animation, image.animationSpeed)}`}
                  style={{
                    // Make images taller so background is less visible
                    height: limitedData.length === 1 ? 
                      (deviceType === 'mobile' ? '260px' : deviceType === 'tablet' ? '320px' : '360px') : 
                      (deviceType === 'mobile' ? '220px' : deviceType === 'tablet' ? '280px' : '340px'),
                    width: '100%',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease'
                  }}
                  onClick={() => handleSubImageClick(image.projectId)}
                  onError={(e) => {
                    // Fallback to sample image if the original fails to load
                    if (e.currentTarget.src !== SAMPLE_SUB_IMAGE) {
                      e.currentTarget.src = SAMPLE_SUB_IMAGE;
                    }
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                />
                {/* Image name */}
                <div style={{
                  marginTop: '8px',
                  fontSize: '12px',
                  color: '#6b7280',
                  textAlign: 'center',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '100%'
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
    </div> : (
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
    {/* End of NextProjects section */}
    </>
  );
};

export default NextProjects;