const mongoose = require("mongoose");

const orgSchema = new mongoose.Schema({
  name: { type: String, required: true },
  workEmail: { type: String, required: true },
  password: {type: String, required: true},
  websiteLink: { type: String },
  profilePicture: { type: String },
  joiningDate: { type: Date, default: Date.now },
  description: { type: String },
  requestCode: {
    type: String,
    unique: true,
  },
  employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
});

const organisationModel = mongoose.model("Organisation", orgSchema);

module.exports = organisationModel;
