/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSaveContainer } from '../../../api/useSaveContainer';
import { useNavigate, useParams } from 'react-router-dom';
import { useContainerDetails } from '../../../api/useContainerDetails';
import { useDeleteProject } from '../../../api/useDeleteProject';
import DeleteConfirmDialog from '../../../components/DeleteConfirmDialog';
import { useNotification } from '../../../components/Tostr';

interface SubImage {
  id: number;
  file: File;
  url: string;
  name: string;
  // FIXED: Always store as percentages internally for true responsiveness
  xPercent: number;
  yPercent: number;
  heightPercent: number;
  animation: string;
  animationSpeed: string;
  animationTrigger: string;
  isExterior: boolean;
}

interface BackgroundImage {
  file: File|null;
  url: string;
  name: string;
  aspectRatio?: number;
  backgroundImageUrl?: string;
}

interface DragState {
  isDragging: boolean;
  dragIndex: number;
}

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

// Framer Motion animation variants
const getAnimationVariants = (animationType: string, trigger: string) => {
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
        ? { opacity: [1, 0.3, 1], transition: { repeat: Infinity, duration: 2 } }
        : { opacity: 1 },
      exit: { opacity: 0 }
    },
    fadeInUp: {
      initial: trigger === 'continuous' ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 },
      animate: trigger === 'continuous' 
        ? { opacity: [1, 0.3, 1], y: [0, 15, 0], transition: { repeat: Infinity, duration: 2 } }
        : { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 30 }
    },
    fadeInDown: {
      initial: trigger === 'continuous' ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 },
      animate: trigger === 'continuous' 
        ? { opacity: [1, 0.3, 1], y: [0, -15, 0], transition: { repeat: Infinity, duration: 2 } }
        : { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -30 }
    },
    fadeInLeft: {
      initial: trigger === 'continuous' ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 },
      animate: trigger === 'continuous' 
        ? { opacity: [1, 0.3, 1], x: [0, -15, 0], transition: { repeat: Infinity, duration: 2 } }
        : { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -30 }
    },
    fadeInRight: {
      initial: trigger === 'continuous' ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 },
      animate: trigger === 'continuous' 
        ? { opacity: [1, 0.3, 1], x: [0, 15, 0], transition: { repeat: Infinity, duration: 2 } }
        : { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 30 }
    },
    fadeInUpBig: {
      initial: trigger === 'continuous' ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 },
      animate: trigger === 'continuous' 
        ? { opacity: [1, 0.2, 1], y: [0, 30, 0], transition: { repeat: Infinity, duration: 2.5 } }
        : { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 100 }
    },
    fadeInDownBig: {
      initial: trigger === 'continuous' ? { opacity: 1, y: 0 } : { opacity: 0, y: -100 },
      animate: trigger === 'continuous' 
        ? { opacity: [1, 0.2, 1], y: [0, -30, 0], transition: { repeat: Infinity, duration: 2.5 } }
        : { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -100 }
    },
    fadeInLeftBig: {
      initial: trigger === 'continuous' ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 },
      animate: trigger === 'continuous' 
        ? { opacity: [1, 0.2, 1], x: [0, -30, 0], transition: { repeat: Infinity, duration: 2.5 } }
        : { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -100 }
    },
    fadeInRightBig: {
      initial: trigger === 'continuous' ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 },
      animate: trigger === 'continuous' 
        ? { opacity: [1, 0.2, 1], x: [0, 30, 0], transition: { repeat: Infinity, duration: 2.5 } }
        : { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 100 }
    },
    
    // === SLIDE ANIMATIONS ===
    slideInLeft: {
      initial: trigger === 'continuous' ? { x: 0 } : { x: '-100%' },
      animate: trigger === 'continuous' 
        ? { x: [0, -20, 0], transition: { repeat: Infinity, duration: 2 } }
        : { x: 0 },
      exit: { x: '-100%' }
    },
    slideInRight: {
      initial: trigger === 'continuous' ? { x: 0 } : { x: '100%' },
      animate: trigger === 'continuous' 
        ? { x: [0, 20, 0], transition: { repeat: Infinity, duration: 2 } }
        : { x: 0 },
      exit: { x: '100%' }
    },
    slideInUp: {
      initial: trigger === 'continuous' ? { y: 0 } : { y: '100%' },
      animate: trigger === 'continuous' 
        ? { y: [0, 20, 0], transition: { repeat: Infinity, duration: 2 } }
        : { y: 0 },
      exit: { y: '100%' }
    },
    slideInDown: {
      initial: trigger === 'continuous' ? { y: 0 } : { y: '-100%' },
      animate: trigger === 'continuous' 
        ? { y: [0, -20, 0], transition: { repeat: Infinity, duration: 2 } }
        : { y: 0 },
      exit: { y: '-100%' }
    },
    
    // === ZOOM ANIMATIONS ===
    zoomIn: {
      initial: trigger === 'continuous' ? { scale: 1 } : { opacity: 0, scale: 0.3 },
      animate: trigger === 'continuous' 
        ? { scale: [1, 1.1, 1], transition: { repeat: Infinity, duration: 2 } }
        : { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.3 }
    },
    zoomInUp: {
      initial: trigger === 'continuous' ? { scale: 1, y: 0 } : { opacity: 0, scale: 0.1, y: 100 },
      animate: trigger === 'continuous' 
        ? { scale: [1, 1.1, 1], y: [0, -10, 0], transition: { repeat: Infinity, duration: 2 } }
        : { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.1, y: 100 }
    },
    zoomInDown: {
      initial: trigger === 'continuous' ? { scale: 1, y: 0 } : { opacity: 0, scale: 0.1, y: -100 },
      animate: trigger === 'continuous' 
        ? { scale: [1, 1.1, 1], y: [0, 10, 0], transition: { repeat: Infinity, duration: 2 } }
        : { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.1, y: -100 }
    },
    zoomInLeft: {
      initial: trigger === 'continuous' ? { scale: 1, x: 0 } : { opacity: 0, scale: 0.1, x: -100 },
      animate: trigger === 'continuous' 
        ? { scale: [1, 1.1, 1], x: [0, 10, 0], transition: { repeat: Infinity, duration: 2 } }
        : { opacity: 1, scale: 1, x: 0 },
      exit: { opacity: 0, scale: 0.1, x: -100 }
    },
    zoomInRight: {
      initial: trigger === 'continuous' ? { scale: 1, x: 0 } : { opacity: 0, scale: 0.1, x: 100 },
      animate: trigger === 'continuous' 
        ? { scale: [1, 1.1, 1], x: [0, -10, 0], transition: { repeat: Infinity, duration: 2 } }
        : { opacity: 1, scale: 1, x: 0 },
      exit: { opacity: 0, scale: 0.1, x: 100 }
    },
    zoomOut: {
      initial: { scale: 1 },
      animate: { 
        scale: [1, 1.3, 1],
        transition: { repeat: trigger === 'continuous' ? Infinity : 0, duration: 2 }
      },
      exit: { scale: 1 }
    },
    
    // === BOUNCE ANIMATIONS ===
    bounce: {
      initial: { y: 0 },
      animate: { 
        y: [0, -30, 0, -15, 0, -4, 0],
        transition: { repeat: trigger === 'continuous' ? Infinity : (trigger === 'once' ? 2 : 0), duration: 2 }
      },
      exit: { y: 0 }
    },
    bounceIn: {
      initial: trigger === 'continuous' ? { scale: 1 } : { opacity: 0, scale: 0.3 },
      animate: trigger === 'continuous' 
        ? { 
            scale: [1, 0.8, 1.1, 0.95, 1.05, 1],
            transition: { repeat: Infinity, duration: 2 }
          }
        : { 
            opacity: [0, 1, 1, 1],
            scale: [0.3, 1.05, 0.9, 1],
            transition: { duration: 1 }
          },
      exit: { opacity: 0, scale: 0.3 }
    },
    bounceInUp: {
      initial: trigger === 'continuous' ? { y: 0 } : { opacity: 0, y: 100 },
      animate: trigger === 'continuous' 
        ? { 
            y: [0, 20, -10, 5, 0],
            transition: { repeat: Infinity, duration: 2 }
          }
        : { 
            opacity: [0, 1, 1, 1],
            y: [100, -30, 10, 0],
            transition: { duration: 1 }
          },
      exit: { opacity: 0, y: 100 }
    },
    bounceInDown: {
      initial: trigger === 'continuous' ? { y: 0 } : { opacity: 0, y: -100 },
      animate: trigger === 'continuous' 
        ? { 
            y: [0, -20, 10, -5, 0],
            transition: { repeat: Infinity, duration: 2 }
          }
        : { 
            opacity: [0, 1, 1, 1],
            y: [-100, 30, -10, 0],
            transition: { duration: 1 }
          },
      exit: { opacity: 0, y: -100 }
    },
    bounceInLeft: {
      initial: trigger === 'continuous' ? { x: 0 } : { opacity: 0, x: -100 },
      animate: trigger === 'continuous' 
        ? { 
            x: [0, -20, 10, -5, 0],
            transition: { repeat: Infinity, duration: 2 }
          }
        : { 
            opacity: [0, 1, 1, 1],
            x: [-100, 30, -10, 0],
            transition: { duration: 1 }
          },
      exit: { opacity: 0, x: -100 }
    },
    bounceInRight: {
      initial: trigger === 'continuous' ? { x: 0 } : { opacity: 0, x: 100 },
      animate: trigger === 'continuous' 
        ? { 
            x: [0, 20, -10, 5, 0],
            transition: { repeat: Infinity, duration: 2 }
          }
        : { 
            opacity: [0, 1, 1, 1],
            x: [100, -30, 10, 0],
            transition: { duration: 1 }
          },
      exit: { opacity: 0, x: 100 }
    },
    
    // === ATTENTION SEEKERS ===
    shake: {
      initial: { x: 0 },
      animate: { 
        x: [0, -10, 10, -10, 10, 0],
        transition: { repeat: trigger === 'continuous' ? Infinity : (trigger === 'once' ? 3 : 0), duration: 1 }
      },
      exit: { x: 0 }
    },
    shakeY: {
      initial: { y: 0 },
      animate: { 
        y: [0, -10, 10, -10, 10, 0],
        transition: { repeat: trigger === 'continuous' ? Infinity : (trigger === 'once' ? 3 : 0), duration: 1 }
      },
      exit: { y: 0 }
    },
    pulse: {
      initial: { scale: 1 },
      animate: { 
        scale: [1, 1.1, 1],
        transition: { repeat: trigger === 'continuous' ? Infinity : (trigger === 'once' ? 2 : 0), duration: 2 }
      },
      exit: { scale: 1 }
    },
    heartbeat: {
      initial: { scale: 1 },
      animate: { 
        scale: [1, 1.3, 1, 1.3, 1],
        transition: { repeat: trigger === 'continuous' ? Infinity : (trigger === 'once' ? 2 : 0), duration: 1.3 }
      },
      exit: { scale: 1 }
    },
    flash: {
      initial: { opacity: 1 },
      animate: { 
        opacity: [1, 0, 1, 0, 1],
        transition: { repeat: trigger === 'continuous' ? Infinity : (trigger === 'once' ? 3 : 0), duration: 2 }
      },
      exit: { opacity: 1 }
    },
    headShake: {
      initial: { x: 0, rotate: 0 },
      animate: { 
        x: [0, -6, 6, -3, 3, 0],
        rotate: [0, -9, 7, -5, 3, 0],
        transition: { repeat: trigger === 'continuous' ? Infinity : (trigger === 'once' ? 2 : 0), duration: 1 }
      },
      exit: { x: 0, rotate: 0 }
    },
    
    // === ELASTIC ANIMATIONS ===
    elasticIn: {
      initial: trigger === 'continuous' ? { scale: 1 } : { opacity: 0, scale: 0 },
      animate: trigger === 'continuous' 
        ? { 
            scale: [1, 1.2, 0.8, 1.1, 0.95, 1.03, 1],
            transition: { repeat: Infinity, duration: 2.5 }
          }
        : { 
            opacity: 1,
            scale: [0, 1.25, 0.75, 1.15, 0.95, 1.05, 1],
            transition: { duration: 1.2 }
          },
      exit: { opacity: 0, scale: 0 }
    },
    elasticInUp: {
      initial: trigger === 'continuous' ? { y: 0 } : { opacity: 0, y: 100 },
      animate: trigger === 'continuous' 
        ? { 
            y: [0, -20, 8, -4, 2, 0],
            transition: { repeat: Infinity, duration: 2.5 }
          }
        : { 
            opacity: 1,
            y: [100, -25, 10, -5, 2, 0],
            transition: { duration: 1.2 }
          },
      exit: { opacity: 0, y: 100 }
    },
    elasticInDown: {
      initial: trigger === 'continuous' ? { y: 0 } : { opacity: 0, y: -100 },
      animate: trigger === 'continuous' 
        ? { 
            y: [0, 20, -8, 4, -2, 0],
            transition: { repeat: Infinity, duration: 2.5 }
          }
        : { 
            opacity: 1,
            y: [-100, 25, -10, 5, -2, 0],
            transition: { duration: 1.2 }
          },
      exit: { opacity: 0, y: -100 }
    },
    elasticInLeft: {
      initial: trigger === 'continuous' ? { x: 0 } : { opacity: 0, x: -100 },
      animate: trigger === 'continuous' 
        ? { 
            x: [0, 20, -8, 4, -2, 0],
            transition: { repeat: Infinity, duration: 2.5 }
          }
        : { 
            opacity: 1,
            x: [-100, 25, -10, 5, -2, 0],
            transition: { duration: 1.2 }
          },
      exit: { opacity: 0, x: -100 }
    },
    elasticInRight: {
      initial: trigger === 'continuous' ? { x: 0 } : { opacity: 0, x: 100 },
      animate: trigger === 'continuous' 
        ? { 
            x: [0, -20, 8, -4, 2, 0],
            transition: { repeat: Infinity, duration: 2.5 }
          }
        : { 
            opacity: 1,
            x: [100, -25, 10, -5, 2, 0],
            transition: { duration: 1.2 }
          },
      exit: { opacity: 0, x: 100 }
    },
    
    // === SWING & ROTATION ===
    swing: {
      initial: { rotate: 0 },
      animate: { 
        rotate: [0, 15, -10, 5, -5, 0],
        transition: { repeat: trigger === 'continuous' ? Infinity : (trigger === 'once' ? 1 : 0), duration: 1 }
      },
      exit: { rotate: 0 }
    },
    rotate: {
      initial: { rotate: 0 },
      animate: { 
        rotate: 360,
        transition: { repeat: trigger === 'continuous' ? Infinity : (trigger === 'once' ? 1 : 0), duration: 2, ease: 'linear' }
      },
      exit: { rotate: 0 }
    },
    rotateIn: {
      initial: trigger === 'continuous' ? { rotate: 0 } : { rotate: -200, opacity: 0 },
      animate: trigger === 'continuous' 
        ? { 
            rotate: [0, -30, 30, -15, 15, 0],
            transition: { repeat: Infinity, duration: 2 }
          }
        : { rotate: 0, opacity: 1 },
      exit: { rotate: -200, opacity: 0 }
    },
    rotateInUpLeft: {
      initial: trigger === 'continuous' ? { rotate: 0 } : { rotate: -45, opacity: 0 },
      animate: trigger === 'continuous' 
        ? { 
            rotate: [0, -20, 20, -10, 10, 0],
            transition: { repeat: Infinity, duration: 2 }
          }
        : { rotate: 0, opacity: 1 },
      exit: { rotate: -45, opacity: 0 }
    },
    rotateInUpRight: {
      initial: trigger === 'continuous' ? { rotate: 0 } : { rotate: 45, opacity: 0 },
      animate: trigger === 'continuous' 
        ? { 
            rotate: [0, 20, -20, 10, -10, 0],
            transition: { repeat: Infinity, duration: 2 }
          }
        : { rotate: 0, opacity: 1 },
      exit: { rotate: 45, opacity: 0 }
    },
    rotateInDownLeft: {
      initial: trigger === 'continuous' ? { rotate: 0 } : { rotate: 45, opacity: 0 },
      animate: trigger === 'continuous' 
        ? { 
            rotate: [0, 20, -20, 10, -10, 0],
            transition: { repeat: Infinity, duration: 2 }
          }
        : { rotate: 0, opacity: 1 },
      exit: { rotate: 45, opacity: 0 }
    },
    rotateInDownRight: {
      initial: trigger === 'continuous' ? { rotate: 0 } : { rotate: -45, opacity: 0 },
      animate: trigger === 'continuous' 
        ? { 
            rotate: [0, -20, 20, -10, 10, 0],
            transition: { repeat: Infinity, duration: 2 }
          }
        : { rotate: 0, opacity: 1 },
      exit: { rotate: -45, opacity: 0 }
    },
    
    // === FLIP ANIMATIONS ===
    flip: {
      initial: { rotateY: 0 },
      animate: { 
        rotateY: 360,
        transition: { repeat: trigger === 'continuous' ? Infinity : (trigger === 'once' ? 1 : 0), duration: 1, ease: 'linear' }
      },
      exit: { rotateY: 0 }
    },
    flipInX: {
      initial: trigger === 'continuous' ? { rotateX: 0 } : { rotateX: 90, opacity: 0 },
      animate: trigger === 'continuous' 
        ? { 
            rotateX: [0, 45, -15, 5, 0],
            transition: { repeat: Infinity, duration: 2 }
          }
        : { 
            rotateX: [90, -10, 10, 0],
            opacity: [0, 1, 1, 1],
            transition: { duration: 1 }
          },
      exit: { rotateX: 90, opacity: 0 }
    },
    flipInY: {
      initial: trigger === 'continuous' ? { rotateY: 0 } : { rotateY: 90, opacity: 0 },
      animate: trigger === 'continuous' 
        ? { 
            rotateY: [0, 45, -15, 5, 0],
            transition: { repeat: Infinity, duration: 2 }
          }
        : { 
            rotateY: [90, -10, 10, 0],
            opacity: [0, 1, 1, 1],
            transition: { duration: 1 }
          },
      exit: { rotateY: 90, opacity: 0 }
    },
    flipX: {
      initial: { rotateX: 0 },
      animate: { 
        rotateX: 360,
        transition: { repeat: trigger === 'continuous' ? Infinity : (trigger === 'once' ? 1 : 0), duration: 1, ease: 'linear' }
      },
      exit: { rotateX: 0 }
    },
    flipY: {
      initial: { rotateY: 0 },
      animate: { 
        rotateY: 360,
        transition: { repeat: trigger === 'continuous' ? Infinity : (trigger === 'once' ? 1 : 0), duration: 1, ease: 'linear' }
      },
      exit: { rotateY: 0 }
    },
    
    // === SPECIAL EFFECTS ===
    rubberBand: {
      initial: { scale: 1 },
      animate: { 
        scale: [1, 1.25, 0.75, 1.15, 1],
        scaleX: [1, 0.75, 1.25, 0.85, 1],
        transition: { repeat: trigger === 'continuous' ? Infinity : (trigger === 'once' ? 1 : 0), duration: 1 }
      },
      exit: { scale: 1 }
    },
    wobble: {
      initial: { x: 0, rotate: 0 },
      animate: { 
        x: [0, -25, 20, -15, 10, -5, 0],
        rotate: [0, -5, 3, -3, 2, -1, 0],
        transition: { repeat: trigger === 'continuous' ? Infinity : (trigger === 'once' ? 1 : 0), duration: 1 }
      },
      exit: { x: 0, rotate: 0 }
    },
    jello: {
      initial: { skewX: 0, skewY: 0 },
      animate: { 
        skewX: [0, -12.5, 6.25, -3.125, 1.5625, -0.78125, 0.390625, -0.1953125, 0],
        skewY: [0, -12.5, 6.25, -3.125, 1.5625, -0.78125, 0.390625, -0.1953125, 0],
        transition: { repeat: trigger === 'continuous' ? Infinity : (trigger === 'once' ? 1 : 0), duration: 1 }
      },
      exit: { skewX: 0, skewY: 0 }
    },
    tada: {
      initial: { scale: 1, rotate: 0 },
      animate: { 
        scale: [1, 0.9, 1.1, 1.1, 1.1, 1.1, 1.1, 1],
        rotate: [0, -3, 3, -3, 3, -3, 3, 0],
        transition: { repeat: trigger === 'continuous' ? Infinity : (trigger === 'once' ? 1 : 0), duration: 1 }
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
            transition: { repeat: Infinity, duration: 2 }
          }
        : { 
            x: [100, -20, 0],
            skewX: [-30, 20, -5, 0],
            opacity: [0, 1, 1, 1],
            transition: { duration: 1 }
          },
      exit: { x: '100%', skewX: -30, opacity: 0 }
    },
    lightSpeedInLeft: {
      initial: trigger === 'continuous' ? { x: 0, skewX: 0 } : { x: '-100%', skewX: 30, opacity: 0 },
      animate: trigger === 'continuous' 
        ? { 
            x: [0, -50, 10, 0],
            skewX: [0, 15, -10, 0],
            transition: { repeat: Infinity, duration: 2 }
          }
        : { 
            x: [-100, 20, 0],
            skewX: [30, -20, 5, 0],
            opacity: [0, 1, 1, 1],
            transition: { duration: 1 }
          },
      exit: { x: '-100%', skewX: 30, opacity: 0 }
    },
    
    // === ROLL ANIMATIONS ===
    rollIn: {
      initial: trigger === 'continuous' ? { x: 0, rotate: 0 } : { x: '-100%', rotate: -120, opacity: 0 },
      animate: trigger === 'continuous' 
        ? { 
            x: [0, -30, 30, 0],
            rotate: [0, -30, 30, 0],
            transition: { repeat: Infinity, duration: 2 }
          }
        : { x: 0, rotate: 0, opacity: 1 },
      exit: { x: '-100%', rotate: -120, opacity: 0 }
    },
    rollOut: {
      initial: { x: 0, rotate: 0, opacity: 1 },
      animate: { 
        x: trigger === 'continuous' ? [0, 50, 0] : ['0%', '100%'],
        rotate: trigger === 'continuous' ? [0, 60, 0] : [0, 120],
        opacity: trigger === 'continuous' ? [1, 0.5, 1] : [1, 0],
        transition: { repeat: trigger === 'continuous' ? Infinity : (trigger === 'once' ? 1 : 0), duration: 1 }
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
            transition: { repeat: Infinity, duration: 2 }
          }
        : { 
            opacity: 1,
            scale: [0.1, 0.5, 0.8, 1],
            rotate: [30, -10, 3, 0],
            transition: { duration: 1 }
          },
      exit: { opacity: 0, scale: 0.1, rotate: 30 }
    },
    hinge: {
      initial: { rotate: 0, transformOrigin: "top left" },
      animate: trigger === 'continuous' 
        ? { 
            rotate: [0, 40, 20, 40, 20, 0],
            transition: { repeat: Infinity, duration: 3 }
          }
        : { 
            rotate: [0, 80, 60, 80, 60, 60],
            opacity: [1, 1, 1, 1, 1, 0],
            y: [0, 0, 0, 0, 0, 200],
            transition: { duration: 2 }
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
            transition: { repeat: Infinity, duration: 2 }
          }
        : { y: 0, scale: 1, opacity: 1 },
      exit: { y: 50, scale: 0.7, opacity: 0 }
    },
    backInDown: {
      initial: trigger === 'continuous' ? { y: 0, scale: 1 } : { y: -50, scale: 0.7, opacity: 0 },
      animate: trigger === 'continuous' 
        ? { 
            y: [0, -20, 0],
            scale: [1, 0.9, 1],
            transition: { repeat: Infinity, duration: 2 }
          }
        : { y: 0, scale: 1, opacity: 1 },
      exit: { y: -50, scale: 0.7, opacity: 0 }
    },
    backInLeft: {
      initial: trigger === 'continuous' ? { x: 0, scale: 1 } : { x: -50, scale: 0.7, opacity: 0 },
      animate: trigger === 'continuous' 
        ? { 
            x: [0, -20, 0],
            scale: [1, 0.9, 1],
            transition: { repeat: Infinity, duration: 2 }
          }
        : { x: 0, scale: 1, opacity: 1 },
      exit: { x: -50, scale: 0.7, opacity: 0 }
    },
    backInRight: {
      initial: trigger === 'continuous' ? { x: 0, scale: 1 } : { x: 50, scale: 0.7, opacity: 0 },
      animate: trigger === 'continuous' 
        ? { 
            x: [0, 20, 0],
            scale: [1, 0.9, 1],
            transition: { repeat: Infinity, duration: 2 }
          }
        : { x: 0, scale: 1, opacity: 1 },
      exit: { x: 50, scale: 0.7, opacity: 0 }
    }
  };

  return baseVariants[animationType] || baseVariants.none;
};

