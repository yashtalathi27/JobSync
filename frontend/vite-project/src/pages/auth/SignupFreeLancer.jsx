import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import skillsData from "../../skills.json";
import axios from "axios";
// If you decide to use UUID, uncomment this line
// import { v4 as uuidv4 } from 'uuid';

const FreelancerSignup = () => {
  const navigate = useNavigate();
  const [freelancerId, setFreelancerId] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    skills: [],
    // freelacer: freelancerId,
    country: "",
    city: "",
    state: "",
    street: "",
    zip: "",
    availability: true,
    pastExperience: { companyName: "", duration: "", role: "" },
    education: { degree: "", institution: "", year: "" },
    DateOfBirth: "",
    bankDetails: {
      accountNumber: "",
      bankName: "",
      ifscCode: "",
      accountHolderName: ""
    },
    // resume: null
  });

  const [showPopup, setShowPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Generate freelancer ID when component mounts
  useEffect(() => {
    generateFreelancerId();
  }, []);

  // Improved function to generate freelancer ID
  const generateFreelancerId = async () => {
    try {
      // Add a timestamp to make concurrent requests less likely to collide
      const timestamp = new Date().getTime().toString().slice(-6);
      const res = await axios.get('http://localhost:5000/api/freelancer/count');
      const count = res.data.count || 0;
      
      // Generate ID using count plus random suffix for uniqueness
      const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      const newId = `frl${(100 + count).toString().padStart(3, '0')}-${timestamp}-${randomSuffix}`;
      
      setFreelancerId(newId);
    } catch (error) {
      console.error("Error fetching freelancer count:", error);
      
      // Fallback with high entropy if API fails
      const randomNum = Math.floor(Math.random() * 100000) + 10000;
      const timestamp = new Date().getTime().toString().slice(-6);
      const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      
      setFreelancerId(`frl${randomNum}-${timestamp}-${randomSuffix}`);
      
      // Alternative using UUID (if you add the uuid package)
      // const uuid = uuidv4().substring(0, 8);
      // setFreelancerId(`frl-${uuid}`);
    }
  };

  async function handleForm(){
    try {
        // Include the freelancer ID in the data being sent
        const dataWithId = {
          ...formData,
          freelancerId: freelancerId
        };

        console.log("Data with ID:", dataWithId);
        
        const res = await axios.post('http://localhost:5000/api/freelancer/update', dataWithId);

        console.log(res);
        if(res.data.success === true){
            console.log('User Registered with ID:', freelancerId);
            navigate('/dashboard/freelancer/:id');  
        } else {
            alert("Registration failed. Please try again.");
        }

    } catch (error) {
        console.error("Registration error:", error);
        alert("Registration failed. Please try again.");
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNestedChange = (e, field) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [field]: { ...prev[field], [name]: value },
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
    //   setFormData((prev) => ({ ...prev, resume: file }));
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const handleSkillSelect = (skill) => {
    if (!formData.skills.includes(skill)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skill],
      }));
    }
  };

  const removeSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleForm();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-6xl">
        <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">Freelancer Signup</h2>
        
        {/* Display Freelancer ID */}
        {freelancerId && (
          <div className="bg-blue-50 p-3 rounded-lg mb-6 text-center">
            <p>Your Freelancer ID: <span className="font-bold text-blue-700">{freelancerId}</span></p>
            <p className="text-sm text-gray-600">This ID will be associated with your account</p>
          </div>
        )}
        
        <form className="grid grid-cols-4 gap-6" onSubmit={handleSubmit}>
          {/* Personal Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Details</h3>
            <input type="text" name="name" placeholder="Full Name" className="w-full p-3 border rounded-lg" onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" className="w-full p-3 border rounded-lg" onChange={handleChange} required />
            <input type="date" name="DateOfBirth" className="w-full p-3 border rounded-lg" onChange={handleChange} required />
          </div>
          
          {/* Education */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Education</h3>
            <input type="text" name="degree" placeholder="Degree" className="w-full p-3 border rounded-lg" onChange={(e) => handleNestedChange(e, "education")} />
            <input type="text" name="institution" placeholder="Institution" className="w-full p-3 border rounded-lg" onChange={(e) => handleNestedChange(e, "education")} />
            <input type="number" name="year" placeholder="Year" className="w-full p-3 border rounded-lg" onChange={(e) => handleNestedChange(e, "education")} />
          </div>

          {/* Work Experience */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Work Experience</h3>
            <input type="text" name="companyName" placeholder="Company Name" className="w-full p-3 border rounded-lg" onChange={(e) => handleNestedChange(e, "pastExperience")} />
            <input type="text" name="duration" placeholder="Duration" className="w-full p-3 border rounded-lg" onChange={(e) => handleNestedChange(e, "pastExperience")} />
            <input type="text" name="role" placeholder="Role" className="w-full p-3 border rounded-lg" onChange={(e) => handleNestedChange(e, "pastExperience")} />
            <div className="space-y-4">
            <h3 className="text-lg font-semibold">Resume Upload</h3>
            <input type="file" accept="application/pdf" className="w-full p-3 border rounded-lg" onChange={handleFileChange} required />
          </div>
          
          </div>
          
          {/* Address */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Address</h3>
            <input type="text" name="country" placeholder="Country" className="w-full p-3 border rounded-lg" onChange={handleChange} required />
            <input type="text" name="city" placeholder="City" className="w-full p-3 border rounded-lg" onChange={handleChange} required />
            <input type="text" name="state" placeholder="State" className="w-full p-3 border rounded-lg" onChange={handleChange} required />
            <input type="text" name="street" placeholder="Street (Optional)" className="w-full p-3 border rounded-lg" onChange={handleChange} />
            <input type="number" name="zip" placeholder="ZIP Code" className="w-full p-3 border rounded-lg" onChange={handleChange} required />
          </div>
          
          {/* Bank Details Section */}
          <div className="col-span-4">
            <h3 className="text-lg font-semibold mb-4">Bank Details</h3>
            <div className="grid grid-cols-4 gap-4">
              <input
                type="text"
                name="accountHolderName"
                placeholder="Account Holder Name"
                className="p-3 border rounded-lg"
                onChange={(e) => handleNestedChange(e, "bankDetails")}
                required
              />
              <input
                type="text"
                name="bankName"
                placeholder="Bank Name"
                className="p-3 border rounded-lg"
                onChange={(e) => handleNestedChange(e, "bankDetails")}
                required
              />
              <input
                type="text"
                name="accountNumber"
                placeholder="Account Number"
                className="p-3 border rounded-lg"
                onChange={(e) => handleNestedChange(e, "bankDetails")}
                required
              />
              <input
                type="text"
                name="ifscCode"
                placeholder="IFSC Code"
                className="p-3 border rounded-lg"
                onChange={(e) => handleNestedChange(e, "bankDetails")}
                required
              />
            </div>
          </div>

          {/* Skills Selection */}
          <div className="col-span-4">
            <button type="button" onClick={() => setShowPopup(true)} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Select Skills</button>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.skills.map((skill) => (
                <div key={skill} className="flex items-center bg-blue-200 px-3 py-1 rounded-full">
                  {skill} <button type="button" onClick={() => removeSkill(skill)} className="ml-2 text-red-500">x</button>
                </div>
              ))}
            </div>
          </div>
          {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-xl  w-full">
            <h2 className="text-lg font-semibold mb-2">Select Skills</h2>
            <input type="text" placeholder="Search skills..." className="w-full p-2 border rounded-lg mb-2" onChange={(e) => setSearchTerm(e.target.value.toLowerCase())} />
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              {skillsData.skills.filter(skill => skill.toLowerCase().includes(searchTerm)).map((skill) => (
                <button key={skill} type="button" onClick={() => handleSkillSelect(skill)} className="bg-gray-200 px-3 py-1 rounded-full">
                  {skill}
                </button>
              ))}
            </div>
            <button onClick={() => setShowPopup(false)} className="mt-3 bg-red-500 text-white px-4 py-2 rounded-lg w-full">Close</button>
          </div>
        </div>
      )}
          <div className="col-span-4">
            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">Sign Up</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FreelancerSignup;