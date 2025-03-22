import React from "react";

const Card = ({ className, children, ...props }) => {
  return (
    <div className={`rounded-lg border bg-white p-4 shadow ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
