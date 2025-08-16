import React from "react";

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
  onMenuItemClick,
}) => {
  // Menu items for the animated logo menu
  const menuItems: MenuItem[] = [
    {
      name: "About",
      icon: "👤",
      link: "/resume",
      action: () => {
        console.log("Navigate to About/Resume page");
      },
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
      item.action();
    } else {
      console.log(`Navigating to ${item.link}`);
      if (item.link.startsWith("http")) {
        window.open(item.link, "_blank");
      } else {
        console.log(`Would navigate to internal route: ${item.link}`);
      }
    }
  };

  // Get responsive sizes based on device type
  const getResponsiveSizes = () => {
    switch (deviceType) {
      case "mobile":
        return {
          logoSize: 100,
          curveRadius: 60,
          strokeWidth: 4,
          menuItemSize: "14px",
          sunRayDistance: 90,
        };
      case "tablet":
        return {
          logoSize: 120,
          curveRadius: 75,
          strokeWidth: 5,
          menuItemSize: "16px",
          sunRayDistance: 110,
        };
      default: // desktop
        return {
          logoSize: 150,
          curveRadius: 80,
          strokeWidth: 6,
          menuItemSize: "18px",
          sunRayDistance: 130,
        };
    }
  };

  const sizes = getResponsiveSizes();

  if (!isMenuOpen) return null;

  return (
    <>
      <style>
        {`
          .curve-path {
            stroke-dasharray: 200;
            stroke-dashoffset: 200;
            animation: drawCurve 1s ease-out forwards;
          }
          
          @keyframes drawCurve {
            to {
              stroke-dashoffset: 0;
            }
          }
          
          .sun-ray-item {
            opacity: 0;
            transform-origin: center;
            animation: sunRayAppear 0.6s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
          }
          
          @keyframes sunRayAppear {
            0% {
              opacity: 0;
              transform: scale(0.8) rotate(var(--ray-angle));
            }
            100% {
              opacity: 1;
              transform: scale(1) rotate(var(--ray-angle));
            }
          }
          
          .sun-ray-item {
            cursor: pointer;
            user-select: none;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .sun-ray-item:hover {
            transform: scale(1.1) rotate(var(--ray-angle)) !important;
            color: #333 !important;
            font-weight: 800 !important;
          }

          .sun-ray-item:active {
            transform: scale(0.9) rotate(var(--ray-angle)) !important;
            transition: transform 0.1s ease;
          }
        `}
      </style>

      <div
        style={{
          position: "relative",
          width: `${sizes.logoSize}px`,
          height: `${sizes.logoSize}px`,
        }}
      >
        {/* Curved Line at bottom-right of logo area */}
        <svg
          width={sizes.curveRadius + 20}
          height={sizes.curveRadius + 20}
          style={{
            position: "absolute",
            bottom: `126px`,
            right: `-20px`,
            pointerEvents: "none",
          }}
        >
          <path
            className="curve-path"
            d={`M 10 ${sizes.curveRadius + 10} A ${sizes.curveRadius} ${sizes.curveRadius} 0 0 0 ${sizes.curveRadius + 10} 10`}
            fill="none"
            stroke="#000000"
            strokeWidth={sizes.strokeWidth}
            strokeLinecap="round"
          />
        </svg>

        {/* Menu Items radiating like sun rays from the curve */}
        {menuItems?.map((item, index) => {
          const total = menuItems.length;
          // Angles for sun ray distribution (spreading from bottom-right)
          const startAngle = 0; // Start from right (0 degrees)
          const endAngle = 90; // End at bottom (90 degrees)
          const angleStep = endAngle / (total - 1);
          const currentAngle = startAngle + index * angleStep;
          const angleRad = (currentAngle * Math.PI) / 180;
          
          // Calculate sun ray position (radiating outward from curve origin)
          const curveOriginX = sizes.logoSize - 95; // Bottom-right of logo area
          const curveOriginY = sizes.logoSize - 200;
          
          // Position menu items further out like sun rays
          const rayX = curveOriginX + sizes.sunRayDistance * Math.cos(angleRad);
          const rayY = curveOriginY + sizes.sunRayDistance * Math.sin(angleRad);

          return (
            <div
              key={item.name}
              className="sun-ray-item"
              onClick={() => handleMenuItemClick(item)}
              style={{
                position: "absolute",
                left: `${rayX}px`,
                top: `${rayY}px`,
                transform: `translate(-50%, -50%) rotate(${currentAngle}deg)`,
                transformOrigin: "center",
                animationDelay: `${0.3 + index * 0.15}s`,
                fontSize: sizes.menuItemSize,
                fontWeight: "700",
                fontFamily: "system-ui, -apple-system, sans-serif",
                color: "#2D3748",
                whiteSpace: "nowrap",
                textShadow: "0 2px 4px rgba(255, 255, 255, 0.8)",
                letterSpacing: "0.5px",
                "--ray-angle": `${currentAngle}deg`,
              } as React.CSSProperties & { "--ray-angle": string }}
            >
              {item.name}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default SideMenu;