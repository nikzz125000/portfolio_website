/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { useSaveSubProjectContainer } from '../../../api/useSaveSubProjectContainer';
import { useSubProjectContainerDetails } from '../../../api/useSubProjectContainerDetails';
import { useNotification } from '../../../components/Tostr';
import DeleteConfirmDialog from '../../../components/DeleteConfirmDialog';
import { useDeleteProject } from '../../../api/useDeleteSubProjects';
import { getAnimationVariants } from '../../../components/Const';

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
  duration: number;
}

interface TriggerOption {
  value: string;
  label: string;
  description: string;
}



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
    const [confirmOpen, setConfirmOpen] = useState(false);
     const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
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

  const { mutate: addOrUpdateContainer,isPending} = useSaveSubProjectContainer();
  const { mutate: deleteProject,isPending:isPendingDelete} = useDeleteProject();

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
              url: !e.target?"": e.target.result as string,
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


  function getProjectId(id: number) {
    if (id > 1_000_000_000_000) {
      return "0";
    }
    return id?.toString();
  }

    const { showNotification } = useNotification();
  // FIXED: Save with percentages (no conversion needed)
 const handleSave = async (): Promise<void> => {
  try {
    const formData = new FormData();

    // Append container/project IDs
    formData.append(
      "SubProjectContainerId",
      !currentItemId ? "0" : String(currentItemId)
    );
    formData.append("ProjectId", getProjectId(projectId));
    formData.append("Title", title);
    formData.append("SortOrder", sortOrder.toString());

    // Append background image if provided
    if (backgroundImage?.file) {
      formData.append("ImageFile", backgroundImage.file);
    }

    if (backgroundImage?.aspectRatio !== undefined) {
      formData.append(
        "BackgroundImageAspectRatio",
        backgroundImage.aspectRatio.toString()
      );
    }

    if (!backgroundImage?.file && backgroundImage?.backgroundImageUrl) {
      formData.append(
        "BackgroundImageUrl",
        backgroundImage.backgroundImageUrl
      );
    }

    // Background type
    if (isExIn) {
      formData.append("BackgroundType", backgroundImage?.isExterior ? "2" : "1");
    } else {
      formData.append("BackgroundType", "0"); // Default to interior if not set
    }

    // Sub-project images
    subImages.forEach((img, index) => {
      formData.append(
        `SubProjects[${index}][ProjectId]`,
        getProjectId(img.id)
      );

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
      formData.append(`SubProjects[${index}][Name]`, safeName);

      const xPercent = Math.round(img.xPercent);
      const yPercent = Math.round(img.yPercent);

      console.log("Saving position as percentages:", {
        xPercent,
        yPercent,
        dimensions: backgroundDimensions,
      });

      formData.append(`SubProjects[${index}][XPosition]`, xPercent.toString());
      formData.append(`SubProjects[${index}][YPosition]`, yPercent.toString());

      formData.append(
        `SubProjects[${index}][HeightPercent]`,
        img.heightPercent.toString()
      );
      formData.append(`SubProjects[${index}][Animation]`, img.animation);
      formData.append(
        `SubProjects[${index}][AnimationSpeed]`,
        img.animationSpeed
      );
      formData.append(
        `SubProjects[${index}][AnimationTrigger]`,
        img.animationTrigger
      );
      formData.append(
        `SubProjects[${index}][IsExterior]`,
        img.isExterior.toString()
      );

      if (img.file && img.file.size > 0) {
        formData.append(`SubProjects[${index}].ImageFile`, img.file);
      } else if (img.url) {
        formData.append(
          `SubProjects[${index}][ProjectImageUrl]`,
          img.url
        );
      }
    });

    // API call
    await addOrUpdateContainer(formData, {
      onSuccess: (res: any) => {
        if (res?.isSuccess) {
          showNotification("Container saved successfully!", "success", "Success");
          handleDrowerClose();
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
    console.error("Save failed:", error);
    const message =
      error instanceof Error
        ? error.message
        : "An unknown error occurred.";
    alert(`Save failed: ${message}`);
  }
};


  // FIXED: Load data and store as percentages
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const loadSampleProject = (apiData:any = null): void => {
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
        updateBackgroundProperty( 'isExterior' ,apiData.backgroundType === 2 ?true: false);
      }
      
      if (apiData.subProjects && Array.isArray(apiData.subProjects)) {
        const loadedSubImages = apiData.subProjects.map((subImg:any) => ({
          id: subImg.subProjectId || Date.now() + Math.random(),
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

  const deleteSubImage = (imageId: number): void => {
    console.log("Deleting image with ID:", imageId);
    setPendingDeleteId(imageId);
    setConfirmOpen(true);
  
  };

   function isDateNowId(id: number | null) {
  return typeof id === "number" && id > 1_000_000_000_000; // more than a trillion
}

  const handleConfirmDelete = (): void => {
console.log(56,isDateNowId(pendingDeleteId), pendingDeleteId);
    if (!isDateNowId(pendingDeleteId)) {

    deleteProject(
      {  
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
  }else{
    setSubImages(prev => prev.filter(img => img.id !== pendingDeleteId));
          if (selectedSubImage === pendingDeleteId) {
            setSelectedSubImage(null);
          }
             setConfirmOpen(false);
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
          style={{ ...styles.button, backgroundColor: '#4caf50', marginTop: '20px' }}
          onClick={handleSave}
          type="button"
          disabled={isPending}
        >
          {isPending?'Loading..': "💾 Save"}
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
            
            {/* FIXED: Render images using Framer Motion and percentage-based positioning */}
            <AnimatePresence>
              {subImages.map((img, index) => {
                const pixelPos = getPixelPosition(img.xPercent, img.yPercent);
                const duration = getAnimationDuration(img.animationSpeed);
                const animationVariants = getAnimationVariants(img.animation, img.animationTrigger, duration);

                return (
                  <motion.div
                    key={`${img.id}-${img.animation}-${img.animationSpeed}-${img.animationTrigger}`}
                    variants={animationVariants}
                    initial={img.animation !== 'none' ? 'initial' : undefined}
                    animate={
                      img.animation !== 'none' && img.animationTrigger !== 'hover' 
                        ? 'animate' 
                        : img.animation !== 'none' && img.animationTrigger === 'hover'
                        ? 'initial'
                        : undefined
                    }
                    whileHover={
                      img.animation !== 'none' && img.animationTrigger === 'hover' 
                        ? 'animate' 
                        : undefined
                    }
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
        </div>

        {confirmOpen && (<DeleteConfirmDialog isOpen={confirmOpen} onConfirm={handleConfirmDelete} onCancel={() => setConfirmOpen(false)} isDeleting={isPendingDelete}/>)}
        
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