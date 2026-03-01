export default function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 1024 1024" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="1024" y2="1024" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3b82f6"/>
          <stop offset="1" stopColor="#9333ea"/>
        </linearGradient>
      </defs>
      
      <rect width="1024" height="1024" rx="220" fill="url(#grad)"/>
      
      {/* Sound Bars */}
      <rect x="390" y="170" width="60" height="120" rx="30" fill="white"/>
      <rect x="482" y="110" width="60" height="180" rx="30" fill="white"/>
      <rect x="574" y="170" width="60" height="120" rx="30" fill="white"/>

      {/* Text */}
      <text 
        x="512" 
        y="780" 
        fontFamily="sans-serif" 
        fontWeight="900" 
        fontSize="550" 
        fill="white" 
        textAnchor="middle" 
        style={{ letterSpacing: "-25px" }}
      >
        LP
      </text>
    </svg>
  );
}
