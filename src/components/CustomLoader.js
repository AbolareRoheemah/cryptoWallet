import React from 'react';

const CryptoLoader = ({ className = "" }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative w-24 h-24">
        {/* Outer rotating hexagon */}
        <div className="absolute inset-0 animate-spin-slow">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon
              points="50 5, 85 25, 85 75, 50 95, 15 75, 15 25"
              className="fill-none stroke-blue-500 stroke-2"
            />
          </svg>
        </div>
        
        {/* Inner pulsing hexagon */}
        <div className="absolute inset-0 animate-pulse">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon
              points="50 15, 75 30, 75 70, 50 85, 25 70, 25 30"
              className="fill-blue-400/20 stroke-blue-400 stroke-2"
            />
          </svg>
        </div>
        
        {/* Center circle with dot pattern */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 animate-pulse shadow-lg">
            <div className="w-full h-full rounded-full bg-dots-white/20"></div>
          </div>
        </div>

        {/* Orbiting dots */}
        <div className="absolute inset-0 animate-spin-reverse">
          <div className="absolute top-0 left-1/2 -translate-x-1 w-2 h-2 rounded-full bg-blue-400"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1 w-2 h-2 rounded-full bg-blue-400"></div>
          <div className="absolute top-1/4 right-0 w-2 h-2 rounded-full bg-blue-400"></div>
          <div className="absolute top-3/4 left-0 w-2 h-2 rounded-full bg-blue-400"></div>
        </div>
      </div>
    </div>
  );
};

export default CryptoLoader;