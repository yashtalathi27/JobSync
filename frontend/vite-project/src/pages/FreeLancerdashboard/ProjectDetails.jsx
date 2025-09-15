import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import ChatBox from "../../components/ChatBox";
import Progress from "../../components/ui/Progress";

export default function ProjectDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [project, setProject] = useState(location.state?.project || null);
  const [loading, setLoading] = useState(!project);
  const [error, setError] = useState(null);
  const [submittedFiles, setSubmittedFiles] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [updatingCheckpoint, setUpdatingCheckpoint] = useState(null);

  // Fetch project details if not passed via state
  useEffect(() => {
    if (!project && id) {
      fetchProjectDetails();
    }
  }, [id, project]);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`http://localhost:5000/api/freelancer/project/${id}`);
      setProject(response.data);
    } catch (error) {
      console.error("Error fetching project details:", error);
      setError("Failed to load project details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = () => {
    if (!project?.checkpoints || project.checkpoints.length === 0) return 0;
    const completedCheckpoints = project.checkpoints.filter(cp => cp.completed).length;
    return Math.round((completedCheckpoints / project.checkpoints.length) * 100);
  };

  const calculateEarnings = () => {
    if (!project?.checkpoints) return 0;
    return project.checkpoints
      .filter(cp => cp.completed)
      .reduce((sum, cp) => sum + (cp.amount || 0), 0);
  };

  const handleCheckpointToggle = async (checkpointIndex, completed) => {
    try {
      setUpdatingCheckpoint(checkpointIndex);
      
      const response = await axios.put(
        `http://localhost:5000/api/freelancer/project/${id}/checkpoint/${checkpointIndex}`,
        { completed }
      );
      
      if (response.data.project) {
        setProject(response.data.project);
      }
    } catch (error) {
      console.error("Error updating checkpoint:", error);
      alert("Failed to update checkpoint. Please try again.");
    } finally {
      setUpdatingCheckpoint(null);
    }
  };

  const handleFileSubmit = (files) => {
    const newFiles = Array.from(files).map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date(),
      url: URL.createObjectURL(file) // In real app, this would be uploaded to server
    }));
    setSubmittedFiles(prev => [...prev, ...newFiles]);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    if (status) return 'bg-green-100 text-green-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const getStatusText = (status) => {
    return status ? 'Completed' : 'In Progress';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-center mt-4 text-gray-600">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
          <div className="text-red-500 text-center mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-bold">Error</h2>
            <p className="text-gray-600 mt-2">{error}</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={fetchProjectDetails}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Retry
            </button>
            <button 
              onClick={() => navigate(-1)}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-gray-600">Project not found.</p>
          <button 
            onClick={() => navigate(-1)}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{project.name || 'Untitled Project'}</h1>
                <p className="text-gray-600">Project ID: {project._id}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                {getStatusText(project.status)}
              </span>
              <div className="text-right">
                <p className="text-lg font-bold text-green-600">${calculateEarnings()}</p>
                <p className="text-sm text-gray-500">Earned</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6">
          <nav className="flex space-x-8">
            {['overview', 'checkpoints', 'files', 'chat'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Project Description</h2>
                <p className="text-gray-700 leading-relaxed">
                  {project.description || 'No description provided for this project.'}
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Project Progress</h2>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                    <span className="text-sm font-medium text-gray-700">{calculateProgress()}%</span>
                  </div>
                  <Progress value={calculateProgress()} checkpoints={project.checkpoints} />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Completed Checkpoints:</span>
                    <span className="ml-2 font-medium">{project.completed_checkpoints || 0} / {project.total_checkpoints}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Budget:</span>
                    <span className="ml-2 font-medium">${project.budget || 'Not specified'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold mb-4">Project Details</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-500">Deadline:</span>
                    <p className="font-medium">{formatDate(project.deadline)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Organization:</span>
                    <p className="font-medium">{project.organization || 'Not specified'}</p>
                  </div>
                  {project.freelancerDetails && (
                    <div>
                      <span className="text-gray-500">Freelancer:</span>
                      <p className="font-medium">{project.freelancerDetails.name}</p>
                      <p className="text-xs text-gray-400">{project.freelancerDetails.email}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold mb-4">Quick Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Created:</span>
                    <span className="font-medium">{formatDate(project.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Earnings:</span>
                    <span className="font-medium text-green-600">${calculateEarnings()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Remaining:</span>
                    <span className="font-medium">${(project.budget || 0) - calculateEarnings()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'checkpoints' && (
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">Project Checkpoints</h2>
              <p className="text-gray-600 mt-1">Track your progress and mark completed milestones</p>
            </div>
            <div className="p-6">
              {project.checkpoints && project.checkpoints.length > 0 ? (
                <div className="space-y-4">
                  {project.checkpoints.map((checkpoint, index) => (
                    <div 
                      key={index} 
                      className={`border rounded-lg p-4 transition-all ${
                        checkpoint.completed 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleCheckpointToggle(index, !checkpoint.completed)}
                              disabled={updatingCheckpoint === index}
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                checkpoint.completed
                                  ? 'bg-green-500 border-green-500 text-white'
                                  : 'border-gray-300 hover:border-green-400'
                              } ${updatingCheckpoint === index ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                              {updatingCheckpoint === index ? (
                                <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                checkpoint.completed && (
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                )
                              )}
                            </button>
                            <div>
                              <h3 className={`font-medium ${checkpoint.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                {checkpoint.title || `Checkpoint ${index + 1}`}
                              </h3>
                              <p className={`text-sm mt-1 ${checkpoint.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                                {checkpoint.description || 'No description provided'}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${checkpoint.completed ? 'text-green-600' : 'text-gray-900'}`}>
                            ${checkpoint.amount || 0}
                          </p>
                          <p className="text-xs text-gray-500">
                            Due: {formatDate(checkpoint.completionDate)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p>No checkpoints defined for this project</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'files' && (
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">File Submissions</h2>
              <p className="text-gray-600 mt-1">Upload and manage your project deliverables</p>
            </div>
            <div className="p-6 space-y-6">
              {/* File Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleFileSubmit(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-lg font-medium text-gray-900">Drop files here or click to upload</p>
                  <p className="text-gray-500 mt-1">Supports multiple file types</p>
                </label>
              </div>

              {/* Submitted Files */}
              {submittedFiles.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Submitted Files</h3>
                  <div className="space-y-2">
                    {submittedFiles.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB • Uploaded {file.uploadedAt.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800">
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">Project Communication</h2>
              <p className="text-gray-600 mt-1">Chat with the project organizer and team</p>
            </div>
            <div className="p-6">
              <ChatBox 
                userName={project.freelancerDetails?.name || "Freelancer"} 
                role="freelancer" 
                projectId={project._id}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
