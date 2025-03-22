const mongoose=require('mongoose');

const projectSchema=new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    freelancer:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'freelancers',
    },
    orgnization:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'organizations',
    },
    employee:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employees',
    },
    budget: 
    { type: Number, 
      required: true 
    }, // Total budget for the freelancer
  checkpoints: [
    {
      title: { type: String, required: true }, // Name of the checkpoint
      description: { type: String }, // Details of the work
      amount: { type: Number, required: true }, // Payment for this checkpoint
      completed: { type: Boolean, default: false }, // Status of the checkpoint
      completionDate: { type: Date }, // Expected completion date
    },
  ],
  createdAt: { type: Date, default: Date.now },
  deadline: { type: Date, required: true }, // Project deadline

});

const projectModel=mongoose.model('Project',projectSchema);
module.exports=projectModel;