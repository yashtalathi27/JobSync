const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  workEmail: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String },
  joiningDate: { type: Date, default: Date.now },
  description: { type: String },
  requestCode: { type: String, required: true }, // Reference to Organisation's requestCode
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization" },
  department: { type: String, required: true },
});

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
