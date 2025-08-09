import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHomePageList } from '../../api/useHomePage';

interface SubImage {
  projectId: number;
  name: string;
  projectImageUrl: string;
  imageFileName?: string;
  xPosition: number;
  yPosition: number;
  heightPercent: number;
  animation: string;
  animationSpeed: string;
  animationTrigger: string;
}

interface BackgroundImage {
  name: string;
  url: string;
  aspectRatio?: number;
}

interface SectionData {
  id: number;
  title: string;
  sortOrder: number;
  backgroundImageUrl?: string;
  backgroundImageAspectRatio?: number;
  backgroundImage?: BackgroundImage | null;
  projects?: SubImage[];
  subImages?: SubImage[];
}

// FIXED: Same unified coordinate system as ImageEditor
const createUnifiedCoordinateSystem = (aspectRatio: number | undefined) => {
  const getImageDimensions = (containerWidth: number) => {
    if (!aspectRatio || aspectRatio <= 0) {
      return { width: containerWidth, height: containerWidth * 0.5625 }; // Default 16:9
    }
    
    // Calculate height based on full width display
    const imageHeight = containerWidth / aspectRatio;
    return { width: containerWidth, height: imageHeight };
  };
  
  const getPixelFromPercent = (xPercent: number, yPercent: number, containerWidth: number) => {
    const { width: imageWidth, height: imageHeight } = getImageDimensions(containerWidth);
    return {
      x: (xPercent / 100) * imageWidth,
      y: (yPercent / 100) * imageHeight,
      imageWidth,
      imageHeight
    };
  };
  
  const getPercentFromPixel = (x: number, y: number, containerWidth: number) => {
    const { width: imageWidth, height: imageHeight } = getImageDimensions(containerWidth);
    return {
      xPercent: imageWidth > 0 ? (x / imageWidth) * 100 : 0,
      yPercent: imageHeight > 0 ? (y / imageHeight) * 100 : 0
    };
  };
  
  return { getImageDimensions, getPixelFromPercent, getPercentFromPixel };
};

