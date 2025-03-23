import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function EmployeeRegistration() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if user came from verification
  useEffect(() => {
    // If no verification data, redirect to verification page
    if (!location.state?.verified) {
      navigate("/employee/verify");
    }
  }, [location, navigate]);
  
  // Form States
  const [formData, setFormData] = useState({
    name: "",
    workEmail: "",
    password: "",
    confirmPassword: "",
    department: "",
    description: "",
    profilePicture: "",
    joiningDate: new Date().toISOString().split('T')[0], // Current date as default
    // Pre-fill from verification
    requestCode: location.state?.orgCode || "",
    orgName: location.state?.orgName || "",
    employeeId: location.state?.employeeId || ""
  });
  
  // UI States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };
  
  // Handle file change for profile picture
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // You would normally upload the file to a server here
      // For now, we'll just store the file name
      setFormData({
        ...formData,
        profilePicture: file.name
      });
    }
  };
  
  // Validate the form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }
    
    if (!formData.workEmail.trim()) {
      newErrors.workEmail = "Work email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.workEmail)) {
      newErrors.workEmail = "Please enter a valid email address";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    if (!formData.department.trim()) {
      newErrors.department = "Department is required";
    }
    
    if (!formData.joiningDate) {
      newErrors.joiningDate = "Joining date is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Prepare data for API - matching the schema structure
    const employeeData = {
      name: formData.name,
      workEmail: formData.workEmail,
      password: formData.password,
      profilePicture: formData.profilePicture,
      joiningDate: formData.joiningDate,
      description: formData.description,
    //   requestCode: formData.requestCode, // Using orgCode from verification as requestCode
      department: formData.department,
      employeeId: formData.employeeId
      // orgId will be associated on the server based on requestCode
    };
    
    try {
      // API call to register employee
      const response = await fetch("http://localhost:5000/api/organization/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(employeeData)
      });
      
      const data = await response.json();
      
      if (response.status === 201 && data.success) {
        // Navigate to success page or login
        navigate("/employee/login", { 
          state: { 
            registrationSuccess: true,
            workEmail: formData.workEmail,
            employeeId: formData.employeeId
          } 
        });
      } else {
        setErrors({
          ...errors,
          submit: data.message || "Registration failed. Please try again."
        });
        setIsSubmitting(false);
      }
    } catch (error) {
      // For demo/testing, simulate successful registration
      if (process.env.NODE_ENV === 'development') {
        setTimeout(() => {
          navigate("/employee/login", { 
            state: { 
              registrationSuccess: true,
              workEmail: formData.workEmail,
              employeeId: formData.employeeId
            } 
          });
        }, 1500);
        return;
      }
      
      setErrors({
        ...errors,
        submit: "An error occurred. Please try again later."
      });
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="p-8 bg-white rounded-lg shadow-lg max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold text-center mb-6">Complete Your Registration</h2>
      
      {/* Organization & Employee ID Info */}
      <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mb-6">
        <h3 className="font-medium text-blue-800 mb-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Verification Information
        </h3>
        <div className="text-sm text-blue-700 space-y-1">
          <p><span className="font-medium">Organization:</span> {formData.orgName}</p>
          <p><span className="font-medium">Employee ID:</span> {formData.employeeId}</p>
          <p><span className="font-medium">Request Code:</span> {formData.requestCode}</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Personal Information Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            name="name"
            className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} p-3 rounded-md focus:ring-blue-500 focus:border-blue-500`}
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Work Email Address</label>
          <input
            type="email"
            name="workEmail"
            className={`w-full border ${errors.workEmail ? 'border-red-500' : 'border-gray-300'} p-3 rounded-md focus:ring-blue-500 focus:border-blue-500`}
            placeholder="your.email@company.com"
            value={formData.workEmail}
            onChange={handleChange}
          />
          {errors.workEmail && <p className="mt-1 text-sm text-red-600">{errors.workEmail}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              className={`w-full border ${errors.password ? 'border-red-500' : 'border-gray-300'} p-3 rounded-md focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Create password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className={`w-full border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} p-3 rounded-md focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
          <select
            name="department"
            className={`w-full border ${errors.department ? 'border-red-500' : 'border-gray-300'} p-3 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white`}
            value={formData.department}
            onChange={handleChange}
          >
            <option value="">Select department</option>
            <option value="Engineering">Engineering</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
            <option value="HR">Human Resources</option>
            <option value="Finance">Finance</option>
            <option value="Operations">Operations</option>
            <option value="Customer Support">Customer Support</option>
            <option value="Other">Other</option>
          </select>
          {errors.department && <p className="mt-1 text-sm text-red-600">{errors.department}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Joining Date</label>
          <input
            type="date"
            name="joiningDate"
            className={`w-full border ${errors.joiningDate ? 'border-red-500' : 'border-gray-300'} p-3 rounded-md focus:ring-blue-500 focus:border-blue-500`}
            value={formData.joiningDate}
            onChange={handleChange}
          />
          {errors.joiningDate && <p className="mt-1 text-sm text-red-600">{errors.joiningDate}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
          <input
            type="file"
            name="profilePicture"
            accept="image/*"
            className="w-full border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
            onChange={handleFileChange}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">About You (Optional)</label>
          <textarea
            name="description"
            rows="3"
            className="w-full border border-gray-300 p-3 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Brief description about yourself"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>
        
        {errors.submit && (
          <div className="bg-red-50 p-3 rounded border border-red-200">
            <p className="text-red-600">{errors.submit}</p>
          </div>
        )}
        
        <button
          type="submit"
          className={`w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition font-medium ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Registering...
            </span>
          ) : (
            "Complete Registration"
          )}
        </button>
      </form>
    </div>
  );
}

export default EmployeeRegistration;