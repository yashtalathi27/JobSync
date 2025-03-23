const express = require("express");

const {
    registerOrg,
    createProject,
    loginOrg,
    verifyOrgCode,
}=require("../Controller/organizationController");

const router=express.Router();
router.post("/register",registerOrg);
router.post("/createProject",createProject);
router.post("/login",loginOrg);
router.post('/verify',verifyOrgCode)

module.exports=router;