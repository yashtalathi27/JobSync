const Employee = require("../Model/employeeSchema");
const Organization=require("../Model/organizationSchema");
const Project = require("../Model/projectSchema");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// const registerEmployee = async (req, res) => {
//     console.log(req.body);
//     const { name, workEmail, password, requestCode, department } = req.body;

//     try {
 
//         // const org = await Organization.findOne({ requestCode });
//         // console.log("Organization:", org);
//         // if (!org) {
//         //     return res.status(404).json({ message: "Organization not found" });
//         // }

//         const hashed = await bcrypt.hash(password, saltRounds);
//         const employee = new Employee({
//             name,
//             workEmail,
//             password: hashed,
//             requestCode,
//             // orgId: org._id,
//             department,
//         });
//         console.log("Employee:", employee);
//         await employee.save();
//         res.status(201).json({ message: "Employee registered successfully" });
//     } catch (error) {
//         console.error("Registration error:", error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// };

const registerEmployee = async (req, res) => {
    console.log(req.body);
    const { name, workEmail, password, requestCode, department, joiningDate, description, profilePicture } = req.body;
  
    try {
      // First check if the employee already exists with this email
      const existingEmployee = await Employee.findOne({ workEmail });
      if (existingEmployee) {
        return res.status(400).json({ 
          message: "An employee with this email already exists", 
          success: false 
        });
      }
      
      // Then verify the organization exists
    //   const org = await Organization.findOne({ requestCode });
    //   if (!org) {
    //     return res.status(404).json({ 
    //       message: "Organization not found with this request code", 
    //       success: false 
    //     });
    //   }
      
      // Hash the password
      const hashed = await bcrypt.hash(password, saltRounds);
      
      // Create and save the employee
      const employee = new Employee({
        name,
        workEmail,
        password: hashed,
        requestCode,
        department,
        joiningDate: joiningDate || Date.now(),
        description: description || "",
        profilePicture: profilePicture || ""
      });
      
      await employee.save();
      return res.status(201).json({ 
        message: "Employee registered successfully", 
        success: true 
      });
    } catch (error) {
      console.error("Registration error:", error);
      // Don't send multiple responses
      return res.status(500).json({ 
        message: "Internal Server Error", 
        success: false,
        error: error.message  // Helpful for debugging
});}
};


const loginEmployee = async (req, res) => {
    console.log(req.body);
    const name= req.body.name;
    const email = req.body.workEmail;
    const password = req.body.password;
    try {
      const existingEmployee = await Employee.findOne({ workEmail: email });
      if (!existingEmployee) {
        return res.status(404).json({ message: "User not found", success: false });
      }
      const isMatch = await bcrypt.compare(password, existingEmployee.password);
      if (isMatch) {
        return res.status(200).json({ message: "Logged in successfully", success: true });
      } else {
        return res.json({ message: "Invalid credentials", success: false });
      }
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Internal Server Error", success: false });
    }
  };

  const updateCheckpoint = async (req, res) => {
    const { projectId, employeeId } = req.body;
    try {
      const project = await Project.findOne({ projectId });
      if (!project) return res.status(404).json({ message: "Project not found" });
  

      if (project.employee !== employeeId) {
        return res.status(403).json({ message: "Not authorized to approve" });
      }

      if (project.completed_checkpoints >= project.total_checkpoints) {
        return res.status(400).json({ message: "All checkpoints completed" });
      }

      project.checkpoints[project.completed_checkpoints].completed = true;
      project.completed_checkpoints += 1;

      if (project.completed_checkpoints === project.total_checkpoints) {
        project.status = true;
      }
      await project.save();
      return res.status(200).json({ 
        message: "Checkpoint approved", 
        completed_checkpoints: project.completed_checkpoints,
        status: project.status
      });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  };

module.exports = {registerEmployee, loginEmployee, updateCheckpoint};
