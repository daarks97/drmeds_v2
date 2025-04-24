// src/components/dashboard/ECGLine.tsx

import React from 'react';

interface ECGLineProps {
  color?: string; // ex: "#facc15"
}

const ECGLine: React.FC<ECGLineProps> = ({ color = 'rgb(250 204 21)' }) => {
  return (
    <div className="w-full overflow-hidden">
      <svg
        className="w-full h-8"
        viewBox="0 0 100 20"
        preserveAspectRatio="none"
      >
        <path
          d="M0 10 H10 L13 4 L16 16 L20 10 H30 L33 6 L36 14 L40 10 H100"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          className="animate-ecg"
        />
      </svg>

      <style>
        {`
          .animate-ecg {
            stroke-dasharray: 150;
            stroke-dashoffset: 0;
            animation: dashMove 2s linear infinite;
          }

          @keyframes dashMove {
            0% {
              stroke-dashoffset: 150;
            }
            100% {
              stroke-dashoffset: 0;
            }
          }
        `}
      </style>
    </div>
  );
};

export default ECGLine;
