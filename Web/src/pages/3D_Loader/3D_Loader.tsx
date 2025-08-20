/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';

// LoadingSpinner Component
interface LoadingSpinnerProps {
  variant: 'gradient' | 'solid';
  size: 'small' | 'medium' | 'large';
  text: string;
  fullHeight: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  variant, 
  size, 
  text, 
  fullHeight 
}) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  const spinnerClass = variant === 'gradient' 
    ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500' 
    : 'bg-blue-500';

  return (
    <div className={`flex flex-col items-center justify-center bg-black ${fullHeight ? 'h-full' : 'h-screen'}`}>
      <div className={`${sizeClasses[size]} rounded-full ${spinnerClass} animate-spin`}>
        <div className="w-full h-full rounded-full bg-black opacity-20"></div>
      </div>
      <p className="text-white mt-4 text-lg font-medium">{text}</p>
    </div>
  );
};

// Define types for better TypeScript support
interface SketchfabAPI {
  play: () => void;
  pause: () => void;
  stop: () => void;
  seekTo: (time: number) => void;
  setCameraLookAt: (position: number[], target: number[], up: number[], duration?: number) => void;
  setMaterial: (materialId: string | number, properties: any) => void;
  addEventListener: (event: string, callback: (data?: any) => void) => void;
  getCurrentTime: (callback: (time: number) => void) => void;
  start: (callback: () => void) => void;
}

interface FastSketchfabPlayerProps {
  modelId?: string;
  autoStart?: boolean;
  className?: string;
  onReady?: (api: SketchfabAPI) => void;
}

interface FastSketchfabPlayerRef {
  play: () => void;
  pause: () => void;
  stop: () => void;
  seekTo: (time: number) => void;
  setCamera: (position: number[], target: number[], duration?: number) => void;
  changeMaterial: (materialId: string | number, properties: any) => void;
  api: SketchfabAPI | null;
}

