import React from 'react';
import logo from './../assets/logo.png';


const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#ff009d]">
      <img
        src={logo} // replace with your loading image path
        alt="Loading..."
        style={{ animation: 'spin 1s linear' }}
        className="h-48 w-48" // Adjust size as needed
      />
    </div>
  );
};

export default Loading;
