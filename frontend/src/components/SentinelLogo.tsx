import React from 'react';

export const SentinelLogo: React.FC<{ className?: string }> = ({ className = "h-8 w-8" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" className={className} fill="none">
    <rect width="40" height="40" rx="8" fill="#0F1318" stroke="#252C35" strokeWidth="1.5"/>
    <path d="M20 7L29 11.5V19C29 25.2 25.1 30.8 20 33C14.9 30.8 11 25.2 11 19V11.5L20 7Z" stroke="#5B9CF6" strokeWidth="1.75" strokeLinejoin="round"/>
    <path d="M16 20H24M20 16V24" stroke="#35C991" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="20" cy="20" r="1.5" fill="#F3F5F7"/>
  </svg>
);
