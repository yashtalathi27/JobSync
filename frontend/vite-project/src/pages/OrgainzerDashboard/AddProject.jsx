import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

// Selection Modal component remains unchanged
const SelectionModal = ({ isOpen, title, options, onSelect, onClose }) => {
  const [searchId, setSearchId] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);

  useEffect(() => {
    if (searchId.trim() === "") {
      setFilteredOptions(options);
    } else {
      setFilteredOptions(
        options.filter((option) => 
          option.id.toLowerCase().includes(searchId.toLowerCase())
        )
      );
    }
  }, [searchId, options]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Search by ID */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="search-id">
            Search by ID
          </label>
          <input
            id="search-id"
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Enter ID..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredOptions.map((option) => (
            <div
              key={option._id}
              className="border rounded-lg p-4 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all"
              onClick={() => {
                onSelect(option);
                onClose();
              }}
            >
              <div className="flex justify-between">
                <h3 className="font-medium text-lg">{option.name}</h3>
                <span className="text-gray-500 text-sm font-mono">ID: {option.id}</span>
              </div>
              {option.specialization && (
                <p className="text-gray-700">{option.specialization}</p>
              )}
              {option.hourlyRate && (
                <p className="text-gray-600">${option.hourlyRate}/hr</p>
              )}
              {option.department && (
                <p className="text-gray-700">{option.department}</p>
              )}
              {option.position && (
                <p className="text-gray-600">{option.position}</p>
              )}
              {option.availability && (
                <p className="mt-1 text-sm text-green-600">{option.availability}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function CreateProject() {
  const navigate = useNavigate();
  const [freelancers, setFreelancers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [checkpoints, setCheckpoints] = useState([
    { title: "", description: "", amount: "", completionDate: new Date() },
  ]);

  // State for modals
  const [showFreelancerModal, setShowFreelancerModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const orgDetails = JSON.parse(localStorage.getItem("orgDetails") || "{}");
  const organization = orgDetails.code || "";
  console.log(organization);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    freelancer: "",
    employee: "",
    budget: "",
    deadline: new Date(),
    organization: organization,
  });

  // Debug: Log form data changes
  useEffect(() => {
    console.log("FormData updated:", formData);
    console.log("Button should be enabled:", !!(formData.freelancer && formData.employee));
  }, [formData]);

  // Fetch freelancers and employees data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch freelancers
        const freelancersResponse = await axios.get("http://localhost:5000/api/freelancer/all");
        const freelancersData = freelancersResponse.data.map(freelancer => ({
          _id: freelancer._id,
          id: freelancer.freelancerId || freelancer._id,
          name: freelancer.name || 'Name not provided',
          specialization: freelancer.skills?.join(', ') || 'Skills not specified',
          hourlyRate: 40, // Default rate - could be added to schema later
          availability: freelancer.availability ? "Available" : "Busy",
          email: freelancer.email,
          address: freelancer.address,
          experience: freelancer.pastExperience
        }));
        setFreelancers(freelancersData);

        // Fetch employees for the organization
        if (organization) {
          const employeesResponse = await axios.get(`http://localhost:5000/api/employee/all/${organization}`);
          const employeesData = employeesResponse.data.map(employee => ({
            _id: employee._id,
            id: employee._id, // Using MongoDB _id as display ID
            name: employee.name,
            department: employee.department,
            position: employee.description || 'Position not specified',
            availability: "Available", // Default - could be tracked separately
            email: employee.workEmail,
            joiningDate: employee.joiningDate
          }));
          setEmployees(employeesData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // Fallback to empty arrays if API fails
        setFreelancers([]);
        setEmployees([]);
        alert("Failed to load freelancers and employees. Please check your connection and try again.");
      }
    };

    fetchData();
  }, [organization]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckpointChange = (index, field, value) => {
    const updatedCheckpoints = [...checkpoints];
    updatedCheckpoints[index][field] = value;
    setCheckpoints(updatedCheckpoints);
  };

  const addCheckpoint = () => {
    setCheckpoints([
      ...checkpoints,
      { title: "", description: "", amount: "", completionDate: new Date() },
    ]);
  };

  const removeCheckpoint = (index) => {
    const updatedCheckpoints = checkpoints.filter((_, i) => i !== index);
    setCheckpoints(updatedCheckpoints);
  };

  const handleFreelancerSelect = (freelancer) => {
    console.log("Freelancer selected:", freelancer);
    setFormData(prev => ({ 
      ...prev, 
      freelancer: freelancer._id,
      freelancerName: freelancer.name,
      freelancerId: freelancer.id,
      freelancerSpecialization: freelancer.specialization,
      freelancerRate: freelancer.hourlyRate
    }));
  };

  const handleEmployeeSelect = (employee) => {
    console.log("Employee selected:", employee);
    setFormData(prev => ({ 
      ...prev, 
      employee: employee._id,
      employeeName: employee.name,
      employeeId: employee.id,
      employeeDepartment: employee.department,
      employeePosition: employee.position 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("Form submitted! Current form data:", formData);
    console.log("Checkpoints:", checkpoints);
    
    // Validate required fields
    if (!formData.freelancer) {
      alert("Please select a freelancer");
      return;
    }
    
    // if (!formData.employee) {
    //   alert("Please select an employee");
    //   return;
    // }
    
    if (!formData.name.trim()) {
      alert("Please enter a project name");
      return;
    }
    
    if (!formData.description.trim()) {
      alert("Please enter a project description");
      return;
    }
    
    if (!formData.budget || Number(formData.budget) <= 0) {
      alert("Please enter a valid budget amount");
      return;
    }
    
    // Calculate total checkpoint amounts to ensure they match budget
    const totalCheckpointAmount = checkpoints.reduce(
      (sum, checkpoint) => sum + Number(checkpoint.amount || 0),
      0
    );
    
    if (totalCheckpointAmount !== Number(formData.budget)) {
      alert(`Total checkpoint amounts (${totalCheckpointAmount}) must equal the project budget (${formData.budget})`);
      return;
    }
    
    // Validate that all checkpoints have required fields
    for (let i = 0; i < checkpoints.length; i++) {
      const checkpoint = checkpoints[i];
      if (!checkpoint.title.trim()) {
        alert(`Please enter a title for checkpoint ${i + 1}`);
        return;
      }
      if (!checkpoint.amount || Number(checkpoint.amount) <= 0) {
        alert(`Please enter a valid amount for checkpoint ${i + 1}`);
        return;
      }
    }
    
    // Create final project object
    const projectData = {
      ...formData,
      checkpoints: checkpoints.map(checkpoint => ({
        ...checkpoint,
        amount: Number(checkpoint.amount),
        completed: false
      }))
    };

    console.log("Submitting project:", projectData);
    
    try {
      const res = await axios.post("http://localhost:5000/api/organization/createProject", { projectData }); 
      console.log("Project created successfully:", res.data);
      
      if (res.data.success) {
        alert("Project created successfully!");
        // Navigate back to admin dashboard
        navigate("/admin/dashboard/");
      } else {
        alert("Failed to create project. Please try again.");
      }
    } catch (error) {
      console.error("Error creating project:", error);
      
      if (error.response?.data?.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert("Failed to create project. Please check your internet connection and try again.");
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Create New Project</h1>
        
        {/* Resource Selection Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Resource Selection</h2>
          <p className="mb-4 text-gray-600">Each project requires both a freelancer and an internal employee.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Freelancer Selection Card */}
            <div className="border rounded-lg p-4 hover:border-blue-300 transition-all">
              <h3 className="text-lg font-medium mb-2">Freelancer</h3>
              <p className="text-gray-600 mb-4">Select a freelancer who will work on this project</p>
              
              {formData.freelancer ? (
                <div className="p-3 border border-blue-200 bg-blue-50 rounded-lg mb-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{formData.freelancerName} <span className="text-gray-500 text-sm">({formData.freelancerId})</span></h4>
                      <p className="text-sm text-gray-600">{formData.freelancerSpecialization} • ${formData.freelancerRate}/hr</p>
                    </div>
                    <button 
                      onClick={() => setShowFreelancerModal(true)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Change
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowFreelancerModal(true)}
                  className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                >
                  Select Freelancer
                </button>
              )}
            </div>
            
            {/* Employee Selection Card */}
            <div className="border rounded-lg p-4 hover:border-blue-300 transition-all">
              <h3 className="text-lg font-medium mb-2">Internal Employee</h3>
              <p className="text-gray-600 mb-4">Select an internal employee to oversee this project</p>
              
              {formData.employee ? (
                <div className="p-3 border border-blue-200 bg-blue-50 rounded-lg mb-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{formData.employeeName} <span className="text-gray-500 text-sm">({formData.employeeId})</span></h4>
                      <p className="text-sm text-gray-600">{formData.employeeDepartment} • {formData.employeePosition}</p>
                    </div>
                    <button 
                      onClick={() => setShowEmployeeModal(true)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Change
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowEmployeeModal(true)}
                  className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                >
                  Select Employee
                </button>
              )}
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* Basic Project Details */}
          <div className="mb-6 grid grid-cols-1 gap-6">
            <h2 className="text-lg font-semibold col-span-full">Project Details</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              ></textarea>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Budget ($)
                </label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deadline
                </label>
                <DatePicker
                  selected={formData.deadline}
                  onChange={(date) => setFormData({ ...formData, deadline: date })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  minDate={new Date()}
                  required
                />
              </div>
            </div>
          </div>
          
          {/* Checkpoints Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">Project Checkpoints</h2>
              <button
                type="button"
                onClick={addCheckpoint}
                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              >
                Add Checkpoint
              </button>
            </div>
            
            {checkpoints.map((checkpoint, index) => (
              <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium">Checkpoint {index + 1}</h3>
                  {checkpoints.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCheckpoint(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={checkpoint.title}
                      onChange={(e) => handleCheckpointChange(index, "title", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount ($)
                    </label>
                    <input
                      type="number"
                      value={checkpoint.amount}
                      onChange={(e) => handleCheckpointChange(index, "amount", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={checkpoint.description}
                      onChange={(e) => handleCheckpointChange(index, "description", e.target.value)}
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expected Completion Date
                    </label>
                    <DatePicker
                      selected={checkpoint.completionDate}
                      onChange={(date) => handleCheckpointChange(index, "completionDate", date)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      minDate={new Date()}
                    />
                  </div>
                </div>
              </div>
            ))}
            
            {formData.budget && checkpoints.length > 0 && (
              <div className="mt-2 text-sm">
                <span className="font-medium">Budget allocation:</span>{" "}
                ${checkpoints.reduce((sum, cp) => sum + Number(cp.amount || 0), 0)} of ${formData.budget} allocated
              </div>
            )}
            
          </div>
         {/* Submit Buttons */}
          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              disabled={false}
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
      
      {/* Freelancer Selection Modal */}
      <SelectionModal
        isOpen={showFreelancerModal}
        title="Select a Freelancer"
        options={freelancers}
        onSelect={handleFreelancerSelect}
        onClose={() => setShowFreelancerModal(false)}
      />
      
      {/* Employee Selection Modal */}
      <SelectionModal
        isOpen={showEmployeeModal}
        title="Select an Employee"
        options={employees}
        onSelect={handleEmployeeSelect}
        onClose={() => setShowEmployeeModal(false)}
      />
    </div>
  );
}