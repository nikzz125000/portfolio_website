// Add this function to your Homepage component, before the return statement

import type { SectionData } from "./Const";

// Function to generate cursor SVG based on position
// export const generatePositionBasedCursor = (xPercent: number, yPercent: number) => {
//   // Define color schemes based on position zones
//   const getColorScheme = (x: number, y: number) => {
//     // Map positions to different color zones
//     if (x < 25 && y < 25) {
//       // Top-left: Purple/Magenta
//       return {
//         primary: '%23b039b0',    // Purple
//         secondary: '%239c27b0',  // Dark Purple
//         tertiary: '%23e91e63',   // Pink
//         quaternary: '%23ad1457'  // Dark Pink
//       };
//     } else if (x >= 25 && x < 50 && y < 25) {
//       // Top-center: Blue
//       return {
//         primary: '%232196f3',    // Blue
//         secondary: '%231976d2',  // Dark Blue
//         tertiary: '%2303a9f4',   // Light Blue
//         quaternary: '%230277bd'  // Deep Blue
//       };
//     } else if (x >= 50 && x < 75 && y < 25) {
//       // Top-right: Cyan
//       return {
//         primary: '%2300bcd4',    // Cyan
//         secondary: '%230097a7',  // Dark Cyan
//         tertiary: '%2300e5ff',   // Light Cyan
//         quaternary: '%23006064'  // Deep Cyan
//       };
//     } else if (x >= 75 && y < 25) {
//       // Far top-right: Teal
//       return {
//         primary: '%23009688',    // Teal
//         secondary: '%23004d40',  // Dark Teal
//         tertiary: '%234db6ac',   // Light Teal
//         quaternary: '%23002d29'  // Deep Teal
//       };
//     } else if (x < 25 && y >= 25 && y < 50) {
//       // Middle-left: Red
//       return {
//         primary: '%23f44336',    // Red
//         secondary: '%23c62828',  // Dark Red
//         tertiary: '%23ff5722',   // Orange Red
//         quaternary: '%23b71c1c'  // Deep Red
//       };
//     } else if (x >= 25 && x < 50 && y >= 25 && y < 50) {
//       // Center: Original Green (keeping as default)
//       return {
//         primary: '%2381c784',    // Green
//         secondary: '%2366bb6a',  // Medium Green
//         tertiary: '%234caf50',   // Light Green
//         quaternary: '%2343a047'  // Dark Green
//       };
//     } else if (x >= 50 && x < 75 && y >= 25 && y < 50) {
//       // Middle-right: Orange
//       return {
//         primary: '%23ff9800',    // Orange
//         secondary: '%23f57c00',  // Dark Orange
//         tertiary: '%23ffb74d',   // Light Orange
//         quaternary: '%23e65100'  // Deep Orange
//       };
//     } else if (x >= 75 && y >= 25 && y < 50) {
//       // Far middle-right: Deep Orange
//       return {
//         primary: '%23ff5722',    // Deep Orange
//         secondary: '%23d84315',  // Dark Deep Orange
//         tertiary: '%23ff8a65',   // Light Deep Orange
//         quaternary: '%23bf360c'  // Deepest Orange
//       };
//     } else if (x < 25 && y >= 50 && y < 75) {
//       // Bottom-left: Indigo
//       return {
//         primary: '%233f51b5',    // Indigo
//         secondary: '%23283593',  // Dark Indigo
//         tertiary: '%237986cb',   // Light Indigo
//         quaternary: '%231a237e'  // Deep Indigo
//       };
//     } else if (x >= 25 && x < 50 && y >= 50 && y < 75) {
//       // Bottom-center: Purple
//       return {
//         primary: '%239c27b0',    // Purple
//         secondary: '%236a1b9a',  // Dark Purple
//         tertiary: '%23ba68c8',   // Light Purple
//         quaternary: '%234a148c'  // Deep Purple
//       };
//     } else if (x >= 50 && x < 75 && y >= 50 && y < 75) {
//       // Bottom-right: Pink
//       return {
//         primary: '%23e91e63',    // Pink
//         secondary: '%23ad1457',  // Dark Pink
//         tertiary: '%23f48fb1',   // Light Pink
//         quaternary: '%23880e4f'  // Deep Pink
//       };
//     } else if (x >= 75 && y >= 50 && y < 75) {
//       // Far bottom-right: Brown
//       return {
//         primary: '%23795548',    // Brown
//         secondary: '%235d4037',  // Dark Brown
//         tertiary: '%23a1887f',   // Light Brown
//         quaternary: '%233e2723'  // Deep Brown
//       };
//     } else if (y >= 75) {
//       // Bottom row: Gradient based on x position
//       const hue = Math.floor((x / 100) * 360); // Map x position to hue (0-360)
//       return {
//         primary: `%23${hslToHex(hue, 70, 60)}`,
//         secondary: `%23${hslToHex(hue, 80, 40)}`,
//         tertiary: `%23${hslToHex(hue, 60, 70)}`,
//         quaternary: `%23${hslToHex(hue, 90, 30)}`
//       };
//     }
    
