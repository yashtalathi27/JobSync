import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function EmployeeSignup() {
  const navigate = useNavigate();
  
  // Form States
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    orgCode: "",
    department: "",
    position: "",
    phoneNumber: ""
  });
  
  // UI States
  const [verificationState, setVerificationState] = useState({
    isVerifying: false,
    isVerified: false,
    orgName: "",
    error: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1); // 1: Org verification, 2: Employee details
  
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
  
  // Verify organization code
  const verifyOrgCode = async () => {
    // Validate org code format
    if (!formData.orgCode.trim()) {
      setErrors({
        ...errors,
        orgCode: "Organization code is required"
      });
      return;
    }
    
    setVerificationState({
      ...verificationState,
      isVerifying: true,
      error: ""
    });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Hard-coded organization codes for demo
      const validOrgs = {
        "ORG123": "Acme Corporation",
        "TECH456": "TechSolutions Inc.",
        "HR789": "Global HR Services",
        "FIN101": "Financial Partners LLC",
        "MKT202": "Marketing Experts Group"
      };
      
      if (validOrgs[formData.orgCode]) {
        setVerificationState({
          isVerifying: false,
          isVerified: true,
          orgName: validOrgs[formData.orgCode],
          error: ""
        });
        setStep(2);
      } else {
        setVerificationState({
          ...verificationState,
          isVerifying: false,
          error: "Invalid organization code. Please check and try again."
        });
      }
    } catch (error) {
      console.error("Error verifying organization:", error);
      setVerificationState({
        ...verificationState,
        isVerifying: false,
        error: "Failed to verify organization. Please try again."
      });
    }
  };
  
  // Validate the complete form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
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
    
    if (!formData.position.trim()) {
      newErrors.position = "Position is required";
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/[^0-9]/g, ''))) {
      newErrors.phoneNumber = "Please enter a valid 10-digit phone number";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call to register employee
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would send the data to your backend
      // For demo, we'll store in localStorage
      const employeeData = {
        ...formData,
        registeredAt: new Date(),
        orgName: verificationState.orgName
      };
      
      // Get existing employees or initialize empty array
      const existingEmployees = JSON.parse(localStorage.getItem("employees") || "[]");
      existingEmployees.push(employeeData);
      
      // Save back to localStorage
      localStorage.setItem("employees", JSON.stringify(existingEmployees));
      
      // Navigate to success page or login
      setTimeout(() => {
        navigate("/employee/login", { 
          state: { 
            registrationSuccess: true,
            email: formData.email
          } 
        });
      }, 1000);
      
    } catch (error) {
      console.error("Error registering employee:", error);
      setErrors({
        ...errors, 
        submit: "Failed to register. Please try again."
      });
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="p-8 bg-white rounded-lg shadow-lg max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold text-center mb-6">Join Your Organization</h2>
      
      {step === 1 ? (
        // Step 1: Organization Verification
        <div className="space-y-4">
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Enter your organization code to continue. This code was provided by your organization administrator.
            </p>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organization Code</label>
              <input
                name="orgCode"
                className={`w-full border ${errors.orgCode || verificationState.error ? 'border-red-500' : 'border-gray-300'} p-3 rounded-md focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Enter your organization code (e.g., ORG123)"
                value={formData.orgCode}
                onChange={handleChange}
              />
              {errors.orgCode && <p className="mt-1 text-sm text-red-600">{errors.orgCode}</p>}
              {verificationState.error && <p className="mt-1 text-sm text-red-600">{verificationState.error}</p>}
            </div>
            
            {/* For demo purposes only - Display available codes */}
            <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-md">
              <p className="text-sm text-gray-500 font-medium">Demo Available Codes:</p>
              <ul className="mt-1 text-xs text-gray-500">
                <li>ORG123 (Acme Corporation)</li>
                <li>TECH456 (TechSolutions Inc.)</li>
                <li>HR789 (Global HR Services)</li>
                <li>FIN101 (Financial Partners LLC)</li>
                <li>MKT202 (Marketing Experts Group)</li>
              </ul>
            </div>
          </div>
          
          <button
            className={`w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition font-medium ${verificationState.isVerifying ? 'opacity-70 cursor-not-allowed' : ''}`}
            onClick={verifyOrgCode}
            disabled={verificationState.isVerifying}
          >
            {verificationState.isVerifying ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </span>
            ) : (
              "Verify & Continue"
            )}
          </button>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Don't have an organization code? Contact your administrator.
            </p>
            <button 
              className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
              onClick={() => navigate("/contact-admin")}
            >
              Need Help?
            </button>
          </div>
        </div>
      ) : (
        // Step 2: Employee Registration
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-green-50 p-3 rounded-md border border-green-200 mb-4">
            <p className="text-green-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Organization Verified: <span className="font-semibold ml-1">{verificationState.orgName}</span>
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              name="fullName"
              className={`w-full border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} p-3 rounded-md focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
            />
            {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} p-3 rounded-md focus:ring-blue-500 focus:border-blue-500`}
              placeholder="your.email@company.com"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
              <input
                name="position"
                className={`w-full border ${errors.position ? 'border-red-500' : 'border-gray-300'} p-3 rounded-md focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Your job title"
                value={formData.position}
                onChange={handleChange}
              />
              {errors.position && <p className="mt-1 text-sm text-red-600">{errors.position}</p>}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              name="phoneNumber"
              className={`w-full border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} p-3 rounded-md focus:ring-blue-500 focus:border-blue-500`}
              placeholder="10-digit phone number"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
            {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
          </div>
          
          {errors.submit && (
            <div className="bg-red-50 p-3 rounded border border-red-200">
              <p className="text-red-600">{errors.submit}</p>
            </div>
          )}
          
          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              className="flex-1 bg-gray-200 text-gray-800 px-4 py-3 rounded-md hover:bg-gray-300 transition font-medium"
              onClick={() => setStep(1)}
            >
              Back
            </button>
            <button
              type="submit"
              className={`flex-1 bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition font-medium ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
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
          </div>
        </form>
      )}
    </div>
  );
}

export default EmployeeSignup;