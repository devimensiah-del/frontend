import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean; // Option to hide text for small icons
}

export const ImensiahLogo = ({ className = "w-full h-full", showText = true }: LogoProps) => {
  return (
    <svg 
      viewBox="0 0 240 240" // Adjusted viewport to include text
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      {/* --- LEFT HEMISPHERE (A - Tech/Circuit) --- */}
      <g id="LeftBrain_A" stroke="var(--navy-900)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
        {/* The "A" Shape */}
        <path d="M90 40 V140" strokeWidth="8" /> {/* Center Spine */}
        <path d="M50 70 L70 70 L90 40 L110 70" /> {/* Top of A */}
        <path d="M60 100 H90" /> {/* Crossbar */}
        
        {/* Circuit Connections */}
        <path d="M20 60 H40 L50 70" /> {/* Top Input */}
        <circle cx="15" cy="60" r="5" fill="var(--navy-900)" stroke="none" />
        
        <path d="M20 100 H50" /> {/* Middle Input */}
        <circle cx="15" cy="100" r="5" fill="var(--navy-900)" stroke="none" />
        
        <path d="M30 140 H50 L60 120" /> {/* Bottom Input */}
        <circle cx="25" cy="140" r="5" fill="var(--navy-900)" stroke="none" />
        
        {/* Outer Lobe Shape (Circuit Style) */}
        <path d="M90 20 H70 C40 20 30 40 30 50" strokeWidth="6" />
        <path d="M30 130 C30 150 50 160 90 160" strokeWidth="6" />
      </g>

      {/* --- RIGHT HEMISPHERE (H - Human/Organic) --- */}
      <g id="RightBrain_H" stroke="var(--gold-500)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
        {/* The "H" Shape */}
        <path d="M130 40 V140" /> {/* Left Leg of H */}
        <path d="M170 70 V140" /> {/* Right Leg of H (partial) */}
        <path d="M130 100 H170" /> {/* Crossbar */}
        
        {/* Neural Connections (Wavy) */}
        <path d="M170 70 C190 50 210 60 220 50" /> {/* Top Synapse */}
        <circle cx="225" cy="50" r="5" fill="var(--gold-500)" stroke="none" />
        
        <path d="M170 100 C190 100 200 110 220 100" /> {/* Middle Synapse */}
        <circle cx="225" cy="100" r="5" fill="var(--gold-500)" stroke="none" />
        
        <path d="M150 140 C160 150 190 130 200 150" /> {/* Bottom Synapse */}
        <circle cx="205" cy="150" r="5" fill="var(--gold-500)" stroke="none" />

        {/* Outer Lobe Shape (Organic Style) */}
        <path d="M130 20 C160 20 190 30 190 60" strokeWidth="6" />
        <path d="M190 140 C190 150 160 160 130 160" strokeWidth="6" />
      </g>

      {/* --- TEXT --- */}
      {showText && (
        <g transform="translate(0, 210)">
          {/* IMENSI (Navy) */}
          <text 
            x="20" 
            y="0" 
            fill="var(--navy-900)" 
            fontFamily="var(--font-heading), sans-serif" 
            fontWeight="800" 
            fontSize="38"
            letterSpacing="0.05em"
          >
            IMENSI
          </text>
          {/* AH (Gold) */}
          <text 
            x="172" 
            y="0" 
            fill="var(--gold-500)" 
            fontFamily="var(--font-heading), sans-serif" 
            fontWeight="800" 
            fontSize="38"
            letterSpacing="0.05em"
          >
            AH
          </text>
        </g>
      )}
    </svg>
  );
};