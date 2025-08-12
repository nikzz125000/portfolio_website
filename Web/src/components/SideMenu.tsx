import React from "react";
import { useNavigate } from "react-router-dom";

interface MenuItem {
  name: string;
  icon: string;
  link: string;
  action?: () => void | Promise<void>;
}

interface SideMenuProps {
  isMenuOpen: boolean;
  deviceType?: "mobile" | "tablet" | "desktop";
  variant?: "homepage" | "project-details";
  onMenuItemClick?: (item: MenuItem) => void;
}

const SideMenu: React.FC<SideMenuProps> = ({
  isMenuOpen,
  deviceType = "desktop",
  variant = "homepage",
  onMenuItemClick,
}) => {
  const navigate = useNavigate();

  // Menu items for the animated logo menu - now dynamic from API
  const menuItems: MenuItem[] = [
    {
      name: "About",
      icon: "👤",
      link: "/about",
      action: () => navigate("/about"),
    },
    {
      name: "Contact",
      icon: "📞",
      link: `tel:+16265550134`,
      action: () => {
        window.open("tel:+16265550134", "_self");
      },
    },
    {
      name: "Instagram",
      icon: "📷",
      link: "https://instagram.com",
      action: () => {
        window.open("https://instagram.com", "_blank");
      },
    },
    {
      name: "LinkedIn",
      icon: "💼",
      link: "https://linkedin.com",
      action: () => {
        window.open("https://linkedin.com", "_blank");
      },
    },
  ];

  // Handle menu item click
  const handleMenuItemClick = (item: MenuItem) => {
    if (onMenuItemClick) {
      onMenuItemClick(item);
    } else if (item.action) {
      // If there's a custom action, execute it
      item.action();
    } else {
      // Default navigation behavior
      console.log(`Navigating to ${item.link}`);
      if (item.link.startsWith("http")) {
        window.open(item.link, "_blank");
      } else {
        navigate(item.link);
      }
    }
  };

  // Get responsive logo sizes based on device type
  const getResponsiveLogoSizes = () => {
    switch (deviceType) {
      case "mobile":
        return {
          fixedLogo: "100px",
          centeredLogo: "80px",
          menuItemSize: "10px",
          menuPadding: "4px 8px",
        };
      case "tablet":
        return {
          fixedLogo: "120px",
          centeredLogo: "100px",
          menuItemSize: "11px",
          menuPadding: "5px 10px",
        };
      default: // desktop
        return {
          fixedLogo: "150px",
          centeredLogo: "120px",
          menuItemSize: "11px",
          menuPadding: "6px 12px",
        };
    }
  };

  const logoSizes = getResponsiveLogoSizes();

  if (!isMenuOpen) return null;

  return (
    <>
      <style>
        {`
          .menu-item-enter {
            opacity: 0;
            transform: translate(-50%, -50%) rotate(0deg) scale(0.9);
            animation: menuItemEnter 0.6s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
          }
          
          @keyframes menuItemEnter {
            0% {
              opacity: 0;
              transform: translate(-50%, -50%) rotate(0deg) scale(0.9);
            }
            100% {
              opacity: 1;
              transform: translate(-50%, -50%) rotate(var(--final-rotation, 0deg)) scale(1);
            }
          }
          
          .menu-item-clean:hover {
            transform: translate(-50%, -50%) rotate(var(--final-rotation, 0deg)) scale(1.05);
            background: rgba(255, 255, 255, 0.98);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
            border-color: rgba(255, 255, 255, 0.5);
          }

          .menu-item-clean:active {
            transform: translate(-50%, -50%) rotate(var(--final-rotation, 0deg)) scale(0.95);
            transition: transform 0.1s ease;
          }

          /* Enhanced Menu Item Styles */
          .menu-item-clean {
            position: relative;
            overflow: hidden;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .menu-item-clean::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
            transition: left 0.5s ease;
            z-index: -1;
          }

          .menu-item-clean:hover::before {
            left: 100%;
          }

          .menu-item-clean:active {
            transform: translate(-50%, -50%) rotate(var(--final-rotation, 0deg)) scale(0.95) !important;
            transition: transform 0.1s ease;
          }

          /* Menu item hover glow effect */
          .menu-item-clean:hover {
            filter: brightness(1.05);
          }
        `}
      </style>

      {/* Animated Menu - Responsive sizing */}
      <div
        id="logo-menu"
        style={{
          position: "absolute",
          top: deviceType === "mobile" ? "55px" : "60px",
          left: deviceType === "mobile" ? "55px" : "60px",
          zIndex: 1001,
        }}
      >
        {menuItems?.map((item, index) => {
          const total = menuItems.length;
          // Create a tighter arc around the logo for better spacing
          const startAngle = -25; // Start closer to center
          const endAngle = 95; // End closer to center
          const angleStep =
            total > 1 ? (endAngle - startAngle) / (total - 1) : 0;
          const currentAngle = startAngle + index * angleStep;
          const angleRad = (currentAngle * Math.PI) / 180;

          // Smaller radius for tighter grouping
          const deviceRadius =
            deviceType === "mobile" ? 60 : deviceType === "tablet" ? 70 : 75;
          const screenRadius = Math.min(
            deviceRadius,
            Math.max(45, window.innerWidth * 0.08)
          );
          const radius = Math.max(
            35,
            Math.min(screenRadius, window.innerWidth * 0.1)
          );

          // Center the arc around the logo position
          const centerX = deviceType === "mobile" ? 55 : 60; // Logo left position
          const centerY = deviceType === "mobile" ? 55 : 60; // Logo top position
          const x = Math.round(centerX + radius * Math.cos(angleRad));
          const y = Math.round(centerY + radius * Math.sin(angleRad));

          return (
            <div
              key={item.name}
              className="menu-item-enter menu-item-clean"
              onClick={() => handleMenuItemClick(item)}
              style={
                {
                  position: "absolute",
                  left: `${x}px`,
                  top: `${y}px`,
                  transform: `translate(-50%, -50%) rotate(${currentAngle}deg)`,
                  padding: logoSizes.menuPadding,
                  borderRadius: "16px",
                  cursor: "pointer",
                  fontSize:
                    deviceType === "mobile"
                      ? "12px"
                      : deviceType === "tablet"
                      ? "13px"
                      : "14px",
                  fontWeight: "700",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  whiteSpace: "nowrap",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  animationDelay: `${index * 0.1}s`,
                  userSelect: "none",
                  minWidth:
                    deviceType === "mobile"
                      ? "65px"
                      : deviceType === "tablet"
                      ? "75px"
                      : "85px",
                  justifyContent: "center",
                  background: "rgba(255, 255, 255, 1)",
                  backdropFilter: "blur(15px)",
                  boxShadow:
                    "0 6px 20px rgba(0, 0, 0, 0.15), 0 3px 10px rgba(0, 0, 0, 0.1)",
                  border: "3px solid rgba(255, 255, 255, 1)",
                  "--final-rotation": `${currentAngle}deg`,
                } as React.CSSProperties & { "--final-rotation": string }
              }
            >
              <span
                style={{
                  fontSize:
                    deviceType === "mobile"
                      ? "11px"
                      : deviceType === "tablet"
                      ? "12px"
                      : "12px",
                  filter: "grayscale(0)",
                  transition: "all 0.2s ease",
                  opacity: 0.8,
                }}
              >
                {item.icon}
              </span>
              <span
                style={{
                  letterSpacing: "0.3px",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  color: "#000000",
                  display: "inline-block",
                  fontWeight: "800",
                  textShadow:
                    "0 1px 3px rgba(255, 255, 255, 1), 0 0 10px rgba(255, 255, 255, 0.5)",
                }}
              >
                {item.name}
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default SideMenu;
