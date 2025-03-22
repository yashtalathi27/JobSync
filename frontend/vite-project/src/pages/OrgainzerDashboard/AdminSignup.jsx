import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function OrgSignup() {
  const navigate = useNavigate();
  
  // Form state
  const [orgName, setOrgName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [industry, setIndustry] = useState("");
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [orgCode, setOrgCode] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [codeConfirmed, setCodeConfirmed] = useState(false);
  
  // Generate a unique organization code
  const generateOrgCode = () => {
    return "ORG" + Math.random().toString(36).substring(2, 8).toUpperCase();
  };
  
  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};
    
    if (!orgName.trim()) newErrors.orgName = "Organization name is required";
    
    if (!adminEmail.trim()) {
      newErrors.adminEmail = "Admin email is required";
    } else if (!/\S+@\S+\.\S+/.test(adminEmail)) {
      newErrors.adminEmail = "Please enter a valid email address";
    }
    
    if (!address.trim()) newErrors.address = "Address is required";
    
    if (!contact.trim()) {
      newErrors.contact = "Contact number is required";
    } else if (!/^\d{10}$/.test(contact.replace(/[^0-9]/g, ''))) {
      newErrors.contact = "Please enter a valid 10-digit contact number";
    }
    
    if (!industry.trim()) newErrors.industry = "Industry type is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSignup = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const code = generateOrgCode();
      setOrgCode(code);
      
      const orgDetails = {
        name: orgName,
        code,
        adminEmail,
        address,
        contact,
        industry,
        createdAt: new Date()
      };
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store in localStorage for demo purposes (replace with actual API call)
      localStorage.setItem("orgDetails", JSON.stringify(orgDetails));
      
      // Show code confirmation dialog
      setShowConfirmation(true);
      
    } catch (error) {
      console.error("Error registering organization:", error);
      setErrors({ submit: "Failed to register organization. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle confirmation and navigate to dashboard
  const handleConfirmation = () => {
    setCodeConfirmed(true);
    
    // Navigate to dashboard after a brief delay
    setTimeout(() => {
      navigate("/admin/dashboard", { 
        state: { 
          orgDetails: JSON.parse(localStorage.getItem("orgDetails"))
        } 
      });
    }, 1000);
  };
  
  // Copy code to clipboard
  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(orgCode)
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
              className={`w-full border ${errors.orgName ? 'border-red-500' : 'border-gray-300'} p-3 rounded-md focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter organization name"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
            />
            {errors.orgName && <p className="mt-1 text-sm text-red-600">{errors.orgName}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email</label>
            <input
              type="email"
              className={`w-full border ${errors.adminEmail ? 'border-red-500' : 'border-gray-300'} p-3 rounded-md focus:ring-blue-500 focus:border-blue-500`}
              placeholder="admin@company.com"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
            />
            {errors.adminEmail && <p className="mt-1 text-sm text-red-600">{errors.adminEmail}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              className={`w-full border ${errors.address ? 'border-red-500' : 'border-gray-300'} p-3 rounded-md focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Organization address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
            <input
              className={`w-full border ${errors.contact ? 'border-red-500' : 'border-gray-300'} p-3 rounded-md focus:ring-blue-500 focus:border-blue-500`}
              placeholder="10-digit contact number"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
            {errors.contact && <p className="mt-1 text-sm text-red-600">{errors.contact}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Industry Type</label>
            <select
              className={`w-full border ${errors.industry ? 'border-red-500' : 'border-gray-300'} p-3 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white`}
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
            >
              <option value="">Select industry type</option>
              <option value="Technology">Technology</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Finance">Finance</option>
              <option value="Education">Education</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Retail">Retail</option>
              <option value="Other">Other</option>
            </select>
            {errors.industry && <p className="mt-1 text-sm text-red-600">{errors.industry}</p>}
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
              <p className="text-gray-600 text-center mb-2">Your Organization Code:</p>
              <div className="flex items-center justify-center">
                <span className="text-xl font-mono font-bold bg-blue-50 px-4 py-2 rounded border border-blue-200">
                  {orgCode}
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
                Please write down or save this code. You'll need it for future logins.
              </p>
              <p className="text-sm text-gray-600 mt-1">
                This code is also used for inviting team members to your organization.
              </p>
            </div>
          </div>
          
          <div className="p-4 bg-yellow-50 rounded-md border border-yellow-200">
            <div className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-yellow-700">
                Have you saved your organization code? You will need this code to access your admin dashboard and to invite team members.
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