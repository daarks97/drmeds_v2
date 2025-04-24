
import React from 'react';

interface MedicalIconProps {
  name: string;
  size?: number;
  className?: string;
}

const MedicalIcon: React.FC<MedicalIconProps> = ({ name, size = 24, className = '' }) => {
  return (
    <div 
      className={`flex items-center justify-center ${className}`}
      style={{ fontSize: `${size}px`, lineHeight: 1 }}
    >
      {name}
    </div>
  );
};

export default MedicalIcon;
