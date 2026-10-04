import React from 'react';

export const SentinelLogo: React.FC<{ className?: string }> = ({ className = "h-8 w-8" }) => (
  <img
    src="/sentinel_icon_transparent.png"
    alt="SENTINEL"
    className={`${className} object-contain`}
  />
);
