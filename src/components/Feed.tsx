import { useEffect, useState } from 'react';
import MasonryGrid from './MasonryGrid';
import FeedItem from './FeedItem';
import { loadFeedData } from '../services/feedService';
import type { FeedItem as FeedItemType } from '../utils/feedUtils';

const Feed = () => {
  const [feedItems, setFeedItems] = useState<FeedItemType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeedData = async () => {
      try {
        setIsLoading(true);
        const data = await loadFeedData();
        setFeedItems(data);
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

  if (feedItems.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <p className="text-gray-600">No feed items available.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <MasonryGrid>
        {feedItems.map(item => (
          <FeedItem key={`${item.type}-${item.id}`} item={item} />
        ))}
      </MasonryGrid>
    </div>
  );
};

export default Feed;
