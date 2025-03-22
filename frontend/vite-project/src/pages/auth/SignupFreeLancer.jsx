import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import skillsData from "../../skills.json";
import axios from "axios";

const FreelancerSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    skills: [],
    country: "",
    city: "",
    state: "",
    street: "",
    zip: "",
    availability: true,
    pastExperience: { companyName: "", duration: "", role: "" },
    education: { degree: "", institution: "", year: "" },
    DateOfBirth: "",
    // resume: null
  });

  const [showPopup, setShowPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  async function handleForm(){
    try {
        const res=await axios.post('http://localhost:5000/api/freelancer/update',formData)

        console.log(res)
        if(res.sucess=='true'){
            console.log('User Registered')
            navigate('/dashboard/freelancer')  
        }

    } catch (error) {
        
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
    console.log(formData);
    navigate("/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-6xl">
        <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">Freelancer Signup</h2>
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
            <button onClick={handleForm} type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">Sign Up</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FreelancerSignup;
