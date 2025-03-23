import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function OrgSignup() {
  const navigate = useNavigate();
  
  // Form state
  const [name, setName] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [websiteLink, setWebsiteLink] = useState("");
  const [description, setDescription] = useState("");
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [requestCode, setRequestCode] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [codeConfirmed, setCodeConfirmed] = useState(false);
  
  // Generate a unique organization request code
  const generateRequestCode = () => {
    return "ORG" + Math.random().toString(36).substring(2, 8).toUpperCase();
  };
  
  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) newErrors.name = "Organization name is required";
    
    if (!workEmail.trim()) {
      newErrors.workEmail = "Work email is required";
    } else if (!/\S+@\S+\.\S+/.test(workEmail)) {
      newErrors.workEmail = "Please enter a valid email address";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    if (websiteLink && !/^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/.test(websiteLink)) {
      newErrors.websiteLink = "Please enter a valid website URL";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSignup = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const code = generateRequestCode();
      setRequestCode(code);
      
      const orgData = {
        name,
        workEmail,
        password,
        websiteLink,
        description,
        requestCode: code,
        orgId: code,
        joiningDate: new Date()
      };
      
      // Make API call to backend
      const response = await axios.post('http://localhost:5000/api/organization/register', orgData);
      
      // Store response data (avoid storing password in local storage in production)
      const safeOrgData = {
        ...response.data,
        password: undefined // Remove password from localStorage
      };
      
      localStorage.setItem("orgDetails", JSON.stringify(safeOrgData));
      
      // Show code confirmation dialog
      setShowConfirmation(true);
      
    } catch (error) {
      console.error("Error registering organization:", error);
      
      // Handle different types of errors
      if (error.response) {
        // Server responded with an error status
        if (error.response.status === 409) {
          setErrors({ workEmail: "This email is already registered" });
        } else {
          setErrors({ submit: error.response.data.message || "Failed to register organization. Please try again." });
        }
      } else if (error.request) {
        // Request was made but no response received
        setErrors({ submit: "No response from server. Please check your connection and try again." });
      } else {
        // Something else happened while setting up the request
        setErrors({ submit: "Failed to register organization. Please try again." });
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle confirmation and navigate to dashboard
  const handleConfirmation = () => {
    setCodeConfirmed(true);
    
    // Navigate to dashboard after a brief delay
    setTimeout(() => {
      navigate(`/admin/dashboard/`, { 
        state: { 
          orgDetails: JSON.parse(localStorage.getItem("orgDetails"))
        } 
      });
    }, 1000);
  };
  
  // Copy code to clipboard
  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(requestCode)
      .then(() => {
        alert("Organization code copied to clipboard!");
      })
      .catch(err => {
        console.error("Failed to copy code: ", err);
      });
  };
  
  return (
    <div className="p-8 bg-white rounded-lg shadow-lg max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold text-center mb-6">Register Your Organization</h2>
      
      {!showConfirmation ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
            <input
              className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} p-3 rounded-md focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter organization name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Work Email</label>
            <input
              type="email"
              className={`w-full border ${errors.workEmail ? 'border-red-500' : 'border-gray-300'} p-3 rounded-md focus:ring-blue-500 focus:border-blue-500`}
              placeholder="work@company.com"
              value={workEmail}
              onChange={(e) => setWorkEmail(e.target.value)}
            />
            {errors.workEmail && <p className="mt-1 text-sm text-red-600">{errors.workEmail}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className={`w-full border ${errors.password ? 'border-red-500' : 'border-gray-300'} p-3 rounded-md focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              className={`w-full border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} p-3 rounded-md focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Website Link (Optional)</label>
            <input
              className={`w-full border ${errors.websiteLink ? 'border-red-500' : 'border-gray-300'} p-3 rounded-md focus:ring-blue-500 focus:border-blue-500`}
              placeholder="https://yourcompany.com"
              value={websiteLink}
              onChange={(e) => setWebsiteLink(e.target.value)}
            />
            {errors.websiteLink && <p className="mt-1 text-sm text-red-600">{errors.websiteLink}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
            <textarea
              className="w-full border border-gray-300 p-3 rounded-md focus:ring-blue-500 focus:border-blue-500 min-h-24"
              placeholder="Tell us about your organization..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          
          {errors.submit && (
            <div className="bg-red-50 p-3 rounded border border-red-200">
              <p className="text-red-600">{errors.submit}</p>
            </div>
          )}
          
          <button
            className={`w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition font-medium ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            onClick={handleSignup}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              "Register Organization"
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h3 className="text-xl font-semibold text-green-700 text-center">Registration Successful!</h3>
            <div className="mt-4 p-4 bg-white rounded-md border border-green-200">
              <p className="text-gray-600 text-center mb-2">Your Organization Request Code:</p>
              <div className="flex items-center justify-center">
                <span className="text-xl font-mono font-bold bg-blue-50 px-4 py-2 rounded border border-blue-200">
                  {requestCode}
                </span>
                <button 
                  onClick={copyCodeToClipboard} 
                  className="ml-2 p-2 text-blue-600 hover:text-blue-800"
                  title="Copy to clipboard"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-gray-700 font-medium">
                Please write down or save this code. You'll need it for future reference.
              </p>
              <p className="text-sm text-gray-600 mt-1">
                This code is also used for inviting employees to your organization.
              </p>
            </div>
          </div>
          
          <div className="p-4 bg-yellow-50 rounded-md border border-yellow-200">
            <div className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-yellow-700">
                Have you saved your organization request code? You will need this code to access your admin dashboard and to invite employees.
              </p>
            </div>
          </div>
          
          {!codeConfirmed ? (
            <div className="flex space-x-3">
              <button
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-3 rounded-md hover:bg-gray-300 transition font-medium"
                onClick={() => setShowConfirmation(false)}
              >
                Go Back
              </button>
              <button
                className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition font-medium"
                onClick={handleConfirmation}
              >
                I've Saved It, Continue
              </button>
            </div>
          ) : (
            <div className="text-center p-4 bg-blue-50 rounded-md">
              <svg className="animate-spin h-5 w-5 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-2 text-blue-700">Redirecting to admin dashboard...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default OrgSignup;