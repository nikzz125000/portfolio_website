import React from 'react';

interface ImageData {
  projectId: number;
  name: string;
  projectImageUrl: string;
  xPosition: number;
  yPosition: number;
  heightPercent: number;
  animation: string;
  animationSpeed: string;
  animationTrigger: string;
  isExterior: boolean;
}

interface DynamicImageShowcaseProps {
  images?: ImageData[];
}

const NextProjects: React.FC<DynamicImageShowcaseProps> = ({ 
  images = [
    {
      projectId: 1,
      name: "Sample Image 1",
      projectImageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
      xPosition: 0,
      yPosition: 0,
      heightPercent: 20,
      animation: "none",
      animationSpeed: "normal",
      animationTrigger: "continuous",
      isExterior: true
    },
    {
      projectId: 2,
      name: "Sample Image 2",
      projectImageUrl: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&h=400&fit=crop",
      xPosition: 0,
      yPosition: 0,
      heightPercent: 20,
      animation: "none",
      animationSpeed: "normal",
      animationTrigger: "continuous",
      isExterior: true
    }
  ]
}) => {
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

  // Function to get grid classes based on image count
  const getGridClasses = (count: number) => {
    if (count === 1) return 'grid grid-cols-1 place-items-center gap-4';
    if (count === 2) return 'grid grid-cols-2 gap-4';
    if (count === 3) return 'grid grid-cols-3 gap-4';
    if (count === 4) return 'grid grid-cols-2 md:grid-cols-4 gap-4';
    return 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4';
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

  const deviceType = getDeviceType();
  const fixedHeight = getFixedHeight();

  return (
    <div 
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

          {/* Dynamic grid based on image count */}
          <div className={getGridClasses(images.length)} style={{
            height: deviceType === 'mobile' ? '280px' : deviceType === 'tablet' ? '320px' : '380px',
            alignItems: 'center'
          }}>
            {images.map((image) => (
              <div key={image.projectId} style={{ width: '100%', height: '100%' }}>
                <img
                  src={image.projectImageUrl}
                  alt={image.name}
                  className={`w-full object-cover rounded ${getAnimationClasses(image.animation, image.animationSpeed)}`}
                  style={{
                    // Make images taller so background is less visible
                    height: images.length === 1 ? 
                      (deviceType === 'mobile' ? '260px' : deviceType === 'tablet' ? '320px' : '360px') : 
                      (deviceType === 'mobile' ? '220px' : deviceType === 'tablet' ? '280px' : '340px'),
                    width: '100%',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease'
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
            Displaying {images.length} image{images.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NextProjects;