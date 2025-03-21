const mongoose = require("mongoose");

const freelancerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  skills: {
    type: [String],
    required: false,
  },
  address: {
    country:{
        type: String,
        required: false,
    },
    city:{
        type: String,
        required: false,
    },
    state:{
        type: String,
        required: false,
    },
    street:{
        type: String,
        required: false,
    },
    zip:{
        type: Number,
        required: false,
    },
  },
  availability: {
    type: Boolean,
    required: false,
  },
  pastExperience: {
    companyName: {
      type: String,
      required: false,
    },
    duration: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      required: false,
    },
  },
    education: {
        degree: {
        type: String,
        required: false,
        },
        institution: {
        type: String,
        required: false,
        },
        year: {
        type: Number,
        required: false,
        },
    },
    DateOfBirth: {
        type: Date,
        required: false,
    },
});



const freelancerModel = mongoose.model("freelancer", freelancerSchema);
module.exports = freelancerModel;