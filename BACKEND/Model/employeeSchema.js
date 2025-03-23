const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  workEmail: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  requestCode: { type: String, required: true }, // Reference to organization, but not unique for employees
  profilePicture: { type: String },
  empployeeId: { type: String, required: true, unique: true },
  joiningDate: { type: Date, default: Date.now },
  description: { type: String },
  department: { type: String },
});

const Employee = mongoose.model("Employee", employeeSchema);
module.exports = Employee;