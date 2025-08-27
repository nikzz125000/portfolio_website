import React, { useState, useEffect, useRef, } from "react";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import { useSaveScrollSpeed } from "../../../api/useSaveWebsiteSettings";
import { useNotification } from "../../../components/Tostr";
import { useScrollerSpeedSettings } from "../../../api/useScrollSpeedSettings";
import { CustomCursor } from "../../../components/CustomCursor";

// Mock device type detection
const getDeviceType = () => {
  const width = window.innerWidth;
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
};



// Scroll speed settings interface
interface ScrollSpeedSettings {
  wheel: number;
  touch: number;
  keyboard: number;
  momentum: number;
  smoothness: number;
}

// Predefined scroll speed presets
const SCROLL_SPEED_PRESETS: { [key: string]: ScrollSpeedSettings } = {
  "very-slow": {
    wheel: 0.1,
    touch: 0.3,
    keyboard: 0.5,
    momentum: 0.15,
    smoothness: 0.04,
  },
  slow: {
    wheel: 0.15,
    touch: 0.45,
    keyboard: 0.7,
    momentum: 0.2,
    smoothness: 0.06,
  },
  normal: {
    wheel: 0.3,
    touch: 0.8,
    keyboard: 1.5,
    momentum: 0.4,
    smoothness: 0.12,
  },
  fast: {
    wheel: 0.35,
    touch: 0.9,
    keyboard: 1.8,
    momentum: 0.45,
    smoothness: 0.14,
  },
  "very-fast": {
    wheel: 0.45,
    touch: 1.0,
    keyboard: 2.0,
    momentum: 0.5,
    smoothness: 0.16,
  },
};

const DEFAULT_SETTINGS: ScrollSpeedSettings = SCROLL_SPEED_PRESETS.slow;

