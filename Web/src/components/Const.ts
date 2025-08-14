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

export const projectDetailsStyles = `
    /* Project Details specific Framer Motion styles */
    @keyframes menuSlideIn {
      0% { 
        opacity: 0; 
        transform: translateY(20px) scale(0.8); 
      }
      100% { 
        opacity: 1; 
        transform: translateY(0) scale(1); 
      }
    }
    @keyframes logoPress {
      0% { transform: scale(1); }
      50% { transform: scale(0.9); }
      100% { transform: scale(1); }
    }
    @keyframes menuItemSlideIn {
      0% { 
        opacity: 0; 
        transform: scale(0.3); 
      }
      70% {
        opacity: 1;
        transform: scale(1.05);
      }
      100% { 
        opacity: 1; 
        transform: scale(1); 
      }
    }
    @keyframes menuItemSlideOut {
      0% { 
        opacity: 1; 
        transform: translate(-50%, -50%) scale(1) rotate(0deg); 
      }
      100% { 
        opacity: 0; 
        transform: translate(-50%, -50%) scale(0.3) rotate(15deg); 
      }
    }
    @keyframes subtleGlow {
      0% { 
        filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.2)) drop-shadow(0 0 16px rgba(255, 255, 255, 0.1));
      }
      50% { 
        filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.3)) drop-shadow(0 0 24px rgba(255, 255, 255, 0.15));
      }
      100% { 
        filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.2)) drop-shadow(0 0 16px rgba(255, 255, 255, 0.1));
      }
    }
    @keyframes glowPulse {
      0% { 
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.4), 0 0 20px rgba(255, 255, 255, 0.3), 0 0 30px rgba(255, 255, 255, 0.2);
      }
      50% { 
        box-shadow: 0 0 15px rgba(255, 255, 255, 0.6), 0 0 25px rgba(255, 255, 255, 0.4), 0 0 35px rgba(255, 255, 255, 0.3);
      }
      100% { 
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.4), 0 0 20px rgba(255, 255, 255, 0.3), 0 0 30px rgba(255, 255, 255, 0.2);
      }
    }

    .fade-in-on-scroll {
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.6s ease-out;
    }

    .fade-in-on-scroll.visible {
      opacity: 1;
      transform: translateY(0);
    }

    .sub-project-visible {
      opacity: 1;
      transform: translateY(0);
      transition: all 0.6s ease-out;
    }

    .logo-press {
      animation: logoPress 0.3s ease-out;
    }

    .logo-container {
      transition: all 0.2s ease;
      position: relative;
    }

    .logo-container:active {
      transform: scale(0.9);
    }

    .logo-container:hover {
      filter: brightness(1.1);
    }

    .menu-item-enter {
      animation: menuItemSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      opacity: 0;
    }

    .menu-item-exit {
      animation: menuItemSlideOut 0.3s ease-in forwards;
    }

    .menu-item-modern {
      background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85));
      backdrop-filter: blur(15px);
      border: 1px solid rgba(255,255,255,0.3);
      color: #2d3748;
      box-shadow: 0 6px 24px rgba(0,0,0,0.15);
      position: relative;
      overflow: hidden;
    }

    .menu-item-modern::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
      transition: left 0.5s;
    }

    .menu-item-modern:hover::before {
      left: 100%;
    }

    .menu-item-modern:hover {
      box-shadow: 0 8px 32px rgba(0,0,0,0.2) !important;
      border-color: rgba(102, 126, 234, 0.4) !important;
      background: linear-gradient(135deg, rgba(255,255,255,0.98), rgba(255,255,255,0.9)) !important;
    }

    .menu-item-modern:active {
      transform: scale(0.95) !important;
    }

    .menu-item-rotated {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .menu-item-rotated:hover {
      transform: scale(1.15) !important;
    }

    .rotate-0 { transform: translate(-50%, -50%) rotate(0deg) !important; }
    .rotate-30 { transform: translate(-50%, -50%) rotate(30deg) !important; }
    .rotate-60 { transform: translate(-50%, -50%) rotate(60deg) !important; }
    .rotate-90 { transform: translate(-50%, -50%) rotate(90deg) !important; }

    .rotate-0:hover { transform: translate(-50%, -50%) rotate(0deg) scale(1.15) !important; }
    .rotate-30:hover { transform: translate(-50%, -50%) rotate(30deg) scale(1.15) !important; }
    .rotate-60:hover { transform: translate(-50%, -50%) rotate(60deg) scale(1.15) !important; }
    .rotate-90:hover { transform: translate(-50%, -50%) rotate(90deg) scale(1.15) !important; }

    .rotate-0:active { transform: translate(-50%, -50%) rotate(0deg) scale(0.95) !important; }
    .rotate-30:active { transform: translate(-50%, -50%) rotate(30deg) scale(0.95) !important; }
    .rotate-60:active { transform: translate(-50%, -50%) rotate(60deg) scale(0.95) !important; }
    .rotate-90:active { transform: translate(-50%, -50%) rotate(90deg) scale(0.95) !important; }

    .clickable-sub-project {
      cursor: pointer !important;
      transition: all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
      position: relative;
      z-index: 20;
      /* Base glow effect with subtle animation */
      filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.2)) drop-shadow(0 0 16px rgba(255, 255, 255, 0.1));
      animation: subtleGlow 3s ease-in-out infinite;
    }

    .clickable-sub-project:hover {
      filter: brightness(1.15) saturate(1.1) drop-shadow(0 0 20px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 40px rgba(255, 255, 255, 0.4)) drop-shadow(0 0 60px rgba(255, 255, 255, 0.2)) drop-shadow(0 0 80px rgba(102, 126, 234, 0.3));
      z-index: 50 !important;
      transform: scale(1.03); /* Slightly more scale for better visual feedback */
      animation: none; /* Pause the subtle glow animation on hover */
    }

    /* REMOVED: All dimming effects for sub-projects */
    .sub-project-container {
      transition: all 0.4s ease;
      /* No dimming classes needed anymore */
    }

    .centered-logo {
      position: absolute;
      top: 40px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 15;
      transition: all 0.6s ease;
      opacity: 0.95;
      cursor: pointer;
    }

    .centered-logo img {
      height: 120px;
      width: auto;
      filter: drop-shadow(0 4px 15px rgba(0,0,0,0.4));
      transition: all 0.3s ease;
    }

    .centered-logo:hover img {
      filter: drop-shadow(0 6px 20px rgba(0,0,0,0.5)) brightness(1.1);
      transform: scale(1.05);
    }

    .centered-logo:active img {
      transform: scale(0.95);
    }

    .connect-button {
      background: linear-gradient(135deg, #ffffff, #f7fafc);
      color: #2d3748;
      border: 2px solid #ffffff;
      padding: 12px 32px;
      border-radius: 25px;
      font-weight: 700;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 1px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }

    .connect-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.2);
      background: linear-gradient(135deg, #ffffff, #ffffff);
    }

    .connect-button:active {
      transform: translateY(0);
    }

    /* Section Navigation Buttons */
    .section-nav-buttons {
      position: fixed;
      top: 20px;
      right: 45px;
      z-index: 1000;
      display: flex;
      gap: 10px;
    }

    .section-nav-btn {
      background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85));
      backdrop-filter: blur(15px);
      border: 2px solid rgba(255,255,255,0.3);
      color: #2d3748;
      padding: 8px 16px;
      border-radius: 20px;
      font-weight: 600;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      position: relative;
      overflow: hidden;
    }

    .section-nav-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
      transition: left 0.5s;
    }

    .section-nav-btn:hover::before {
      left: 100%;
    }

    .section-nav-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.2);
      border-color: rgba(102, 126, 234, 0.4);
      background: linear-gradient(135deg, rgba(255,255,255,0.98), rgba(255,255,255,0.9));
    }

    .section-nav-btn:active {
      transform: translateY(0);
    }

    .section-nav-btn.active {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border-color: rgba(102, 126, 234, 0.6);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
    }

    .section-nav-btn.active:hover {
      background: linear-gradient(135deg, #5a67d8, #6b46c1);
    }

    /* Section badges */
    .exterior-badge {
      background: #4caf50;
      color: white;
      font-size: 9px;
      padding: 1px 4px;
      border-radius: 3px;
      margin-left: 6px;
    }

    .interior-badge {
      background: #ff9800;
      color: white;
      font-size: 9px;
      padding: 1px 4px;
      border-radius: 3px;
      margin-left: 6px;
    }

    /* Responsive coordinate system debugging */
    .coordinate-debug {
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(0,0,0,0.8);
      color: white;
      padding: 8px;
      border-radius: 4px;
      font-size: 11px;
      z-index: 1001;
      font-family: monospace;
      line-height: 1.3;
    }

    .section-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      border: 2px dashed rgba(255,255,255,0.3);
      z-index: 5;
    }

    /* Ensure no gaps between sections */
    section {
      margin: 0 !important;
      padding: 0 !important;
      border: none !important;
      display: block !important;
    }

    /* ENHANCED MOBILE & TABLET RESPONSIVENESS */
    
    /* Mobile (≤768px) */
    @media (max-width: 768px) {
      section {
        width: 100vw !important;
        min-height: 80vh !important; /* Reduced from 100vh to prevent gaps */
      }
      
      .centered-logo {
        top: 20px !important;
      }
      
      .centered-logo img {
        height: 80px !important;
      }
      
      .coordinate-debug {
        font-size: 8px !important;
        padding: 4px !important;
        right: 5px !important;
        top: 5px !important;
        max-width: 120px !important;
      }
      
      .logo-container img {
        height: 100px !important;
      }
      
      /* Mobile menu adjustments */
      .menu-item-modern {
        padding: 4px 8px !important;
        font-size: 8px !important;
        min-width: 65px !important;
      }
      
      .menu-item-modern span:first-child {
        font-size: 10px !important;
      }
      
      /* Mobile section navigation */
      .section-nav-buttons {
        top: 15px !important;
        right: 40px !important;
        gap: 8px !important;
      }
      
      .section-nav-btn {
        padding: 6px 12px !important;
        font-size: 10px !important;
        border-radius: 15px !important;
      }
    }
    
    /* Tablet (769px - 1024px) */
    @media (min-width: 769px) and (max-width: 1024px) {
      section {
        width: 100vw !important;
        min-height: 90vh !important;
      }
      
      .centered-logo {
        top: 30px !important;
      }
      
      .centered-logo img {
        height: 100px !important;
      }
      
      .coordinate-debug {
        font-size: 9px !important;
        padding: 6px !important;
        max-width: 140px !important;
      }
      
      .logo-container img {
        height: 120px !important;
      }
      
      .menu-item-modern {
        padding: 5px 10px !important;
        font-size: 10px !important;
        min-width: 75px !important;
      }
      
      .menu-item-modern span:first-child {
        font-size: 11px !important;
      }
      
      .section-nav-btn {
        padding: 7px 14px !important;
        font-size: 11px !important;
      }
    }
    
    /* Large tablets and small desktops (1025px - 1199px) */
    @media (min-width: 1025px) and (max-width: 1199px) {
      .coordinate-debug {
        font-size: 10px !important;
        padding: 7px !important;
      }
      
      .menu-item-modern {
        padding: 5px 10px !important;
        font-size: 10px !important;
        min-width: 80px !important;
      }
    }

    /* Ensure smooth scrolling container */
    body, html {
      margin: 0;
      padding: 0;
      overflow: hidden;
    }

    /* LOADING OVERLAY */
    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    /* RESPONSIVE IMPROVEMENTS FOR TOUCH INTERFACES */
    @media (max-width: 1024px) {
      .clickable-sub-project {
        /* Increase touch target size on tablets/mobile */
        min-width: 44px !important;
        min-height: 44px !important;
      }
      
      .clickable-sub-project:hover {
        /* Enhanced glow for touch devices */
        filter: brightness(1.1) saturate(1.08) drop-shadow(0 0 15px rgba(255, 255, 255, 0.7)) drop-shadow(0 0 30px rgba(255, 255, 255, 0.3)) drop-shadow(0 0 45px rgba(102, 126, 234, 0.2));
        transform: scale(1.02); /* Slightly reduced scale on smaller devices */
        animation: none; /* Pause the subtle glow animation on hover */
      }
      
      /* Disable hover effects completely on pure touch devices but keep base glow */
      @media (hover: none) {
        .clickable-sub-project {
          /* Enhanced base glow for touch devices */
          filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3)) drop-shadow(0 0 20px rgba(255, 255, 255, 0.15));
        }
        
        .clickable-sub-project:hover {
          filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3)) drop-shadow(0 0 20px rgba(255, 255, 255, 0.15));
          transform: none;
          animation: subtleGlow 3s ease-in-out infinite;
        }
        
        .menu-item-modern:hover {
          box-shadow: 0 6px 24px rgba(0,0,0,0.15) !important;
          background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85)) !important;
        }
        
        .section-nav-btn:hover {
          transform: none !important;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important;
        }
      }
    }
  `;

