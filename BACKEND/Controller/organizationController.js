const Organization=require('../Model/organizationSchema');
const bcrypt=require('bcrypt');
const saltRounds=10;
const Project=require('../Model/projectSchema');

const registerOrg=async(req, res)=>{
    console.log(req.body);
    const name=req.body.name;
    const email=req.body.workEmail;
    const password=req.body.password;
    try{
          const CheckResult=await Organization.find({workEmail: email});
          if(CheckResult.length>0)
          {
                res.send("Email already exists. Try logging in.");
          }
          const hashed=await bcrypt.hash(password, saltRounds);
          const org= new Organization({
                name: name,
                workEmail: email,
                password: hashed,
                  name: req.body.name,
                  websiteLink: req.body.websiteLink,
                  profilePicture: req.body.profilePicture,
                  description: req.body.description,
                  requestCode: req.body.requestCode,
                  // orgId: req.body.orgId,
          });
          await org.save();
          res 
              .status(201).json({message: "Organization registered successfully", success: true});
       }
       catch(error)
       {
           console.log("Registration error: ", errror);
            res.status(500).json({message: "Internal Server Error"});
       }
};

async function verifyOrgCode(req, res) {  
      const requestCode = req.body.orgCode;
      try {
        const org = await Organization.findOne({
          requestCode: requestCode,
        }); 
            if (org) {
            res.status(200).json({ message: "Code verified", success: true });
            } else {
            res.status(404).json({ message: "Code not found" });
            }     
      }
      catch (error) {
        console.error("Error during verification:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
      }

const loginOrg=async(req,res)=>{
      console.log(req.body);
      const email=req.body.workEmail;
      const password=req.body.password;
      try{
            const org=await Organization.findOne({workEmail: email});
            if(org===null)
            {
                  res.status(404).json({message: "Organization not found"});
            }
            const match=await bcrypt.compare(password, org.password);
            if(match)
            {
                  res.status(200).json({message: "Logged in successfully", success: true});
            }
            else
            {
                  res.status(401).json({message: "Invalid credentials"});
            }
      }
      catch(error)
      {
            console.error("Error during login:", error);
            res.status(500).json({message: "Internal Server Error"});
      }

};

const createProject=async(req,res)=>{
      console.log(req.body);
      const id= req.body.projectId;
      const name=req.body.name;
      const description=req.body.description;
      const freelancer=req.body.freelancer;
      const organization=req.body.organization;
      const employee=req.body.employee;

      console.log(id, name, description, freelancer, organization, employee);
      try{
            const project=new Project({
                  projectId: id,
                  name: name,
                  description: description,
                  freelancer: freelancer,
                  organization: organization,
                  employee: employee,
                  budget: req.body.budget,
                  total_checkpoints: req.body.total_checkpoints,
                  checkpoints: req.body.checkpoints,
                  createdAt: req.body.createdAt,
                  deadline: req.body.deadline,

            });
            await project.save();
            res.status(201).json({message: "Project created successfully", success: true});
      }
      catch(error){
            console.error("Error during project creation:", error);
            res.status(500).json({message: "Internal Server Error"});
      }
};



module.exports={
    registerOrg,
    loginOrg,
    createProject,
    verifyOrgCode,
};