import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProjectList } from "../../../api/useProjectistList";

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
  isExterior?: boolean; // Optional property to indicate if it's exterior or interior
}

const ImageElementListPage: React.FC = () => {
  const [projects, setProjects] = useState<ImageElement[]>([]);
  const { data, isPending, isSuccess } = useProjectList();
    // Handle success in useEffect
    useEffect(() => {
      if (data && data.data && data.data?.length > 0 && isSuccess) {
        // Add mock images to the projects if they don't have them
        console.log(70, data.data, "Loading:", isPending);
  
        setProjects(data.data);
        // Handle your success logic here
      }
    }, [isSuccess, data]);

    console.log(80, projects, "Loading:", isPending);

  const navigate = useNavigate();

  const handleAddElement = () => {
    console.log("Navigate to add image element form");
    alert("Navigate to Add Image Element Page");
    navigate("/admin/image_elements/add");
  };

  const handleEditElement = (elementId: number) => {
    console.log("Navigate to edit image element:", elementId);
    alert(`Navigate to Edit Image Element Page - ID: ${elementId}`);
    navigate(`/admin/image_elements/edit/${elementId}`);
  };

  const handleDeleteElement = (elementId: number) => {
    const element = projects?.find((e) => e.id === elementId);
    if (
      element &&
      window.confirm(`Are you sure you want to delete "${element.name}"?`)
    ) {
      setProjects((prev) => prev.filter((e) => e.id !== elementId));
    }
  };

  const handlePreviewElement = (element: ImageElement) => {
    console.log("Preview element:", element);
    navigate(`/admin/projects/${element.projectId}?isExIn=${element.isExterior}`);
  };

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
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );

  const getAnimationBadgeColor = (animation: string) => {
    const colors: { [key: string]: string } = {
      fadeInDown: "bg-blue-100 text-blue-800",
      slideInRight: "bg-green-100 text-green-800",
      bounceIn: "bg-purple-100 text-purple-800",
      fadeIn: "bg-gray-100 text-gray-800",
      slideInLeft: "bg-orange-100 text-orange-800",
      zoomIn: "bg-pink-100 text-pink-800"
    };
    return colors[animation] || "bg-gray-100 text-gray-800";
  };

  const getSpeedBadgeColor = (speed: string) => {
    const colors: { [key: string]: string } = {
      fast: "bg-red-100 text-red-800",
      normal: "bg-yellow-100 text-yellow-800",
      slow: "bg-green-100 text-green-800"
    };
    return colors[speed] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Image Elements
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage image elements with positioning and animations
            </p>
          </div>
          
          {/* <button
            onClick={handleAddElement}
            className="flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <AddIcon />
            <span className="ml-2">Add Element</span>
          </button> */}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Desktop Table View with Horizontal Scrolling */}
          <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200" style={{ minWidth: '1000px' }}>
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Element
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Have Exterior/Interior
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Animation
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ minWidth: '200px' }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {projects?.map((element) => (
                    <tr key={element.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <img
                              className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                              src={element.projectImageUrl}
                              alt={element.name}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIGZpbGw9IiNkZGQiIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTQgMTZsNC41ODYtNC41ODZhMiAyIDAgMDEyLjgyOCAwTDE2IDE2bS0yLTJsMS41ODYtMS41ODZhMiAyIDAgMDEyLjgyOCAwTDIwIDE0bS02LTZoLjAxTTYgMjBoMTJhMiAyIDAgMDAyLTJWNmEyIDIgMCAwMC0yLTJINmEyIDIgMCAwMC0yIDJ2MTJhMiAyIDAgMDAyIDJ6Ii8+PC9zdmc+';
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {element.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {!element.isExterior ? 'false' : 'true'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          X: {element.x}%, Y: {element.y}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {element.heightPercent}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAnimationBadgeColor(element.animation)}`}>
                            {element.animation}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSpeedBadgeColor(element.animationSpeed)}`}>
                            {element.animationSpeed}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {element.animationTrigger}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handlePreviewElement(element)}
                            className="inline-flex items-center px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 font-medium text-sm rounded-md transition-colors duration-200"
                          >
                            <PreviewIcon />
                            <span className="ml-1">Preview</span>
                          </button>
                          {/* <button
                            onClick={() => handleEditElement(element.id)}
                            className="inline-flex items-center px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium text-sm rounded-md transition-colors duration-200"
                          >
                            <EditIcon />
                            <span className="ml-1">Edit</span>
                          </button> */}
                          {/* <button
                            onClick={() => handleDeleteElement(element.id)}
                            className="inline-flex items-center px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 font-medium text-sm rounded-md transition-colors duration-200"
                          >
                            <DeleteIcon />
                            <span className="ml-1">Delete</span>
                          </button> */}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile & Tablet Card View */}
          <div className="lg:hidden space-y-4">
            {projects?.map((element) => (
              <div key={element.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Card Header */}
                <div className="p-4 sm:p-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <img
                        className="h-20 w-20 sm:h-24 sm:w-24 rounded-lg object-cover border border-gray-200"
                        src={element.projectImageUrl}
                        alt={element.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIGZpbGw9IiNkZGQiIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTQgMTZsNC41ODYtNC41ODZhMiAyIDAgMDEyLjgyOCAwTDE2IDE2bS0yLTJsMS41ODYtMS41ODZhMiAyIDAgMDEyLjgyOCAwTDIwIDE0bS02LTZoLjAxTTYgMjBoMTJhMiAyIDAgMDAyLTJWNmEyIDIgMCAwMC0yLTJINmEyIDIgMCAwMC0yIDJ2MTJhMiAyIDAgMDAyIDJ6Ii8+PC9zdmc+';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                        {element.name}
                      </h3>
                      
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="px-4 sm:px-6 pb-4">
                  {/* Position & Size */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Position
                      </div>
                      <div className="mt-1 text-sm sm:text-base font-semibold text-gray-900">
                        X: {element.x}%, Y: {element.y}%
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Size
                      </div>
                      <div className="mt-1 text-sm sm:text-base font-semibold text-gray-900">
                        {element.heightPercent}%
                      </div>
                    </div>
                  </div>

                  {/* Animation Badges */}
                  <div className="mb-6">
                    <div className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                      Animation Settings
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${getAnimationBadgeColor(element.animation)}`}>
                        {element.animation}
                      </span>
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${getSpeedBadgeColor(element.animationSpeed)}`}>
                        Speed: {element.animationSpeed}
                      </span>
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                        Trigger: {element.animationTrigger}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <button
                      onClick={() => handlePreviewElement(element)}
                      className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      <PreviewIcon />
                      <span className="ml-2">Preview</span>
                    </button>
                    {/* <button
                      onClick={() => handleEditElement(element.id)}
                      className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <EditIcon />
                      <span className="ml-2">Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteElement(element.id)}
                      className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      <DeleteIcon />
                      <span className="ml-2">Delete</span>
                    </button> */}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {projects?.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 text-center py-12 px-4">
              <div className="text-gray-500">
                <div className="mx-auto mb-4 w-20 h-20 opacity-20 flex items-center justify-center">
                  <ImageIcon />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No image elements yet
                </h3>
                <p className="text-base text-gray-500 mb-8 max-w-md mx-auto">
                  Get started by adding your first image element to begin managing your visual content
                </p>
                <button
                  onClick={handleAddElement}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium text-lg rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <AddIcon />
                  <span className="ml-2">Add Your First Element</span>
                </button>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
              <span className="text-sm text-gray-500">
                Total Elements: <span className="font-semibold text-gray-900">{projects?.length}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageElementListPage;