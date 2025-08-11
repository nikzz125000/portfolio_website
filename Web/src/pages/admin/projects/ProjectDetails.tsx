import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useSaveContainer } from '../../../api/useSaveContainer';
import { useContainerDetails } from '../../../api/useContainerDetails';
import { useDeleteProject } from '../../../api/useDeleteProject';
import { useSaveSubProjectContainer } from '../../../api/useSaveSubProjectContainer';
import { useSubProjectContainerDetails } from '../../../api/useSubProjectContainerDetails';

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
  isExterior?: boolean;
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
  duration: string;
}

interface TriggerOption {
  value: string;
  label: string;
  description: string;
}

const ProjectDetails: React.FC<{ currentItemId: number, projectId:number,isOpen:boolean, mode:unknown, onClose:()=>void }> = ({ currentItemId,projectId ,isOpen,onClose,mode}) => {
  // Read isExIn from URL parameters
  const getIsExInFromUrl = (): boolean => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('isExIn') === 'true';
    }
    return false;
  };

  const handleDrowerClose = () => {
    onClose();
    setBackgroundImage(null);
    setTitle('');
setSubImages([]);
setSelectedSubImage(null);
  }

  const existingData = {
    title: 'Sample Project',
    sortOrder: 5,
    backgroundImage: null,
    subImages: []
  };

  const [title, setTitle] = useState<string>(existingData.title || '');
  const [sortOrder, setSortOrder] = useState<number>(existingData.sortOrder || 1);
  const [backgroundImage, setBackgroundImage] = useState<BackgroundImage | null>(null);
  const [subImages, setSubImages] = useState<SubImage[]>([]);
  const [selectedSubImage, setSelectedSubImage] = useState<number | null>(null);
  const [dragState, setDragState] = useState<DragState>({ isDragging: false, dragIndex: -1 });
  const [backgroundDimensions, setBackgroundDimensions] = useState<{ width: number, height: number }>({ width: 0, height: 0 });
  const [isLoadingApiData, setIsLoadingApiData] = useState<boolean>(false);
  
  // Get isExIn from URL - this should not be changeable via UI
  const isExIn = getIsExInFromUrl();
  
  const backgroundRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const subImageInputRef = useRef<HTMLInputElement>(null);

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

  const { mutate: addOrUpdateContainer} = useSaveSubProjectContainer();
  const { mutate: deleteProject} = useDeleteProject();

  const animationOptions: AnimationOption[] = [
    { value: 'none', label: 'No Animation' },
    { value: 'fadeIn', label: 'Fade In' },
    { value: 'fadeInUp', label: 'Fade In Up' },
    { value: 'fadeInDown', label: 'Fade In Down' },
    { value: 'slideInLeft', label: 'Slide In Left' },
    { value: 'slideInRight', label: 'Slide In Right' },
    { value: 'slideInUp', label: 'Slide In Up' },
    { value: 'slideInDown', label: 'Slide In Down' },
    { value: 'zoomIn', label: 'Zoom In' },
    { value: 'zoomInUp', label: 'Zoom In Up' },
    { value: 'zoomInDown', label: 'Zoom In Down' },
    { value: 'bounce', label: 'Bounce' },
    { value: 'bounceIn', label: 'Bounce In' },
    { value: 'bounceInUp', label: 'Bounce In Up' },
    { value: 'bounceInDown', label: 'Bounce In Down' },
    { value: 'shake', label: 'Shake' },
    { value: 'pulse', label: 'Pulse' },
    { value: 'heartbeat', label: 'Heartbeat' },
    { value: 'swing', label: 'Swing' },
    { value: 'rotate', label: 'Rotate' },
    { value: 'rotateIn', label: 'Rotate In' },
    { value: 'flip', label: 'Flip' },
    { value: 'flipInX', label: 'Flip In X' },
    { value: 'flipInY', label: 'Flip In Y' },
    { value: 'rubberBand', label: 'Rubber Band' },
    { value: 'wobble', label: 'Wobble' },
    { value: 'jello', label: 'Jello' },
    { value: 'tada', label: 'Tada' }
  ];

  const triggerOptions: TriggerOption[] = [
    { value: 'continuous', label: 'Continuous', description: 'Animation plays all the time' },
    { value: 'hover', label: 'On Hover', description: 'Animation plays when mouse hovers' },
    { value: 'once', label: 'Play Once', description: 'Animation plays once on load' }
  ];

  const speedOptions: SpeedOption[] = [
    { value: 'very-slow', label: 'Very Slow', duration: '4s' },
    { value: 'slow', label: 'Slow', duration: '2.5s' },
    { value: 'normal', label: 'Normal', duration: '1.5s' },
    { value: 'fast', label: 'Fast', duration: '0.8s' },
    { value: 'very-fast', label: 'Very Fast', duration: '0.4s' }
  ];

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
    @keyframes slideInUp {
      0% { transform: translateY(100%); }
      100% { transform: translateY(0); }
    }
    @keyframes slideInDown {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(0); }
    }
    @keyframes zoomIn {
      0% { opacity: 0; transform: scale(0.3); }
      50% { opacity: 1; }
      100% { transform: scale(1); }
    }
    @keyframes zoomInUp {
      0% { opacity: 0; transform: scale(0.1) translateY(2000px); }
      60% { opacity: 1; transform: scale(0.475) translateY(-60px); }
      100% { transform: scale(1) translateY(0); }
    }
    @keyframes zoomInDown {
      0% { opacity: 0; transform: scale(0.1) translateY(-2000px); }
      60% { opacity: 1; transform: scale(0.475) translateY(60px); }
      100% { transform: scale(1) translateY(0); }
    }
    @keyframes bounce {
      0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
      40%, 43% { transform: translateY(-30px); }
      70% { transform: translateY(-15px); }
      90% { transform: translateY(-4px); }
    }
    @keyframes bounceIn {
      0% { opacity: 0; transform: scale(0.3); }
      50% { opacity: 1; transform: scale(1.05); }
      70% { transform: scale(0.9); }
      100% { opacity: 1; transform: scale(1); }
    }
    @keyframes bounceInUp {
      0% { opacity: 0; transform: translateY(2000px); }
      60% { opacity: 1; transform: translateY(-30px); }
      80% { transform: translateY(10px); }
      100% { transform: translateY(0); }
    }
    @keyframes bounceInDown {
      0% { opacity: 0; transform: translateY(-2000px); }
      60% { opacity: 1; transform: translateY(30px); }
      80% { transform: translateY(-10px); }
      100% { transform: translateY(0); }
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
      20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }
    @keyframes heartbeat {
      0% { transform: scale(1); }
      14% { transform: scale(1.3); }
      28% { transform: scale(1); }
      42% { transform: scale(1.3); }
      70% { transform: scale(1); }
      100% { transform: scale(1); }
    }
    @keyframes swing {
      20% { transform: rotate(15deg); }
      40% { transform: rotate(-10deg); }
      60% { transform: rotate(5deg); }
      80% { transform: rotate(-5deg); }
      100% { transform: rotate(0deg); }
    }
    @keyframes rotate {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes rotateIn {
      0% { transform: rotate(-200deg); opacity: 0; }
      100% { transform: rotate(0deg); opacity: 1; }
    }
    @keyframes flip {
      0% { transform: perspective(400px) rotateY(0); }
      100% { transform: perspective(400px) rotateY(360deg); }
    }
    @keyframes flipInX {
      0% { transform: perspective(400px) rotateX(90deg); opacity: 0; }
      40% { transform: perspective(400px) rotateX(-10deg); }
      70% { transform: perspective(400px) rotateX(10deg); }
      100% { transform: perspective(400px) rotateX(0deg); opacity: 1; }
    }
    @keyframes flipInY {
      0% { transform: perspective(400px) rotateY(90deg); opacity: 0; }
      40% { transform: perspective(400px) rotateY(-10deg); }
      70% { transform: perspective(400px) rotateY(10deg); }
      100% { transform: perspective(400px) rotateY(0deg); opacity: 1; }
    }
    @keyframes rubberBand {
      0% { transform: scale(1); }
      30% { transform: scale(1.25, 0.75); }
      40% { transform: scale(0.75, 1.25); }
      60% { transform: scale(1.15, 0.85); }
      100% { transform: scale(1); }
    }
    @keyframes wobble {
      0% { transform: translateX(0%); }
      15% { transform: translateX(-25%) rotate(-5deg); }
      30% { transform: translateX(20%) rotate(3deg); }
      45% { transform: translateX(-15%) rotate(-3deg); }
      60% { transform: translateX(10%) rotate(2deg); }
      75% { transform: translateX(-5%) rotate(-1deg); }
      100% { transform: translateX(0%); }
    }
    @keyframes jello {
      0%, 11.1%, 100% { transform: translateX(0); }
      22.2% { transform: skewX(-12.5deg) skewY(-12.5deg); }
      33.3% { transform: skewX(6.25deg) skewY(6.25deg); }
      44.4% { transform: skewX(-3.125deg) skewY(-3.125deg); }
      55.5% { transform: skewX(1.5625deg) skewY(1.5625deg); }
      66.6% { transform: skewX(-0.78125deg) skewY(-0.78125deg); }
      77.7% { transform: skewX(0.390625deg) skewY(0.390625deg); }
      88.8% { transform: skewX(-0.1953125deg) skewY(-0.1953125deg); }
    }
    @keyframes tada {
      0% { transform: scale(1) rotate(0deg); }
      10%, 20% { transform: scale(0.9) rotate(-3deg); }
      30%, 50%, 70%, 90% { transform: scale(1.1) rotate(3deg); }
      40%, 60%, 80% { transform: scale(1.1) rotate(-3deg); }
      100% { transform: scale(1) rotate(0deg); }
    }

    .animated-image {
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
    .trigger-hover:hover { animation-play-state: running; }

    .animated-image.bounce.trigger-continuous,
    .animated-image.shake.trigger-continuous,
    .animated-image.pulse.trigger-continuous,
    .animated-image.heartbeat.trigger-continuous,
    .animated-image.rotate.trigger-continuous,
    .animated-image.flip.trigger-continuous { 
      animation-iteration-count: infinite; 
    }

    .animated-image.bounce.trigger-once,
    .animated-image.shake.trigger-once,
    .animated-image.pulse.trigger-once,
    .animated-image.heartbeat.trigger-once,
    .animated-image.rotate.trigger-once,
    .animated-image.flip.trigger-once { 
      animation-iteration-count: 3; 
    }

    .animated-image.bounce.trigger-hover,
    .animated-image.shake.trigger-hover,
    .animated-image.pulse.trigger-hover,
    .animated-image.heartbeat.trigger-hover,
    .animated-image.rotate.trigger-hover,
    .animated-image.flip.trigger-hover { 
      animation-iteration-count: infinite;
      animation-play-state: paused;
    }

    .animated-image.bounce.trigger-hover:hover,
    .animated-image.shake.trigger-hover:hover,
    .animated-image.pulse.trigger-hover:hover,
    .animated-image.heartbeat.trigger-hover:hover,
    .animated-image.rotate.trigger-hover:hover,
    .animated-image.flip.trigger-hover:hover { 
      animation-play-state: running;
    }

    .animated-image.fadeIn { animation-name: fadeIn; animation-duration: 1s; }
    .animated-image.fadeInUp { animation-name: fadeInUp; animation-duration: 1s; }
    .animated-image.fadeInDown { animation-name: fadeInDown; animation-duration: 1s; }
    .animated-image.slideInLeft { animation-name: slideInLeft; animation-duration: 1s; }
    .animated-image.slideInRight { animation-name: slideInRight; animation-duration: 1s; }
    .animated-image.slideInUp { animation-name: slideInUp; animation-duration: 1s; }
    .animated-image.slideInDown { animation-name: slideInDown; animation-duration: 1s; }
    .animated-image.zoomIn { animation-name: zoomIn; animation-duration: 1s; }
    .animated-image.zoomInUp { animation-name: zoomInUp; animation-duration: 1s; }
    .animated-image.zoomInDown { animation-name: zoomInDown; animation-duration: 1s; }
    .animated-image.bounce { animation-name: bounce; animation-duration: 2s; animation-iteration-count: infinite; }
    .animated-image.bounceIn { animation-name: bounceIn; animation-duration: 1s; }
    .animated-image.bounceInUp { animation-name: bounceInUp; animation-duration: 1s; }
    .animated-image.bounceInDown { animation-name: bounceInDown; animation-duration: 1s; }
    .animated-image.shake { animation-name: shake; animation-duration: 1s; animation-iteration-count: infinite; }
    .animated-image.pulse { animation-name: pulse; animation-duration: 2s; animation-iteration-count: infinite; }
    .animated-image.heartbeat { animation-name: heartbeat; animation-duration: 1.3s; animation-iteration-count: infinite; }
    .animated-image.swing { animation-name: swing; animation-duration: 1s; transform-origin: top center; }
    .animated-image.rotate { animation-name: rotate; animation-duration: 2s; animation-iteration-count: infinite; animation-timing-function: linear; }
    .animated-image.rotateIn { animation-name: rotateIn; animation-duration: 1s; }
    .animated-image.flip { animation-name: flip; animation-duration: 1s; animation-iteration-count: infinite; }
    .animated-image.flipInX { animation-name: flipInX; animation-duration: 1s; }
    .animated-image.flipInY { animation-name: flipInY; animation-duration: 1s; }
    .animated-image.rubberBand { animation-name: rubberBand; animation-duration: 1s; }
    .animated-image.wobble { animation-name: wobble; animation-duration: 1s; }
    .animated-image.jello { animation-name: jello; animation-duration: 1s; }
    .animated-image.tada { animation-name: tada; animation-duration: 1s; }

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

    .checkbox-container {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      gap: 8px;
    }

    .checkbox-container input[type="checkbox"] {
      width: 16px;
      height: 16px;
    }

    .checkbox-container label {
      font-size: 14px;
      margin-bottom: 0;
      cursor: pointer;
    }

    .isexin-badge {
      background: #2196f3;
      color: white;
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 4px;
      margin-left: 8px;
      font-weight: bold;
    }
  `;

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
              url: e.target.result as string,
              name: file.name,
              aspectRatio,
              isExterior: true
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

  const updateBackgroundProperty = (property: keyof BackgroundImage, value: string | number | boolean): void => {
    setBackgroundImage(prev => prev ? { ...prev, [property]: value } : null);
  };

  const deleteSubImage = (imageId: number): void => {
    deleteProject(
      { 
        containerId: id ? parseInt(id, 10) : 0,
        projectId: typeof imageId === 'number' ? imageId : 0
      },
      {
        onSuccess: () => {
          console.log("Project deleted successfully");
          setSubImages(prev => prev.filter(img => img.id !== imageId));
          if (selectedSubImage === imageId) {
            setSelectedSubImage(null);
          }
        }
      }
    );
  };

  function getProjectId(id: number) {
    if (id > 1_000_000_000_000) {
      return "0";
    }
    return id?.toString();
  }

  // FIXED: Save with percentages (no conversion needed)
  const handleSave = async (): Promise<void> => {
    try {
      const formData = new FormData();
      
      formData.append('SubProjectContainerId', !currentItemId ? '0' : currentItemId);
      formData.append('ProjectId', getProjectId(projectId));
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
        formData.append(`SubProjects[${index}][ProjectId]`, getProjectId(img.id));
        formData.append(`SubProjects[${index}][Name]`, img.name);
        
        const xPercent = Math.round(img.xPercent);
        const yPercent = Math.round(img.yPercent);
        
        console.log('Saving position as percentages:', {
          xPercent,
          yPercent,
          dimensions: backgroundDimensions
        });
        
        formData.append(`SubProjects[${index}][XPosition]`, xPercent.toString());
        formData.append(`SubProjects[${index}][YPosition]`, yPercent.toString());
        
        formData.append(`SubProjects[${index}][HeightPercent]`, img.heightPercent.toString());
        formData.append(`SubProjects[${index}][Animation]`, img.animation);
        formData.append(`SubProjects[${index}][AnimationSpeed]`, img.animationSpeed);
        formData.append(`SubProjects[${index}][AnimationTrigger]`, img.animationTrigger);
        formData.append(`SubProjects[${index}][IsExterior]`, img.isExterior.toString());
        
        if (img.file && img.file.size > 0) {
          formData.append(`SubProjects[${index}].ImageFile`, img.file);
        } else if (img.url) {
          formData.append(`SubProjects[${index}][ProjectImageUrl]`, img.url); 
        }
      });
      
      await addOrUpdateContainer(formData);
      alert('Data saved successfully!');
      
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
  const loadSampleProject = (apiData = null): void => {
    if (apiData) {
      console.log('Loading API data:', apiData);
      
      setTitle(apiData.title || '');
      setSortOrder(apiData.sortOrder || 1);
      
      if (apiData.backgroundImageUrl) {
        setBackgroundImage({
          file: null,
          url: apiData.backgroundImageUrl,
          name: apiData.backgroundImageFileName || 'Background Image',
          aspectRatio: apiData.backgroundImageAspectRatio || 1,
          backgroundImageUrl: apiData.backgroundImageUrl,
          isExterior: true
        });
      }
      
      if (apiData.subProjects && Array.isArray(apiData.subProjects)) {
        const loadedSubImages = apiData.subProjects.map(subImg => ({
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


  const { data, isSuccess } = useSubProjectContainerDetails(currentItemId||0);

  console.log(700, currentItemId);
  useEffect(() => {
    if (isSuccess && data && data.data&& currentItemId) {
      setIsLoadingApiData(true);
      console.log('Fetched data:', data.data);
      
      const apiData = data.data;
      
      if (apiData) {
        console.log(333, apiData);
        loadSampleProject(apiData);
        setIsLoadingApiData(false);
      }
    }
  }, [isSuccess, data,currentItemId]);

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
    previewArea: {
      width: '100%',
      height: `${Math.min(backgroundDimensions.height, 600)}px`,
      minHeight: '300px',
      maxHeight: '600px',
      border: '2px solid #ddd',
      position: 'relative',
      overflow: 'auto',
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
    }
  };

  return (
      <div className={`fixed top-0 bottom-0 right-0 z-50 w-full max-w-7xl bg-white shadow-xl transform transition-transform duration-300 ease-in-out overflow-hidden ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
      style={{ 
        marginTop: '65px', // Adjust this value based on your header height (e.g., '64px' if header is 64px tall)
        height: '100vh' // Use full viewport height
      }}>
        
        {/* Drawer Header - with higher z-index and fixed positioning */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white shadow-sm">
          <div className="flex-1 min-w-0 pr-4">
            <h2 className="text-lg font-semibold text-gray-900 truncate">
              {mode === 'add' ? 'Add New Project' : `Edit Project #${projectId}`}
            </h2>
            <p className="text-sm text-gray-600 truncate">
              {mode === 'add' ? 'Create a new image project with the details below.' : 'Update the project details below.'}
            </p>
          </div>
          
          {/* Close button with better positioning */}
          <div className="flex-shrink-0">
            <button
              onClick={handleDrowerClose}
              className="rounded-md p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              type="button"
              aria-label="Close drawer"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Drawer Content - with proper overflow handling */}
        <div className="flex-1 h-full overflow-hidden" style={{ height: 'calc(100vh - 140px)' }}>
    <div style={styles.container}>
      <style>{animationStyles}</style>
      
      <div style={styles.leftPanel}>
        {isLoadingApiData && (
          <div style={styles.loadingBadge}>
            Loading API Data...
          </div>
        )}
        
        <h2 style={{ marginTop: 0, marginBottom: '20px' }}>Image Editor</h2>

        <div style={styles.formGroup}>
          <label style={styles.label}>Title:</label>
          <input
            type="text"
            style={styles.input}
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            placeholder="Enter title"
          />
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
          
          {/* Background Image Type Selection - Only show when isExIn is true */}
          {isExIn && backgroundImage && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Background Type:</label>
              <div style={{ display: 'flex', gap: '15px', marginBottom: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '14px', fontWeight: 'normal' }}>
                  <input
                    type="radio"
                    name="backgroundType"
                    value="exterior"
                    checked={backgroundImage.isExterior === true}
                    onChange={() => updateBackgroundProperty('isExterior', true)}
                    style={{ marginRight: '6px' }}
                  />
                  🏠 Exterior
                </label>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '14px', fontWeight: 'normal' }}>
                  <input
                    type="radio"
                    name="backgroundType"
                    value="interior"
                    checked={backgroundImage.isExterior === false}
                    onChange={() => updateBackgroundProperty('isExterior', false)}
                    style={{ marginRight: '6px' }}
                  />
                  🏠 Interior
                </label>
              </div>
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
                  style={styles.buttonDanger}
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
            
            {/* <div className="checkbox-container">
              <input
                type="checkbox"
                id={`exterior-${selectedImageData.id}`}
                checked={selectedImageData.isExterior}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  updateSubImageProperty(selectedImageData.id, 'isExterior', e.target.checked)
                }
              />
              <label htmlFor={`exterior-${selectedImageData.id}`}>
                Have Exterior / Interior
              </label>
            </div> */}
            
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
                      {option.label} ({option.duration})
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
                  Speed: {speedOptions.find(s => s.value === selectedImageData.animationSpeed)?.duration || '1.5s'}
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
          style={{ ...styles.button, backgroundColor: '#4caf50', marginTop: '20px' }}
          onClick={handleSave}
          type="button"
        >
          💾 Save
        </button>
      </div>

      <div style={styles.rightPanel}>
        <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Preview</h3>
        <div
          ref={backgroundRef}
          style={{
            ...styles.previewArea,
            cursor: dragState.isDragging ? 'grabbing' : 'default'
          }}
        >
          {/* Inner container that maintains the actual background image dimensions */}
          <div
            style={{
              width: '100%',
              height: `${backgroundDimensions.height}px`,
              minHeight: '300px',
              position: 'relative',
              backgroundImage: backgroundImage ? `url(${backgroundImage.url})` : 'none',
              backgroundSize: '100% auto',
              backgroundPosition: 'center top',
              backgroundRepeat: 'no-repeat'
            }}
          >
            {isLoadingApiData && (
              <div className="loading-overlay">
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', marginBottom: '10px' }}>⏳</div>
                  <div>Loading API Data...</div>
                </div>
              </div>
            )}
            
            {!backgroundImage && !isLoadingApiData && (
              <div style={styles.emptyState}>
                <h3>Upload a background image</h3>
                <p>to see the preview</p>
              </div>
            )}
            
            {/* FIXED: Render images using percentage-based positioning */}
            {subImages.map((img, index) => {
              const pixelPos = getPixelPosition(img.xPercent, img.yPercent);
              return (
                <div
                  key={img.id}
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
                  <img
                    src={img.url}
                    alt={img.name}
                    className={`animated-image ${img.animation !== 'none' ? img.animation : ''} ${img.animation !== 'none' ? `speed-${img.animationSpeed}` : ''} ${img.animation !== 'none' ? `trigger-${img.animationTrigger}` : ''}`}
                    style={{
                      height: `${getActualHeight(img.heightPercent)}px`,
                      width: 'auto',
                      display: 'block',
                      userSelect: 'none',
                      pointerEvents: img.animationTrigger === 'hover' && img.animation !== 'none' ? 'auto' : 'none'
                    }}
                  />
                  {selectedSubImage === img.id && (
                    <div style={styles.tag}>
                      {img.isExterior ? '🏠 EXT' : '🏠 INT'} | 
                      {img.animation !== 'none' ? 
                        ` ${img.animation} (${speedOptions.find(s => s.value === img.animationSpeed)?.label} - ${triggerOptions.find(t => t.value === img.animationTrigger)?.label})` 
                        : ' draggable'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        {backgroundImage && (
          <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
            Canvas Size: {backgroundDimensions.width} × {backgroundDimensions.height}px 
            {backgroundDimensions.height > 600 && (
              <span style={{ color: '#ff9800' }}> (Preview limited to 600px height - scroll to see full image)</span>
            )}
            {backgroundImage.aspectRatio && (
              <span> | Aspect Ratio: {backgroundImage.aspectRatio.toFixed(2)}:1</span>
            )}
            {isExIn && backgroundImage.isExterior !== undefined && (
              <span> | Type: {backgroundImage.isExterior ? 'Exterior' : 'Interior'}</span>
            )}
          </div>
        )}
      </div>
    </div>
    </div>

        <div className="sticky bottom-0 border-t border-gray-200 bg-gray-50 px-6 py-3 shadow-sm">
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">
              Press Esc to close | Drag images to reposition
            </p>
            <div className="text-xs text-gray-500">
              Use the left panel to configure your project
            </div>
          </div>
        </div>
      </div>
  );
};

export default ProjectDetails;