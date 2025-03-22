import React from "react";

const Progress = ({ value, max = 100, checkpoints = [] }) => {
  return (
    <div className="relative w-full mt-2">
      {/* Checkpoint Labels with Lines */}
      <div className="relative h-6 mb-2">
        {checkpoints.map((checkpoint, index) => (
          <div key={index} className="absolute flex flex-col items-center text-xs text-gray-700"
            style={{
              left: `calc(${checkpoint.value}% - 10px)`,
              top: "-16px",
              whiteSpace: "nowrap",
            }}>
            <span className="mt-2">{checkpoint.label}</span>
            {/* Vertical Line */}
            <div className="w-[2px] h-5 bg-gray-500 mt-1"></div>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 relative">
        <div className="bg-blue-600 h-3 rounded-full transition-all" style={{ width: `${(value / max) * 100}%` }}></div>
      </div>
    </div>
  );
};

export default Progress;
