const express=require("express");
const {registerEmployee,loginEmployee, updateCheckpoint}
=require("../Controller/employeeController");

const router=express.Router();
router.post("/register",registerEmployee);
router.post("/login",loginEmployee);
router.post("/updateCheckpoint",updateCheckpoint);

module.exports=router;