// Scroll Test Container Component
const ScrollTestContainer: React.FC<{
  title: string;
  settings: ScrollSpeedSettings;
  deviceType: string;
  isDeviceAdjusted: boolean;
}> = ({ title, settings, deviceType, isDeviceAdjusted }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [lastTouchY, setLastTouchY] = useState<number | null>(null);

  // Sample content for scrolling
  const sampleContent = [
    "🌟 Welcome to the Scroll Speed Test",
    "This interactive container lets you test how your scroll settings feel in real-time.",
    "🖱️ Try using your mouse wheel to scroll up and down",
    "⌨️ Use arrow keys (↑ ↓) to test keyboard scrolling",
    "📱 On mobile/tablet, try touch gestures and swipe scrolling",
    "The momentum setting controls how much the content continues scrolling after you stop",
    "Smoothness affects how fluid the scrolling animation feels",
    "Higher wheel/touch/keyboard speeds make content scroll faster with each input",
    "🎯 This container uses your current settings:",
    `Wheel Speed: ${settings.wheel.toFixed(2)}`,
    `Touch Speed: ${settings.touch.toFixed(2)}`,
    `Keyboard Speed: ${settings.keyboard.toFixed(2)}`,
    `Momentum: ${settings.momentum.toFixed(2)}`,
    `Smoothness: ${settings.smoothness.toFixed(3)}`,
    "You can see how different settings affect the scroll experience",
    "Try adjusting the sliders above and see the difference immediately",
    "🚀 Fast settings make everything zoom by quickly",
    "🐌 Slow settings give you more precise control",
    "Find the perfect balance for your users' needs",
    "Remember that mobile devices get automatic speed adjustments",
    "The device-adjusted container shows how it will feel on this device type",
    "Test both containers to see the difference",
    "🎮 Happy scrolling!"
  ];

  // Custom scroll function that applies speed settings
  const scrollTo = (targetPosition: number) => {
    if (!containerRef.current || !contentRef.current) return;
    
    const maxScroll = contentRef.current.scrollHeight - containerRef.current.clientHeight;
    const clampedPosition = Math.max(0, Math.min(targetPosition, maxScroll));
    
    setScrollPosition(clampedPosition);
    contentRef.current.style.transform = `translateY(-${clampedPosition}px)`;
  };

  // Handle wheel events with custom speed
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Stop event from bubbling up to main page
    const scrollAmount = e.deltaY * settings.wheel;
    scrollTo(scrollPosition + scrollAmount);
  };

  // Handle keyboard events with custom speed
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      e.stopPropagation(); // Stop event from bubbling up to main page
      const scrollAmount = (e.key === 'ArrowDown' ? 1 : -1) * settings.keyboard * 20;
      scrollTo(scrollPosition + scrollAmount);
    }
  };

  // Handle touch events with custom speed
  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation(); // Stop event from bubbling up to main page
    if (e.touches.length === 1) {
      setLastTouchY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Stop event from bubbling up to main page
    if (e.touches.length === 1 && lastTouchY !== null) {
      const touch = e.touches[0];
      const deltaY = lastTouchY - touch.clientY;
      const scrollAmount = deltaY * settings.touch;
      scrollTo(scrollPosition + scrollAmount);
      setLastTouchY(touch.clientY);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation(); // Stop event from bubbling up to main page
    setLastTouchY(null);
  };

  // Calculate scroll percentage for indicator
  const getScrollPercentage = () => {
    if (!containerRef.current || !contentRef.current) return 0;
    const maxScroll = contentRef.current.scrollHeight - containerRef.current.clientHeight;
    return maxScroll > 0 ? (scrollPosition / maxScroll) * 100 : 0;
  };

  return (
    <div>
      <h4 style={{ 
        fontSize: "16px", 
        fontWeight: "600", 
        marginBottom: "10px", 
        color: "#475569",
        textAlign: "center"
      }}>
        {title}
      </h4>
      
      {/* Settings Display */}
      <div style={{
        background: isDeviceAdjusted ? "rgba(255, 248, 220, 0.5)" : "rgba(241, 245, 249, 0.5)",
        borderRadius: "6px",
        padding: "8px 12px",
        marginBottom: "10px",
        fontSize: "12px",
        color: isDeviceAdjusted ? "#92400e" : "#64748b"
      }}>
        W:{settings.wheel.toFixed(2)} | T:{settings.touch.toFixed(2)} | K:{settings.keyboard.toFixed(2)} | M:{settings.momentum.toFixed(2)} | S:{settings.smoothness.toFixed(3)}
      </div>

      {/* Scrollable Container */}
      <div
        ref={containerRef}
        tabIndex={0}
        onWheel={handleWheel}
        onKeyDown={handleKeyDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="scroll-container"
        style={{
          height: "300px",
          overflow: "hidden", // Use hidden to prevent native scrolling
          border: `2px solid ${isDeviceAdjusted ? "#f59e0b" : "#667eea"}`,
          borderRadius: "8px",
          background: isDeviceAdjusted 
            ? "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)"
            : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
          cursor: "grab",
          outline: "none",
          position: "relative"
        }}
      >
        {/* Scroll Position Indicator */}
        <div style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          background: "rgba(0, 0, 0, 0.6)",
          color: "white",
          padding: "4px 8px",
          borderRadius: "4px",
          fontSize: "10px",
          fontWeight: "600",
          zIndex: 10
        }}>
          Pos: {Math.round(scrollPosition)}px
        </div>

        {/* Scrollable Content */}
        <div
          ref={contentRef}
          style={{
            padding: "20px",
            minHeight: "800px",
            transform: `translateY(-${scrollPosition}px)`,
            transition: `transform ${settings.smoothness}s ease-out`,
            willChange: "transform"
          }}
        >
          {/* Content */}
          {sampleContent.map((line, index) => (
            <div
              key={index}
              style={{
                marginBottom: "16px",
                lineHeight: "1.6",
                color: isDeviceAdjusted ? "#92400e" : "#475569",
                fontSize: "14px",
                fontWeight: line.includes("🌟") || line.includes("🎯") || line.includes("🎮") ? "600" : "400"
              }}
            >
              {line}
            </div>
          ))}
        </div>

        {/* Custom Scroll Indicator Bar */}
        <div style={{
          position: "absolute",
          bottom: "10px",
          left: "10px",
          right: "10px",
          height: "4px",
          background: "rgba(0, 0, 0, 0.1)",
          borderRadius: "2px",
          overflow: "hidden",
          zIndex: 10
        }}>
          <div style={{
            height: "100%",
            width: `${getScrollPercentage()}%`,
            background: isDeviceAdjusted 
              ? "linear-gradient(to right, #f59e0b, #d97706)"
              : "linear-gradient(to right, #667eea, #764ba2)",
            transition: "width 0.1s ease-out"
          }} />
        </div>
      </div>

      {/* Instructions */}
      <div style={{
        marginTop: "8px",
        fontSize: "11px",
        color: "#9ca3af",
        textAlign: "center"
      }}>
        {deviceType === "mobile" ? "👆 Touch and swipe to test" : "🖱️ Scroll, use ↑↓ keys, or touch to test"}
        <br />
        <span style={{ fontSize: "10px", opacity: 0.8 }}>
          Notice the difference in scroll speed between containers!
        </span>
      </div>
    </div>
  );
};

