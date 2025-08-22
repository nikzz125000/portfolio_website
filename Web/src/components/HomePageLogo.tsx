import React from 'react'
import SideMenu from './SideMenu'
import type { MenuItem } from './Const'

function HomePageLogo({
  deviceType, 
  scrollY, 
  isMenuOpen, 
  logoSizes, 
  handleLogoClick, 
  handleMenuItemClick
}: {
  deviceType: string, 
  scrollY: number, 
  isMenuOpen: boolean, 
  logoSizes: {
    fixedLogo: string;     
    SecondLogo: string;     
    centeredLogo: string;     
    menuItemSize: string;     
    menuPadding: string;
    bottomLogo:string;
  }, 
  handleLogoClick: () => void, 
  handleMenuItemClick:(item: MenuItem) => void
}) {   
  return (     
    <div>
      <div
        style={{
          position: "fixed",
          top: deviceType === "mobile" ? "60px" : "50px",
          left: deviceType === "mobile" ? "15px" : "20px",
          zIndex: 1000,
          transform: `translateY(${Math.min(scrollY * 0.05, 20)}px)`,
          transition: "transform 0.3s ease-out",
          opacity: scrollY > 100 ? 0.9 : 1,
        }}
      >
        {/* Logo Container with Stacked Effect */}
        <div
          id="main-logo"
          onClick={handleLogoClick}
          className="logo-container"
          style={{
            cursor: "pointer",
            position: "relative",
            borderRadius: "12px",
            padding: "8px",
            transition: "all 0.3s ease",
            width: "auto",
            height: "auto",
          }}
        >
          {/* Bottom Logo (po.png) - Always present */}
          <img
            src="/logo/font.png"
            alt="Bottom Logo"
            style={{
              height: logoSizes.bottomLogo,
              width: "auto",
              position: "relative",
              display: "block",
               filter: "brightness(0) invert(1)",
              marginLeft:1.9,
              marginTop:-9
              
            }}
          />
          
          {/* Top Logo (font_2.png) - Animates on menu state */}
          <img
            src="/logo/font 2_.png"
            alt="Top Logo"
            style={{
              height: logoSizes.fixedLogo,
              width: "auto",
              position: "absolute",
              top: "4.5px", // Match the padding
              left: "7px", // Match the padding
              filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))",
              transform: isMenuOpen 
                ? "translateX(2px) translateY(-14px) rotate(2deg)" 
                : "translateX(0) translateY(0) rotate(0deg)",
              transition: "transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
              zIndex: 2,
            }}
          />
        </div>

        {/* Side Menu Component */}
        <SideMenu
          isMenuOpen={isMenuOpen}
          deviceType={deviceType as "mobile" | "tablet" | "desktop"}
          variant="homepage"
          onMenuItemClick={handleMenuItemClick}
        />
      </div>
    </div>
  ) 
}

export default HomePageLogo