import React from "react";
import Progress from "../../components/ui/Progress";

const ActiveProject = ({ 
  name, 
  progress, 
  hoursWorked, 
  deadline, 
  checkpoints, 
  budget, 
  status 
}) => {
  const totalCheckpoints = checkpoints?.length || 0;
  const completedCheckpoints = checkpoints?.filter(c => c.completed).length || 0;

  return (
    <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          status 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {status ? 'Completed' : 'In Progress'}
        </span>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <p><span className="font-medium">Deadline:</span> {deadline}</p>
        {hoursWorked > 0 && (
          <p><span className="font-medium">Hours Worked:</span> {hoursWorked} hrs</p>
        )}
        {budget && (
          <p><span className="font-medium">Budget:</span> ${budget}</p>
        )}
        <p>
          <span className="font-medium">Checkpoints:</span> {completedCheckpoints}/{totalCheckpoints} completed
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mt-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-gray-700">Progress</span>
          <span className="text-xs font-medium text-gray-700">{progress}%</span>
        </div>
        <Progress value={progress} checkpoints={checkpoints} />
      </div>
    </div>
  );
};

export default ActiveProject;
