import React from "react";

const Progress = ({ value, max = 100, checkpoints = [] }) => {
  return (
    <div className="relative w-full mt-2">
      {/* Checkpoint Labels with Lines */}
      {checkpoints.length > 0 && (
        <div className="relative h-6 mb-2">
          {checkpoints.map((checkpoint, index) => {
            const position = ((index + 1) / checkpoints.length) * 100;
            return (
              <div 
                key={index} 
                className="absolute flex flex-col items-center text-xs text-gray-700"
                style={{
                  left: `calc(${position}% - 10px)`,
                  top: "-16px",
                  whiteSpace: "nowrap",
                }}
              >
                <span className="mt-2" title={checkpoint.description}>
                  {checkpoint.title || `Step ${index + 1}`}
                </span>
                {/* Vertical Line */}
                <div 
                  className={`w-[2px] h-5 mt-1 ${
                    checkpoint.completed ? 'bg-green-500' : 'bg-gray-500'
                  }`}
                ></div>
              </div>
            );
          })}
        </div>
      )}

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 relative">
        <div 
          className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
          style={{ width: `${Math.min((value / max) * 100, 100)}%` }}
        ></div>
        
        {/* Progress percentage text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium text-white mix-blend-difference">
            {Math.round(value)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default Progress;
