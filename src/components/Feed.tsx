import { useEffect, useState, useRef, useCallback } from 'react';
import MasonryGrid from './MasonryGrid';
import FeedItem from './FeedItem';
import VideoBanner from './VideoBanner';
import {
  loadFeedData,
  loadNextFeedData,
  loadVideo,
  loadPrevFeedData,
} from '../services/feedService';
import type { FeedItem as FeedItemType } from '../utils/feedUtils';
import type { VideoItem } from '../utils/types';

const Feed = () => {
  const [currentFeedItems, setCurrentFeedItems] = useState<FeedItemType[]>([]);
  const [nextFeedItems, setNextFeedItems] = useState<FeedItemType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoadedNextPage, setHasLoadedNextPage] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<VideoItem | null>(null);
  const [nextVideo, setNextVideo] = useState<VideoItem | null>(null);
  // Pull-to-refresh states
  const [isPullingToRefresh, setIsPullingToRefresh] = useState(false);
  const [hasLoadedPrevPage, setHasLoadedPrevPage] = useState(false);
  const [prevVideo, setPrevVideo] = useState<VideoItem | null>(null);
  const [prevFeedItems, setPrevFeedItems] = useState<FeedItemType[]>([]);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const feedRef = useRef<HTMLDivElement>(null);

  // Track touch start position for pull-to-refresh
  const touchStartY = useRef<number | null>(null);
  const touchMoveY = useRef<number | null>(null);
  const pullThreshold = 80; // Pixel threshold to trigger refresh

  useEffect(() => {
    const fetchFeedData = async () => {
      try {
        setIsLoading(true);
        const [data, video] = await Promise.all([loadFeedData(), loadVideo()]);
        setCurrentFeedItems(data);
        setCurrentVideo(video);
        setError(null);
      } catch (err) {
        setError('Failed to load feed data. Please try again later.');
        console.error('Error loading feed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedData();
  }, []);

  const loadMoreItems = useCallback(async () => {
    if (isLoadingMore || hasLoadedNextPage) return;

    try {
      setIsLoadingMore(true);
      const { feedItems: nextItems, video } = await loadNextFeedData();
      setNextFeedItems(nextItems);
      setNextVideo(video);
      setHasLoadedNextPage(true); // Mark as loaded so we don't fetch again
    } catch (err) {
      console.error('Error loading next feed data:', err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasLoadedNextPage]);

  // Handle pull-to-refresh functionality
  const loadPrevItems = useCallback(async () => {
    if (isPullingToRefresh || hasLoadedPrevPage) return;

    try {
      setIsPullingToRefresh(true);
      const { feedItems, video } = await loadPrevFeedData();
      setPrevVideo(video);
      setHasLoadedPrevPage(true);

      // Don't merge the data anymore, maintain separate sections
      if (feedItems.length > 0) {
        setPrevFeedItems(feedItems); // Store prev feed items separately
      }
    } catch (err) {
      console.error('Error loading previous feed data:', err);
    } finally {
      setIsPullingToRefresh(false);
    }
  }, [isPullingToRefresh, hasLoadedPrevPage]);

  // Set up touch event handlers for pull-to-refresh (mobile only)
  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY <= 5) {
        touchStartY.current = e.touches[0].clientY;
      } else {
        touchStartY.current = null;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartY.current !== null) {
        touchMoveY.current = e.touches[0].clientY;
        const pullDistance = touchMoveY.current - touchStartY.current;

        // If pulling down  not already loaded previous page
        if (pullDistance > 0 && !hasLoadedPrevPage) {
          // Prevent default scrolling behavior when pulling down
          e.preventDefault();

          // Show visual feedback of pulling (this could be improved with a custom UI)
          if (pullDistance > pullThreshold / 2) {
            document.body.style.setProperty(
              '--pull-distance',
              `${Math.min(pullDistance, pullThreshold)}px`
            );

            // Add a visual indicator for the pull action
            const indicator = document.querySelector('.pull-indicator');
            if (indicator) {
              (indicator as HTMLElement).style.opacity =
                `${Math.min(pullDistance / pullThreshold, 1)}`;
            }
          }
        }
      }
    };

    const handleTouchEnd = () => {
      if (touchStartY.current !== null && touchMoveY.current !== null) {
        const pullDistance = touchMoveY.current - touchStartY.current;

        // Reset styles
        document.body.style.removeProperty('--pull-distance');
        const indicator = document.querySelector('.pull-indicator');
        if (indicator) {
          (indicator as HTMLElement).style.opacity = '0';
        }

        // If pulled past threshold and not already loaded prev page
        if (pullDistance > pullThreshold && !hasLoadedPrevPage && !isPullingToRefresh) {
          loadPrevItems();
        }

        // Reset touch tracking
        touchStartY.current = null;
        touchMoveY.current = null;
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.body.style.removeProperty('--pull-distance');
    };
  }, [hasLoadedPrevPage, isPullingToRefresh, loadPrevItems]);

  useEffect(() => {
    if (isLoading) return;

    const options = {
      root: null,
      rootMargin: '0px 0px 500px 0px', // Load when user is 500px from bottom
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(entries => {
      const [entry] = entries;
      if (entry.isIntersecting && !hasLoadedNextPage) {
        loadMoreItems();
      }
    }, options);

    observerRef.current = observer;

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isLoading, loadMoreItems, hasLoadedNextPage]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-50 rounded-lg text-red-600">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (currentFeedItems.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <p className="text-gray-600">No feed items available.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" ref={feedRef}>
      {/* Pull-to-refresh indicator */}
      <div className="pull-indicator fixed top-0 left-0 w-full h-16 bg-blue-100 flex justify-center items-center z-50 opacity-0 transition-opacity duration-200">
        {isPullingToRefresh ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mr-2"></div>
            <span>Refreshing...</span>
          </div>
        ) : (
          <span>Pull down to refresh</span>
        )}
      </div>

      {/* Previous content section - only show when loaded */}
      {hasLoadedPrevPage && (
        <>
          {/* Previous video banner */}
          {prevVideo && <VideoBanner videoUrl={prevVideo.src} />}

          {/* Previous feed items */}
          <div className="mt-8">
            <MasonryGrid>
              {prevFeedItems.map((item, index) => (
                <FeedItem key={`prev-${item.type}-${item.id}-${index}`} item={item} />
              ))}
            </MasonryGrid>
          </div>
        </>
      )}

      {/* Current video banner */}
      {currentVideo && <VideoBanner videoUrl={currentVideo.src} />}

      {/* Current feed items */}
      <div className="mt-8">
        <MasonryGrid>
          {currentFeedItems.map((item, index) => (
            <FeedItem key={`feed-${item.type}-${item.id}-${index}`} item={item} />
          ))}
        </MasonryGrid>
      </div>

      {/* Loading indicator for next page */}
      <div ref={loadingRef} className="w-full h-20 flex justify-center items-center mt-8">
        {isLoadingMore && !hasLoadedNextPage && (
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        )}
      </div>

      {/* Next page content */}
      {nextVideo && <VideoBanner videoUrl={nextVideo.src} />}

      {/* Next feed items */}
      {nextFeedItems.length > 0 && (
        <div className="mt-8">
          <MasonryGrid>
            {nextFeedItems.map((item, index) => (
              <FeedItem key={`next-${item.type}-${item.id}-${index}`} item={item} />
            ))}
          </MasonryGrid>
        </div>
      )}
    </div>
  );
};

export default Feed;
