import { useState, useRef, useEffect } from 'react';

interface ProductTagProps {
  x: number;
  y: number;
  label: string;
  price: string;
}

const ProductTag = ({ x, y, label, price }: ProductTagProps) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });
  const tagRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Function to calculate tooltip position
  const calculateTooltipPosition = () => {
    if (!tagRef.current || !tooltipRef.current) return;

    const tag = tagRef.current.getBoundingClientRect();
    const tooltip = tooltipRef.current.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // Initial position (above the tag)
    let top = -tooltip.height - 10;
    let left = -(tooltip.width / 2) + tag.width / 2;

    // Check if tooltip goes beyond right edge of viewport
    if (tag.left + left + tooltip.width > viewport.width) {
      left = viewport.width - tooltip.width - tag.left;
    }

    // Check if tooltip goes beyond left edge of viewport
    if (tag.left + left < 0) {
      left = -tag.left + 10;
    }

    // Check if tooltip goes beyond top edge of viewport
    if (tag.top + top < 0) {
      // Position below the tag instead
      top = tag.height + 10;
    }

    setTooltipPosition({ top, left });
  };

  // Recalculate tooltip position when it becomes visible
  useEffect(() => {
    if (isTooltipVisible) {
      calculateTooltipPosition();
    }
  }, [isTooltipVisible]);

  // Also recalculate on window resize
  useEffect(() => {
    const handleResize = () => {
      if (isTooltipVisible) {
        calculateTooltipPosition();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isTooltipVisible]);

  // Handle different interactions for desktop and mobile
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const handleInteraction = () => {
    if (isMobile) {
      setIsTooltipVisible(!isTooltipVisible);
    }
  };

  return (
    <div
      ref={tagRef}
      className="absolute z-10 cursor-pointer"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      onClick={handleInteraction}
      onMouseEnter={() => !isMobile && setIsTooltipVisible(true)}
      onMouseLeave={() => !isMobile && setIsTooltipVisible(false)}
    >
      {/* Circular hotspot */}
      <div className="w-6 h-6 rounded-full bg-white border-2 border-gray-800 flex items-center justify-center shadow-md">
        <div className="w-3 h-3 rounded-full bg-gray-800"></div>
      </div>

      {/* Tooltip */}
      {isTooltipVisible && (
        <div
          ref={tooltipRef}
          className="absolute bg-white rounded-md shadow-lg p-3 z-20 transition-all duration-300 transform origin-bottom"
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
            opacity: isTooltipVisible ? 1 : 0,
            animation: 'fadeIn 0.3s ease-in-out',
          }}
        >
          <div className="flex flex-col items-center">
            <p className="font-bold text-lg text-gray-800 price-animation">{price}</p>
            <p className="whitespace-nowrap text-sm text-gray-800 mt-1">{label}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductTag;
