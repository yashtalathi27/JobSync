const { get } = require("mongoose");
const Freelancer = require("../Model/freelancerSchema");
const bcrypt = require("bcrypt");
const saltRounds = 10;

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
            return res.status(200).json({ message: "Logged in successfully" ,success:true}) ;
        } else {
            if(existingFreelancer.email==email && password!=existingFreelancer.password){
            return res.json({ message: "Loggin by google" , success:false });
            }
            return res.json({ message: "invalid crediendf" , success:false });
        }
    }}
    catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// async function getFreeLancerByID(req, res) {
//   const id = req.params.id;
//   try {
//     const freelancer = await Freelancer.findById(id);
//     res.status(200).json(freelancer);
//   } catch (error) {
//     console.error("Error getting freelancer:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
//   try {
//     const existingFreelancer = await Freel
//   }
// }

module.exports = { registerFreelancer, updateFreelancer,loginFreeLancer };
