const mongoose=require('mongoose');


const employeeSchema=new mongoose.Schema({
    name: {type: String, required: true},
    workEmail: {type: String, required: true},
    profilePicture: {type: String},
    joiningDate: {type: Date, default: Date.now},
    description: {type: String},
    orgId: { type: mongoose.Schema.Types.ObjectId, ref: "Organisation", required: true },
    department:{type: String, required: true} 
});

const employeeModel=mongoose.model('Employee', employeeSchema);

module.exports=employeeModel;