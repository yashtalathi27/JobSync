import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function EmployeeVerification() {
  const navigate = useNavigate();
  
  // Verification state
  const [orgCode, setOrgCode] = useState("");
  const [verificationState, setVerificationState] = useState({
    isVerifying: false,
    isVerified: false,
    orgName: "",
    error: "",
    employeeId: ""
  });
  
  // Handle input changes
  const handleCodeChange = (e) => {
    setOrgCode(e.target.value);
    
    // Clear error when user types
    if (verificationState.error) {
      setVerificationState(prev => ({
        ...prev,
        error: ""
      }));
    }
  };
  
  // Verify organization code
  const verifyOrgCode = async () => {
    if (!orgCode.trim()) {
      setVerificationState(prev => ({
        ...prev,
        error: "Please enter an organization code"
      }));
      return;
    }
    
    setVerificationState(prev => ({
      ...prev,
      isVerifying: true,
      error: ""
    }));
    
    try {
      // API call to verify org code
      // Replace with actual API endpoint
      const response = await fetch("http://localhost:5000/api/organization/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ orgCode })
      });
      
      const data = await response.json();
      
      if (response.status === 200 && data.success) {
        // Generate employee ID (or get from API)
        const randomDigits = Math.floor(Math.random() * 900) + 100;
        const employeeId = `EMP${randomDigits}`;
        
        setVerificationState({
          isVerifying: false,
          isVerified: true,
          orgName: data.orgName || `Organization ${orgCode}`,
          error: "",
          employeeId
        });
        
        // Navigate to registration with verified data
        setTimeout(() => {
          navigate("/employee/register", {
            state: {
              verified: true,
              orgCode,
              orgName: data.orgName || `Organization ${orgCode}`,
              employeeId
            }
          });
        }, 1500);
      } else {
        setVerificationState({
          isVerifying: false,
          isVerified: false,
          orgName: "",
          error: data.message || "Invalid organization code",
          employeeId: ""
        });
      }
    } catch (error) {
      // For demo/testing, simulate successful verification
      if (process.env.NODE_ENV === 'development') {
        const randomDigits = Math.floor(Math.random() * 900) + 100;
        const employeeId = `EMP${randomDigits}`;
        
        setVerificationState({
          isVerifying: false,
          isVerified: true,
          orgName: `Organization ${orgCode}`,
          error: "",
          employeeId
        });
        
        setTimeout(() => {
          navigate("/employee/register", {
            state: {
              verified: true,
              orgCode,
              orgName: `Organization ${orgCode}`,
              employeeId
            }
          });
        }, 1500);
        return;
      }
      
      setVerificationState({
        isVerifying: false,
        isVerified: false,
        orgName: "",
        error: "Verification failed. Please try again.",
        employeeId: ""
      });
    }
  };
  
  return (
    <div className="p-8 bg-white rounded-lg shadow-lg max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold text-center mb-6">Verify Your Organization</h2>
      
      <div className="space-y-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Organization Code</label>
          <input
            name="orgCode"
            className={`w-full border ${verificationState.error ? 'border-red-500' : verificationState.isVerified ? 'border-green-500' : 'border-gray-300'} p-3 rounded-md focus:ring-blue-500 focus:border-blue-500`}
            placeholder="Enter your organization code (e.g., ORG123)"
            value={orgCode}
            onChange={handleCodeChange}
          />
          {verificationState.error && <p className="mt-1 text-sm text-red-600">{verificationState.error}</p>}
          
          {verificationState.isVerified && (
            <div className="flex mt-2">
              <div className="bg-green-50 p-2 rounded-md border border-green-200 flex items-center w-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-green-700 text-sm">
                  Verified: <span className="font-semibold">{verificationState.orgName}</span>
                </p>
              </div>
            </div>
          )}
          
          {verificationState.employeeId && (
            <div className="bg-blue-50 p-3 rounded-md border border-blue-200 mt-2">
              <p className="text-blue-700 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" />
                </svg>
                Your Employee ID: <span className="font-semibold ml-1">{verificationState.employeeId}</span>
              </p>
            </div>
          )}
        </div>
        
        <button
          onClick={verifyOrgCode}
          className={`w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition font-medium ${verificationState.isVerifying ? 'opacity-70 cursor-not-allowed' : ''}`}
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
            "Verify Organization"
          )}
        </button>
        
        <div className="text-center pt-2">
          <p className="text-sm text-gray-600">
            Don't have an organization code? 
            <button 
              type="button"
              className="ml-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
              onClick={() => navigate("/contact-admin")}
            >
              Contact your administrator
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default EmployeeVerification;