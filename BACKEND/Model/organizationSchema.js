const mongoose = require("mongoose");
const { or } = require("sequelize");

const orgSchema = new mongoose.Schema({
  name: { type: String, required: false },
  workEmail: { type: String, required: true },
  password: {type: String, required: false},
  websiteLink: { type: String },
  profilePicture: { type: String },
  joiningDate: { type: Date, default: Date.now },
  description: { type: String },
  requestCode: {
    type: String,
    unique: true,
    // default: () => Math.floor(100000 + Math.random() * 900000).toString(),
  },
  // orgId: { type: String, required: false },
  employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
});

const organisationModel = mongoose.model("Organisation", orgSchema);

module.exports = organisationModel;