const Homepage: React.FC = () => {
  const [sections, setSections] = useState<SectionData[]>([]);
  const [viewportHeight, setViewportHeight] = useState<number>(window.innerHeight);
  const [scrollY, setScrollY] = useState<number>(0);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [hoveredImageId, setHoveredImageId] = useState<number | null>(null);
  const [showConnectForm, setShowConnectForm] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const targetScrollY = useRef<number>(0);
  const currentScrollY = useRef<number>(0);
  const animationFrameId = useRef<number | null>(null);
  const isScrolling = useRef<boolean>(false);
  const [totalHeight, setTotalHeight] = useState<number>(0);
  const navigate = useNavigate();

  const { data, isPending, isSuccess } = useHomePageList();

  // Navigation handler for sub-images
  const handleSubImageClick = (subImageId: number) => {
    console.log(`Navigating to project/${subImageId}`);
    alert(`Navigating to project/${subImageId}`);
  };

  // Handle centered logo click - navigate to /resume
  const handleCenteredLogoClick = () => {
    navigate('/resume');
  };

  // Menu items for the animated logo menu
  const menuItems = [
    { name: 'About', icon: '👤', link: '/about' },
    { name: 'Contact', icon: '📞', link: '/contact' },
    { name: 'Instagram', icon: '📷', link: 'https://instagram.com' },
    { name: 'LinkedIn', icon: '💼', link: 'https://linkedin.com' }
  ];

  // Handle logo click
  const handleLogoClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // FIXED: Same background strategy as ImageEditor
  const getBackgroundStyle = (section: SectionData) => {
    if (!section.backgroundImageUrl) return {};
    
    return {
      backgroundImage: `url(${section.backgroundImageUrl})`,
      backgroundSize: '100% auto', // Same as ImageEditor
      backgroundPosition: 'center top',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'scroll'
    };
  };

  // FIXED: Same section dimension calculation as ImageEditor
  const getSectionDimensions = (section: SectionData) => {
    const containerWidth = window.innerWidth;
    const coordinateSystem = createUnifiedCoordinateSystem(section.backgroundImageAspectRatio);
    const { width, height } = coordinateSystem.getImageDimensions(containerWidth);
    
    // Ensure minimum viewport height but respect image proportions
    const sectionHeight = Math.max(height, window.innerHeight);
    
    return {
      width: containerWidth,
      height: sectionHeight,
      imageHeight: height // Actual image height for positioning
    };
  };

  // FIXED: Calculate total height using unified system
  useEffect(() => {
    if (sections.length > 0) {
      let height = 0;
      sections.forEach((section) => {
        const dimensions = getSectionDimensions(section);
        height += dimensions.height;
      });
      height += 200; // Add footer height
      setTotalHeight(height);
      
      // Reset scroll if it's beyond the new bounds
      if (targetScrollY.current > height - window.innerHeight) {
        targetScrollY.current = Math.max(0, height - window.innerHeight);
      }
      
      console.log('Unified coordinate system total height calculated:', {
        totalHeight: height,
        sectionsCount: sections.length,
        viewportHeight,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight
      });
    }
  }, [sections, viewportHeight]);

  // Custom smooth scroll animation
  const smoothScrollStep = () => {
    const difference = targetScrollY.current - currentScrollY.current;
    const step = difference * 0.05; // Slow scroll speed
    
    if (Math.abs(difference) < 0.5) {
      currentScrollY.current = targetScrollY.current;
      isScrolling.current = false;
      setScrollY(currentScrollY.current);
      return;
    }
    
    currentScrollY.current += step;
    setScrollY(currentScrollY.current);
    
    if (containerRef.current) {
      containerRef.current.style.transform = `translateY(-${currentScrollY.current}px)`;
    }
    
    animationFrameId.current = requestAnimationFrame(smoothScrollStep);
  };

  // Handle wheel events for custom scrolling
  useEffect(() => {
    if (totalHeight === 0) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      const scrollAmount = e.deltaY * 0.3;
      const maxScroll = Math.max(0, totalHeight - window.innerHeight);
      
      const newScrollY = targetScrollY.current + scrollAmount;
      targetScrollY.current = Math.max(0, Math.min(maxScroll, newScrollY));
      
      if (!isScrolling.current) {
        isScrolling.current = true;
        smoothScrollStep();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const scrollAmount = 50;
      const maxScroll = Math.max(0, totalHeight - window.innerHeight);
      
      switch (e.key) {
        case 'ArrowDown':
        case 'PageDown':
        case ' ':
          if (e.target === document.body) {
            e.preventDefault();
            targetScrollY.current = Math.min(maxScroll, targetScrollY.current + scrollAmount);
          }
          break;
        case 'ArrowUp':
        case 'PageUp':
          if (e.target === document.body) {
            e.preventDefault();
            targetScrollY.current = Math.max(0, targetScrollY.current - scrollAmount);
          }
          break;
        case 'Home':
          e.preventDefault();
          targetScrollY.current = 0;
          break;
        case 'End':
          e.preventDefault();
          targetScrollY.current = maxScroll;
          break;
        default:
          return;
      }
      
      if (!isScrolling.current) {
        isScrolling.current = true;
        smoothScrollStep();
      }
    };

    let startY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        e.preventDefault();
        const currentY = e.touches[0].clientY;
        const deltaY = (startY - currentY) * 0.5;
        const maxScroll = Math.max(0, totalHeight - window.innerHeight);
        
        targetScrollY.current = Math.max(0, Math.min(maxScroll, targetScrollY.current + deltaY));
        startY = currentY;
        
        if (!isScrolling.current) {
          isScrolling.current = true;
          smoothScrollStep();
        }
      }
    };

    document.body.style.overflow = 'hidden';
    
    window.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('wheel', handleWheel);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [totalHeight]);

  // Handle click outside menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen) {
        const target = event.target as HTMLElement;
        const logoElement = document.getElementById('main-logo');
        const menuElement = document.getElementById('logo-menu');
        
        if (logoElement && menuElement) {
          if (!logoElement.contains(target) && !menuElement.contains(target)) {
            setIsMenuOpen(false);
          }
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Load data from API
  useEffect(() => {
    if (data?.data) {
      console.log('Raw API Data:', data.data);
      setTimeout(() => {
        setSections(data.data.sort((a, b) => a.sortOrder - b.sortOrder));
      }, 500);
    }
  }, [data]);

  // Debug API data structure
  useEffect(() => {
    if (data?.data && data.data.length > 0) {
      console.log('API Data Structure:', data.data[0]);
      if (data.data[0].projects && data.data[0].projects.length > 0) {
        console.log('First Project Position:', {
          xPosition: data.data[0].projects[0].xPosition,
          yPosition: data.data[0].projects[0].yPosition,
          heightPercent: data.data[0].projects[0].heightPercent
        });
      }
    }
  }, [data]);

  // FIXED: Handle window resize - force re-render by updating viewport height
  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
      // Force a re-render which will recalculate all positions
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle menu item click
  const handleMenuItemClick = (item: typeof menuItems[0]) => {
    console.log(`Navigating to ${item.link}`);
    if (item.link.startsWith('http')) {
      window.open(item.link, '_blank');
    } else {
      alert(`Navigating to ${item.link}`);
    }
    setIsMenuOpen(false);
  };

  // Handle connect form submission
  const handleConnectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      console.log('Email submitted:', email);
      setFormSubmitted(true);
      setTimeout(() => {
        setShowConnectForm(false);
        setFormSubmitted(false);
        setEmail('');
      }, 2000);
    }
  };

  // Handle connect button click
  const handleConnectClick = () => {
    setShowConnectForm(true);
  };
  
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    const elements = document.querySelectorAll('.fade-in-on-scroll:not(.sub-image-container)');
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [sections]);

  // Animation classes function to handle API data structure
  const getAnimationClasses = (subImage: any): string => {
    if (subImage.animation === 'none' || !subImage.animation) return '';
    
    const classes = [
      'animated-element',
      subImage.animation,
      `speed-${subImage.animationSpeed || 'normal'}`,
      `trigger-${subImage.animationTrigger || 'once'}`
    ];
    
    return classes.join(' ');
  };

  // FIXED: Calculate image dimensions using unified coordinate system
  const calculateImageDimensions = (
    containerWidth: number,
    heightPercent: number,
    aspectRatio: number | undefined
  ) => {
    const coordinateSystem = createUnifiedCoordinateSystem(aspectRatio);
    const { width: imageWidth } = coordinateSystem.getImageDimensions(containerWidth);
    
    // FIXED: Use imageWidth for height calculation (same as ImageEditor)
    const height = (heightPercent / 100) * imageWidth;
    return {
      width: 'auto',
      height: `${height}px`,
      maxWidth: `${containerWidth * 0.9}px`,
      maxHeight: `${window.innerHeight * 0.9}px`
    };
  };

  // Animation CSS
  const animationStyles = `
    @keyframes fadeIn {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }
    @keyframes fadeInUp {
      0% { opacity: 0; transform: translateY(30px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeInDown {
      0% { opacity: 0; transform: translateY(-30px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideInLeft {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(0); }
    }
    @keyframes slideInRight {
      0% { transform: translateX(100%); }
      100% { transform: translateX(0); }
    }
    @keyframes zoomIn {
      0% { opacity: 0; transform: scale(0.3); }
      100% { opacity: 1; transform: scale(1); }
    }
    @keyframes bounceIn {
      0% { opacity: 0; transform: scale(0.3); }
      50% { opacity: 1; transform: scale(1.05); }
      70% { transform: scale(0.9); }
      100% { opacity: 1; transform: scale(1); }
    }
    @keyframes bounce {
      0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
      40%, 43% { transform: translateY(-30px); }
      70% { transform: translateY(-15px); }
      90% { transform: translateY(-4px); }
    }
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
      20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
    @keyframes rotate {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
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

    .animated-element {
      animation-fill-mode: both;
    }

    .speed-very-slow { animation-duration: 4s !important; }
    .speed-slow { animation-duration: 2.5s !important; }
    .speed-normal { animation-duration: 1.5s !important; }
    .speed-fast { animation-duration: 0.8s !important; }
    .speed-very-fast { animation-duration: 0.4s !important; }

    .trigger-continuous { animation-iteration-count: infinite; }
    .trigger-once { animation-iteration-count: 1; }
    .trigger-hover { animation-play-state: paused; }
    .trigger-hover:hover { animation-play-state: running; animation-iteration-count: infinite; }

    .animated-element.fadeIn { animation-name: fadeIn; }
    .animated-element.fadeInUp { animation-name: fadeInUp; }
    .animated-element.fadeInDown { animation-name: fadeInDown; }
    .animated-element.slideInLeft { animation-name: slideInLeft; }
    .animated-element.slideInRight { animation-name: slideInRight; }
    .animated-element.zoomIn { animation-name: zoomIn; }
    .animated-element.bounceIn { animation-name: bounceIn; }
    .animated-element.bounce { animation-name: bounce; animation-iteration-count: infinite; }
    .animated-element.pulse { animation-name: pulse; animation-iteration-count: infinite; }
    .animated-element.shake { animation-name: shake; }
    .animated-element.rotate { animation-name: rotate; animation-iteration-count: infinite; }

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
    }

    .clickable-sub-image:hover {
      transform: scale(1.2) !important;
      filter: brightness(1.3) saturate(1.2) drop-shadow(0 0 15px rgba(255, 255, 255, 0.5));
      z-index: 50 !important;
      animation: glowPulse 15s infinite;
    }

    .clickable-sub-image:active {
      transform: scale(1.1) !important;
    }

    .section-background {
      transition: all 0.4s ease;
    }

    .section-background.dimmed {
      filter: brightness(0.2) blur(3px);
    }

    .sub-image-container {
      transition: all 0.4s ease;
    }

    .sub-image-container.dimmed {
      opacity: 0.2;
      filter: blur(2px) grayscale(0.5);
      transform: translate(-50%, -50%) scale(0.95);
    }

    .sub-image-container.highlighted {
      opacity: 1;
      filter: none;
      z-index: 50;
      transform: translate(-50%, -50%) scale(1);
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
      max-width: 400px;
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

    .email-input {
      width: 100%;
      padding: 15px 20px;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      font-size: 16px;
      margin-bottom: 20px;
      transition: all 0.3s ease;
      box-sizing: border-box;
    }

    .email-input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
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

    /* FIXED: Unified coordinate system debugging */
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

    /* FIXED: Ensure no gaps between sections */
    section {
      margin: 0 !important;
      padding: 0 !important;
      border: none !important;
      display: block !important;
    }

    /* FIXED: Mobile optimization for unified coordinate system */
    @media (max-width: 768px) {
      section {
        width: 100vw !important;
      }
      
      .centered-logo img {
        height: 80px !important;
      }
      
      .coordinate-debug {
        font-size: 9px !important;
        padding: 4px !important;
      }
    }

    /* FIXED: Ensure smooth scrolling container */
    body, html {
      margin: 0;
      padding: 0;
      overflow: hidden;
    }
  `;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <style>{animationStyles}</style>
      
      {/* Fixed Logo with Menu */}
      <div
        style={{
          position: 'fixed',
          top: '80px',
          left: '20px',
          zIndex: 1000,
          transform: `translateY(${Math.min(scrollY * 0.05, 20)}px)`,
          transition: 'transform 0.3s ease-out',
          opacity: scrollY > 100 ? 0.9 : 1
        }}
      >
        {/* Logo */}
        <div
          id="main-logo"
          onClick={handleLogoClick}
          className="logo-container"
          style={{
            cursor: 'pointer',
            position: 'relative',
            borderRadius: '12px',
            padding: '8px',
            transition: 'all 0.3s ease'
          }}
        >
          <img
            src="/logo/font 2_.png"
            alt="Fixed Logo"
            style={{
              height: '150px',
              width: 'auto',
              filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))',
              transition: 'transform 0.2s ease, filter 0.2s ease'
            }}
          />
        </div>

        {/* Animated Menu */}
        {isMenuOpen && (
          <div
            id="logo-menu"
            style={{
              position: 'absolute',
              top: '75px',
              left: '75px',
              zIndex: 1001
            }}
          >
            {menuItems?.map((item, index) => {
              const rotationAngles = [0, 30, 60, 90];
              const itemRotation = rotationAngles[index] || 0;
              const top = [0, 47.5, 90.9, 135];
              const left = [105, 90, 54, 0];

              return (
                <div
                  key={item.name}
                  className="menu-item-enter menu-item-modern"
                  onClick={() => handleMenuItemClick(item)}
                  style={{
                    position: 'absolute',
                    left: `${left[index]}px`,
                    top: `${top[index]}px`,
                    transform: `translate(-50%, -50%) rotate(${itemRotation}deg)`,
                    padding: '6px 12px',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    animationDelay: `${index * 0.1}s`,
                    userSelect: 'none',
                    minWidth: '85px',
                    justifyContent: 'center',
                    '--rotation': `${itemRotation}deg`
                  } as React.CSSProperties & { '--rotation': string }}
                >
                  <span style={{ 
                    fontSize: '12px',
                    filter: 'grayscale(0)',
                    transition: 'all 0.2s ease'
                  }}>
                    {item.icon}
                  </span>
                  <span style={{
                    letterSpacing: '0.2px',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}>
                    {item.name}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Content Container */}
      <div 
        ref={containerRef} 
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          transition: 'transform 0.1s ease-out',
          willChange: 'transform'
        }}
      >
        {/* FIXED: Unified coordinate system responsive sections */}
        {sections?.map((section, sectionIndex) => {
          // FIXED: Calculate proper dimensions using unified system
          const dimensions = getSectionDimensions(section);
          const bgStyle = getBackgroundStyle(section);
          const coordinateSystem = createUnifiedCoordinateSystem(section.backgroundImageAspectRatio);

          return (
            <section
              key={section.projectContainerId}
              style={{
                position: 'relative',
                width: '100vw',
                height: `${dimensions.height}px`,
                minHeight: '100vh',
                ...bgStyle,
                overflow: 'hidden'
              }}
            >
              {/* Background Overlay */}
              <div
                className={`section-background ${hoveredImageId !== null ? 'dimmed' : ''}`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: sectionIndex === 0 
                    ? 'linear-gradient(45deg, rgba(0,0,0,0.1), rgba(0,0,0,0.3))' 
                    : 'rgba(0,0,0,0.1)',
                  zIndex: 1
                }}
              />

              {/* FIXED: Debug info for unified coordinate system */}
              {process.env.NODE_ENV === 'development' && (
                <div className="coordinate-debug">
                  Screen: {window.innerWidth}×{window.innerHeight}<br/>
                  Image Ratio: {section.backgroundImageAspectRatio?.toFixed(2) || 'N/A'}<br/>
                  Section Height: {dimensions.height}px<br/>
                  Image Height: {dimensions.imageHeight}px<br/>
                  BgSize: 100% auto (unified)<br/>
                  Coordinate System: Unified
                </div>
              )}

              {/* Centered Top Logo - Only show on first section */}
              {sectionIndex === 0 && (
                <div className="centered-logo" onClick={handleCenteredLogoClick}>
                  <img
                    src="/logo/font.png"
                    alt="Centered Logo"
                    style={{cursor:'pointer'}}
                  />
                </div>
              )}

              {/* FIXED: Sub-images positioned using unified coordinate system */}
              {section.projects?.map((subImage) => {
                // FIXED: Use unified coordinate system for positioning
                const containerWidth = window.innerWidth;
                const { x: pixelX, y: pixelY } = coordinateSystem.getPixelFromPercent(
                  subImage.xPosition, 
                  subImage.yPosition, 
                  containerWidth
                );
                
                const imageDimensions = calculateImageDimensions(
                  containerWidth,
                  subImage.heightPercent,
                  section.backgroundImageAspectRatio
                );

                console.log('Unified coordinate system positioning:', {
                  name: subImage.name,
                  xPosition: subImage.xPosition,
                  yPosition: subImage.yPosition,
                  containerWidth,
                  imageHeight: dimensions.imageHeight,
                  sectionHeight: dimensions.height,
                  finalX: pixelX,
                  finalY: pixelY,
                  aspectRatio: section.backgroundImageAspectRatio?.toFixed(2),
                  coordinateSystem: 'unified'
                });

                const isHovered = hoveredImageId === subImage.projectId;
                const isDimmed = hoveredImageId !== null && hoveredImageId !== subImage.projectId;

                return (
                  <div
                    key={subImage.projectId}
                    className={`sub-image-visible sub-image-container ${
                      isHovered ? 'highlighted' : isDimmed ? 'dimmed' : ''
                    }`}
                    style={{
                      position: 'absolute',
                      left: `${pixelX}px`,  // Real-time calculation using unified system
                      top: `${pixelY}px`,   // Real-time calculation using unified system
                      zIndex: isHovered ? 50 : 10,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <img
                      src={subImage.projectImageUrl}
                      alt={subImage.name || subImage.imageFileName}
                      className={`${getAnimationClasses(subImage)} clickable-sub-image`}
                      onClick={() => handleSubImageClick(subImage.projectId)}
                      onMouseEnter={() => setHoveredImageId(subImage.projectId)}
                      onMouseLeave={() => setHoveredImageId(null)}
                      style={{
                        ...imageDimensions,
                        display: 'block',
                        borderRadius: '8px',
                        boxShadow: isHovered 
                          ? '0 0 15px rgba(255, 255, 255, 0.6), 0 0 25px rgba(255, 255, 255, 0.4), 0 0 35px rgba(255, 255, 255, 0.3)'
                          : '0 4px 20px rgba(0,0,0,0.3)',
                        cursor: 'pointer'
                      }}
                    />
                  </div>
                );
              })}

              {/* Section Title (Hidden but can be used for SEO) */}
              <h1 style={{ 
                position: 'absolute', 
                left: '-9999px', 
                visibility: 'hidden' 
              }}>
                {section.title}
              </h1>
            </section>
          );
        })}

        {/* Footer Section */}
        <footer
          style={{
            position: 'relative',
            width: '100vw',
            height: '200px',
            background: 'linear-gradient(135deg, #9f4f96 0%, #ff6b6b 30%, #ff8e53 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 60px',
            color: 'white',
            zIndex: 100
          }}
        >
          {/* Left side - Heart logo and text */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ 
              fontSize: '48px', 
              marginBottom: '10px',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
            }}>
              ♥
            </div>
            <div style={{ 
              fontSize: '14px', 
              lineHeight: '1.4',
              color: 'rgba(255,255,255,0.9)',
              maxWidth: '200px'
            }}>
              <div style={{ fontWeight: '600', marginBottom: '2px' }}>Get in Touch</div>
              <div>3420 Bristol St.</div>
              <div>Costa Mesa, CA 92626</div>
              <div>+1 (626) 555 0134</div>
            </div>
          </div>

          {/* Right side - Connect button */}
          <div>
            <button 
              className="connect-button"
              onClick={handleConnectClick}
            >
              CONNECT
            </button>
          </div>
        </footer>
      </div>

      {/* Connect Form Modal */}
      {showConnectForm && (
        <div className="connect-modal" onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowConnectForm(false);
          }
        }}>
          <div className="connect-form">
            {!formSubmitted ? (
              <form onSubmit={handleConnectSubmit}>
                <h2>Let's Connect!</h2>
                <p>Enter your email address and we'll get in touch with you soon.</p>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="email-input"
                  required
                />
                <button type="submit" className="submit-btn">
                  Send Message
                </button>
                <button 
                  type="button" 
                  className="close-btn"
                  onClick={() => setShowConnectForm(false)}
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div>
                <h2>✨ Thank You!</h2>
                <p className="success-message">
                  Your message has been sent successfully. We'll get back to you soon!
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Scroll to Top Button */}
      {scrollY > 500 && (
        <button
          onClick={() => {
            targetScrollY.current = 0;
            if (!isScrolling.current) {
              isScrolling.current = true;
              smoothScrollStep();
            }
          }}
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            border: 'none',
            color: 'white',
            fontSize: '20px',
            cursor: 'pointer',
            zIndex: 1000,
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            transition: 'transform 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          ↑
        </button>
      )}
    </div>
  );
};

export default Homepage;