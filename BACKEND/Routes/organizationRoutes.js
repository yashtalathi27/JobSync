const express = require("express");

const {
    registerOrg,
    createProject,
    loginOrg,
}=require("../Controller/organizationController");

const router=express.Router();
router.post("/register",registerOrg);
router.post("/createProject",createProject);
router.post("/login",loginOrg);
module.exports=router;