import { useState, useEffect } from 'react';
import Feed from '../components/Feed';

const FeedPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-neutral-50">
      <h1 className="text-3xl font-bold text-center text-neutral-900 py-8">Responsive Feed UI</h1>
      <div className="container mx-auto px-4 pb-16">
        <p className="text-center text-neutral-800 mb-8">
          A responsive masonry grid layout with images and ads at Fibonacci positions.
        </p>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading...</p>
          </div>
        ) : (
          <Feed />
        )}
      </div>
    </main>
  );
};

export default FeedPage;
