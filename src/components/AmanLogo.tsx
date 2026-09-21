import React from 'react';

interface AmanLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'gradient';
  showSubtitle?: boolean;
}

export const AmanLogo: React.FC<AmanLogoProps> = ({
  size = 'md',
  variant = 'light',
  showSubtitle = true
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  };

  const titleSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-4xl'
  };

  const isDark = variant === 'dark';

  return (
    <div className="flex items-center gap-3 select-none">
      {/* Visual Logo Icon: Stylized Ribbon A in Emerald / Cyan */}
      <div className={`relative ${iconSizes[size]} flex items-center justify-center shrink-0`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          <defs>
            <linearGradient id="amanGrad1" x1="15" y1="85" x2="50" y2="15" gradientUnits="userSpaceOnUse">
              <stop stopColor="#087F6E" />
              <stop offset="0.6" stopColor="#19899A" />
              <stop offset="1" stopColor="#6EE7B7" />
            </linearGradient>
            <linearGradient id="amanGrad2" x1="50" y1="15" x2="85" y2="85" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6EE7B7" />
              <stop offset="0.5" stopColor="#19899A" />
              <stop offset="1" stopColor="#087F6E" />
            </linearGradient>
            <linearGradient id="amanGradCross" x1="28" y1="58" x2="72" y2="58" gradientUnits="userSpaceOnUse">
              <stop stopColor="#087F6E" />
              <stop offset="1" stopColor="#6EE7B7" />
            </linearGradient>
          </defs>
          {/* Left leg of A */}
          <path
            d="M20 85 C 20 85, 36 35, 50 18 C 53 14, 57 14, 60 18 L 82 85 C 84 89, 78 92, 74 86 L 63 64 L 37 64 L 26 86 C 22 92, 16 89, 20 85 Z"
            fill="url(#amanGrad1)"
          />
          {/* Inner Loop & Swirl */}
          <path
            d="M50 28 L 60 54 L 40 54 Z"
            fill="#FFFFFF"
            opacity="0.95"
          />
          {/* Dynamic ribbon crossbar */}
          <path
            d="M32 58 Q 50 50 68 58 Q 50 64 32 58 Z"
            fill="url(#amanGradCross)"
          />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col text-right">
        <div className="flex items-baseline gap-2">
          <span className={`font-bold tracking-tight ${titleSizes[size]} ${isDark ? 'text-white' : 'text-[#087F6E]'}`}>
            AMAN
          </span>
          <span className={`font-bold ${titleSizes[size]} ${isDark ? 'text-white' : 'text-[#183B2D]'}`}>
            أمان
          </span>
        </div>
        {showSubtitle && (
          <span className={`text-[11px] font-medium tracking-wide ${isDark ? 'text-emerald-200/80' : 'text-[#6E7A77]'}`}>
            أمان حماية وضمان
          </span>
        )}
      </div>
    </div>
  );
};