const ScrollSpeedAdmin: React.FC = () => {
  const [deviceType, setDeviceType] = useState<string>(getDeviceType());
  const [currentSettings, setCurrentSettings] = useState<ScrollSpeedSettings>(DEFAULT_SETTINGS);
  const [originalSettings, setOriginalSettings] = useState<ScrollSpeedSettings>(DEFAULT_SETTINGS);
  const [selectedPreset, setSelectedPreset] = useState<string>("slow");
  const [, setIsCustomMode] = useState<boolean>(false);
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [showSuccessMessage, ] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [isLoadingSettings, ] = useState<boolean>(false);
  const [isSaving, ] = useState<boolean>(false);

   const { data } = useScrollerSpeedSettings();
console.log(55,data)
   const { mutate: saveScrollSpeed, isPending: isLoginPending } = useSaveScrollSpeed();

  // Mock API data - replace with real API when available
  const scrollSpeedData = { 
    data: {    
      wheel: 0.2, 
      touch: 0.6, 
      keyboard: 1.0, 
      momentum: 0.3, 
      smoothness: 0.08 
    } 
  };

  const findMatchingPreset = (settings: ScrollSpeedSettings): string | null => {
    for (const [presetName, presetSettings] of Object.entries(SCROLL_SPEED_PRESETS)) {
      if (settingsEqual(settings, presetSettings)) {
        return presetName;
      }
    }
    return null;
  };

  useEffect(() => {
  if(data?.data){
setCurrentSettings(data.data)
const current=findMatchingPreset(data.data)
setSelectedPreset(current || "custom");
  }
  }, [data?.data])
  

  console.log(123,currentSettings,selectedPreset,isLoginPending)

  // Load current settings from API
  useEffect(() => {
    if (scrollSpeedData?.data) {
      const apiSettings: ScrollSpeedSettings = {
        wheel: scrollSpeedData.data.wheel ?? DEFAULT_SETTINGS.wheel,
        touch: scrollSpeedData.data.touch ?? DEFAULT_SETTINGS.touch,
        keyboard: scrollSpeedData.data.keyboard ?? DEFAULT_SETTINGS.keyboard,
        momentum: scrollSpeedData.data.momentum ?? DEFAULT_SETTINGS.momentum,
        smoothness: scrollSpeedData.data.smoothness ?? DEFAULT_SETTINGS.smoothness,
      };
      
      console.log('📡 Loading settings from API:', {
        rawData: scrollSpeedData.data,
        processedSettings: apiSettings,
        timestamp: new Date().toISOString()
      });
      
      setCurrentSettings(apiSettings);
      setOriginalSettings(apiSettings);
      
      // Try to match with existing presets
      const matchingPreset = findMatchingPreset(apiSettings);
      if (matchingPreset) {
        setSelectedPreset(matchingPreset);
        setIsCustomMode(false);
        console.log('🎯 Matched API settings to preset:', matchingPreset);
      } else {
        setSelectedPreset("custom");
        setIsCustomMode(true);
        console.log('🔧 API settings are custom (no matching preset)');
      }
      setHasChanges(false);
    }
  }, []);

  // Check for changes whenever currentSettings change
  useEffect(() => {
    const hasChangesNow = !settingsEqual(currentSettings, originalSettings);
    setHasChanges(hasChangesNow);
  }, [currentSettings, originalSettings]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setDeviceType(getDeviceType());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Check if two settings objects are equal
  const settingsEqual = (settings1: ScrollSpeedSettings, settings2: ScrollSpeedSettings): boolean => {
    return Math.abs(settings1.wheel - settings2.wheel) < 0.001 &&
           Math.abs(settings1.touch - settings2.touch) < 0.001 &&
           Math.abs(settings1.keyboard - settings2.keyboard) < 0.001 &&
           Math.abs(settings1.momentum - settings2.momentum) < 0.001 &&
           Math.abs(settings1.smoothness - settings2.smoothness) < 0.001;
  };

  // Find matching preset for given settings
  

  // Handle preset selection
  const handlePresetChange = (preset: string) => {
    console.log('🎯 Preset changed:', { 
      from: selectedPreset, 
      to: preset,
      timestamp: new Date().toISOString() 
    });
    
    setSelectedPreset(preset);
    if (preset === "custom") {
      setIsCustomMode(true);
      console.log('🔧 Switched to custom mode');
    } else {
      setIsCustomMode(false);
      const presetSettings = SCROLL_SPEED_PRESETS[preset];
      if (presetSettings) {
        setCurrentSettings({ ...presetSettings });
        console.log('📋 Applied preset settings:', { preset, settings: presetSettings });
      }
    }
  };

  // Handle individual setting changes
  const handleSettingChange = (setting: keyof ScrollSpeedSettings, value: number) => {
    const newSettings = {
      ...currentSettings,
      [setting]: value,
    };
    setCurrentSettings(newSettings);
    
    console.log('⚙️ Setting changed:', { 
      setting, 
      oldValue: currentSettings[setting], 
      newValue: value,
      newSettings,
      timestamp: new Date().toISOString()
    });
    
    // Check if the new settings match any preset
    const matchingPreset = findMatchingPreset(newSettings);
    if (matchingPreset) {
      setSelectedPreset(matchingPreset);
      setIsCustomMode(false);
      console.log('🎯 Auto-detected matching preset:', matchingPreset);
    } else {
      setSelectedPreset("custom");
      setIsCustomMode(true);
      console.log('🔧 Switched to custom mode (no matching preset)');
    }
  };
    const { showNotification } = useNotification();  

  // Save settings to API
  const handleSaveSettings = async () => {
    saveScrollSpeed(currentSettings,{
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onSuccess: (res: any) => {
          if (res?.isSuccess) {
            showNotification("saved successfully!", "success", "Success");
           
          } else {
            showNotification(
              res?.message || "Failed to Save",
              "error",
              "Error"
            );
          }
        },
      })
  };

  // Reset to current API settings
  const handleResetSettings = () => {
    console.log('🔄 Resetting settings:', {
      from: currentSettings,
      to: originalSettings,
      timestamp: new Date().toISOString()
    });
    
    setCurrentSettings({ ...originalSettings });
    const matchingPreset = findMatchingPreset(originalSettings);
    if (matchingPreset) {
      setSelectedPreset(matchingPreset);
      setIsCustomMode(false);
      console.log('🎯 Reset to preset:', matchingPreset);
    } else {
      setSelectedPreset("custom");
      setIsCustomMode(true);
      console.log('🔧 Reset to custom settings');
    }
  };

  // Toggle preview mode
  const togglePreview = () => {
    const newPreviewState = !showPreview;
    setShowPreview(newPreviewState);
    console.log('👁️ Preview toggled:', { 
      showPreview: newPreviewState,
      currentSettings,
      deviceAdjustedSettings: getDeviceAdjustedPreview(),
      deviceType,
      timestamp: new Date().toISOString()
    });
  };

  // Get device-adjusted settings for preview
  const getDeviceAdjustedPreview = (): ScrollSpeedSettings => {
    let deviceMultiplier = 1;
    if (deviceType === "mobile") {
      deviceMultiplier = 1.5;
    } else if (deviceType === "tablet") {
      deviceMultiplier = 1.25;
    }

    return {
      wheel: currentSettings.wheel * deviceMultiplier,
      touch: currentSettings.touch * deviceMultiplier,
      keyboard: currentSettings.keyboard,
      momentum: currentSettings.momentum,
      smoothness: currentSettings.smoothness,
    };
  };

  // Responsive styles
  const getResponsiveStyles = () => {
    const isMobile = deviceType === "mobile";
    const isTablet = deviceType === "tablet";

    return {
      container: {
        padding: isMobile ? "20px" : isTablet ? "30px" : "40px",
        maxWidth: isMobile ? "100%" : isTablet ? "800px" : "1000px",
        margin: "0 auto",
      },
      card: {
        padding: isMobile ? "20px" : isTablet ? "30px" : "40px",
        borderRadius: isMobile ? "12px" : "16px",
      },
      grid: {
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "1fr 1fr 1fr",
        gap: isMobile ? "20px" : "30px",
      },
      button: {
        padding: isMobile ? "12px 24px" : "14px 28px",
        fontSize: isMobile ? "14px" : "16px",
      },
    };
  };

  const styles = getResponsiveStyles();

  if (isLoadingSettings) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}>
        <LoadingSpinner
          variant="gradient"
          size="large"
          text="Loading scroll speed settings..."
          fullHeight={true}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        paddingTop: "60px",
        paddingBottom: "60px",
      }}
    >
      <CustomCursor/>
      <div style={styles.container}>
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "40px",
            color: "white",
          }}
        >
          <h1
            style={{
              fontSize: deviceType === "mobile" ? "28px" : deviceType === "tablet" ? "36px" : "42px",
              fontWeight: "bold",
              marginBottom: "10px",
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
            }}
          >
            Scroll Speed Administration
          </h1>
         
        </div>

        {/* Success Message */}
        {showSuccessMessage && (
          <div
            style={{
              background: "rgba(34, 197, 94, 0.9)",
              color: "white",
              padding: "16px 24px",
              borderRadius: "12px",
              marginBottom: "30px",
              textAlign: "center",
              fontWeight: "500",
              boxShadow: "0 4px 20px rgba(34, 197, 94, 0.3)",
            }}
          >
            ✅ Scroll speed settings saved successfully!
          </div>
        )}

        {/* Main Settings Card */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            borderRadius: styles.card.borderRadius,
            padding: styles.card.padding,
            marginBottom: "30px",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          {/* Preset Selection */}
          <div style={{ marginBottom: "40px" }}>
            <h3
              style={{
                fontSize: deviceType === "mobile" ? "20px" : "24px",
                fontWeight: "bold",
                marginBottom: "20px",
                color: "#334155",
              }}
            >
              Quick Presets {selectedPreset && (
                <span style={{ fontSize: "16px", fontWeight: "normal", color: "#667eea" }}>
                  (Currently: {selectedPreset === "custom" ? "Custom" : selectedPreset.replace("-", " ")})
                </span>
              )}
            </h3>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                marginBottom: "20px",
              }}
            >
              {Object.keys(SCROLL_SPEED_PRESETS).map((preset) => (
                <button
                  key={preset}
                  onClick={() => handlePresetChange(preset)}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "8px",
                    border: "2px solid transparent",
                    background: selectedPreset === preset 
                      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                      : "rgba(102, 126, 234, 0.1)",
                    color: selectedPreset === preset ? "white" : "#667eea",
                    fontWeight: selectedPreset === preset ? "600" : "500",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    textTransform: "capitalize",
                    fontSize: deviceType === "mobile" ? "14px" : "16px",
                  }}
                >
                  {preset.replace("-", " ")}
                </button>
              ))}
              <button
                onClick={() => handlePresetChange("custom")}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "2px solid transparent",
                  background: selectedPreset === "custom" 
                    ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                    : "rgba(245, 158, 11, 0.1)",
                  color: selectedPreset === "custom" ? "white" : "#f59e0b",
                  fontWeight: selectedPreset === "custom" ? "600" : "500",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  fontSize: deviceType === "mobile" ? "14px" : "16px",
                }}
              >
                Custom
              </button>
            </div>
          </div>

          {/* Individual Settings Controls */}
          <div style={{ marginBottom: "40px" }}>
            <h3
              style={{
                fontSize: deviceType === "mobile" ? "20px" : "24px",
                fontWeight: "bold",
                marginBottom: "20px",
                color: "#334155",
              }}
            >
              Fine-Tune Settings
            </h3>
            
            <div style={styles.grid}>
              {/* Mouse Wheel Speed */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    color: "#475569",
                    fontSize: "14px",
                  }}
                >
                  Mouse Wheel Speed
                </label>
                <div
                  style={{
                    background: "rgba(241, 245, 249, 0.8)",
                    borderRadius: "8px",
                    padding: "15px",
                    border: "1px solid rgba(203, 213, 225, 0.5)",
                  }}
                >
                  <div style={{ marginBottom: "10px", textAlign: "center" }}>
                    <span style={{ fontSize: "18px", fontWeight: "bold", color: "#667eea" }}>
                      {currentSettings.wheel.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="1.0"
                    step="0.05"
                    value={currentSettings.wheel}
                    onChange={(e) => handleSettingChange("wheel", parseFloat(e.target.value))}
                    style={{
                      width: "100%",
                      height: "6px",
                      borderRadius: "3px",
                      background: "linear-gradient(to right, #e2e8f0, #667eea)",
                      outline: "none",
                      cursor: "pointer",
                    }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "5px", fontSize: "12px", color: "#64748b" }}>
                    <span>Slow</span>
                    <span>Fast</span>
                  </div>
                </div>
              </div>

              {/* Touch Speed */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    color: "#475569",
                    fontSize: "14px",
                  }}
                >
                  Touch/Swipe Speed
                </label>
                <div
                  style={{
                    background: "rgba(241, 245, 249, 0.8)",
                    borderRadius: "8px",
                    padding: "15px",
                    border: "1px solid rgba(203, 213, 225, 0.5)",
                  }}
                >
                  <div style={{ marginBottom: "10px", textAlign: "center" }}>
                    <span style={{ fontSize: "18px", fontWeight: "bold", color: "#667eea" }}>
                      {currentSettings.touch.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="2.0"
                    step="0.1"
                    value={currentSettings.touch}
                    onChange={(e) => handleSettingChange("touch", parseFloat(e.target.value))}
                    style={{
                      width: "100%",
                      height: "6px",
                      borderRadius: "3px",
                      background: "linear-gradient(to right, #e2e8f0, #667eea)",
                      outline: "none",
                      cursor: "pointer",
                    }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "5px", fontSize: "12px", color: "#64748b" }}>
                    <span>Slow</span>
                    <span>Fast</span>
                  </div>
                </div>
              </div>

              {/* Keyboard Speed */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    color: "#475569",
                    fontSize: "14px",
                  }}
                >
                  Keyboard Speed
                </label>
                <div
                  style={{
                    background: "rgba(241, 245, 249, 0.8)",
                    borderRadius: "8px",
                    padding: "15px",
                    border: "1px solid rgba(203, 213, 225, 0.5)",
                  }}
                >
                  <div style={{ marginBottom: "10px", textAlign: "center" }}>
                    <span style={{ fontSize: "18px", fontWeight: "bold", color: "#667eea" }}>
                      {currentSettings.keyboard.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="3.0"
                    step="0.1"
                    value={currentSettings.keyboard}
                    onChange={(e) => handleSettingChange("keyboard", parseFloat(e.target.value))}
                    style={{
                      width: "100%",
                      height: "6px",
                      borderRadius: "3px",
                      background: "linear-gradient(to right, #e2e8f0, #667eea)",
                      outline: "none",
                      cursor: "pointer",
                    }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "5px", fontSize: "12px", color: "#64748b" }}>
                    <span>Slow</span>
                    <span>Fast</span>
                  </div>
                </div>
              </div>

              {/* Momentum */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    color: "#475569",
                    fontSize: "14px",
                  }}
                >
                  Momentum Effect
                </label>
                <div
                  style={{
                    background: "rgba(241, 245, 249, 0.8)",
                    borderRadius: "8px",
                    padding: "15px",
                    border: "1px solid rgba(203, 213, 225, 0.5)",
                  }}
                >
                  <div style={{ marginBottom: "10px", textAlign: "center" }}>
                    <span style={{ fontSize: "18px", fontWeight: "bold", color: "#667eea" }}>
                      {currentSettings.momentum.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={currentSettings.momentum}
                    onChange={(e) => handleSettingChange("momentum", parseFloat(e.target.value))}
                    style={{
                      width: "100%",
                      height: "6px",
                      borderRadius: "3px",
                      background: "linear-gradient(to right, #e2e8f0, #667eea)",
                      outline: "none",
                      cursor: "pointer",
                    }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "5px", fontSize: "12px", color: "#64748b" }}>
                    <span>None</span>
                    <span>High</span>
                  </div>
                </div>
              </div>

              {/* Smoothness */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    color: "#475569",
                    fontSize: "14px",
                  }}
                >
                  Smoothness
                </label>
                <div
                  style={{
                    background: "rgba(241, 245, 249, 0.8)",
                    borderRadius: "8px",
                    padding: "15px",
                    border: "1px solid rgba(203, 213, 225, 0.5)",
                  }}
                >
                  <div style={{ marginBottom: "10px", textAlign: "center" }}>
                    <span style={{ fontSize: "18px", fontWeight: "bold", color: "#667eea" }}>
                      {currentSettings.smoothness.toFixed(3)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.02"
                    max="0.25"
                    step="0.01"
                    value={currentSettings.smoothness}
                    onChange={(e) => handleSettingChange("smoothness", parseFloat(e.target.value))}
                    style={{
                      width: "100%",
                      height: "6px",
                      borderRadius: "3px",
                      background: "linear-gradient(to right, #e2e8f0, #667eea)",
                      outline: "none",
                      cursor: "pointer",
                    }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "5px", fontSize: "12px", color: "#64748b" }}>
                    <span>Sharp</span>
                    <span>Smooth</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              flexDirection: deviceType === "mobile" ? "column" : "row",
              gap: "15px",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "30px",
            }}
          >
            <button
              onClick={handleSaveSettings}
              disabled={ isSaving}
              style={{
                ...styles.button,
                background:  !isSaving
                  ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                  : "rgba(156, 163, 175, 0.5)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                cursor:  !isSaving ? "pointer" : "not-allowed",
                transition: "all 0.3s ease",
                boxShadow: !isSaving ? "0 4px 15px rgba(16, 185, 129, 0.3)" : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                minWidth: "140px",
              }}
            >
              {isSaving ? (
                <>
                  <div
                    style={{
                      width: "16px",
                      height: "16px",
                      border: "2px solid transparent",
                      borderTop: "2px solid white",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                    }}
                  />
                  Saving...
                </>
              ) : (
                <>
                  💾 Save Settings
                </>
              )}
            </button>

            <button
              onClick={handleResetSettings}
              disabled={!hasChanges}
              style={{
                ...styles.button,
                background: hasChanges ? "rgba(239, 68, 68, 0.1)" : "rgba(156, 163, 175, 0.1)",
                color: hasChanges ? "#dc2626" : "#9ca3af",
                border: `2px solid ${hasChanges ? "#dc2626" : "#9ca3af"}`,
                borderRadius: "8px",
                fontWeight: "600",
                cursor: hasChanges ? "pointer" : "not-allowed",
                transition: "all 0.3s ease",
                minWidth: "140px",
              }}
            >
              🔄 Reset
            </button>

                         <button
               onClick={togglePreview}
               style={{
                 ...styles.button,
                 background: showPreview 
                   ? "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
                   : "rgba(139, 92, 246, 0.1)",
                 color: showPreview ? "white" : "#8b5cf6",
                 border: `2px solid ${showPreview ? "transparent" : "#8b5cf6"}`,
                 borderRadius: "8px",
                 fontWeight: "600",
                 cursor: deviceType === "desktop" ? "pointer" : "not-allowed",
                 transition: "all 0.3s ease",
                 minWidth: "140px",
                 opacity: deviceType === "desktop" ? 1 : 0.5,
               }}
               disabled={deviceType !== "desktop"}
             >
               {deviceType === "desktop" 
                 ? (showPreview ? "🙈 Hide Preview" : "👁️ Show Preview")
                 : "👁️ Preview (Desktop Only)"
               }
             </button>
          </div>
        </div>

                 {/* Preview Section - Desktop Only, Right Side */}
         {showPreview && deviceType === "desktop" && (
           <div
             style={{
               position: "fixed",
               top: "80px",
               right: "20px",
               width: "400px",
               maxHeight: "calc(100vh - 100px)",
               background: "rgba(255, 255, 255, 0.98)",
               borderRadius: "16px",
               padding: "20px",
               boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
               backdropFilter: "blur(10px)",
               border: "1px solid rgba(255, 255, 255, 0.2)",
               overflow: "hidden",
               zIndex: 1000,
             }}
           >
                         <div style={{
               display: "flex",
               justifyContent: "space-between",
               alignItems: "center",
               marginBottom: "20px"
             }}>
               <h3
                 style={{
                   fontSize: "20px",
                   fontWeight: "bold",
                   color: "#334155",
                   margin: 0
                 }}
               >
                 🎮 Scroll Test
               </h3>
               <button
                 onClick={togglePreview}
                 style={{
                   background: "rgba(239, 68, 68, 0.1)",
                   color: "#dc2626",
                   border: "1px solid #dc2626",
                   borderRadius: "6px",
                   padding: "6px 12px",
                   fontSize: "12px",
                   cursor: "pointer",
                   fontWeight: "500"
                 }}
               >
                 ✕ Close
               </button>
             </div>
            
                         <p style={{
               color: "#64748b",
               marginBottom: "20px",
               fontSize: "12px",
               lineHeight: "1.4"
             }}>
               Test scroll speed with mouse wheel, arrow keys, or touch. Try "very-slow" vs "very-fast" presets above.
             </p>
            
                         <div style={{
               display: "flex",
               flexDirection: "column",
               gap: "15px",
               maxHeight: "calc(100vh - 200px)",
               overflowY: "auto"
             }}>
               {/* Raw Settings Test Container */}
               <ScrollTestContainer
                 title={`Raw Settings (${selectedPreset === "custom" ? "Custom" : selectedPreset.replace("-", " ")})`}
                 settings={currentSettings}
                 deviceType={deviceType}
                 isDeviceAdjusted={false}
               />
               
             
             </div>

           
          </div>
        )}
      </div>

      {/* Keyframe animation for loading spinner and scrollbar styles */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
            40% { transform: translateX(-50%) translateY(-10px); }
            60% { transform: translateX(-50%) translateY(-5px); }
          }
          
                                /* Custom scrollbar styles removed - using custom scrolling implementation */
        `}
      </style>
    </div>
  );
};

export default ScrollSpeedAdmin;