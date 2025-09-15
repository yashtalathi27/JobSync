const { get } = require("mongoose");
const Freelancer = require("../Model/freelancerSchema");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const Project = require("../Model/projectSchema");

const registerFreelancer = async (req, res) => {
  console.log(req.body);
  const email = req.body.email;
  const password = req.body.password;
  try {
    const checkResult = await Freelancer.find({ email: email });
    if (checkResult.length > 0) {
      res.send("Email already exists. Try logging in.");
    }
    const hashed = await bcrypt.hash(password, saltRounds);
    const freelancer = new Freelancer({
      email: email,
      password: hashed,
    });
    await freelancer.save();
    res
      .status(201)
      .json({ message: "User registered successfully", success: true });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateFreelancer = async (req, res) => {
  console.log(req.body);

  const email = req.body.email;
  try {
    const existingFreelancer = await Freelancer.find({ email: email });
    if (!existingFreelancer) {
      return res.status(404).json({ message: "Freelancer not found" });
    }
    const updatedData = {
      name: req.body.name ?? existingFreelancer.name,
      email: req.body.email ?? existingFreelancer.email,
      skills: req.body.skills ?? existingFreelancer.skills,
      freelancerId: req.body.freelancerId ?? existingFreelancer.freelancerId,
      address: {
        country: req.body.country ?? existingFreelancer.address.country,
        city: req.body.city ?? existingFreelancer.address.city,
        state: req.body.state ?? existingFreelancer.address.state,
        street: req.body.street ?? existingFreelancer.address.street,
        zip: req.body.zip ?? existingFreelancer.address.zip,
      },
      availability: req.body.availability ?? existingFreelancer.availability,
      pastExperience: {
        companyName: req.body.pastExperience?.companyName ?? "Not provided",
        duration: req.body.pastExperience?.duration ?? "Not provided",
        role: req.body.pastExperience?.role ?? "Not provided",
      },
      education: {
        degree: req.body.education?.degree ?? "Not provided",
        institution: req.body.education?.institution ?? "Not provided",
        year: req.body.education?.year ?? 0,
      },
      DateOfBirth: req.body.DateOfBirth ?? existingFreelancer.DateOfBirth,
    };
    const updatedFreelancer = await Freelancer.findOneAndUpdate(
      { email: email },
      updatedData,
      { new: true }
    );
    console.log("Updated Freelancer:", updatedFreelancer);
    res.status(200).json({
      data: updatedFreelancer,
      success: true,
    });
  } catch (error) {
    console.error("Error updating freelancer:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const loginFreeLancer = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const existingFreelancer = await Freelancer.findOne
    ({ email: email });
    if (!existingFreelancer) {
      return res.status(404).json({ message: "User not found" });
    } else {
        const isMatch = await bcrypt.compare(password, existingFreelancer.password);
        if (isMatch) {
            return res.status(200).json({ 
              message: "Logged in successfully", 
              success: true,
              freelancer: {
                id: existingFreelancer.freelancerId || existingFreelancer._id,
                name: existingFreelancer.name,
                email: existingFreelancer.email
              }
            });
        } else {
            if(existingFreelancer.email==email && password!=existingFreelancer.password){
            return res.json({ message: "Loggin by google" , success:false });
            }
            return res.json({ message: "invalid credentials" , success:false });
        }
    }}
    catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

async function getFreeLancerByID(req, res) {
  const id = req.params.id;
  console.log("Fetching freelancer with ID:", id);
  
  try {
    let freelancer = null;
    
    // Check if the ID is a valid MongoDB ObjectId format (24 character hex string)
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    
    if (isValidObjectId) {
      // If it's a MongoDB ObjectId, use it directly
      freelancer = await Freelancer.findById(id);
    } else {
      // If it's a freelancerId, find by freelancerId field
      freelancer = await Freelancer.findOne({ freelancerId: id });
    }
    
    if (!freelancer) {
      return res.status(404).json({ message: "Freelancer not found" });
    }
    
    res.status(200).json(freelancer);
  } catch (error) {
    console.error("Error getting freelancer:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getFreeLancerByEmail(req, res) {
  const email = req.params.email;
  console.log("Fetching freelancer with email:", email);
  
  try {
    const freelancer = await Freelancer.findOne({ email: email });
    
    if (!freelancer) {
      return res.status(404).json({ message: "Freelancer not found" });
    }
    
    res.status(200).json(freelancer);
  } catch (error) {
    console.error("Error getting freelancer by email:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getFreeLancerProjects(req, res) {
  const id = req.params.id;
  console.log("Freelancer ID:", id);
  
  try {
    let freelancerObjectId = null;
    let projects = [];
    
    // Check if the ID is a valid MongoDB ObjectId format (24 character hex string)
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    
    if (isValidObjectId) {
      // If it's a MongoDB ObjectId, use it directly
      console.log("Using MongoDB ObjectId directly:", id);
      freelancerObjectId = id;
    } else {
      // If it's a freelancerId, first find the freelancer's MongoDB _id
      console.log("Looking up freelancer by freelancerId:", id);
      const freelancer = await Freelancer.findOne({ freelancerId: id });
      console.log("Found freelancer:", freelancer ? freelancer._id.toString() : "not found");
      if (freelancer) {
        freelancerObjectId = freelancer._id.toString();
      } else {
        console.log("Freelancer not found with freelancerId:", id);
        return res.status(404).json({ message: "Freelancer not found" });
      }
    }
    
    if (freelancerObjectId) {
      console.log("Searching for projects with freelancer field:", freelancerObjectId);
      // Search for projects where freelancer field matches the ObjectId (as string)
      projects = await Project.find({ freelancer: freelancerObjectId });
      console.log(`Found ${projects.length} projects`);
      
      if (projects.length === 0) {
        console.log("No projects found, checking all projects to debug...");
        const allProjects = await Project.find({});
        console.log("All projects in database:", allProjects.map(p => ({ 
          id: p._id, 
          name: p.name, 
          freelancer: p.freelancer,
          freelancerType: typeof p.freelancer 
        })));
      }
    }
    
    res.status(200).json(projects);
  } catch (error) {
    console.error("Error getting freelancer projects:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getAllFreelancers(req, res) {
  try {
    // Get all freelancers with only necessary fields for selection
    const freelancers = await Freelancer.find({}, {
      name: 1,
      email: 1,
      freelancerId: 1,
      skills: 1,
      availability: 1,
      pastExperience: 1,
      address: 1
    });
    
    res.status(200).json(freelancers);
  } catch (error) {
    console.error("Error getting all freelancers:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getProjectById(req, res) {
  const projectId = req.params.id;
  console.log("Fetching project with ID:", projectId);
  
  try {
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    // Also fetch freelancer and organization details if needed
    let freelancerDetails = null;
    if (project.freelancer) {
      freelancerDetails = await Freelancer.findById(project.freelancer, {
        name: 1,
        email: 1,
        freelancerId: 1,
        skills: 1
      });
    }
    
    const projectWithDetails = {
      ...project.toObject(),
      freelancerDetails
    };
    
    res.status(200).json(projectWithDetails);
  } catch (error) {
    console.error("Error getting project:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function updateCheckpoint(req, res) {
  const { projectId, checkpointIndex } = req.params;
  const { completed } = req.body;
  
  console.log("Updating checkpoint:", { projectId, checkpointIndex, completed });
  
  try {
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    if (checkpointIndex >= project.checkpoints.length) {
      return res.status(400).json({ message: "Invalid checkpoint index" });
    }
    
    // Update the specific checkpoint
    project.checkpoints[checkpointIndex].completed = completed;
    
    // Update completed_checkpoints count
    const completedCount = project.checkpoints.filter(cp => cp.completed).length;
    project.completed_checkpoints = completedCount;
    
    // Update project status if all checkpoints are completed
    if (completedCount === project.checkpoints.length) {
      project.status = true;
    }
    
    await project.save();
    
    res.status(200).json({ 
      message: "Checkpoint updated successfully", 
      project: project 
    });
  } catch (error) {
    console.error("Error updating checkpoint:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = { 
  registerFreelancer, 
  updateFreelancer,
  loginFreeLancer,
  getFreeLancerByID,
  getFreeLancerByEmail,
  getFreeLancerProjects,
  getAllFreelancers,
  getProjectById,
  updateCheckpoint
};