// Get animation duration based on speed
const getAnimationDuration = (speed: string): number => {
  const speedMap: { [key: string]: number } = {
    'very-slow': 4,
    'slow': 2.5,
    'normal': 1.5,
    'fast': 0.8,
    'very-fast': 0.4
  };
  return speedMap[speed] || 1.5;
};

const ImageEditor: React.FC = () => {
  const existingData = {
    title: 'Sample Project',
    sortOrder: 5,
    backgroundImage: null,
    subImages: []
  };

  const [title, setTitle] = useState<string>(existingData.title || '');
  const [sortOrder, setSortOrder] = useState<number>(existingData.sortOrder || 1);
  const [backgroundImage, setBackgroundImage] = useState<BackgroundImage | null>(null);
  const [titleError, setTitleError] = useState<string>('');
  const [subImages, setSubImages] = useState<SubImage[]>([]);
  const [selectedSubImage, setSelectedSubImage] = useState<number | null>(null);
  const [dragState, setDragState] = useState<DragState>({ isDragging: false, dragIndex: -1 });
  const [backgroundDimensions, setBackgroundDimensions] = useState<{ width: number, height: number }>({ width: 0, height: 0 });
  const [isLoadingApiData, setIsLoadingApiData] = useState<boolean>(false);
  
  const backgroundRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const subImageInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  // Confirm dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  // FIXED: Calculate background dimensions using full-width approach like Homepage
  const calculateBackgroundDimensions = useCallback(() => {
    if (backgroundRef.current && backgroundImage?.aspectRatio) {
      const containerWidth = backgroundRef.current.clientWidth;
      // Use same approach as Homepage: full-width, calculated height
      const calculatedHeight = containerWidth / backgroundImage.aspectRatio;
      
      return {
        width: containerWidth,
        height: calculatedHeight
      };
    }
    return { width: 0, height: 0 };
  }, [backgroundImage?.aspectRatio]);

  // Monitor preview area size and update dimensions responsively
  useEffect(() => {
    const updateDimensions = () => {
      const newDimensions = calculateBackgroundDimensions();
      if (newDimensions.width > 0 && newDimensions.height > 0) {
        setBackgroundDimensions(newDimensions);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    // Also listen for container size changes (like sidebar collapse)
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (backgroundRef.current) {
      resizeObserver.observe(backgroundRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateDimensions);
      resizeObserver.disconnect();
    };
  }, [calculateBackgroundDimensions]);

  // FIXED: Convert percentages to pixels for display (helper function)
  const getPixelPosition = (xPercent: number, yPercent: number) => {
    return {
      x: (xPercent / 100) * backgroundDimensions.width,
      y: (yPercent / 100) * backgroundDimensions.height
    };
  };

  // FIXED: Convert pixels to percentages (helper function)
  const getPercentagePosition = (x: number, y: number) => {
    return {
      xPercent: backgroundDimensions.width > 0 ? (x / backgroundDimensions.width) * 100 : 0,
      yPercent: backgroundDimensions.height > 0 ? (y / backgroundDimensions.height) * 100 : 0
    };
  };

  const { mutate: addOrUpdateContainer, isPending: isSaving } = useSaveContainer();
  const { mutate: deleteProject, isPending: isDeleting } = useDeleteProject();

  const animationOptions: AnimationOption[] = [
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

  const triggerOptions: TriggerOption[] = [
    { value: 'continuous', label: 'Continuous', description: 'Animation plays all the time' },
    { value: 'hover', label: 'On Hover', description: 'Animation plays when mouse hovers' },
    { value: 'once', label: 'Play Once', description: 'Animation plays once on load' }
  ];

  const speedOptions: SpeedOption[] = [
    { value: 'very-slow', label: 'Very Slow', duration: 4 },
    { value: 'slow', label: 'Slow', duration: 2.5 },
    { value: 'normal', label: 'Normal', duration: 1.5 },
    { value: 'fast', label: 'Fast', duration: 0.8 },
    { value: 'very-fast', label: 'Very Fast', duration: 0.4 }
  ];

  const validateTitle = (value: string): string => {
    if (!value || value.trim() === '') {
      return 'Title is required';
    }
    if (value.trim().length < 2) {
      return 'Title must be at least 2 characters long';
    }
    if (value.trim().length > 100) {
      return 'Title must be less than 100 characters';
    }
    return '';
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitle(value);
    const error = validateTitle(value);
    setTitleError(error);
  };

  const handleBackgroundUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          const img = new Image();
          img.onload = () => {
            const aspectRatio = img.width / img.height;
            setBackgroundImage({
              file,
              url: !e.target ? "" : e.target.result as string,
              name: file.name,
              aspectRatio
            });
          };
          img.src = e.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubImageUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          const newSubImage: SubImage = {
            id: Date.now(),
            file,
            url: e.target.result as string,
            name: file.name,
            xPercent: 50, // FIXED: Store as percentage from start
            yPercent: 50, // FIXED: Store as percentage from start
            heightPercent: 20,
            animation: 'none',
            animationSpeed: 'normal',
            animationTrigger: 'continuous',
            isExterior: true
          };
          setSubImages([...subImages, newSubImage]);
          setSelectedSubImage(newSubImage.id);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getActualHeight = (heightPercent: number): number => {
    return (heightPercent / 100) * backgroundDimensions.width;
  };

  // FIXED: Handle dragging with percentage-based positioning for true responsiveness
  const handleMouseDown = useCallback((e: React.MouseEvent, index: number): void => {
    e.preventDefault();
    const rect = backgroundRef.current?.getBoundingClientRect();
    if (!rect) return;

    const currentImg = subImages[index];
    const currentPos = getPixelPosition(currentImg.xPercent, currentImg.yPercent);
    
    const startX = e.clientX - rect.left - currentPos.x;
    const startY = e.clientY - rect.top - currentPos.y;

    setDragState({ isDragging: true, dragIndex: index });
    setSelectedSubImage(subImages[index].id);

    const handleMouseMove = (e: MouseEvent): void => {
      const newX = Math.max(0, Math.min(backgroundDimensions.width - 50, e.clientX - rect.left - startX));
      const newY = Math.max(0, Math.min(backgroundDimensions.height - 50, e.clientY - rect.top - startY));
      
      // FIXED: Convert to percentages and store for true responsiveness
      const newPos = getPercentagePosition(newX, newY);
      
      setSubImages(prev => prev.map((img, i) => 
        i === index ? { ...img, xPercent: newPos.xPercent, yPercent: newPos.yPercent } : img
      ));
    };

    const handleMouseUp = (): void => {
      setDragState({ isDragging: false, dragIndex: -1 });
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [subImages, backgroundDimensions, getPixelPosition, getPercentagePosition]);

  const updateSubImageProperty = (id: number, property: keyof SubImage, value: string | number | boolean): void => {
    setSubImages(prev => prev.map(img => 
      img.id === id ? { ...img, [property]: value } : img
    ));
  };

  const deleteSubImage = (imageId: number): void => {
    console.log("Deleting image with ID:", imageId);
    setPendingDeleteId(imageId);
    setConfirmOpen(true);
  };

  function isDateNowId(id: number | null) {
    return typeof id === "number" && id > 1_000_000_000_000; // more than a trillion
  }

  const handleConfirmDelete = (): void => {
    if (!isDateNowId(pendingDeleteId)) {
      deleteProject(
        { 
          containerId: id ? parseInt(id, 10) : 0,
          projectId: typeof pendingDeleteId === 'number' ? pendingDeleteId : 0
        },
        {
          onSuccess: () => {
            setSubImages(prev => prev.filter(img => img.id !== pendingDeleteId));
            if (selectedSubImage === pendingDeleteId) {
              setSelectedSubImage(null);
            }
            setConfirmOpen(false);
            setPendingDeleteId(null);
          }
        }
      );
    } else {
      setSubImages(prev => prev.filter(img => img.id !== pendingDeleteId));
      if (selectedSubImage === pendingDeleteId) {
        setSelectedSubImage(null);
      }
      setConfirmOpen(false);
    }
  };

  function getProjectId(id: number) {
    if (id > 1_000_000_000_000) {
      return "0";
    }
    return id?.toString();
  }

  const { showNotification } = useNotification();  

  // FIXED: Save with percentages (no conversion needed)
  const handleSave = async (): Promise<void> => {
    const error = validateTitle(title);
    if (error) {
      setTitleError(error);
      showNotification('Please fix the validation errors before saving.', 'error', 'Validation Error');
      return;
    }
    try {
      const formData = new FormData();
      
      formData.append('ProjectContainerId', !id ? '0' : id);
      formData.append('Title', title);
      formData.append('SortOrder', sortOrder.toString());
      
      if (backgroundImage?.file) {
        formData.append('ImageFile', backgroundImage.file);
      }
      
      if (backgroundImage?.aspectRatio !== undefined) {
        formData.append('BackgroundImageAspectRatio', backgroundImage.aspectRatio.toString());
      }
      
      if (!backgroundImage?.file && backgroundImage?.backgroundImageUrl) {
        formData.append('BackgroundImageUrl', backgroundImage.backgroundImageUrl);
      }
      
      // FIXED: Save percentages directly (no conversion needed)
      subImages.forEach((img, index) => {
        formData.append(`Projects[${index}][ProjectId]`, getProjectId(img.id));
        const getSafeFileName = (name: string, maxLength = 50) => {
          // Remove extension
          const baseName = name.substring(0, name.lastIndexOf(".")) || name;

          // Limit to maxLength characters
          return baseName.length > maxLength
            ? baseName.substring(0, maxLength)
            : baseName;
        };

        // Usage
        const safeName = getSafeFileName(img.name, 50);
        formData.append(`Projects[${index}][Name]`, safeName);
        
        const xPercent = Math.round(img.xPercent);
        const yPercent = Math.round(img.yPercent);
        
        formData.append(`Projects[${index}][XPosition]`, xPercent.toString());
        formData.append(`Projects[${index}][YPosition]`, yPercent.toString());
        
        formData.append(`Projects[${index}][HeightPercent]`, img.heightPercent.toString());
        formData.append(`Projects[${index}][Animation]`, img.animation);
        formData.append(`Projects[${index}][AnimationSpeed]`, img.animationSpeed);
        formData.append(`Projects[${index}][AnimationTrigger]`, img.animationTrigger);
        formData.append(`Projects[${index}][IsExterior]`, img.isExterior.toString());
        
        if (img.file && img.file.size > 0) {
          formData.append(`Projects[${index}].ImageFile`, img.file);
        } else if (img.url) {
          formData.append(`Projects[${index}][ProjectImageUrl]`, img.url); 
        }
      });
      
      await addOrUpdateContainer(formData, {
        onSuccess: (res: any) => {
          if (res?.isSuccess) {
            showNotification("Container saved successfully!", "success", "Success");
            navigate(`/admin/dashboard`);
          } else {
            showNotification(
              res?.message || "Failed to save container",
              "error",
              "Error"
            );
          }
        },
      });
      
    } catch (error) {
      console.error('Save failed:', error);
      if (error instanceof Error) {
        alert(`Save failed: ${error.message}`);
      } else {
        alert('Save failed: An unknown error occurred.');
      }
    }
  };

  // FIXED: Load data and store as percentages
  const loadSampleProject = (apiData: any = null): void => {
    if (apiData) {
      const loadedTitle = apiData.title || '';
      setTitle(loadedTitle);
      // Validate loaded title
      const error = validateTitle(loadedTitle);
      setTitleError(error);
      setSortOrder(apiData.sortOrder || 1);
      
      if (apiData.backgroundImageUrl) {
        setBackgroundImage({
          file: null,
          url: apiData.backgroundImageUrl,
          name: apiData.backgroundImageFileName || 'Background Image',
          aspectRatio: apiData.backgroundImageAspectRatio || 1,
          backgroundImageUrl: apiData.backgroundImageUrl
        });
      }
      
      if (apiData.projects && Array.isArray(apiData.projects)) {
        console.log('Loading projects:', apiData.projects);
        const loadedSubImages = apiData.projects.map((subImg: any) => ({
          id: subImg.projectId || Date.now() + Math.random(),
          file: new File([], subImg.name || 'image.png'),
          url: subImg.projectImageUrl,
          name: subImg.name || 'Unnamed Image',
          xPercent: subImg.xPosition || 50, // FIXED: Store as percentages
          yPercent: subImg.yPosition || 50, // FIXED: Store as percentages
          heightPercent: subImg.heightPercent || 20,
          animation: subImg.animation || 'none',
          animationSpeed: subImg.animationSpeed || 'normal',
          animationTrigger: subImg.animationTrigger || 'once',
          isExterior: subImg.isExterior !== undefined ? subImg.isExterior : true
        }));
        
        setSubImages(loadedSubImages);
        
        if (loadedSubImages.length > 0) {
          setSelectedSubImage(loadedSubImages[0].id);
        }
      }
    } 
  };

  const { id } = useParams<{ id: string }>(); 
  const { data, isSuccess } = useContainerDetails(id ? parseInt(id, 10) : 0);

  useEffect(() => {
    if (isSuccess && data && data.data) {
      setIsLoadingApiData(true);
      
      const apiData = data.data;
      
      if (apiData) {
        loadSampleProject(apiData);
        setIsLoadingApiData(false);
      }
    }
  }, [isSuccess, data]);

  const selectedImageData = subImages.find(img => img.id === selectedSubImage);

  const styles: { [key: string]: React.CSSProperties } = {
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
    previewArea: {
      width: '100%',
      height: `${backgroundDimensions.height}px`,
      minHeight: '300px',
      border: '2px solid #ddd',
      position: 'relative',
      overflow: 'hidden',
      backgroundSize: '100% auto', // FIXED: Full width like Homepage
      backgroundPosition: 'center top',
      backgroundColor: '#f9f9f9'
    },
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

  return (
    <div style={styles.container}>
      <div style={styles.leftPanel}>
        {isLoadingApiData && (
          <div style={styles.loadingBadge}>
            Loading API Data...
          </div>
        )}
        
        <h2 style={{ marginTop: 0, marginBottom: '20px' }}>Image Editor</h2>
        <div style={styles.formGroup}>
          <label style={styles.labelRequired}>
            Title: <span style={{ color: '#f44336' }}>*</span>
          </label>
          <input
            type="text"
            style={titleError ? styles.inputError : styles.input}
            value={title}
            onChange={handleTitleChange}
            placeholder="Enter title (required)"
            maxLength={100}
          />
          {titleError && (
            <div style={styles.errorMessage}>{titleError}</div>
          )}
          <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
            {title.trim().length}/100 characters
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Sort Order:</label>
          <input
            type="number"
            style={styles.input}
            value={sortOrder}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSortOrder(Number(e.target.value))}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Background Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleBackgroundUpload}
            style={{ display: 'none' }}
            ref={fileInputRef}
          />
          <button
            style={styles.button}
            onClick={() => fileInputRef.current?.click()}
            type="button"
          >
            📁 Upload Background
          </button>
          {backgroundImage && (
            <div style={{ fontSize: '12px', color: '#666', margin: '5px 0' }}>
              <p style={{ margin: '2px 0' }}>{backgroundImage.name}</p>
              {backgroundImage.aspectRatio && (
                <p style={{ margin: '2px 0', fontSize: '11px' }}>
                  Aspect Ratio: {backgroundImage.aspectRatio.toFixed(2)}:1
                </p>
              )}
            </div>
          )}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Projects:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleSubImageUpload}
            style={{ display: 'none' }}
            ref={subImageInputRef}
          />
          <button
            style={styles.buttonSecondary}
            onClick={() => subImageInputRef.current?.click()}
            type="button"
          >
            ➕ Add Projects
          </button>
        </div>

        <div style={styles.formGroup}>
          {subImages.map((img) => {
            const pixelPos = getPixelPosition(img.xPercent, img.yPercent);
            return (
              <div
                key={img.id}
                style={{
                  ...styles.subImageItem,
                  ...(selectedSubImage === img.id ? styles.selectedItem : {})
                }}
                onClick={() => setSelectedSubImage(img.id)}
              >
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                    {img.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#666' }}>
                    {/* FIXED: Show both percentage and pixel positions */}
                    x: {Math.round(pixelPos.x)}px ({Math.round(img.xPercent)}%), y: {Math.round(pixelPos.y)}px ({Math.round(img.yPercent)}%), size: {img.heightPercent}%
                  </div>
                  {img.animation !== 'none' && (
                    <div style={styles.speedIndicator}>
                      {img.animation} - {speedOptions.find(s => s.value === img.animationSpeed)?.label} - {triggerOptions.find(t => t.value === img.animationTrigger)?.label}
                    </div>
                  )}
                </div>
                <button
                  style={{ 
                    ...styles.buttonDanger,
                    opacity: isDeleting ? 0.7 : 1,
                    cursor: isDeleting ? 'not-allowed' : 'pointer'
                  }}
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    deleteSubImage(img.id);
                  }}
                  type="button"
                >
                  🗑️
                </button>
              </div>
            );
          })}
        </div>

        {selectedImageData && (
          <div style={styles.formGroup}>
            <hr style={{ margin: '20px 0' }} />
            <h3 style={{ fontSize: '16px', marginBottom: '15px' }}>Edit Selected Image</h3>
            
            <div style={styles.checkboxContainer}>
              <input
                type="checkbox"
                id={`exterior-${selectedImageData.id}`}
                checked={selectedImageData.isExterior}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  updateSubImageProperty(selectedImageData.id, 'isExterior', e.target.checked)
                }
                style={{ width: '16px', height: '16px' }}
              />
              <label htmlFor={`exterior-${selectedImageData.id}`} style={{ fontSize: '14px', marginBottom: 0, cursor: 'pointer' }}>
                Have Exterior / Interior
              </label>
            </div>
            
            <label style={styles.label}>Size: {selectedImageData.heightPercent}% of background width</label>
            <input
              type="range"
              min="5"
              max="100"
              value={selectedImageData.heightPercent}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                updateSubImageProperty(selectedImageData.id, 'heightPercent', Number(e.target.value))
              }
              style={styles.slider}
            />

            <label style={styles.label}>Animation:</label>
            <select
              value={selectedImageData.animation}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                updateSubImageProperty(selectedImageData.id, 'animation', e.target.value)
              }
              style={styles.select}
            >
              {animationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {selectedImageData.animation !== 'none' && (
              <>
                <label style={styles.label}>Animation Speed:</label>
                <select
                  value={selectedImageData.animationSpeed}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                    updateSubImageProperty(selectedImageData.id, 'animationSpeed', e.target.value)
                  }
                  style={styles.select}
                >
                  {speedOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label} ({option.duration}s)
                    </option>
                  ))}
                </select>

                <label style={styles.label}>Animation Trigger:</label>
                <select
                  value={selectedImageData.animationTrigger}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                    updateSubImageProperty(selectedImageData.id, 'animationTrigger', e.target.value)
                  }
                  style={styles.select}
                >
                  {triggerOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div style={{ fontSize: '11px', color: '#666', marginBottom: '10px', lineHeight: '1.3' }}>
                  {triggerOptions.find(t => t.value === selectedImageData.animationTrigger)?.description}
                </div>

                <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
                  Speed: {speedOptions.find(s => s.value === selectedImageData.animationSpeed)?.duration || 1.5}s
                </div>
              </>
            )}

            {/* FIXED: Show both pixel and percentage positions */}
            <p style={{ fontSize: '12px', color: '#666' }}>
              Position: x: {Math.round(getPixelPosition(selectedImageData.xPercent, selectedImageData.yPercent).x)}px ({Math.round(selectedImageData.xPercent)}%), y: {Math.round(getPixelPosition(selectedImageData.xPercent, selectedImageData.yPercent).y)}px ({Math.round(selectedImageData.yPercent)}%)
            </p>
          </div>
        )}

        <button
          style={{ 
            ...styles.button, 
            backgroundColor: isSaving ? '#6fbf73' : '#4caf50',
            marginTop: '20px',
            opacity: isSaving ? 0.8 : 1,
            cursor: isSaving ? 'not-allowed' : 'pointer'
          }}
          onClick={handleSave}
          type="button"
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : '💾 Save'}
        </button>
      </div>

      <div style={styles.rightPanel}>
        <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Preview</h3>
        <div
          ref={backgroundRef}
          style={{
            ...styles.previewArea,
            backgroundImage: backgroundImage ? `url(${backgroundImage.url})` : 'none',
            cursor: dragState.isDragging ? 'grabbing' : 'default'
          }}
        >
          {isLoadingApiData && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(255, 255, 255, 0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  style={{ fontSize: '18px', marginBottom: '10px' }}
                >
                  ⏳
                </motion.div>
                <div>Loading API Data...</div>
              </div>
            </motion.div>
          )}
          
          {!backgroundImage && !isLoadingApiData && (
            <div style={styles.emptyState}>
              <h3>Upload a background image</h3>
              <p>to see the preview</p>
            </div>
          )}
          
          <AnimatePresence>
            {subImages.map((img, index) => {
              const pixelPos = getPixelPosition(img.xPercent, img.yPercent);
              const animationVariants = getAnimationVariants(img.animation, img.animationTrigger);
              const duration = getAnimationDuration(img.animationSpeed);

              return (
                <motion.div
                  key={img.id}
                  variants={animationVariants}
                  initial={img.animation !== 'none' ? 'initial' : {}}
                  animate={img.animation !== 'none' && img.animationTrigger !== 'hover' ? 'animate' : 'initial'}
                  whileHover={img.animation !== 'none' && img.animationTrigger === 'hover' ? 'animate' : {}}
                  transition={{ duration }}
                  onMouseDown={(e: React.MouseEvent) => handleMouseDown(e, index)}
                  style={{
                    ...styles.draggableImage,
                    left: pixelPos.x,
                    top: pixelPos.y,
                    cursor: dragState.isDragging && dragState.dragIndex === index ? 'grabbing' : 'grab',
                    ...(selectedSubImage === img.id ? styles.selectedImage : {}),
                  }}
                  onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                    if (!dragState.isDragging) {
                      (e.target as HTMLDivElement).style.borderColor = '#1976d2';
                    }
                  }}
                  onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                    if (selectedSubImage !== img.id && !dragState.isDragging) {
                      (e.target as HTMLDivElement).style.borderColor = 'transparent';
                    }
                  }}
                >
                  <motion.img
                    src={img.url}
                    alt={img.name}
                    style={{
                      height: `${getActualHeight(img.heightPercent)}px`,
                      width: 'auto',
                      display: 'block',
                      userSelect: 'none',
                      pointerEvents: 'none'
                    }}
                  />
                  {selectedSubImage === img.id && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={styles.tag}
                    >
                      {img.isExterior ? '🏠 EXT' : '🏠 INT'} | 
                      {img.animation !== 'none' ? 
                        ` ${img.animation} (${speedOptions.find(s => s.value === img.animationSpeed)?.label} - ${triggerOptions.find(t => t.value === img.animationTrigger)?.label})` 
                        : ' draggable'}
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
        
        {backgroundImage && (
          <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
            Canvas Size: {backgroundDimensions.width} × {backgroundDimensions.height}px 
            {backgroundImage.aspectRatio && (
              <span> | Aspect Ratio: {backgroundImage.aspectRatio.toFixed(2)}:1</span>
            )}
          </div>
        )}
      </div>
      
      {confirmOpen && (
        <DeleteConfirmDialog 
          isOpen={confirmOpen} 
          onConfirm={handleConfirmDelete} 
          onCancel={() => setConfirmOpen(false)} 
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};

export default ImageEditor;