import React, { useEffect, useState } from 'react';
import { useSavePadding } from '../../../api/webSettings/useSavePadding';
import { useNotification } from '../../../components/Tostr';
import { useGetPadding } from '../../../api/webSettings/useGetPadding';
import { useProjectList } from '../../../api/useProjectistList';

interface PaddingData {
  paddingLeft: number;
  paddingRight: number;
  paddingBottom: number;
  paddingTop: number;
}

interface ImageElement {
  projectId: number;
  name: string;
  projectImageUrl: string;
  x: number;
  y: number;
  heightPercent: number;
  animation: string;
  animationSpeed: string;
  animationTrigger: string;
  isExterior?: boolean;
  id: number;
}


const PaddingAdjuster: React.FC = () => {
  const [projects, setProjects] = useState<ImageElement[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  
  const [padding, setPadding] = useState<PaddingData>({
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingTop: 0
  });

  // Project list API
  const { data, isPending, isSuccess } = useProjectList();

  // Handle project list success
  useEffect(() => {
    if (data && data.data && data.data?.length > 0 && isSuccess) {
      setProjects(data.data);
    }
  }, [isSuccess, data]);

  // Padding API
  const { data: paddingData } = useGetPadding();
  useEffect(() => {
    if (paddingData?.data) {
      setPadding(paddingData.data);
    }
  }, [paddingData]);

  const { showNotification } = useNotification();
  const { mutate: addOrUpdatePadding, isPending: isSaving } = useSavePadding();

  const handleProjectSelect = (projectId: number) => {
    if (projectId === 0) {
      setSelectedProjectId(null);
      console.log('No project selected');
    } else {
      const id =projectId||0
      setSelectedProjectId(id);
      console.log('Selected project ID:', id);
      // In the future, you can pass this id to your get API here
    }
  };

  const handlePaddingChange = (key: keyof PaddingData, value: number) => {
    console.log(`Changing ${key} to ${value}`);
    setPadding(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    console.log('Adjusted padding:', padding);
    console.log('For project ID:', selectedProjectId);
    
    await addOrUpdatePadding(padding, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onSuccess: (res: any) => {
        if (res?.isSuccess) {
          showNotification("Padding saved successfully!", "success", "Success");
        } else {
          showNotification(
            res?.message || "Failed to save Padding",
            "error",
            "Error"
          );
        }
      },
    });
  };

  const handleSetDefault = () => {
    setPadding({
      paddingLeft: 0,
      paddingRight: 0,
      paddingBottom: 0,
      paddingTop: 0
    });
  };

  const sliderFields: { key: keyof PaddingData; label: string; icon: string; color: string }[] = [
    { key: 'paddingRight', label: 'Right Padding', icon: '→', color: 'bg-blue-500' },
    { key: 'paddingLeft', label: 'Left Padding', icon: '←', color: 'bg-purple-500' }
  ];

  return (
    <>
      <style>{`
        .custom-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 8px;
          border-radius: 4px;
          background: #d1d5db;
          outline: none;
          opacity: 0.7;
          transition: opacity 0.2s;
        }

        .custom-slider:hover {
          opacity: 1;
        }

        .custom-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
        }

        .custom-slider::-webkit-slider-thumb:hover {
          background: #2563eb;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
        }

        .custom-slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
        }

        .custom-slider::-moz-range-track {
          width: 100%;
          height: 8px;
          cursor: pointer;
          background: #d1d5db;
          border-radius: 4px;
          border: none;
        }

        .custom-slider:focus::-webkit-slider-thumb {
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
        }
      `}</style>
      
      <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Project Padding Settings</h2>

        {/* Project Selection */}
        <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Select Project</h3>
          
          <div className="flex items-center space-x-4">
            <label htmlFor="project-select" className="text-sm font-medium text-gray-700">
              Choose Project:
            </label>
            
            <select
              id="project-select"
              value={selectedProjectId || 'none'}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(e) => handleProjectSelect(e.target.value as any)}
              className="flex-1 max-w-md px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              disabled={isPending}
            >
              <option value="none">-- Select a Project --</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name} (ID: {project.projectId})
                </option>
              ))}
            </select>

            {isPending && (
              <div className="text-sm text-gray-500">Loading projects...</div>
            )}
          </div>

          {selectedProjectId && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm text-blue-700">
                <strong>Selected Project:</strong> {projects.find(p => p.id === selectedProjectId)?.name} 
                <span className="ml-2 text-blue-600">(ID: {selectedProjectId})</span>
              </div>
            </div>
          )}
        </div>

        {/* Padding Adjuster - Only visible when project is selected */}
        {selectedProjectId && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Controls Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-6">Adjust Padding with Sliders</h3>

              {/* Padding Sliders */}
              {sliderFields.map(({ key, label, icon }) => (
                <div key={key} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <span className="mr-2 text-lg">{icon}</span>
                      {label}
                    </label>
                    <div className="text-lg font-bold text-blue-600 min-w-16 text-right">
                      {padding[key]}px
                    </div>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={padding[key]}
                    onChange={(e) => handlePaddingChange(key, parseInt(e.target.value, 10))}
                    className="custom-slider"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1 px-1">
                    <span>0</span>
                    <span>25</span>
                    <span>50</span>
                    <span>75</span>
                    <span>100</span>
                  </div>
                </div>
              ))}

              {/* Padding Values Summary */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl shadow-inner">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Current Padding Values</h4>
                <div className="grid grid-cols-2 gap-3">
                  {sliderFields.map(({ key, label, color }) => (
                    <div key={key} className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${color}`}></div>
                      <span className="text-sm text-gray-600">{label.split(' ')[0]}:</span>
                      <span className="text-sm font-medium text-gray-800">{padding[key]}px</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200"
                >
                  {isSaving ? '💾 Saving...' : '💾 Save Changes'}
                </button>
                <button
                  onClick={handleSetDefault}
                  disabled={isSaving}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200"
                >
                  🔄 Reset to Zero
                </button>
              </div>
            </div>

            {/* Live Preview */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">Live Preview</h3>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-xl shadow-inner min-h-[600px]">
                <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg min-h-[550px] flex items-center justify-center relative overflow-hidden">
                  <div
                    className="bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-blue-300 rounded-lg min-w-48 min-h-48 flex items-center justify-center transition-all duration-200 ease-out relative"
                    style={{
                      paddingTop: `${padding.paddingTop}px`,
                      paddingRight: `${padding.paddingRight}px`,
                      paddingBottom: `${padding.paddingBottom}px`,
                      paddingLeft: `${padding.paddingLeft}px`
                    }}
                  >
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-lg text-lg font-medium shadow-lg text-center">
                      {projects.find(p => p.id === selectedProjectId)?.name}
                      <div className="text-sm opacity-80 mt-1">Padding Preview</div>
                    </div>

                    {/* Padding Visual Overlays */}
                    {padding.paddingTop > 0 && (
                      <div
                        className="absolute top-0 left-0 right-0 bg-red-400 bg-opacity-30 flex items-center justify-center text-red-700 text-xs font-semibold"
                        style={{ height: `${padding.paddingTop}px` }}
                      >
                        {padding.paddingTop > 15 && `Top: ${padding.paddingTop}px`}
                      </div>
                    )}
                    {padding.paddingRight > 0 && (
                      <div
                        className="absolute top-0 right-0 bottom-0 bg-blue-400 bg-opacity-30 flex items-center justify-center text-blue-700 text-xs font-semibold"
                        style={{ width: `${padding.paddingRight}px` }}
                      >
                        {padding.paddingRight > 15 && (
                          <span className="transform rotate-90 whitespace-nowrap">
                            Right: {padding.paddingRight}px
                          </span>
                        )}
                      </div>
                    )}
                    {padding.paddingBottom > 0 && (
                      <div
                        className="absolute bottom-0 left-0 right-0 bg-green-400 bg-opacity-30 flex items-center justify-center text-green-700 text-xs font-semibold"
                        style={{ height: `${padding.paddingBottom}px` }}
                      >
                        {padding.paddingBottom > 15 && `Bottom: ${padding.paddingBottom}px`}
                      </div>
                    )}
                    {padding.paddingLeft > 0 && (
                      <div
                        className="absolute top-0 left-0 bottom-0 bg-purple-400 bg-opacity-30 flex items-center justify-center text-purple-700 text-xs font-semibold"
                        style={{ width: `${padding.paddingLeft}px` }}
                      >
                        {padding.paddingLeft > 15 && (
                          <span className="transform -rotate-90 whitespace-nowrap">
                            Left: {padding.paddingLeft}px
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-4 text-center text-sm text-gray-600">
                  Total Padding: {padding.paddingTop + padding.paddingRight + padding.paddingBottom + padding.paddingLeft}px
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Project Selected Message */}
        {!selectedProjectId && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">No Project Selected</h3>
            <p className="text-gray-500">Please select a project from the dropdown above to configure its padding settings.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default PaddingAdjuster;