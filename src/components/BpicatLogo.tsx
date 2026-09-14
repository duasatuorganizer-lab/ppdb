import React from 'react';

interface BpicatLogoProps {
  className?: string;
  size?: number | string;
  alt?: string;
}

export const BpicatLogo: React.FC<BpicatLogoProps> = ({ 
  className = 'w-10 h-10', 
  alt = 'Logo Badan Pengelola Islamic Centre At Taufiq' 
}) => {
  return (
    <img 
      src="/logo-bpicat.svg" 
      alt={alt}
      className={`shrink-0 object-contain rounded-full shadow-xs bg-white ${className}`}
      loading="eager"
    />
  );
};