const FastSketchfabPlayer = forwardRef<FastSketchfabPlayerRef, FastSketchfabPlayerProps>(({ 
  modelId = "6892665c7d574d3f87586ff0aee7528e",
  autoStart = true,
  className = "",
  onReady = null 
}, ref) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [api, setApi] = useState<SketchfabAPI | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const apiInstanceRef = useRef<SketchfabAPI | null>(null);

  useEffect(() => {
    if (!(window as any).Sketchfab || !iframeRef.current) return;

    const iframe = iframeRef.current;
    const client = new (window as any).Sketchfab(iframe);

    // Inject CSS to hide all UI elements after iframe loads
    const injectHideCSS = () => {
      setTimeout(() => {
        try {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
          if (iframeDoc) {
            const style = iframeDoc.createElement('style');
            style.textContent = `
              /* Hide all Sketchfab UI controls */
              .controls,
              .watermark,
              .animation-controls,
              .hotspot-controls,
              .general-controls,
              .widget,
              .control,
              .timeline,
              .animation-controls__buttons,
              .viewer-icon-fullscreen,
              .viewer-icon-vr,
              .viewer-icon-gear,
              .viewer-icon-inspector,
              .viewer-icon-question,
              .volume,
              .settings,
              .inspector,
              .vr,
              .fullscreen,
              .help,
              [data-action="watermark"],
              [class*="viewer-icon-"],
              .sketchfab-watermark,
              .sketchfab-attribution {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
                pointer-events: none !important;
              }
              
              /* Hide any potential overlay or UI containers */
              div[class*="control"],
              div[class*="widget"],
              div[class*="ui-"],
              a[class*="control"] {
                display: none !important;
              }
              
              /* Ensure the 3D viewer takes full space */
              canvas,
              .viewer-container,
              .viewer,
              #viewer {
                width: 100% !important;
                height: 100% !important;
              }
            `;
            iframeDoc.head.appendChild(style);
            console.log('Custom CSS injected to hide Sketchfab UI');
          }
        } catch (error) {
          console.warn('Could not inject CSS into iframe:', error);
        }
      }, 1000);
    };

    // Fallback timeout to hide loading spinner (max 10 seconds)
    const fallbackTimeout = setTimeout(() => {
      console.log('Fallback: Hiding loading spinner after timeout');
      setIsLoading(false);
    }, 10000);

    // Fast initialization - completely clean UI
    client.init('', {
      success: (apiInstance: SketchfabAPI) => {
        console.log('Sketchfab API initialized');
        setApi(apiInstance);
        apiInstanceRef.current = apiInstance;
        
        apiInstance.start(() => {
          console.log('Sketchfab started');
          
          // Multiple event listeners to ensure loading stops
          apiInstance.addEventListener('viewerready', () => {
            console.log('Viewer ready - hiding loading spinner');
            injectHideCSS();
            clearTimeout(fallbackTimeout);
            setIsLoading(false);
            
            if (autoStart) {
              apiInstance.play();
            }
            
            if (onReady) {
              onReady(apiInstance);
            }
          });

          // Additional event listeners as fallbacks
          apiInstance.addEventListener('viewerstart', () => {
            console.log('Viewer started - hiding loading spinner');
            clearTimeout(fallbackTimeout);
            injectHideCSS();
            setIsLoading(false);
          });

          // Fallback after 3 seconds of start
          setTimeout(() => {
            console.log('3 second fallback - hiding loading spinner');
            clearTimeout(fallbackTimeout);
            setIsLoading(false);
            injectHideCSS()
            if (autoStart) {
              apiInstance.play();
            }
          }, 3000);
        });
      },
      error: (error: any) => {
        console.error('Sketchfab error:', error);
        clearTimeout(fallbackTimeout);
        setIsLoading(false);
      },
      // Completely clean UI - hide everything
      ui_theme: 'dark',
      ui_controls: 0,        // Hide all default controls
      ui_infos: 0,          // Hide model info
      ui_inspector: 0,      // Hide inspector
      ui_stop: 0,           // Hide stop button  
      ui_watermark: 0,      // Hide watermark
      ui_annotations: 0,    // Hide annotations
      ui_loading: 0,        // Hide loading screen
      ui_hint: 0,           // Hide hints
      ui_help: 0,           // Hide help
      ui_settings: 0,       // Hide settings
      ui_vr: 0,             // Hide VR button
      ui_fullscreen: 0,     // Hide fullscreen button
      ui_ar: 0,             // Hide AR button
      autostart: 1,         // Start immediately
      preload: 1           // Preload for speed
    });

    // Cleanup
    return () => {
      if (apiInstanceRef.current) {
        try {
          apiInstanceRef.current.stop();
        } catch (error) {
          console.warn('Error stopping Sketchfab player:', error);
        }
      }
    };
  }, [modelId, autoStart, onReady]);

  // Dynamic control functions
  const play = (): void => {
    if (api) {
      api.play();
    }
  };

  const pause = (): void => {
    if (api) {
      api.pause();
    }
  };

  const stop = (): void => {
    if (api) {
      api.stop();
    }
  };

  const seekTo = (time: number): void => {
    if (api) {
      api.seekTo(time);
    }
  };

  const setCamera = (position: number[], target: number[], duration: number = 1.0): void => {
    if (api) {
      api.setCameraLookAt(position, target, [0, 1, 0], duration);
    }
  };

  const changeMaterial = (materialId: string | number, properties: any): void => {
    if (api) {
      api.setMaterial(materialId, properties);
    }
  };

  // Expose control methods to parent
  useImperativeHandle(ref, () => ({
    play,
    pause,
    stop,
    seekTo,
    setCamera,
    changeMaterial,
    api
  }), [api]);

  return (
    <div className={`relative ${className}`}>
      {/* Custom Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 z-10">
          <LoadingSpinner
            variant="gradient"
            size="large"
            text="Loading your portfolio..."
            fullHeight={true}
          />
        </div>
      )}
      
      <iframe
        ref={iframeRef}
        src={`https://sketchfab.com/models/${modelId}/embed?ui_theme=dark&ui_controls=0&ui_infos=0&ui_stop=0&ui_watermark=0&ui_loading=0&ui_hint=0&ui_help=0&ui_settings=0&ui_vr=0&ui_fullscreen=0&ui_ar=0&autostart=1&preload=1`}
        className="w-full h-full border-0"
        frameBorder="0"
        allow="autoplay; fullscreen; xr-spatial-tracking"
        allowFullScreen
        title="3D Model"
        style={{ 
          border: 'none',
          outline: 'none',
          background: 'transparent'
        }}
      />
    </div>
  );
});

FastSketchfabPlayer.displayName = 'FastSketchfabPlayer';

// Fullscreen 3D Viewer Component
const FullScreen3DViewer: React.FC = () => {
  const playerRef = useRef<FastSketchfabPlayerRef>(null);

  // Handle when player is ready - optional camera positioning
  const handlePlayerReady = (api: SketchfabAPI): void => {
    console.log('3D Model loaded successfully');
    
    // Optional: Set initial camera position for best view
    setTimeout(() => {
      api.setCameraLookAt([0, 0, 8], [0, 0, 0], [0, 1, 0], 1.0);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black overflow-hidden">
      <FastSketchfabPlayer
        ref={playerRef}
        modelId="6892665c7d574d3f87586ff0aee7528e"
        autoStart={true}
        className="w-full h-full"
        onReady={handlePlayerReady}
      />
    </div>
  );
};

export default FullScreen3DViewer;