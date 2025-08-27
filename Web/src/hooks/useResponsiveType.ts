
import  { useState, useEffect } from 'react';

// Generic breakpoint configuration interface
interface BreakpointConfig<T> {
  maxWidth: number;
  value: T;
}

// Generic hook for breakpoint-based type detection
function useBreakpoint<T>(
  breakpoints: BreakpointConfig<T>[],
  defaultValue: T
): T {
  const [currentValue, setCurrentValue] = useState<T>(defaultValue);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      
      // Sort breakpoints by maxWidth in ascending order
      const sortedBreakpoints = [...breakpoints].sort((a, b) => a.maxWidth - b.maxWidth);
      
      // Find the first breakpoint that matches
      const matchedBreakpoint = sortedBreakpoints.find(bp => width <= bp.maxWidth);
      
      if (matchedBreakpoint) {
        setCurrentValue(matchedBreakpoint.value);
      } else {
        // If no breakpoint matches (screen is larger than all maxWidths), use default
        setCurrentValue(defaultValue);
      }
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoints, defaultValue]);

  return currentValue;
}

// Example usage with device types
type DeviceType = 'mobile' | 'tablet' | 'desktop';

export const useDeviceType = (): DeviceType => {
  return useBreakpoint<DeviceType>(
    [
      { maxWidth: 767, value: 'mobile' },
      { maxWidth: 1023, value: 'tablet' }
    ],
    'desktop' // Default value for screens > 1023px
  );
};

// Example usage with layout types
type LayoutType = 'compact' | 'normal' | 'expanded';

export const useLayoutType = (): LayoutType => {
  return useBreakpoint<LayoutType>(
    [
      { maxWidth: 640, value: 'compact' },
      { maxWidth: 1280, value: 'normal' }
    ],
    'expanded' // Default value for screens > 1280px
  );
};

// Example usage with column counts
export const useColumnCount = (): number => {
  return useBreakpoint<number>(
    [
      { maxWidth: 640, value: 1 },
      { maxWidth: 1024, value: 2 },
      { maxWidth: 1440, value: 3 }
    ],
    4 // Default value for screens > 1440px
  );
};

// Example usage with custom configuration object
interface ThemeConfig {
  sidebar: 'hidden' | 'collapsed' | 'expanded';
  fontSize: 'small' | 'medium' | 'large';
  spacing: 'tight' | 'normal' | 'loose';
}

export const useThemeConfig = (): ThemeConfig => {
  return useBreakpoint<ThemeConfig>(
    [
      { 
        maxWidth: 768, 
        value: { 
          sidebar: 'hidden', 
          fontSize: 'small', 
          spacing: 'tight' 
        } 
      },
      { 
        maxWidth: 1024, 
        value: { 
          sidebar: 'collapsed', 
          fontSize: 'medium', 
          spacing: 'normal' 
        } 
      }
    ],
    { 
      sidebar: 'expanded', 
      fontSize: 'large', 
      spacing: 'loose' 
    } // Default for screens > 1024px
  );
};
