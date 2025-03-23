const mongoose=require('mongoose');

const projectSchema=new mongoose.Schema({
  projectId: {
    type: String,
    unique: true,
    default: () => Math.random().toString(36).substring(2,9),// Auto-generated project ID
       },
    name:{
        type: String,
        required: false,
    },
    description:{
        type: String,
        required: false,
    },
    freelancer:
    {
      type:String,
      required:false,
    },
    orgnization:
    {
      type:String,
      required:false,
    },
    employee:
    {
      type:String,
      required:false,
    },
    budget: 
    { type: String, 
      required: false 
    }, // Total budget for the freelancer
    status: 
    { type: Boolean, 
      default: false 
    }, // Status of the project
    total_checkpoints: 
    { type: Number, 
      required: true,
      minimum:1,
    }, // Total number of checkpoints
    completed_checkpoints: 
    { type: Number, 
      default: 0 
    },
  checkpoints: [
    {
      title: { type: String, required: false }, // Name of the checkpoint
      description: { type: String }, // Details of the work
      amount: { type: Number, required: false }, // Payment for this checkpoint
      completed: { type: Boolean, default: false }, // Status of the checkpoint
      completionDate: { type: Date }, // Expected completion date
    },
  ],
  createdAt: { type: Date, default: Date.now },
  deadline: { type: Date, required: true }, // Project deadline

});

const projectModel=mongoose.model('Project',projectSchema);
module.exports=projectModel;