//     // Default fallback (original green)
//     return {
//       primary: '%2381c784',
//       secondary: '%2366bb6a',
//       tertiary: '%234caf50',
//       quaternary: '%2343a047'
//     };
//   };

//   // Helper function to convert HSL to Hex
//   const hslToHex = (h: number, s: number, l: number) => {
//     l /= 100;
//     const a = s * Math.min(l, 1 - l) / 100;
//     const f = (n: number) => {
//       const k = (n + h / 30) % 12;
//       const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
//       return Math.round(255 * color).toString(16).padStart(2, '0');
//     };
//     return `${f(0)}${f(8)}${f(4)}`;
//   };

//   const colors = getColorScheme(xPercent, yPercent);
  
//   // Generate SVG with dynamic colors
//   const cursorSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cdefs%3E%3CradialGradient id='glassGrad' cx='40%25' cy='30%25' r='60%25'%3E%3Cstop offset='0%25' stop-color='${colors.primary}' stop-opacity='0.9'/%3E%3Cstop offset='30%25' stop-color='${colors.secondary}' stop-opacity='0.7'/%3E%3Cstop offset='70%25' stop-color='${colors.tertiary}' stop-opacity='0.5'/%3E%3Cstop offset='100%25' stop-color='${colors.quaternary}' stop-opacity='0.3'/%3E%3C/radialGradient%3E%3CradialGradient id='highlight' cx='35%25' cy='25%25' r='25%25'%3E%3Cstop offset='0%25' stop-color='%23ffffff' stop-opacity='0.8'/%3E%3Cstop offset='100%25' stop-color='%23ffffff' stop-opacity='0'/%3E%3C/radialGradient%3E%3C/defs%3E%3Ccircle cx='12' cy='12.5' r='9' fill='%23000000' fill-opacity='0.2'/%3E%3Ccircle cx='12' cy='12' r='9' fill='url(%23glassGrad)' stroke='${colors.quaternary}' stroke-width='0.4'/%3E%3Ccircle cx='12' cy='12' r='6' fill='url(%23highlight)'/%3E%3Cellipse cx='10.5' cy='9' rx='2.2' ry='1.1' fill='%23ffffff' fill-opacity='0.6'/%3E%3C/svg%3E`;
  
//   return cursorSvg;
// };

