
import React from 'react';

type PlaceholderIconProps = {
  name: string;
  size?: number;
  className?: string;
};

const PlaceholderIcon: React.FC<PlaceholderIconProps> = ({ 
  name, 
  size = 24, 
  className = "" 
}) => {
  return (
    <div 
      className={`flex items-center justify-center bg-gray-200 rounded-full ${className}`}
      style={{ width: size, height: size }}
    >
      <span className="text-xs text-gray-500">
        {name.substring(0, 2).toUpperCase()}
      </span>
    </div>
  );
};

export default PlaceholderIcon;
