import React, { useEffect, useState, useRef, useCallback } from "react";
import ProjectDetails from "./ProjectDetails";

interface ImageProject {
  id: number;
  title: string;
  sortOrder: number;
  image?: string;
  thumbnail?: string;
}

interface SubImage {
  id: number;
  file: File;
  url: string;
  name: string;
  x: number;
  y: number;
  heightPercent: number;
  animation: string;
  animationSpeed: string;
  animationTrigger: string;
  isExterior: boolean;
}

interface BackgroundImage {
  file: File;
  url: string;
  name: string;
  aspectRatio?: number;
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

// Mock API hook
const useHomeImages = (projectId: string) => {
  const [data, setData] = useState<any>(undefined);
  const [isPending, setIsPending] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      const mockData = {
        data: {
          data: [
            { id: 1, title: "Hero Section", sortOrder: 1 },
            { id: 2, title: "About Us Gallery", sortOrder: 2 },
            { id: 3, title: "Services Showcase", sortOrder: 3 },
            { id: 4, title: "Team Photos", sortOrder: 4 },
            { id: 5, title: "Contact Banner", sortOrder: 5 }
          ]
        }
      };
      setData(mockData);
      setIsPending(false);
      setIsSuccess(true);
    }, 1000);
  }, [projectId]);

  return { data, isPending, isSuccess };
};

