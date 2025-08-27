
// import { useEffect, useState } from "react";
// import { motion, useMotionValue, useSpring } from "framer-motion";

// export const CustomCursor = () => {
//   const [variant, setVariant] = useState<"default" | "hover">("default");

//   // motion values for position
//   const mouseX = useMotionValue(0);
//   const mouseY = useMotionValue(0);

//   // smooth spring animation
//   const x = useSpring(mouseX, { stiffness: 300, damping: 25 });
//   const y = useSpring(mouseY, { stiffness: 300, damping: 25 });

//   // Track mouse position without re-rendering
//   useEffect(() => {
//     const move = (e: MouseEvent) => {
//       mouseX.set(e.clientX);
//       mouseY.set(e.clientY);
//     };
//     window.addEventListener("mousemove", move);
//     return () => window.removeEventListener("mousemove", move);
//   }, [mouseX, mouseY]);

//   // Hover detection (event delegation)
//   useEffect(() => {
//     const HOVER_SELECTOR =
//       `a, button, .clickable-sub-image, 
//       .cursor-hover, .centered-logo, .logo-container, .section-nav-title,#nextProjectImage`;

//     const handleOver = (e: Event) => {
//       const target = e.target as Element | null;
//       if (target && target.closest(HOVER_SELECTOR)) {
//         setVariant("hover");
//       }
//     };

//     const handleOut = (e: Event) => {
//       const target = e.target as Element | null;
//       const related = (e as MouseEvent).relatedTarget as Element | null;
//       const leavingClickable = target?.closest(HOVER_SELECTOR);
//       const enteringClickable = related?.closest?.(HOVER_SELECTOR);
//       if (leavingClickable && !enteringClickable) {
//         setVariant("default");
//       }
//     };

//     document.addEventListener("pointerover", handleOver, true);
//     document.addEventListener("pointerout", handleOut, true);

//     return () => {
//       document.removeEventListener("pointerover", handleOver, true);
//       document.removeEventListener("pointerout", handleOut, true);
//     };
//   }, []);

//   return (
//     <motion.div
//       className="fixed top-0 left-0 rounded-full pointer-events-none"
//       style={{
//         zIndex: 2147483647,
//         x: x, // spring smoothed
//         y: y,
//         translateX: variant === "hover" ? "-25px" : "-10px",
//         translateY: variant === "hover" ? "-25px" : "-10px",
//         height: variant === "hover" ? 50 : 20,
//         width: variant === "hover" ? 50 : 20,
//         backgroundColor:
//           variant === "hover"
//             ? "rgba(255,0,120,0.6)"
//             : "rgba(255,255,255,0.7)",
//         borderRadius: "50%",
//         mixBlendMode: "difference",
//       }}
//       transition={{ type: "spring", stiffness: 300, damping: 25 }}
//     />
//   );
// };






import { useEffect, useRef, useState } from "react";


export const CustomCursor = () => {
  const [variant, setVariant] = useState<"default" | "hover">("default");

  const cursorRef = useRef<HTMLDivElement>(null);

  // target mouse position
  const mouse = useRef({ x: 0, y: 0 });
  // animated cursor position
  const pos = useRef({ x: 0, y: 0 });

  // track mouse
  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  // animation loop (RAF based lerp)
  useEffect(() => {
    const lerp = (a: number, b: number, n: number) => a + (b - a) * n;

    const update = () => {
      pos.current.x = lerp(pos.current.x, mouse.current.x, 0.2); // smoothness
      pos.current.y = lerp(pos.current.y, mouse.current.y, 0.2);

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${
          pos.current.x - (variant === "hover" ? 25 : 10)
        }px, ${pos.current.y - (variant === "hover" ? 25 : 10)}px, 0)`;
      }

      requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  }, [variant]);

  // hover detection
  useEffect(() => {
    const HOVER_SELECTOR =
      `a, button, .clickable-sub-image, 
      .cursor-hover, .centered-logo, .logo-container, .section-nav-title,#nextProjectImage`;

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
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 rounded-full pointer-events-none"
      style={{
        zIndex: 2147483647,
        height: variant === "hover" ? 50 : 20,
        width: variant === "hover" ? 50 : 20,
        backgroundColor:
          variant === "hover"
            ? "rgba(255,0,120,0.6)"
            : "rgba(255,255,255,0.7)",
        borderRadius: "50%",
        mixBlendMode: "difference",
        transition: "width 0.2s ease, height 0.2s ease, background 0.3s ease",
      }}
    />
  );
};

