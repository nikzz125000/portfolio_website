// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";

// export const CustomCursor = () => {
//   const [pos, setPos] = useState({ x: 0, y: 0 });
//   const [variant, setVariant] = useState<"default" | "hover">("default");

//   useEffect(() => {
//     const move = (e: MouseEvent) => {
//       setPos({ x: e.clientX, y: e.clientY });
//     };
//     window.addEventListener("mousemove", move);
//     return () => window.removeEventListener("mousemove", move);
//   }, []);

//   // Animated cursor styles
//   const variants = {
//     default: {
//       x: pos.x - 10,
//       y: pos.y - 10,
//       height: 20,
//       width: 20,
//       backgroundColor: "rgba(255,255,255,0.7)",
//       mixBlendMode: "difference",
//     },
//     hover: {
//       x: pos.x - 25,
//       y: pos.y - 25,
//       height: 50,
//       width: 50,
//       backgroundColor: "rgba(255,0,120,0.6)",
//       mixBlendMode: "difference",
//     },
//   };

//   // Detect when hovering on clickable elements
//   useEffect(() => {
//     const addHover = () => setVariant("hover");
//     const removeHover = () => setVariant("default");

//     const hoverables = document.querySelectorAll(
//       "a, button, .clickable-sub-image, .clickable-sub-image-gradient, img, motion.img ,.cursor-hover, [data-cursor='hover'], .centered-logo"
//     );

//     hoverables.forEach((el) => {
//       el.addEventListener("mouseenter", addHover);
//       el.addEventListener("mouseleave", removeHover);
//     });

//     return () => {
//       hoverables.forEach((el) => {
//         el.removeEventListener("mouseenter", addHover);
//         el.removeEventListener("mouseleave", removeHover);
//       });
//     };
//   }, []);

//   return (
//     <motion.div
//       className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999]"
//       animate={variant}
//       variants={variants}
//       transition={{ type: "spring", stiffness: 300, damping: 25 }}
//     />
//   );
// };
import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export const CustomCursor = () => {
  const [variant, setVariant] = useState<"default" | "hover">("default");

  // motion values for position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // smooth spring animation
  const x = useSpring(mouseX, { stiffness: 300, damping: 25 });
  const y = useSpring(mouseY, { stiffness: 300, damping: 25 });

  // Track mouse position without re-rendering
  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [mouseX, mouseY]);

  // Hover detection (event delegation)
  useEffect(() => {
    const HOVER_SELECTOR =
      `a, button, .clickable-sub-image, .clickable-sub-image-gradient, 
      .cursor-hover, [data-cursor='hover'], .centered-logo, .logo-container, .section-nav-title,#nextProjectImage`;

    const handleOver = (e: Event) => {
      const target = e.target as Element | null;
      if (target && target.closest(HOVER_SELECTOR)) {
        setVariant("hover");
      }
    };

    const handleOut = (e: Event) => {
      const target = e.target as Element | null;
      const related = (e as MouseEvent).relatedTarget as Element | null;
      const leavingClickable = target?.closest(HOVER_SELECTOR);
      const enteringClickable = related?.closest?.(HOVER_SELECTOR);
      if (leavingClickable && !enteringClickable) {
        setVariant("default");
      }
    };

    document.addEventListener("pointerover", handleOver, true);
    document.addEventListener("pointerout", handleOut, true);

    return () => {
      document.removeEventListener("pointerover", handleOver, true);
      document.removeEventListener("pointerout", handleOut, true);
    };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 rounded-full pointer-events-none"
      style={{
        zIndex: 2147483647,
        x: x, // spring smoothed
        y: y,
        translateX: variant === "hover" ? "-25px" : "-10px",
        translateY: variant === "hover" ? "-25px" : "-10px",
        height: variant === "hover" ? 50 : 20,
        width: variant === "hover" ? 50 : 20,
        backgroundColor:
          variant === "hover"
            ? "rgba(255,0,120,0.6)"
            : "rgba(255,255,255,0.7)",
        borderRadius: "50%",
        mixBlendMode: "difference",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    />
  );
};
