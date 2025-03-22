import React from "react";

const RecentMessages = ({ messages }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-2">Recent Messages</h3>
      <ul className="space-y-3">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <li key={index} className="flex justify-between items-center p-2 bg-gray-100 rounded-md">
              <div>
                <p className="text-sm font-medium">{msg.sender}</p>
                <p className="text-xs text-gray-600">{msg.message}</p>
              </div>
              <span className="text-xs text-gray-500">{msg.time}</span>
            </li>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No recent messages.</p>
        )}
      </ul>
    </div>
  );
};

export default RecentMessages;
