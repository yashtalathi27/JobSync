const Organization=require('../Model/organizationSchema');
const bcrypt=require('bcrypt');
const saltRounds=10;

const registerOrg=async(req, res)=>{
    console.log(req.body);
    const email=req.body.workEmail;
    const password=req.body.pasword;
    try{
          const CheckResult=await Organization.find({workEmail: email});
          if(CheckResult.length>0)
          {
                res.send("Email already exists. Try logging in.");
          }
          const hashed=await bcrypt.hash(password, saltRounds);
          const org= new Organization({
                workEmail: email,
                password: hashed,
          });
          await org.save();
          res 
              .status(201).json({message: "Organization registered successfully", success: true});
       }
       catch(errror)
       {
           console.log("Registration error: ", error);
            res.status(500).json({message: "Internal Server Error"});
       }
};

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
      const name=req.body.name;
      const description=req.body.description;
      const freelancer=req.body.freelancer;
      const organization=req.body.organization;
      const employee=req.body.employee;
      try{
            const project=new Project({
                  name: name,
                  description: description,
                  freelancer: freelancer,
                  organization: organization,
                  employee: employee,
                  budget: req.body.budget,
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
};