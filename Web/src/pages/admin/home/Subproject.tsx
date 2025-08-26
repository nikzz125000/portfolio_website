/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSaveContainer } from '../../../api/useSaveContainer';
import { useNavigate, useParams } from 'react-router-dom';
import { useContainerDetails } from '../../../api/useContainerDetails';
import { useDeleteProject } from '../../../api/useDeleteProject';
import DeleteConfirmDialog from '../../../components/DeleteConfirmDialog';
import { useNotification } from '../../../components/Tostr';
import { animationOptions, getAnimationVariants, speedOptions, stylesSubproject as styles, triggerOptions } from '../../../components/Const';
import { CustomCursor } from '../../../components/CustomCursor';

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



// FIXED: Framer Motion animation variants with duration parameter
// FIXED: Updated getAnimationVariants function that properly uses duration for all animations


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

  const style: { [key: string]: React.CSSProperties } = {
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
  }


  return (
    <div style={styles.container}>
      <CustomCursor/>
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
            ...style.previewArea,
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
              // FIXED: Calculate duration first, then pass to getAnimationVariants
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