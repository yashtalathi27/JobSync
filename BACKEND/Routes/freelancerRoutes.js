const express = require("express");
const {
  registerFreelancer,
  updateFreelancer,
  loginFreeLancer,
  getFreeLancerByID,  
  getFreeLancerProjects,
} = require("../Controller/freelancerController");
const { googleAuth } = require("../config/firebase");
const router = express.Router();

router.post("/register", registerFreelancer);
router.post("/update", updateFreelancer);
router.post("/google-auth", googleAuth);
router.post("/login", loginFreeLancer);
router.get("/:id", getFreeLancerByID);
router.get("/:id/projects", getFreeLancerProjects);

module.exports = router;
