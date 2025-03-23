import React from "react";
import Progress from "../../components/ui/Progress";

const ActiveProject = ({ name, progress, hoursWorked, deadline, checkpoints }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="text-sm text-gray-500">Deadline: {deadline}</p>
      <p className="text-sm text-gray-500">Hours Worked: {hoursWorked} hrs</p>

      {/* Updated Progress Bar with Checkpoints */}
      <Progress value={progress} checkpoints={checkpoints} />

    </div>
  );
};

export default ActiveProject;