export const generatePositionBasedCursor = (xPercent: number, yPercent: number) => {
  // Create dramatic color progression from left to right
  const getColorScheme = (x: number, y: number) => {
    // Map x position to hue across full spectrum for dramatic color changes
    // 0% = Red (0°), 25% = Yellow (60°), 50% = Cyan (180°), 75% = Blue (240°), 100% = Magenta (300°)
    const baseHue = (x / 100) * 300; // 0 to 300 degrees for strong color separation
    
    // Use y position to create variations in saturation and lightness
    const saturation = Math.max(60, Math.min(90, 70 + (y / 100) * 20)); // 60-90% saturation
    const lightness = Math.max(40, Math.min(70, 55 + (y / 100) * 15)); // 40-70% lightness
    
    // Create 4 related but distinct colors for the gradient
    const hue1 = baseHue;
    const hue2 = (baseHue + 15) % 360; // Slightly shifted for secondary
    const hue3 = (baseHue - 10) % 360; // Counter-shifted for tertiary
    const hue4 = (baseHue + 25) % 360; // More shifted for quaternary
    
    return {
      primary: `%23${hslToHex(hue1, saturation, lightness)}`,
      secondary: `%23${hslToHex(hue2, saturation + 10, lightness - 15)}`, // Darker, more saturated
      tertiary: `%23${hslToHex(hue3, saturation - 5, lightness + 10)}`,   // Lighter, less saturated
      quaternary: `%23${hslToHex(hue4, saturation + 15, lightness - 25)}` // Much darker for border
    };
  };

  // Helper function to convert HSL to Hex
  const hslToHex = (h: number, s: number, l: number) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `${f(0)}${f(8)}${f(4)}`;
  };

  const colors = getColorScheme(xPercent, yPercent);
  
  // Generate SVG with dynamic colors
  const cursorSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cdefs%3E%3CradialGradient id='glassGrad' cx='40%25' cy='30%25' r='60%25'%3E%3Cstop offset='0%25' stop-color='${colors.primary}' stop-opacity='0.9'/%3E%3Cstop offset='30%25' stop-color='${colors.secondary}' stop-opacity='0.7'/%3E%3Cstop offset='70%25' stop-color='${colors.tertiary}' stop-opacity='0.5'/%3E%3Cstop offset='100%25' stop-color='${colors.quaternary}' stop-opacity='0.3'/%3E%3C/radialGradient%3E%3CradialGradient id='highlight' cx='35%25' cy='25%25' r='25%25'%3E%3Cstop offset='0%25' stop-color='%23ffffff' stop-opacity='0.8'/%3E%3Cstop offset='100%25' stop-color='%23ffffff' stop-opacity='0'/%3E%3C/radialGradient%3E%3C/defs%3E%3Ccircle cx='12' cy='12.5' r='9' fill='%23000000' fill-opacity='0.2'/%3E%3Ccircle cx='12' cy='12' r='9' fill='url(%23glassGrad)' stroke='${colors.quaternary}' stroke-width='0.4'/%3E%3Ccircle cx='12' cy='12' r='6' fill='url(%23highlight)'/%3E%3Cellipse cx='10.5' cy='9' rx='2.2' ry='1.1' fill='%23ffffff' fill-opacity='0.6'/%3E%3C/svg%3E`;
  
  return cursorSvg;
};

// Function to generate dynamic CSS for each sub-image
export const generateDynamicCursorStyles = (sections: SectionData[]) => {
  let styles = '';
  
  sections.forEach((section) => {
    section.projects?.forEach((subImage) => {
      const cursorSvg = generatePositionBasedCursor(subImage.xPosition, subImage.yPosition);
      const hoverCursorSvg = generatePositionBasedCursor(subImage.xPosition, subImage.yPosition);
      
      styles += `
        .clickable-sub-image[data-project-id="${subImage.projectId}"] {
          cursor: url("${cursorSvg}") 12 12, pointer !important;
        }
        
        .clickable-sub-image[data-project-id="${subImage.projectId}"]:hover {
          cursor: url("${hoverCursorSvg}") 12 12, pointer !important;
        }
      `;
    });
  });
  
  return styles;
};

// Add this useEffect after your existing useEffects to apply dynamic styles

// Replace your existing cursor style with this updated one:
