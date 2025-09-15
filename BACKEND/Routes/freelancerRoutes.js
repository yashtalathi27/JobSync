const express = require("express");
const {
  registerFreelancer,
  updateFreelancer,
  loginFreeLancer,
  getFreeLancerByID,  
  getFreeLancerByEmail,
  getFreeLancerProjects,
  getAllFreelancers,
  debugProjects,
  getProjectById,
  updateCheckpoint,
} = require("../Controller/freelancerController");
const { googleAuth } = require("../config/firebase");
const router = express.Router();

router.post("/register", registerFreelancer);
router.post("/update", updateFreelancer);
router.post("/google-auth", googleAuth);
router.post("/login", loginFreeLancer);
router.get("/all", getAllFreelancers);
router.get("/email/:email", getFreeLancerByEmail);
router.get("/:id", getFreeLancerByID);
router.get("/:id/projects", getFreeLancerProjects);

// Project-specific routes
router.get("/project/:id", getProjectById);
router.put("/project/:projectId/checkpoint/:checkpointIndex", updateCheckpoint);

module.exports = router;
