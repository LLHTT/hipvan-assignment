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
  const [tooltipDirection, setTooltipDirection] = useState<'top' | 'right' | 'bottom' | 'left'>(
    'top'
  );
  const tagRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Find the container (image container - the relative parent)
    if (tagRef.current) {
      // Find closest parent with position relative
      let parent = tagRef.current.parentElement;
      while (parent) {
        const position = window.getComputedStyle(parent).getPropertyValue('position');
        if (position === 'relative') {
          containerRef.current = parent as HTMLDivElement;
          break;
        }
        parent = parent.parentElement;
      }
    }
  }, []);

  // Function to calculate tooltip position
  const calculateTooltipPosition = () => {
    if (!tagRef.current || !tooltipRef.current || !containerRef.current) return;

    const tag = tagRef.current.getBoundingClientRect();
    const tooltip = tooltipRef.current.getBoundingClientRect();
    const container = containerRef.current.getBoundingClientRect();

    // Convert coordinates to be relative to container
    const tagLeft = tag.left - container.left;
    const tagTop = tag.top - container.top;
    const containerWidth = container.width;
    const containerHeight = container.height;

    // Try all four positions and find the best one
    const positions = [
      { direction: 'top', top: -tooltip.height - 10, left: -(tooltip.width / 2) + tag.width / 2 },
      { direction: 'right', top: -(tooltip.height / 2) + tag.height / 2, left: tag.width + 10 },
      { direction: 'bottom', top: tag.height + 10, left: -(tooltip.width / 2) + tag.width / 2 },
      { direction: 'left', top: -(tooltip.height / 2) + tag.height / 2, left: -tooltip.width - 10 },
    ];

    // Check fit for each position
    for (const pos of positions) {
      const tooltipLeft = tagLeft + pos.left;
      const tooltipTop = tagTop + pos.top;
      const tooltipRight = tooltipLeft + tooltip.width;
      const tooltipBottom = tooltipTop + tooltip.height;

      // Check if tooltip fits within container in this position
      if (
        tooltipLeft >= 0 &&
        tooltipTop >= 0 &&
        tooltipRight <= containerWidth &&
        tooltipBottom <= containerHeight
      ) {
        // Found a good position
        setTooltipPosition({ top: pos.top, left: pos.left });
        setTooltipDirection(pos.direction as 'top' | 'right' | 'bottom' | 'left');
        return;
      }
    }

    // If no perfect position, use the one that's most inside the container
    const bestPosition = positions
      .map(pos => {
        const tooltipLeft = tagLeft + pos.left;
        const tooltipTop = tagTop + pos.top;
        const tooltipRight = tooltipLeft + tooltip.width;
        const tooltipBottom = tooltipTop + tooltip.height;

        // Calculate how much the tooltip is outside the container
        const leftOverflow = Math.max(0, -tooltipLeft);
        const topOverflow = Math.max(0, -tooltipTop);
        const rightOverflow = Math.max(0, tooltipRight - containerWidth);
        const bottomOverflow = Math.max(0, tooltipBottom - containerHeight);

        // Calculate total overflow
        const totalOverflow = leftOverflow + topOverflow + rightOverflow + bottomOverflow;

        return { ...pos, overflow: totalOverflow };
      })
      .sort((a, b) => a.overflow - b.overflow)[0]; // Sort by least overflow

    // Adjust position to minimize overflow
    let { top, left } = bestPosition;

    // Adjust horizontal position if needed
    if (tagLeft + left < 0) {
      left = -tagLeft + 10; // Keep 10px from left edge
    } else if (tagLeft + left + tooltip.width > containerWidth) {
      left = containerWidth - tagLeft - tooltip.width - 10; // Keep 10px from right edge
    }

    // Adjust vertical position if needed
    if (tagTop + top < 0) {
      top = -tagTop + 10; // Keep 10px from top edge
    } else if (tagTop + top + tooltip.height > containerHeight) {
      top = containerHeight - tagTop - tooltip.height - 10; // Keep 10px from bottom edge
    }

    setTooltipPosition({ top, left });
    setTooltipDirection(bestPosition.direction as 'top' | 'right' | 'bottom' | 'left');
  };

  // Recalculate tooltip position when it becomes visible
  useEffect(() => {
    if (isTooltipVisible) {
      // Use timeout to ensure DOM is updated before calculating
      setTimeout(calculateTooltipPosition, 0);
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

  // Also recalculate on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isTooltipVisible) {
        calculateTooltipPosition();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isTooltipVisible]);

  // Handle different interactions for desktop and mobile
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const handleInteraction = () => {
    if (isMobile) {
      setIsTooltipVisible(!isTooltipVisible);
    }
  };

  // Get origin point for animation based on direction
  const getTransformOrigin = () => {
    switch (tooltipDirection) {
      case 'top':
        return 'center bottom';
      case 'right':
        return 'left center';
      case 'bottom':
        return 'center top';
      case 'left':
        return 'right center';
      default:
        return 'center bottom';
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
          className="absolute bg-white rounded-md shadow-lg p-3 z-20 transition-all duration-300"
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
            opacity: isTooltipVisible ? 1 : 0,
            animation: 'fadeIn 0.3s ease-in-out',
            transformOrigin: getTransformOrigin(),
          }}
        >
          <div className="flex flex-col items-center whitespace-nowrap">
            <p className="font-bold text-lg text-gray-800 price-animation">{price}</p>
            <p className="text-sm text-gray-800 mt-1">{label}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductTag;
