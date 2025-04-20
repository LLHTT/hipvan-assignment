import { useEffect, useRef, useState } from 'react';

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void>;
  pullDownThreshold?: number;
  maxPullDownDistance?: number;
}

const usePullToRefresh = ({
  onRefresh,
  pullDownThreshold = 80,
  maxPullDownDistance = 120,
}: UsePullToRefreshOptions) => {
  const [isPulling, setIsPulling] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [pullDistance, setPullDistance] = useState<number>(0);
  const startYRef = useRef<number | null>(null);
  const scrollTopRef = useRef<boolean>(false);

  useEffect(() => {
    // Only enable on touch devices
    if (typeof window === 'undefined' || !('ontouchstart' in window)) {
      return;
    }

    const handleTouchStart = (e: TouchEvent) => {
      // Only trigger if at the top of the page
      if (window.scrollY <= 0) {
        scrollTopRef.current = true;
        startYRef.current = e.touches[0].clientY;
      } else {
        scrollTopRef.current = false;
        startYRef.current = null;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!scrollTopRef.current || startYRef.current === null || isRefreshing) {
        return;
      }

      const currentY = e.touches[0].clientY;
      const diff = currentY - startYRef.current;

      // Only allow pulling down
      if (diff > 0) {
        setIsPulling(true);
        const distance = Math.min(diff * 0.5, maxPullDownDistance);
        setPullDistance(distance);

        // Prevent default scrolling behavior
        if (diff > 5) {
          e.preventDefault();
        }
      }
    };

    const handleTouchEnd = async () => {
      if (!isPulling) {
        return;
      }

      if (pullDistance >= pullDownThreshold) {
        setIsRefreshing(true);
        try {
          await onRefresh();
        } finally {
          setIsRefreshing(false);
        }
      }

      setIsPulling(false);
      setPullDistance(0);
      startYRef.current = null;
      scrollTopRef.current = false;
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isPulling, isRefreshing, pullDistance, pullDownThreshold, maxPullDownDistance, onRefresh]);

  return {
    isPulling,
    isRefreshing,
    pullDistance,
    pullProgress: Math.min(pullDistance / pullDownThreshold, 1),
  };
};

export default usePullToRefresh;
