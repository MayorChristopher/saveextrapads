import React from "react";

const Spinner = () => {
  return (
    <div
      className="inline-block w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"
      role="status"
      aria-label="Loading..."
    />
  );
};

export default Spinner;
