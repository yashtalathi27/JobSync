const express=require("express");
const {registerEmployee,loginEmployee, updateCheckpoint, getAllEmployees}
=require("../Controller/employeeController");

const router=express.Router();
router.post("/register",registerEmployee);
router.post("/login",loginEmployee);
router.post("/updateCheckpoint",updateCheckpoint);
router.get("/all/:orgCode", getAllEmployees);

module.exports=router;