import { useEffect, useState, useRef, useCallback } from 'react';
import MasonryGrid from './MasonryGrid';
import FeedItem from './FeedItem';
import VideoBanner from './VideoBanner';
import { loadFeedData, loadNextFeedData, loadVideo } from '../services/feedService';
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
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

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
    <div className="container mx-auto px-4 py-8">
      {/* Current video banner */}
      {currentVideo && <VideoBanner videoUrl={currentVideo.src} />}

      {/* Current feed items */}
      <div className="mt-8">
        <MasonryGrid>
          {currentFeedItems.map((item, index) => (
            <FeedItem key={`current-${item.type}-${item.id}-${index}`} item={item} />
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
