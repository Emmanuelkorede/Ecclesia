import React from 'react';

export const Logo: React.FC<React.SVGProps<SVGSVGElement>> = ({ 
  className = "h-10 w-auto", // Default height, keeps aspect ratio
  ...props 
}) => {
  return (
    <svg
      viewBox="0 0 900 220"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <text
        x="60"
        y="145"
        fontFamily="Helvetica, Arial, sans-serif"
        fontSize="96"
        fontWeight="300"
        fill="currentColor"
        letterSpacing="4"
      >
        ECCLESI
      </text>

      <g
        transform="translate(490,20)"
        stroke="currentColor"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="42" y1="0" x2="42" y2="22" />
        <line x1="34" y1="8" x2="50" y2="8" />

        <line x1="42" y1="22" x2="28" y2="62" />
        <line x1="42" y1="22" x2="56" y2="62" />

        <polyline points="28,62 42,48 56,62" />

        <line x1="28" y1="62" x2="12" y2="170" />

        <line x1="56" y1="62" x2="72" y2="170" />

        <path
          d="M28 170
             C40 135,52 105,72 90
             C63 118,58 145,56 170"
        />

        <line x1="12" y1="170" x2="56" y2="170" />
      </g>
    </svg>
  );
};