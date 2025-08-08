import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHomeImages } from "../../../api/useHomeImages";
import { useContainerList } from "../../../api/useContainerList";

interface ImageProject {
  id: number;
  title: string;
  sortOrder: number;
  image?: string; // Optional image URL
  thumbnail?: string; // Optional thumbnail URL
}

const ProjectListPage: React.FC = () => {
  // Initialize as empty array instead of undefined
  const [projects, setProjects] = useState<ImageProject[]>([]);

  // Define the expected API response type
  interface HomeImagesResponse {
    data: {
      data: ImageProject[];
    };
  }

  const { data, isPending, isSuccess } = useContainerList() as {
    data?: HomeImagesResponse;
    isPending: boolean;
    isSuccess: boolean;
  };

  console.log("Home Images Data:", data, "Loading:", isPending);

  // Handle success in useEffect
  useEffect(() => {
    if (isSuccess && data) {
      // Add mock images to the projects if they don't have them
      const projectsWithImages = (data?.data?.data as ImageProject[])?.map((project, index) => ({
        ...project,
        // Add mock images if not present (replace with your actual image URLs)
        image: project.image || `https://images.unsplash.com/photo-${1500000000000 + index}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`,
        thumbnail: project.thumbnail || `https://images.unsplash.com/photo-${1500000000000 + index}?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80`
      })) || [];
      
      setProjects(projectsWithImages);
      // Handle your success logic here
    }
  }, [isSuccess, data]);

  console.log("Home Images:", projects, "Loading:", isPending);

  const navigate = useNavigate();

  // Navigation handlers (in real app, these would use router)
  const handleAddProject = () => {
    // Navigate to /project/add or similar
    console.log("Navigate to add project form");
    alert("Navigate to Add Project Page");
    navigate("/admin/sub_projects"); // Example navigation
  };

  const handleEditProject = (projectId: number) => {
    // Navigate to /project/edit/:id
    console.log("Navigate to edit project:", projectId);
    alert(`Navigate to Edit Project Page - ID: ${projectId}`);
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

  // MUI-style icons as SVG components
  const AddIcon = () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4v16m8-8H4"
      />
    </svg>
  );

  const EditIcon = () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </svg>
  );

  const DeleteIcon = () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
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
                Home page Images
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your image projects and configurations
              </p>
            </div>

            {/* Add Button */}
            <button
              onClick={handleAddProject}
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <AddIcon />
              <span className="ml-2">Add Project</span>
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
                        {/* <button
                          onClick={() => handlePreviewProject(project)}
                          className="inline-flex items-center px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 font-medium text-sm rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        >
                          <PreviewIcon />
                          <span className="ml-1">Preview</span>
                        </button> */}
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
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiNkZGQiIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTQgMTZsNC41ODYtNC41ODZhMiAyIDAgMDEyLjgyOCAwTDE2IDE2bS0yLTJsMS41ODYtMS41ODZhMiAyIDAgMDEyLjgyOCAwTDIwIDE0bS02LTZoLjAxTTYgMjBoMTJhMiAyIDAgMDAyLTJWNmEyIDIgMCAwMC0yLTJINmEyIDIgMCAwMC0yIDJ2MTJhMiAyIDAgMDAyIDJ6Ii8+PC9zdmc+';
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
    </div>
  );
};

export default ProjectListPage;