export const homepageStyles = `
    /* Homepage specific Framer Motion styles */
    @keyframes menuSlideIn {
      0% { 
        opacity: 0; 
        transform: translateY(20px) scale(0.8); 
      }
      100% { 
        opacity: 1; 
        transform: translateY(0) scale(1); 
      }
    }
    @keyframes logoPress {
      0% { transform: scale(1); }
      50% { transform: scale(0.9); }
      100% { transform: scale(1); }
    }
    @keyframes menuItemSlideIn {
      0% { 
        opacity: 0; 
        transform: scale(0.3); 
      }
      70% {
        opacity: 1;
        transform: scale(1.05);
      }
      100% { 
        opacity: 1; 
        transform: scale(1); 
      }
    }
    @keyframes menuItemSlideOut {
      0% { 
        opacity: 1; 
        transform: translate(-50%, -50%) scale(1) rotate(0deg); 
      }
      100% { 
        opacity: 0; 
        transform: translate(-50%, -50%) scale(0.3) rotate(15deg); 
      }
    }
    @keyframes subtleGlow {
      0% { 
        filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.2)) drop-shadow(0 0 16px rgba(255, 255, 255, 0.1));
      }
      50% { 
        filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.3)) drop-shadow(0 0 24px rgba(255, 255, 255, 0.15));
      }
      100% { 
        filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.2)) drop-shadow(0 0 16px rgba(255, 255, 255, 0.1));
      }
    }

    @keyframes glowPulse {
      0% { 
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.4), 0 0 20px rgba(255, 255, 255, 0.3), 0 0 30px rgba(255, 255, 255, 0.2);
      }
      50% { 
        box-shadow: 0 0 15px rgba(255, 255, 255, 0.6), 0 0 25px rgba(255, 255, 255, 0.4), 0 0 35px rgba(255, 255, 255, 0.3);
      }
      100% { 
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.4), 0 0 20px rgba(255, 255, 255, 0.3), 0 0 30px rgba(255, 255, 255, 0.2);
      }
    }

    .fade-in-on-scroll {
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.6s ease-out;
    }

    .fade-in-on-scroll.visible {
      opacity: 1;
      transform: translateY(0);
    }

    .sub-image-visible {
      opacity: 1;
      transform: translateY(0);
      transition: all 0.6s ease-out;
    }

    .logo-press {
      animation: logoPress 0.3s ease-out;
    }

    .logo-container {
      transition: all 0.2s ease;
      position: relative;
    }

    .logo-container:active {
      transform: scale(0.9);
    }

    .logo-container:hover {
      filter: brightness(1.1);
    }

    .menu-item-enter {
      animation: menuItemSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      opacity: 0;
    }

    .menu-item-exit {
      animation: menuItemSlideOut 0.3s ease-in forwards;
    }

    .menu-item-modern {
      background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85));
      backdrop-filter: blur(15px);
      border: 1px solid rgba(255,255,255,0.3);
      color: #2d3748;
      box-shadow: 0 6px 24px rgba(0,0,0,0.15);
      position: relative;
      overflow: hidden;
    }

    .menu-item-modern::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
      transition: left 0.5s;
    }

    .menu-item-modern:hover::before {
      left: 100%;
    }

    .menu-item-modern:hover {
      box-shadow: 0 8px 32px rgba(0,0,0,0.2) !important;
      border-color: rgba(102, 126, 234, 0.4) !important;
      background: linear-gradient(135deg, rgba(255,255,255,0.98), rgba(255,255,255,0.9)) !important;
    }

    .menu-item-modern:active {
      transform: scale(0.95) !important;
    }

    .menu-item-rotated {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .menu-item-rotated:hover {
      transform: scale(1.15) !important;
    }

    .rotate-0 { transform: translate(-50%, -50%) rotate(0deg) !important; }
    .rotate-30 { transform: translate(-50%, -50%) rotate(30deg) !important; }
    .rotate-60 { transform: translate(-50%, -50%) rotate(60deg) !important; }
    .rotate-90 { transform: translate(-50%, -50%) rotate(90deg) !important; }

    .rotate-0:hover { transform: translate(-50%, -50%) rotate(0deg) scale(1.15) !important; }
    .rotate-30:hover { transform: translate(-50%, -50%) rotate(30deg) scale(1.15) !important; }
    .rotate-60:hover { transform: translate(-50%, -50%) rotate(60deg) scale(1.15) !important; }
    .rotate-90:hover { transform: translate(-50%, -50%) rotate(90deg) scale(1.15) !important; }

    .rotate-0:active { transform: translate(-50%, -50%) rotate(0deg) scale(0.95) !important; }
    .rotate-30:active { transform: translate(-50%, -50%) rotate(30deg) scale(0.95) !important; }
    .rotate-60:active { transform: translate(-50%, -50%) rotate(60deg) scale(0.95) !important; }
    .rotate-90:active { transform: translate(-50%, -50%) rotate(90deg) scale(0.95) !important; }

    .clickable-sub-image {
      cursor: pointer !important;
      transition: all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
      position: relative;
      z-index: 20;
      /* Base glow effect with subtle animation */
      filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.2)) drop-shadow(0 0 16px rgba(255, 255, 255, 0.1));
      animation: subtleGlow 3s ease-in-out infinite;
    }

    .clickable-sub-image:hover {
      filter: brightness(1.15) saturate(1.1) drop-shadow(0 0 20px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 40px rgba(255, 255, 255, 0.4)) drop-shadow(0 0 60px rgba(255, 255, 255, 0.2)) drop-shadow(0 0 80px rgba(102, 126, 234, 0.3));
      z-index: 50 !important;
      transform: scale(1.03); /* Slightly more scale for better visual feedback */
      animation: none; /* Pause the subtle glow animation on hover */
    }

    /* REMOVED: All dimming effects for sub-images */
    .sub-image-container {
      transition: all 0.4s ease;
      /* No dimming classes needed anymore */
    }

    .centered-logo {
      position: absolute;
      top: 40px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 15;
      transition: all 0.6s ease;
      opacity: 0.95;
      cursor: pointer;
    }

    .centered-logo img {
      height: 120px;
      width: auto;
      filter: drop-shadow(0 4px 15px rgba(0,0,0,0.4));
      transition: all 0.3s ease;
    }

    .centered-logo:hover img {
      filter: drop-shadow(0 6px 20px rgba(0,0,0,0.5)) brightness(1.1);
      transform: scale(1.05);
    }

    .centered-logo:active img {
      transform: scale(0.95);
    }

    .connect-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      animation: fadeIn 0.3s ease-out;
    }

    .connect-form {
      background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.9));
      backdrop-filter: blur(20px);
      border-radius: 20px;
      padding: 40px;
      max-width: 500px;
      width: 90%;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0,0,0,0.3);
      animation: zoomIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .connect-form h2 {
      margin: 0 0 20px 0;
      color: #2d3748;
      font-size: 28px;
      font-weight: 700;
    }

    .connect-form p {
      margin: 0 0 30px 0;
      color: #4a5568;
      font-size: 16px;
      line-height: 1.5;
    }

    .form-group {
      margin-bottom: 20px;
      text-align: left;
    }

    .email-input,
    .mobile-input,
    .message-input {
      width: 100%;
      padding: 15px 20px;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      font-size: 16px;
      transition: all 0.3s ease;
      box-sizing: border-box;
      font-family: inherit;
    }

    .email-input:focus,
    .mobile-input:focus,
    .message-input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .email-input.error,
    .mobile-input.error,
    .message-input.error {
      border-color: #e53e3e;
      box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1);
    }

    .message-input {
      resize: vertical;
      min-height: 100px;
    }

    .error-message {
      color: #e53e3e;
      font-size: 14px;
      margin-top: 5px;
      text-align: left;
      font-weight: 500;
    }

    .general-error {
      background: #fed7d7;
      color: #c53030;
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 20px;
      text-align: center;
      font-weight: 600;
    }

    .success-container {
      text-align: center;
    }

    .success-icon {
      font-size: 64px;
      color: #38a169;
      margin-bottom: 20px;
      animation: bounce 0.6s ease;
    }

    .closing-note {
      color: #718096;
      font-size: 14px;
      margin-top: 15px;
      font-style: italic;
    }

    .submit-btn {
      width: 100%;
      padding: 15px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-bottom: 15px;
    }

    .submit-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
    }

    .submit-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    .close-btn {
      background: none;
      border: none;
      color: #718096;
      cursor: pointer;
      font-size: 14px;
      padding: 10px;
      transition: color 0.3s ease;
    }

    .close-btn:hover {
      color: #2d3748;
    }

    .success-message {
      color: #38a169;
      font-weight: 600;
      margin-top: 10px;
    }

    .connect-button {
      background: linear-gradient(135deg, #ffffff, #f7fafc);
      color: #2d3748;
      border: 2px solid #ffffff;
      padding: 12px 32px;
      border-radius: 25px;
      font-weight: 700;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 1px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }

    .connect-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.2);
      background: linear-gradient(135deg, #ffffff, #ffffff);
    }

    .connect-button:active {
      transform: translateY(0);
    }

    /* Responsive coordinate system debugging */
    .coordinate-debug {
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(0,0,0,0.8);
      color: white;
      padding: 8px;
      border-radius: 4px;
      font-size: 11px;
      z-index: 1001;
      font-family: monospace;
      line-height: 1.3;
    }

    .section-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      border: 2px dashed rgba(255,255,255,0.3);
      z-index: 5;
    }

    /* Ensure no gaps between sections */
    section {
      margin: 0 !important;
      padding: 0 !important;
      border: none !important;
      display: block !important;
    }

    /* ENHANCED MOBILE & TABLET RESPONSIVENESS */
    
    /* Mobile (≤768px) */
    @media (max-width: 768px) {
      section {
        width: 100vw !important;
        min-height: 80vh !important; /* Reduced from 100vh to prevent gaps */
      }
      
      .centered-logo {
        top: 20px !important;
      }
      
      .centered-logo img {
        height: 80px !important;
      }
      
      .coordinate-debug {
        font-size: 8px !important;
        padding: 4px !important;
        right: 5px !important;
        top: 5px !important;
        max-width: 120px !important;
      }
      
      .logo-container img {
        height: 100px !important;
      }
      
      .connect-form {
        padding: 30px 20px !important;
        margin: 0 10px !important;
      }
      
      .connect-form h2 {
        font-size: 24px !important;
      }
      
      .connect-form p {
        font-size: 14px !important;
      }
      
      .email-input {
        padding: 12px 16px !important;
        font-size: 14px !important;
      }
      
      .submit-btn {
        padding: 12px !important;
        font-size: 14px !important;
      }
      
      .connect-button {
        padding: 10px 24px !important;
        font-size: 14px !important;
      }
      
      /* Mobile menu adjustments */
      .menu-item-modern {
        padding: 4px 8px !important;
        font-size: 8px !important;
        min-width: 65px !important;
      }
      
      .menu-item-modern span:first-child {
        font-size: 10px !important;
      }
    }
    
    /* Tablet (769px - 1024px) */
    @media (min-width: 769px) and (max-width: 1024px) {
      section {
        width: 100vw !important;
        min-height: 90vh !important;
      }
      
      .centered-logo {
        top: 30px !important;
      }
      
      .centered-logo img {
        height: 100px !important;
      }
      
      .coordinate-debug {
        font-size: 9px !important;
        padding: 6px !important;
        max-width: 140px !important;
      }
      
      .logo-container img {
        height: 120px !important;
      }
      
      .connect-form {
        padding: 35px !important;
        max-width: 350px !important;
      }
      
      .connect-form h2 {
        font-size: 26px !important;
      }
      
      .menu-item-modern {
        padding: 5px 10px !important;
        font-size: 10px !important;
        min-width: 75px !important;
      }
      
      .menu-item-modern span:first-child {
        font-size: 11px !important;
      }
    }
    
    /* Large tablets and small desktops (1025px - 1199px) */
    @media (min-width: 1025px) and (max-width: 1199px) {
      .coordinate-debug {
        font-size: 10px !important;
        padding: 7px !important;
      }
      
      .menu-item-modern {
        padding: 5px 10px !important;
        font-size: 10px !important;
        min-width: 80px !important;
      }
    }

    /* Ensure smooth scrolling container */
    body, html {
      margin: 0;
      padding: 0;
      overflow: hidden;
    }

    /* RESPONSIVE IMPROVEMENTS FOR TOUCH INTERFACES */
    @media (max-width: 1024px) {
      .clickable-sub-image {
        /* Increase touch target size on tablets/mobile */
        min-width: 44px !important;
        min-height: 44px !important;
      }
      
      .clickable-sub-image:hover {
        /* Enhanced glow for touch devices */
        filter: brightness(1.1) saturate(1.08) drop-shadow(0 0 15px rgba(255, 255, 255, 0.7)) drop-shadow(0 0 30px rgba(255, 255, 255, 0.3)) drop-shadow(0 0 45px rgba(102, 126, 234, 0.2));
        transform: scale(1.02); /* Slightly reduced scale on smaller devices */
        animation: none; /* Pause the subtle glow animation on hover */
      }
      
      /* Disable hover effects completely on pure touch devices but keep base glow */
      @media (hover: none) {
        .clickable-sub-image {
          /* Enhanced base glow for touch devices */
          filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3)) drop-shadow(0 0 20px rgba(255, 255, 255, 0.15));
        }
        
        .clickable-sub-image:hover {
          filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3)) drop-shadow(0 0 20px rgba(255, 255, 255, 0.15));
          transform: none;
          animation: subtleGlow 3s ease-in-out infinite;
        }
        
        .menu-item-modern:hover {
          box-shadow: 0 6px 24px rgba(0,0,0,0.15) !important;
          background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85)) !important;
        }
      }
    }
  `;

      interface AnimationOption {
  value: string;
  label: string;
}