// Enhanced Image Editor Component
const ProjectImageEditor: React.FC<{
  mode: 'add' | 'edit';
  projectId?: number;
  currentProject?: ImageProject;
  onClose: () => void;
}> = ({ mode, projectId, currentProject, onClose }) => {
  const existingData = {
    title: currentProject?.title || 'Sample Project',
    sortOrder: currentProject?.sortOrder || 1,
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
  const [isExIn, setIsExIn] = useState<boolean>(false);
  
  const backgroundRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const subImageInputRef = useRef<HTMLInputElement>(null);

  // Monitor preview area size
  useEffect(() => {
    const updateDimensions = () => {
      if (backgroundRef.current) {
        const containerWidth = backgroundRef.current.clientWidth;
        let containerHeight = containerWidth * 0.6; // 16:10 aspect ratio
        
        if (backgroundImage?.aspectRatio) {
          containerHeight = containerWidth / backgroundImage.aspectRatio;
        }
        
        setBackgroundDimensions({
          width: containerWidth,
          height: containerHeight
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [backgroundImage?.aspectRatio]);

  const animationOptions: AnimationOption[] = [
    { value: 'none', label: 'No Animation' },
    { value: 'fadeIn', label: 'Fade In' },
    { value: 'fadeInUp', label: 'Fade In Up' },
    { value: 'fadeInDown', label: 'Fade In Down' },
    { value: 'slideInLeft', label: 'Slide In Left' },
    { value: 'slideInRight', label: 'Slide In Right' },
    { value: 'bounce', label: 'Bounce' },
    { value: 'pulse', label: 'Pulse' },
    { value: 'zoomIn', label: 'Zoom In' }
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
            x: 50,
            y: 50,
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

  const handleMouseDown = useCallback((e: React.MouseEvent, index: number): void => {
    e.preventDefault();
    const rect = backgroundRef.current?.getBoundingClientRect();
    if (!rect) return;

    const startX = e.clientX - rect.left - subImages[index].x;
    const startY = e.clientY - rect.top - subImages[index].y;

    setDragState({ isDragging: true, dragIndex: index });
    setSelectedSubImage(subImages[index].id);

    const handleMouseMove = (e: MouseEvent): void => {
      const newX = Math.max(0, Math.min(backgroundDimensions.width - 50, e.clientX - rect.left - startX));
      const newY = Math.max(0, Math.min(backgroundDimensions.height - 50, e.clientY - rect.top - startY));
      setSubImages(prev => prev.map((img, i) => 
        i === index ? { ...img, x: newX, y: newY } : img
      ));
    };

    const handleMouseUp = (): void => {
      setDragState({ isDragging: false, dragIndex: -1 });
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [subImages, backgroundDimensions]);

  const updateSubImageProperty = (id: number, property: keyof SubImage, value: string | number | boolean): void => {
    setSubImages(prev => prev.map(img => 
      img.id === id ? { ...img, [property]: value } : img
    ));
  };

  const updateBackgroundProperty = (property: keyof BackgroundImage, value: string | number | boolean): void => {
    setBackgroundImage(prev => prev ? { ...prev, [property]: value } : null);
  };

  const deleteSubImage = (id: number): void => {
    setSubImages(prev => prev.filter(img => img.id !== id));
    if (selectedSubImage === id) {
      setSelectedSubImage(null);
    }
  };

  const validateSave = (): boolean => {
    if (isExIn && !backgroundImage) {
      alert('Background image is mandatory when isExIn is enabled!');
      return false;
    }
    return true;
  };

  const handleSave = (): void => {
    if (!validateSave()) return;

    const data = {
      title,
      sortOrder,
      isExIn,
      backgroundImage: backgroundImage ? {
        name: backgroundImage.name,
        aspectRatio: backgroundImage.aspectRatio,
        isExterior: backgroundImage.isExterior
      } : null,
      subImages: subImages.map(img => ({
        id: img.id,
        name: img.name,
        x: img.x,
        y: img.y,
        heightPercent: img.heightPercent,
        animation: img.animation,
        animationSpeed: img.animationSpeed,
        animationTrigger: img.animationTrigger,
        ...(isExIn ? {} : { isExterior: img.isExterior })
      }))
    };
    
    console.log('Saving data:', data);
    alert(`${mode === 'add' ? 'Project created' : 'Project updated'} successfully!`);
    onClose();
  };

  const selectedImageData = subImages.find(img => img.id === selectedSubImage);

  return (
    <div className="h-full flex">
      {/* Left Panel - Controls */}
      <div className="w-96 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Project Settings</h3>
            
            {/* Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter project title"
              />
            </div>

            {/* Sort Order */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort Order</label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1"
              />
            </div>

            {/* isExIn Toggle */}
            <div className="mb-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isExIn"
                  checked={isExIn}
                  onChange={(e) => setIsExIn(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isExIn" className="ml-2 block text-sm text-gray-700">
                  Enable Exterior/Interior Mode
                </label>
              </div>
            </div>
          </div>

          {/* Background Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Background Image {isExIn && <span className="text-red-500">*</span>}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleBackgroundUpload}
              ref={fileInputRef}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              📁 Upload Background
            </button>
            {backgroundImage && (
              <div className="mt-2 text-xs text-gray-600">
                <p>{backgroundImage.name}</p>
                {backgroundImage.aspectRatio && (
                  <p>Aspect Ratio: {backgroundImage.aspectRatio.toFixed(2)}:1</p>
                )}
              </div>
            )}

            {/* Background Type Selection */}
            {isExIn && backgroundImage && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Background Type</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="backgroundType"
                      value="exterior"
                      checked={backgroundImage.isExterior === true}
                      onChange={() => updateBackgroundProperty('isExterior', true)}
                      className="mr-2"
                    />
                    🏠 Exterior
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="backgroundType"
                      value="interior"
                      checked={backgroundImage.isExterior === false}
                      onChange={() => updateBackgroundProperty('isExterior', false)}
                      className="mr-2"
                    />
                    🏠 Interior
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Sub Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sub Images</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleSubImageUpload}
              ref={subImageInputRef}
              className="hidden"
            />
            <button
              onClick={() => subImageInputRef.current?.click()}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              ➕ Add Sub Image
            </button>

            {/* Sub Images List */}
            <div className="mt-4 space-y-2">
              {subImages.map((img) => (
                <div
                  key={img.id}
                  className={`flex items-center justify-between p-3 border rounded-md cursor-pointer ${
                    selectedSubImage === img.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedSubImage(img.id)}
                >
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{img.name}</div>
                    <div className="text-xs text-gray-500">
                      x: {Math.round(img.x)}, y: {Math.round(img.y)}, size: {img.heightPercent}%
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSubImage(img.id);
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Image Controls */}
          {selectedImageData && (
            <div className="border-t pt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-4">Edit Selected Image</h4>
              
              {!isExIn && (
                <div className="mb-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`exterior-${selectedImageData.id}`}
                      checked={selectedImageData.isExterior}
                      onChange={(e) => updateSubImageProperty(selectedImageData.id, 'isExterior', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`exterior-${selectedImageData.id}`} className="ml-2 block text-sm text-gray-700">
                      Is Exterior
                    </label>
                  </div>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size: {selectedImageData.heightPercent}%
                </label>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={selectedImageData.heightPercent}
                  onChange={(e) => updateSubImageProperty(selectedImageData.id, 'heightPercent', Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Animation</label>
                <select
                  value={selectedImageData.animation}
                  onChange={(e) => updateSubImageProperty(selectedImageData.id, 'animation', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {animationOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {selectedImageData.animation !== 'none' && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Speed</label>
                    <select
                      value={selectedImageData.animationSpeed}
                      onChange={(e) => updateSubImageProperty(selectedImageData.id, 'animationSpeed', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {speedOptions.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Trigger</label>
                    <select
                      value={selectedImageData.animationTrigger}
                      onChange={(e) => updateSubImageProperty(selectedImageData.id, 'animationTrigger', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {triggerOptions.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-6 border-t space-y-3">
            <button
              onClick={handleSave}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              💾 {mode === 'add' ? 'Create Project' : 'Update Project'}
            </button>
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel - Preview */}
      <div className="flex-1 bg-gray-50 p-6">
        <div className="h-full flex flex-col">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
          <div className="flex-1 flex items-center justify-center">
            <div
              ref={backgroundRef}
              className="relative w-full max-w-4xl border-2 border-dashed border-gray-300 rounded-lg overflow-hidden"
              style={{
                height: `${backgroundDimensions.height}px`,
                maxHeight: 'calc(100vh - 200px)',
                backgroundImage: backgroundImage ? `url(${backgroundImage.url})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: '#f9f9f9'
              }}
            >
              {!backgroundImage && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <h4 className="text-lg font-medium">Upload a background image</h4>
                    <p className="text-sm">to see the preview</p>
                  </div>
                </div>
              )}

              {subImages.map((img, index) => (
                <div
                  key={img.id}
                  onMouseDown={(e) => handleMouseDown(e, index)}
                  className={`absolute cursor-grab border-2 border-transparent rounded ${
                    selectedSubImage === img.id ? 'border-blue-500' : ''
                  }`}
                  style={{
                    left: img.x,
                    top: img.y,
                    cursor: dragState.isDragging && dragState.dragIndex === index ? 'grabbing' : 'grab'
                  }}
                >
                  <img
                    src={img.url}
                    alt={img.name}
                    style={{
                      height: `${getActualHeight(img.heightPercent)}px`,
                      width: 'auto',
                      display: 'block',
                      userSelect: 'none',
                      pointerEvents: 'none'
                    }}
                    className="rounded shadow-sm"
                  />
                  {selectedSubImage === img.id && (
                    <div className="absolute -top-6 left-0 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                      {img.name}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {backgroundImage && (
            <div className="mt-4 text-sm text-gray-600 text-center">
              Canvas: {backgroundDimensions.width} × {backgroundDimensions.height}px
              {backgroundImage.aspectRatio && ` | Ratio: ${backgroundImage.aspectRatio.toFixed(2)}:1`}
              {isExIn && backgroundImage.isExterior !== undefined && ` | Type: ${backgroundImage.isExterior ? 'Exterior' : 'Interior'}`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Drawer Component
// Updated ProjectDrawer Component with header overlap fix
const ProjectDrawer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  projectId?: number;
  currentProject?: ImageProject;
}> = ({ isOpen, onClose, mode, projectId, currentProject }) => {
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black/50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer - Fixed positioning with proper header clearance */}
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
              onClick={onClose}
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
          <ProjectDetails/>
        </div>

        {/* Footer - sticky at bottom */}
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
    </>
  );
};

const ProjectDetailsList: React.FC = () => {
  const [projects, setProjects] = useState<ImageProject[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedProjectId, setSelectedProjectId] = useState<number | undefined>(undefined);

  interface HomeImagesResponse {
    data: {
      data: ImageProject[];
    };
  }

  const { data, isPending, isSuccess } = useHomeImages("12345") as {
    data?: HomeImagesResponse;
    isPending: boolean;
    isSuccess: boolean;
  };

  useEffect(() => {
    if (isSuccess && data) {
      const projectsWithImages = (data?.data?.data as ImageProject[])?.map((project, index) => ({
        ...project,
        image: project.image || `https://images.unsplash.com/photo-${1500000000000 + index}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`,
        thumbnail: project.thumbnail || `https://images.unsplash.com/photo-${1500000000000 + index}?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80`
      })) || [];
      
      setProjects(projectsWithImages);
    }
  }, [isSuccess, data]);

  const navigate = (path: string) => {
    console.log('Navigate to:', path);
  };

  // Modal handlers
  const handleAddProject = () => {
    setModalMode('add');
    setSelectedProjectId(undefined);
    setIsModalOpen(true);
  };

  const handleEditProject = (projectId: number) => {
    setModalMode('edit');
    setSelectedProjectId(projectId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProjectId(undefined);
  };

  const handleDeleteProject = (projectId: number) => {
    const project = projects.find((p) => p.id === projectId);
    if (
      project &&
      window.confirm(`Are you sure you want to delete "${project.title}"?`)
    ) {
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
    }
  };

  const handlePreviewProject = (project: ImageProject) => {
    console.log("Preview project:", project);
    alert(`Preview: ${project.title}`);
  };

  const currentProject = selectedProjectId 
    ? projects.find(p => p.id === selectedProjectId) 
    : undefined;

  // Icons
  const AddIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );

  const EditIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );

  const DeleteIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );

  const PreviewIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );

  const ImageIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Main Images
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your main image projects 
              </p>
            </div>

            <button
              onClick={handleAddProject}
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <AddIcon />
              <span className="ml-2">Add Project Images</span>
            </button>
          </div>
        </div>

        {/* Data Grid Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sort Order
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.map((project) => (
                  <tr
                    key={project.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <img
                            className="h-12 w-12 rounded-lg object-cover border border-gray-200 shadow-sm"
                            src={project.thumbnail || project.image}
                            alt={project.title}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIGZpbGw9IiNkZGQiIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTQgMTZsNC41ODYtNC41ODZhMiAyIDAgMDEyLjgyOCAwTDE2IDE2bS0yLTJsMS41ODYtMS41ODZhMiAyIDAgMDEyLjgyOCAwTDIwIDE0bS02LTZoLjAxTTYgMjBoMTJhMiAyIDAgMDAyLTJWNmEyIDIgMCAwMC0yLTJINmEyIDIgMCAwMC0yIDJ2MTJhMiAyIDAgMDAyIDJ6Ii8+PC9zdmc+';
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {project.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {project.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {project.sortOrder}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handlePreviewProject(project)}
                          className="inline-flex items-center px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 font-medium text-sm rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        >
                          <PreviewIcon />
                          <span className="ml-1">Preview</span>
                        </button>
                        <button
                          onClick={() => handleEditProject(project.id)}
                          className="inline-flex items-center px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium text-sm rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          <EditIcon />
                          <span className="ml-1">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="inline-flex items-center px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 font-medium text-sm rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                          <DeleteIcon />
                          <span className="ml-1">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden">
            <div className="divide-y divide-gray-200">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="p-4 hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <img
                        className="h-16 w-16 rounded-lg object-cover border border-gray-200 shadow-sm"
                        src={project.thumbnail || project.image}
                        alt={project.title}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiNkZGQiIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTQgMTZsNC41ODYtNC41ODZhMiAyIDAgMDEyLjgyOCAwTDE2IDE2bS0yLTJsMS41ODYtMS41ODZhMiAyIDAgMDEyLjgyOCAwTDIwIDE0bS02LTZoLjAxTTYgMjBoMTJhMiAyIDAgMDAyLTJWNmEyIDIgMCAwMC0yLTJINmEyIDIgMCAwMC0yIDJ2MTJhMiAyIDAgMDAyIDJ6Ci8+PC9zdmc+';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {project.title}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Sort Order: {project.sortOrder} | ID: {project.id}
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => handlePreviewProject(project)}
                          className="inline-flex items-center px-2 py-1 bg-green-100 hover:bg-green-200 text-green-700 font-medium text-xs rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        >
                          <PreviewIcon />
                        </button>
                        <button
                          onClick={() => handleEditProject(project.id)}
                          className="inline-flex items-center px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium text-xs rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          <EditIcon />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="inline-flex items-center px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 font-medium text-xs rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Empty State */}
          {projects.length === 0 && !isPending && (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                <div className="mx-auto mb-4 w-12 h-12 opacity-20 flex items-center justify-center">
                  <ImageIcon />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No projects yet
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Get started by creating your first image project
                </p>
                <button
                  onClick={handleAddProject}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <AddIcon />
                  <span className="ml-2">Add Your First Project</span>
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isPending && (
            <div className="text-center py-12">
              <div className="text-gray-500">
                <div className="mx-auto mb-4 w-8 h-8 animate-spin">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500">Loading projects...</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Total Projects: {projects.length}
        </div>
      </div>

      {/* Project Drawer */}
      <ProjectDrawer
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        mode={modalMode}
        projectId={selectedProjectId}
        currentProject={currentProject}
      />
    </div>
  );
};

export default ProjectDetailsList;