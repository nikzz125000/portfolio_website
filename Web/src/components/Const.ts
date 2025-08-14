export const getAnimationVariants = (animationType: string, trigger: string, duration: number = 1.5) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const baseVariants: any = {
    none: {
      initial: {},
      animate: {},
      exit: {}
    },
    // === FADE ANIMATIONS ===
    fadeIn: {
      initial: { opacity: trigger === 'continuous' ? 1 : 0 },
      animate: trigger === 'continuous' 
        ? { opacity: [1, 0.3, 1], transition: { repeat: Infinity, duration } }
        : { opacity: 1, transition: { duration } },
      exit: { opacity: 0, transition: { duration: duration * 0.5 } }
    },
    fadeInUp: {
      initial: trigger === 'continuous' ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 },
      animate: trigger === 'continuous' 
        ? { opacity: [1, 0.3, 1], y: [0, 15, 0], transition: { repeat: Infinity, duration } }
        : { opacity: 1, y: 0, transition: { duration } },
      exit: { opacity: 0, y: 30, transition: { duration: duration * 0.5 } }
    },
    fadeInDown: {
      initial: trigger === 'continuous' ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 },
      animate: trigger === 'continuous' 
        ? { opacity: [1, 0.3, 1], y: [0, -15, 0], transition: { repeat: Infinity, duration } }
        : { opacity: 1, y: 0, transition: { duration } },
      exit: { opacity: 0, y: -30, transition: { duration: duration * 0.5 } }
    },
    fadeInLeft: {
      initial: trigger === 'continuous' ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 },
      animate: trigger === 'continuous' 
        ? { opacity: [1, 0.3, 1], x: [0, -15, 0], transition: { repeat: Infinity, duration } }
        : { opacity: 1, x: 0, transition: { duration } },
      exit: { opacity: 0, x: -30, transition: { duration: duration * 0.5 } }
    },
    fadeInRight: {
      initial: trigger === 'continuous' ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 },
      animate: trigger === 'continuous' 
        ? { opacity: [1, 0.3, 1], x: [0, 15, 0], transition: { repeat: Infinity, duration } }
        : { opacity: 1, x: 0, transition: { duration } },
      exit: { opacity: 0, x: 30, transition: { duration: duration * 0.5 } }
    },
    fadeInUpBig: {
      initial: trigger === 'continuous' ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 },
      animate: trigger === 'continuous' 
        ? { opacity: [1, 0.2, 1], y: [0, 30, 0], transition: { repeat: Infinity, duration: duration * 1.2 } }
        : { opacity: 1, y: 0, transition: { duration: duration * 1.2 } },
      exit: { opacity: 0, y: 100, transition: { duration: duration * 0.6 } }
    },
    fadeInDownBig: {
      initial: trigger === 'continuous' ? { opacity: 1, y: 0 } : { opacity: 0, y: -100 },
      animate: trigger === 'continuous' 
        ? { opacity: [1, 0.2, 1], y: [0, -30, 0], transition: { repeat: Infinity, duration: duration * 1.2 } }
        : { opacity: 1, y: 0, transition: { duration: duration * 1.2 } },
      exit: { opacity: 0, y: -100, transition: { duration: duration * 0.6 } }
    },
    fadeInLeftBig: {
      initial: trigger === 'continuous' ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 },
      animate: trigger === 'continuous' 
        ? { opacity: [1, 0.2, 1], x: [0, -30, 0], transition: { repeat: Infinity, duration: duration * 1.2 } }
        : { opacity: 1, x: 0, transition: { duration: duration * 1.2 } },
      exit: { opacity: 0, x: -100, transition: { duration: duration * 0.6 } }
    },
    fadeInRightBig: {
      initial: trigger === 'continuous' ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 },
      animate: trigger === 'continuous' 
        ? { opacity: [1, 0.2, 1], x: [0, 30, 0], transition: { repeat: Infinity, duration: duration * 1.2 } }
        : { opacity: 1, x: 0, transition: { duration: duration * 1.2 } },
      exit: { opacity: 0, x: 100, transition: { duration: duration * 0.6 } }
    },
    
    // === SLIDE ANIMATIONS ===
    slideInLeft: {
      initial: trigger === 'continuous' ? { x: 0 } : { x: '-100%' },
      animate: trigger === 'continuous' 
        ? { x: [0, -20, 0], transition: { repeat: Infinity, duration } }
        : { x: 0, transition: { duration, type: 'spring', damping: 20 } },
      exit: { x: '-100%', transition: { duration: duration * 0.7 } }
    },
    slideInRight: {
      initial: trigger === 'continuous' ? { x: 0 } : { x: '100%' },
      animate: trigger === 'continuous' 
        ? { x: [0, 20, 0], transition: { repeat: Infinity, duration } }
        : { x: 0, transition: { duration, type: 'spring', damping: 20 } },
      exit: { x: '100%', transition: { duration: duration * 0.7 } }
    },
    slideInUp: {
      initial: trigger === 'continuous' ? { y: 0 } : { y: '100%' },
      animate: trigger === 'continuous' 
        ? { y: [0, 20, 0], transition: { repeat: Infinity, duration } }
        : { y: 0, transition: { duration, type: 'spring', damping: 20 } },
      exit: { y: '100%', transition: { duration: duration * 0.7 } }
    },
    slideInDown: {
      initial: trigger === 'continuous' ? { y: 0 } : { y: '-100%' },
      animate: trigger === 'continuous' 
        ? { y: [0, -20, 0], transition: { repeat: Infinity, duration } }
        : { y: 0, transition: { duration, type: 'spring', damping: 20 } },
      exit: { y: '-100%', transition: { duration: duration * 0.7 } }
    },
    
    // === ZOOM ANIMATIONS ===
    zoomIn: {
      initial: trigger === 'continuous' ? { scale: 1 } : { opacity: 0, scale: 0.3 },
      animate: trigger === 'continuous' 
        ? { scale: [1, 1.1, 1], transition: { repeat: Infinity, duration } }
        : { opacity: 1, scale: 1, transition: { duration } },
      exit: { opacity: 0, scale: 0.3, transition: { duration: duration * 0.5 } }
    },
    zoomInUp: {
      initial: trigger === 'continuous' ? { scale: 1, y: 0 } : { opacity: 0, scale: 0.1, y: 100 },
      animate: trigger === 'continuous' 
        ? { scale: [1, 1.1, 1], y: [0, -10, 0], transition: { repeat: Infinity, duration } }
        : { opacity: 1, scale: 1, y: 0, transition: { duration } },
      exit: { opacity: 0, scale: 0.1, y: 100, transition: { duration: duration * 0.6 } }
    },
    zoomInDown: {
      initial: trigger === 'continuous' ? { scale: 1, y: 0 } : { opacity: 0, scale: 0.1, y: -100 },
      animate: trigger === 'continuous' 
        ? { scale: [1, 1.1, 1], y: [0, 10, 0], transition: { repeat: Infinity, duration } }
        : { opacity: 1, scale: 1, y: 0, transition: { duration } },
      exit: { opacity: 0, scale: 0.1, y: -100, transition: { duration: duration * 0.6 } }
    },
    zoomInLeft: {
      initial: trigger === 'continuous' ? { scale: 1, x: 0 } : { opacity: 0, scale: 0.1, x: -100 },
      animate: trigger === 'continuous' 
        ? { scale: [1, 1.1, 1], x: [0, 10, 0], transition: { repeat: Infinity, duration } }
        : { opacity: 1, scale: 1, x: 0, transition: { duration } },
      exit: { opacity: 0, scale: 0.1, x: -100, transition: { duration: duration * 0.6 } }
    },
    zoomInRight: {
      initial: trigger === 'continuous' ? { scale: 1, x: 0 } : { opacity: 0, scale: 0.1, x: 100 },
      animate: trigger === 'continuous' 
        ? { scale: [1, 1.1, 1], x: [0, -10, 0], transition: { repeat: Infinity, duration } }
        : { opacity: 1, scale: 1, x: 0, transition: { duration } },
      exit: { opacity: 0, scale: 0.1, x: 100, transition: { duration: duration * 0.6 } }
    },
    zoomOut: {
      initial: { scale: 1 },
      animate: { 
        scale: [1, 1.3, 1],
        transition: { repeat: trigger === 'continuous' ? Infinity : 0, duration }
      },
      exit: { scale: 1 }
    },
    
    // === BOUNCE ANIMATIONS ===
    bounce: {
      initial: { y: 0 },
      animate: { 
        y: [0, -30, 0, -15, 0, -4, 0],
        transition: { repeat: trigger === 'continuous' ? Infinity : (trigger === 'once' ? 2 : 0), duration }
      },
      exit: { y: 0 }
    },
    bounceIn: {
      initial: trigger === 'continuous' ? { scale: 1 } : { opacity: 0, scale: 0.3 },
      animate: trigger === 'continuous' 
        ? { 
            scale: [1, 0.8, 1.1, 0.95, 1.05, 1],
            transition: { repeat: Infinity, duration }
          }
        : { 
            opacity: [0, 1, 1, 1],
            scale: [0.3, 1.05, 0.9, 1],
            transition: { duration }
          },
      exit: { opacity: 0, scale: 0.3, transition: { duration: duration * 0.5 } }
    },
    bounceInUp: {
      initial: trigger === 'continuous' ? { y: 0 } : { opacity: 0, y: 100 },
      animate: trigger === 'continuous' 
        ? { 
            y: [0, 20, -10, 5, 0],
            transition: { repeat: Infinity, duration }
          }
        : { 
            opacity: [0, 1, 1, 1],
            y: [100, -30, 10, 0],
            transition: { duration }
          },
      exit: { opacity: 0, y: 100, transition: { duration: duration * 0.6 } }
    },
    bounceInDown: {
      initial: trigger === 'continuous' ? { y: 0 } : { opacity: 0, y: -100 },
      animate: trigger === 'continuous' 
        ? { 
            y: [0, -20, 10, -5, 0],
            transition: { repeat: Infinity, duration }
          }
        : { 
            opacity: [0, 1, 1, 1],
            y: [-100, 30, -10, 0],
            transition: { duration }
          },
      exit: { opacity: 0, y: -100, transition: { duration: duration * 0.6 } }
    },
    bounceInLeft: {
      initial: trigger === 'continuous' ? { x: 0 } : { opacity: 0, x: -100 },
      animate: trigger === 'continuous' 
        ? { 
            x: [0, -20, 10, -5, 0],
            transition: { repeat: Infinity, duration }
          }
        : { 
            opacity: [0, 1, 1, 1],
            x: [-100, 30, -10, 0],
            transition: { duration }
          },
      exit: { opacity: 0, x: -100, transition: { duration: duration * 0.6 } }
    },
    bounceInRight: {
      initial: trigger === 'continuous' ? { x: 0 } : { opacity: 0, x: 100 },
      animate: trigger === 'continuous' 
        ? { 
            x: [0, 20, -10, 5, 0],
            transition: { repeat: Infinity, duration }
          }
        : { 
            opacity: [0, 1, 1, 1],
            x: [100, -30, 10, 0],
            transition: { duration }
          },
      exit: { opacity: 0, x: 100, transition: { duration: duration * 0.6 } }
    },
    
    // === ATTENTION SEEKERS ===
    shake: {
      initial: { x: 0 },
      animate: { 
        x: [0, -10, 10, -10, 10, 0],
        transition: { repeat: trigger === 'continuous' ? Infinity : (trigger === 'once' ? 3 : 0), duration }
      },
      exit: { x: 0 }
    },
    shakeY: {
      initial: { y: 0 },
      animate: { 
        y: [0, -10, 10, -10, 10, 0],
        transition: { repeat: trigger === 'continuous' ? Infinity : (trigger === 'once' ? 3 : 0), duration }
      },
      exit: { y: 0 }
    },
    pulse: {
      initial: { scale: 1 },
      animate: { 
        scale: [1, 1.1, 1],
        transition: { repeat: trigger === 'continuous' ? Infinity : (trigger === 'once' ? 2 : 0), duration }
      },
      exit: { scale: 1 }
    },
    heartbeat: {
      initial: { scale: 1 },
      animate: { 
        scale: [1, 1.3, 1, 1.3, 1],
        transition: { repeat: trigger === 'continuous' ? Infinity : (trigger === 'once' ? 2 : 0), duration }
      },
      exit: { scale: 1 }
    },
    flash: {
      initial: { opacity: 1 },
      animate: { 
        opacity: [1, 0, 1, 0, 1],
        transition: { repeat: trigger === 'continuous' ? Infinity : (trigger === 'once' ? 3 : 0), duration }
      },
      exit: { opacity: 1 }
    },
    headShake: {
      initial: { x: 0, rotate: 0 },
      animate: { 
        x: [0, -6, 6, -3, 3, 0],
        rotate: [0, -9, 7, -5, 3, 0],
        transition: { repeat: trigger === 'continuous' ? Infinity : (trigger === 'once' ? 2 : 0), duration }
      },
      exit: { x: 0, rotate: 0 }
    },
    
    // === ELASTIC ANIMATIONS ===
    elasticIn: {
      initial: trigger === 'continuous' ? { scale: 1 } : { opacity: 0, scale: 0 },
      animate: trigger === 'continuous' 
        ? { 
            scale: [1, 1.2, 0.8, 1.1, 0.95, 1.03, 1],
            transition: { repeat: Infinity, duration: duration * 1.2 }
          }
        : { 
            opacity: 1,
            scale: [0, 1.25, 0.75, 1.15, 0.95, 1.05, 1],
            transition: { duration: duration * 1.1 }
          },
      exit: { opacity: 0, scale: 0, transition: { duration: duration * 0.5 } }
    },
    elasticInUp: {
      initial: trigger === 'continuous' ? { y: 0 } : { opacity: 0, y: 100 },
      animate: trigger === 'continuous' 
        ? { 
            y: [0, -20, 8, -4, 2, 0],
            transition: { repeat: Infinity, duration: duration * 1.2 }
          }
        : { 
            opacity: 1,
            y: [100, -25, 10, -5, 2, 0],
            transition: { duration: duration * 1.1 }
          },
      exit: { opacity: 0, y: 100, transition: { duration: duration * 0.6 } }
    },
    elasticInDown: {
      initial: trigger === 'continuous' ? { y: 0 } : { opacity: 0, y: -100 },
      animate: trigger === 'continuous' 
        ? { 
            y: [0, 20, -8, 4, -2, 0],
            transition: { repeat: Infinity, duration: duration * 1.2 }
          }
        : { 
            opacity: 1,
            y: [-100, 25, -10, 5, -2, 0],
            transition: { duration: duration * 1.1 }
          },
      exit: { opacity: 0, y: -100, transition: { duration: duration * 0.6 } }
    },
    elasticInLeft: {
      initial: trigger === 'continuous' ? { x: 0 } : { opacity: 0, x: -100 },
      animate: trigger === 'continuous' 
        ? { 
            x: [0, 20, -8, 4, -2, 0],
            transition: { repeat: Infinity, duration: duration * 1.2 }
          }
        : { 
            opacity: 1,
            x: [-100, 25, -10, 5, -2, 0],
            transition: { duration: duration * 1.1 }
          },
      exit: { opacity: 0, x: -100, transition: { duration: duration * 0.6 } }
    },
    elasticInRight: {
      initial: trigger === 'continuous' ? { x: 0 } : { opacity: 0, x: 100 },
      animate: trigger === 'continuous' 
        ? { 
            x: [0, -20, 8, -4, 2, 0],
            transition: { repeat: Infinity, duration: duration * 1.2 }
          }
        : { 
            opacity: 1,
            x: [100, -25, 10, -5, 2, 0],
            transition: { duration: duration * 1.1 }
          },
      exit: { opacity: 0, x: 100, transition: { duration: duration * 0.6 } }
    },
    
    // === SWING & ROTATION ===
    swing: {
      initial: { rotate: 0 },
      animate: { 
        rotate: [0, 15, -10, 5, -5, 0],
        transition: { repeat: trigger === 'continuous' ? Infinity : (trigger === 'once' ? 1 : 0), duration }
      },
      exit: { rotate: 0 }
    },
    rotate: {
      initial: { rotate: 0 },
      animate: { 
        rotate: 360,
        transition: { repeat: trigger === 'continuous' ? Infinity : (trigger === 'once' ? 1 : 0), duration, ease: 'linear' }
      },
      exit: { rotate: 0 }
    },
    rotateIn: {
      initial: trigger === 'continuous' ? { rotate: 0 } : { rotate: -200, opacity: 0 },
      animate: trigger === 'continuous' 
        ? { 
            rotate: [0, -30, 30, -15, 15, 0],
            transition: { repeat: Infinity, duration }
          }
        : { rotate: 0, opacity: 1, transition: { duration } },
      exit: { rotate: -200, opacity: 0, transition: { duration: duration * 0.7 } }
    },
    rotateInUpLeft: {
      initial: trigger === 'continuous' ? { rotate: 0 } : { rotate: -45, opacity: 0 },
      animate: trigger === 'continuous' 
        ? { 
            rotate: [0, -20, 20, -10, 10, 0],
            transition: { repeat: Infinity, duration }
          }
        : { rotate: 0, opacity: 1, transition: { duration } },
      exit: { rotate: -45, opacity: 0, transition: { duration: duration * 0.7 } }
    },
    rotateInUpRight: {
      initial: trigger === 'continuous' ? { rotate: 0 } : { rotate: 45, opacity: 0 },
      animate: trigger === 'continuous' 
        ? { 
            rotate: [0, 20, -20, 10, -10, 0],
            transition: { repeat: Infinity, duration }
          }
        : { rotate: 0, opacity: 1, transition: { duration } },
      exit: { rotate: 45, opacity: 0, transition: { duration: duration * 0.7 } }
    },
    rotateInDownLeft: {
      initial: trigger === 'continuous' ? { rotate: 0 } : { rotate: 45, opacity: 0 },
      animate: trigger === 'continuous' 
        ? { 
            rotate: [0, 20, -20, 10, -10, 0],
            transition: { repeat: Infinity, duration }
          }
        : { rotate: 0, opacity: 1, transition: { duration } },
      exit: { rotate: 45, opacity: 0, transition: { duration: duration * 0.7 } }
    },
    rotateInDownRight: {
      initial: trigger === 'continuous' ? { rotate: 0 } : { rotate: -45, opacity: 0 },
      animate: trigger === 'continuous' 
        ? { 
            rotate: [0, -20, 20, -10, 10, 0],
            transition: { repeat: Infinity, duration }
          }
        : { rotate: 0, opacity: 1, transition: { duration } },
      exit: { rotate: -45, opacity: 0, transition: { duration: duration * 0.7 } }
    },
    
    // === FLIP ANIMATIONS ===
    flip: {
      initial: { rotateY: 0 },
      animate: { 
        rotateY: 360,
        transition: { repeat: trigger === 'continuous' ? Infinity : (trigger === 'once' ? 1 : 0), duration, ease: 'linear' }
      },
      exit: { rotateY: 0 }
    },
    flipInX: {
      initial: trigger === 'continuous' ? { rotateX: 0 } : { rotateX: 90, opacity: 0 },
      animate: trigger === 'continuous' 
        ? { 
            rotateX: [0, 45, -15, 5, 0],
            transition: { repeat: Infinity, duration }
          }
        : { 
            rotateX: [90, -10, 10, 0],
            opacity: [0, 1, 1, 1],
            transition: { duration }
          },
      exit: { rotateX: 90, opacity: 0, transition: { duration: duration * 0.6 } }
    },
    flipInY: {
      initial: trigger === 'continuous' ? { rotateY: 0 } : { rotateY: 90, opacity: 0 },
      animate: trigger === 'continuous' 
        ? { 
            rotateY: [0, 45, -15, 5, 0],
            transition: { repeat: Infinity, duration }
          }
        : { 
            rotateY: [90, -10, 10, 0],
            opacity: [0, 1, 1, 1],
            transition: { duration }
          },
      exit: { rotateY: 90, opacity: 0, transition: { duration: duration * 0.6 } }
    },
    flipX: {
      initial: { rotateX: 0 },
      animate: { 
        rotateX: 360,
        transition: { repeat: trigger === 'continuous' ? Infinity : (trigger === 'once' ? 1 : 0), duration, ease: 'linear' }
      },
      exit: { rotateX: 0 }
    },
    flipY: {
      initial: { rotateY: 0 },
      animate: { 
        rotateY: 360,
        transition: { repeat: trigger === 'continuous' ? Infinity : (trigger === 'once' ? 1 : 0), duration, ease: 'linear' }
      },
      exit: { rotateY: 0 }
    },
    
    // === SPECIAL EFFECTS ===
    rubberBand: {
      initial: { scale: 1 },
      animate: { 
        scale: [1, 1.25, 0.75, 1.15, 1],
        scaleX: [1, 0.75, 1.25, 0.85, 1],
        transition: { repeat: trigger === 'continuous' ? Infinity : (trigger === 'once' ? 1 : 0), duration }
      },
      exit: { scale: 1 }
    },
    wobble: {
      initial: { x: 0, rotate: 0 },
      animate: { 
        x: [0, -25, 20, -15, 10, -5, 0],
        rotate: [0, -5, 3, -3, 2, -1, 0],
        transition: { repeat: trigger === 'continuous' ? Infinity : (trigger === 'once' ? 1 : 0), duration }
      },
      exit: { x: 0, rotate: 0 }
    },
    jello: {
      initial: { skewX: 0, skewY: 0 },
      animate: { 
        skewX: [0, -12.5, 6.25, -3.125, 1.5625, -0.78125, 0.390625, -0.1953125, 0],
        skewY: [0, -12.5, 6.25, -3.125, 1.5625, -0.78125, 0.390625, -0.1953125, 0],
        transition: { repeat: trigger === 'continuous' ? Infinity : (trigger === 'once' ? 1 : 0), duration }
      },
      exit: { skewX: 0, skewY: 0 }
    },
    tada: {
      initial: { scale: 1, rotate: 0 },
      animate: { 
        scale: [1, 0.9, 1.1, 1.1, 1.1, 1.1, 1.1, 1],
        rotate: [0, -3, 3, -3, 3, -3, 3, 0],
        transition: { repeat: trigger === 'continuous' ? Infinity : (trigger === 'once' ? 1 : 0), duration }
      },
      exit: { scale: 1, rotate: 0 }
    },
    
    // === LIGHTSPEED ===
    lightSpeedInRight: {
      initial: trigger === 'continuous' ? { x: 0, skewX: 0 } : { x: '100%', skewX: -30, opacity: 0 },
      animate: trigger === 'continuous' 
        ? { 
            x: [0, 50, -10, 0],
            skewX: [0, -15, 10, 0],
            transition: { repeat: Infinity, duration }
          }
        : { 
            x: [100, -20, 0],
            skewX: [-30, 20, -5, 0],
            opacity: [0, 1, 1, 1],
            transition: { duration }
          },
      exit: { x: '100%', skewX: -30, opacity: 0, transition: { duration: duration * 0.7 } }
    },
    lightSpeedInLeft: {
      initial: trigger === 'continuous' ? { x: 0, skewX: 0 } : { x: '-100%', skewX: 30, opacity: 0 },
      animate: trigger === 'continuous' 
        ? { 
            x: [0, -50, 10, 0],
            skewX: [0, 15, -10, 0],
            transition: { repeat: Infinity, duration }
          }
        : { 
            x: [-100, 20, 0],
            skewX: [30, -20, 5, 0],
            opacity: [0, 1, 1, 1],
            transition: { duration }
          },
      exit: { x: '-100%', skewX: 30, opacity: 0, transition: { duration: duration * 0.7 } }
    },
    
    // === ROLL ANIMATIONS ===
    rollIn: {
      initial: trigger === 'continuous' ? { x: 0, rotate: 0 } : { x: '-100%', rotate: -120, opacity: 0 },
      animate: trigger === 'continuous' 
        ? { 
            x: [0, -30, 30, 0],
            rotate: [0, -30, 30, 0],
            transition: { repeat: Infinity, duration }
          }
        : { x: 0, rotate: 0, opacity: 1, transition: { duration } },
      exit: { x: '-100%', rotate: -120, opacity: 0, transition: { duration: duration * 0.7 } }
    },
    rollOut: {
      initial: { x: 0, rotate: 0, opacity: 1 },
      animate: { 
        x: trigger === 'continuous' ? [0, 50, 0] : ['0%', '100%'],
        rotate: trigger === 'continuous' ? [0, 60, 0] : [0, 120],
        opacity: trigger === 'continuous' ? [1, 0.5, 1] : [1, 0],
        transition: { repeat: trigger === 'continuous' ? Infinity : (trigger === 'once' ? 1 : 0), duration }
      },
      exit: { x: 0, rotate: 0, opacity: 1 }
    },
    
    // === GEOMETRIC ===
    jackInTheBox: {
      initial: trigger === 'continuous' ? { scale: 1, rotate: 0 } : { opacity: 0, scale: 0.1, rotate: 30 },
      animate: trigger === 'continuous' 
        ? { 
            scale: [1, 0.8, 1.2, 1],
            rotate: [0, 15, -15, 0],
            transition: { repeat: Infinity, duration }
          }
        : { 
            opacity: 1,
            scale: [0.1, 0.5, 0.8, 1],
            rotate: [30, -10, 3, 0],
            transition: { duration }
          },
      exit: { opacity: 0, scale: 0.1, rotate: 30, transition: { duration: duration * 0.6 } }
    },
    hinge: {
      initial: { rotate: 0, transformOrigin: "top left" },
      animate: trigger === 'continuous' 
        ? { 
            rotate: [0, 40, 20, 40, 20, 0],
            transition: { repeat: Infinity, duration: duration * 1.5 }
          }
        : { 
            rotate: [0, 80, 60, 80, 60, 60],
            opacity: [1, 1, 1, 1, 1, 0],
            y: [0, 0, 0, 0, 0, 200],
            transition: { duration: duration * 1.8 }
          },
      exit: { rotate: 0, opacity: 1, y: 0 }
    },
    
    // === BACK ANIMATIONS ===
    backInUp: {
      initial: trigger === 'continuous' ? { y: 0, scale: 1 } : { y: 50, scale: 0.7, opacity: 0 },
      animate: trigger === 'continuous' 
        ? { 
            y: [0, 20, 0],
            scale: [1, 0.9, 1],
            transition: { repeat: Infinity, duration }
          }
        : { y: 0, scale: 1, opacity: 1, transition: { duration } },
      exit: { y: 50, scale: 0.7, opacity: 0, transition: { duration: duration * 0.6 } }
    },
    backInDown: {
      initial: trigger === 'continuous' ? { y: 0, scale: 1 } : { y: -50, scale: 0.7, opacity: 0 },
      animate: trigger === 'continuous' 
        ? { 
            y: [0, -20, 0],
            scale: [1, 0.9, 1],
            transition: { repeat: Infinity, duration }
          }
        : { y: 0, scale: 1, opacity: 1, transition: { duration } },
      exit: { y: -50, scale: 0.7, opacity: 0, transition: { duration: duration * 0.6 } }
    },
    backInLeft: {
      initial: trigger === 'continuous' ? { x: 0, scale: 1 } : { x: -50, scale: 0.7, opacity: 0 },
      animate: trigger === 'continuous' 
        ? { 
            x: [0, -20, 0],
            scale: [1, 0.9, 1],
            transition: { repeat: Infinity, duration }
          }
        : { x: 0, scale: 1, opacity: 1, transition: { duration } },
      exit: { x: -50, scale: 0.7, opacity: 0, transition: { duration: duration * 0.6 } }
    },
    backInRight: {
      initial: trigger === 'continuous' ? { x: 0, scale: 1 } : { x: 50, scale: 0.7, opacity: 0 },
      animate: trigger === 'continuous' 
        ? { 
            x: [0, 20, 0],
            scale: [1, 0.9, 1],
            transition: { repeat: Infinity, duration }
          }
        : { x: 0, scale: 1, opacity: 1, transition: { duration } },
      exit: { x: 50, scale: 0.7, opacity: 0, transition: { duration: duration * 0.6 } }
    }
  };

  return baseVariants[animationType] || baseVariants.none;
};