interface SpeedOption {
  value: string;
  label: string;
  duration: number;
}

interface TriggerOption {
  value: string;
  label: string;
  description: string;
}

  export   const animationOptions: AnimationOption[] = [
      { value: 'none', label: '🚫 No Animation' },
      
      // === FADE ANIMATIONS ===
      { value: 'fadeIn', label: '✨ Fade In' },
      { value: 'fadeInUp', label: '⬆️ Fade In Up' },
      { value: 'fadeInDown', label: '⬇️ Fade In Down' },
      { value: 'fadeInLeft', label: '⬅️ Fade In Left' },
      { value: 'fadeInRight', label: '➡️ Fade In Right' },
      { value: 'fadeInUpBig', label: '⬆️ Fade In Up Big' },
      { value: 'fadeInDownBig', label: '⬇️ Fade In Down Big' },
      { value: 'fadeInLeftBig', label: '⬅️ Fade In Left Big' },
      { value: 'fadeInRightBig', label: '➡️ Fade In Right Big' },
      
      // === SLIDE ANIMATIONS ===
      { value: 'slideInLeft', label: '⬅️ Slide In Left' },
      { value: 'slideInRight', label: '➡️ Slide In Right' },
      { value: 'slideInUp', label: '⬆️ Slide In Up' },
      { value: 'slideInDown', label: '⬇️ Slide In Down' },
      
      // === ZOOM ANIMATIONS ===
      { value: 'zoomIn', label: '🔍 Zoom In' },
      { value: 'zoomInUp', label: '🔍⬆️ Zoom In Up' },
      { value: 'zoomInDown', label: '🔍⬇️ Zoom In Down' },
      { value: 'zoomInLeft', label: '🔍⬅️ Zoom In Left' },
      { value: 'zoomInRight', label: '🔍➡️ Zoom In Right' },
      { value: 'zoomOut', label: '🔍 Zoom Out' },
      
      // === BOUNCE ANIMATIONS ===
      { value: 'bounce', label: '⚽ Bounce' },
      { value: 'bounceIn', label: '⚽ Bounce In' },
      { value: 'bounceInUp', label: '⚽⬆️ Bounce In Up' },
      { value: 'bounceInDown', label: '⚽⬇️ Bounce In Down' },
      { value: 'bounceInLeft', label: '⚽⬅️ Bounce In Left' },
      { value: 'bounceInRight', label: '⚽➡️ Bounce In Right' },
      
      // === ATTENTION SEEKERS ===
      { value: 'shake', label: '🫨 Shake X' },
      { value: 'shakeY', label: '🫨 Shake Y' },
      { value: 'pulse', label: '💓 Pulse' },
      { value: 'heartbeat', label: '💗 Heartbeat' },
      { value: 'flash', label: '⚡ Flash' },
      { value: 'headShake', label: '🙄 Head Shake' },
      
      // === ELASTIC ANIMATIONS ===
      { value: 'elasticIn', label: '🪃 Elastic In' },
      { value: 'elasticInUp', label: '🪃⬆️ Elastic In Up' },
      { value: 'elasticInDown', label: '🪃⬇️ Elastic In Down' },
      { value: 'elasticInLeft', label: '🪃⬅️ Elastic In Left' },
      { value: 'elasticInRight', label: '🪃➡️ Elastic In Right' },
      
      // === ROTATION & SWING ===
      { value: 'swing', label: '🎭 Swing' },
      { value: 'rotate', label: '🌀 Rotate' },
      { value: 'rotateIn', label: '🌀 Rotate In' },
      { value: 'rotateInUpLeft', label: '🌀↖️ Rotate In Up Left' },
      { value: 'rotateInUpRight', label: '🌀↗️ Rotate In Up Right' },
      { value: 'rotateInDownLeft', label: '🌀↙️ Rotate In Down Left' },
      { value: 'rotateInDownRight', label: '🌀↘️ Rotate In Down Right' },
      
      // === FLIP ANIMATIONS ===
      { value: 'flip', label: '🔄 Flip Y' },
      { value: 'flipX', label: '🔃 Flip X' },
      { value: 'flipY', label: '🔄 Flip Y Continuous' },
      { value: 'flipInX', label: '🔃 Flip In X' },
      { value: 'flipInY', label: '🔄 Flip In Y' },
      
      // === SPECIAL EFFECTS ===
      { value: 'rubberBand', label: '🪀 Rubber Band' },
      { value: 'wobble', label: '🌊 Wobble' },
      { value: 'jello', label: '🍮 Jello' },
      { value: 'tada', label: '🎉 Tada' },
      
      // === LIGHTSPEED ===
      { value: 'lightSpeedInRight', label: '⚡➡️ Light Speed In Right' },
      { value: 'lightSpeedInLeft', label: '⚡⬅️ Light Speed In Left' },
      
      // === ROLL ANIMATIONS ===
      { value: 'rollIn', label: '🎳 Roll In' },
      { value: 'rollOut', label: '🎳 Roll Out' },
      
      // === SPECIAL GEOMETRIC ===
      { value: 'jackInTheBox', label: '📦 Jack In The Box' },
      { value: 'hinge', label: '🚪 Hinge' },
      
      // === BACK ANIMATIONS ===
      { value: 'backInUp', label: '↩️⬆️ Back In Up' },
      { value: 'backInDown', label: '↩️⬇️ Back In Down' },
      { value: 'backInLeft', label: '↩️⬅️ Back In Left' },
      { value: 'backInRight', label: '↩️➡️ Back In Right' }
    ];
  
   export const triggerOptions: TriggerOption[] = [
      { value: 'continuous', label: 'Continuous', description: 'Animation plays all the time' },
      { value: 'hover', label: 'On Hover', description: 'Animation plays when mouse hovers' },
      { value: 'once', label: 'Play Once', description: 'Animation plays once on load' }
    ];
  
 export   const speedOptions: SpeedOption[] = [
      { value: 'very-slow', label: 'Very Slow', duration: 4 },
      { value: 'slow', label: 'Slow', duration: 2.5 },
      { value: 'normal', label: 'Normal', duration: 1.5 },
      { value: 'fast', label: 'Fast', duration: 0.8 },
      { value: 'very-fast', label: 'Very Fast', duration: 0.4 }
    ];


  export const stylesProjectDetails: { [key: string]: React.CSSProperties } = {
    container: {
      fontFamily: 'Arial, sans-serif',
      display: 'flex',
      height: '100vh',
      backgroundColor: '#f5f5f5'
    },
    leftPanel: {
      width: '380px',
      backgroundColor: 'white',
      padding: '20px 20px 150px 20px',
      borderRight: '1px solid #ddd',
      overflowY: 'auto',
      maxHeight: '100vh',
      position: 'relative',
      boxSizing: 'border-box'
    },
    rightPanel: {
      flex: 1,
      padding: '20px',
      backgroundColor: 'white',
      margin: '20px',
      overflowY: 'auto',
      maxHeight: 'calc(100vh - 40px)'
    },
    formGroup: {
      marginBottom: '15px'
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontWeight: 'bold',
      fontSize: '14px'
    },
    input: {
      width: '100%',
      padding: '8px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px'
    },
    button: {
      backgroundColor: '#1976d2',
      color: 'white',
      border: 'none',
      padding: '10px 15px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      width: '100%',
      marginBottom: '10px'
    },
    buttonSecondary: {
      backgroundColor: '#666',
      color: 'white',
      border: 'none',
      padding: '8px 12px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '12px'
    },
    buttonDanger: {
      backgroundColor: '#f44336',
      color: 'white',
      border: 'none',
      padding: '5px 8px',
      borderRadius: '3px',
      cursor: 'pointer',
      fontSize: '12px'
    },
    // previewArea: {
    //   width: '100%',
    //   height: `${Math.min(backgroundDimensions.height, 600)}px`,
    //   minHeight: '300px',
    //   maxHeight: '600px',
    //   border: '2px solid #ddd',
    //   position: 'relative',
    //   overflow: 'auto',
    //   backgroundColor: '#f9f9f9'
    // },
    subImageItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px',
      border: '1px solid #eee',
      borderRadius: '4px',
      marginBottom: '5px',
      cursor: 'pointer'
    },
    selectedItem: {
      backgroundColor: '#e3f2fd',
      borderColor: '#1976d2'
    },
    slider: {
      width: '100%',
      marginBottom: '10px'
    },
    select: {
      width: '100%',
      padding: '8px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px',
      marginBottom: '10px'
    },
    draggableImage: {
      position: 'absolute',
      cursor: 'grab',
      border: '2px solid transparent',
      borderRadius: '4px',
      transition: 'border-color 0.2s'
    },
    selectedImage: {
      borderColor: '#1976d2'
    },
    tag: {
      position: 'absolute',
      top: '-20px',
      left: '0',
      backgroundColor: 'rgba(25, 118, 210, 0.8)',
      color: 'white',
      padding: '2px 6px',
      borderRadius: '3px',
      fontSize: '10px'
    },
    emptyState: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      textAlign: 'center',
      color: '#666'
    },
    speedIndicator: {
      fontSize: '11px',
      color: '#4caf50',
      fontWeight: 'bold',
      marginTop: '2px'
    },
    loadingBadge: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      backgroundColor: '#4caf50',
      color: 'white',
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '10px',
      fontWeight: 'bold'
    }
  };


  export const stylesSubproject: { [key: string]: React.CSSProperties } = {
      container: {
        fontFamily: 'Arial, sans-serif',
        display: 'flex',
        height: '100vh',
        backgroundColor: '#f5f5f5'
      },
      leftPanel: {
        width: '380px',
        backgroundColor: 'white',
        padding: '20px',
        borderRight: '1px solid #ddd',
        overflowY: 'auto',
        position: 'relative'
      },
      rightPanel: {
        flex: 1,
        padding: '20px',
        backgroundColor: 'white',
        margin: '20px'
      },
      formGroup: {
        marginBottom: '15px'
      },
      label: {
        display: 'block',
        marginBottom: '5px',
        fontWeight: 'bold',
        fontSize: '14px'
      },
      input: {
        width: '100%',
        padding: '8px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '14px'
      },
      button: {
        backgroundColor: '#1976d2',
        color: 'white',
        border: 'none',
        padding: '10px 15px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        width: '100%',
        marginBottom: '10px'
      },
      buttonSecondary: {
        backgroundColor: '#666',
        color: 'white',
        border: 'none',
        padding: '8px 12px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px'
      },
      buttonDanger: {
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        padding: '5px 8px',
        borderRadius: '3px',
        cursor: 'pointer',
        fontSize: '12px'
      },
    //   previewArea: {
    //     width: '100%',
    //     height: `${backgroundDimensions.height}px`,
    //     minHeight: '300px',
    //     border: '2px solid #ddd',
    //     position: 'relative',
    //     overflow: 'hidden',
    //     backgroundSize: '100% auto', // FIXED: Full width like Homepage
    //     backgroundPosition: 'center top',
    //     backgroundColor: '#f9f9f9'
    //   },
      subImageItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px',
        border: '1px solid #eee',
        borderRadius: '4px',
        marginBottom: '5px',
        cursor: 'pointer'
      },
      selectedItem: {
        backgroundColor: '#e3f2fd',
        borderColor: '#1976d2'
      },
      slider: {
        width: '100%',
        marginBottom: '10px'
      },
      select: {
        width: '100%',
        padding: '8px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '14px',
        marginBottom: '10px'
      },
      draggableImage: {
        position: 'absolute',
        cursor: 'grab',
        border: '2px solid transparent',
        borderRadius: '4px',
        transition: 'border-color 0.2s'
      },
      selectedImage: {
        borderColor: '#1976d2'
      },
      tag: {
        position: 'absolute',
        top: '-20px',
        left: '0',
        backgroundColor: 'rgba(25, 118, 210, 0.8)',
        color: 'white',
        padding: '2px 6px',
        borderRadius: '3px',
        fontSize: '10px'
      },
      emptyState: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        color: '#666'
      },
      speedIndicator: {
        fontSize: '11px',
        color: '#4caf50',
        fontWeight: 'bold',
        marginTop: '2px'
      },
      loadingBadge: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        backgroundColor: '#4caf50',
        color: 'white',
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '10px',
        fontWeight: 'bold'
      },
      labelRequired: {
        display: 'block',
        marginBottom: '5px',
        fontWeight: 'bold',
        fontSize: '14px'
      },
      inputError: {
        width: '100%',
        padding: '8px',
        border: '2px solid #f44336',
        borderRadius: '4px',
        fontSize: '14px',
        backgroundColor: '#fff5f5'
      },
      errorMessage: {
        color: '#f44336',
        fontSize: '12px',
        marginTop: '4px',
        fontWeight: '500'
      },
      checkboxContainer: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '15px',
        gap: '8px'
      },
      exteriorBadge: {
        background: '#4caf50',
        color: 'white',
        fontSize: '9px',
        padding: '1px 4px',
        borderRadius: '3px',
        marginLeft: '6px'
      },
      interiorBadge: {
        background: '#ff9800',
        color: 'white',
        fontSize: '9px',
        padding: '1px 4px',
        borderRadius: '3px',
        marginLeft: '6px'
      }
    };