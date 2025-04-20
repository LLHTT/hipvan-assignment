import { useState } from 'react';

const Feed = () => {
  const [loading, setLoading] = useState(false);

  return (
    <main className="min-h-screen bg-neutral-50">
      <h1 className="text-3xl font-bold text-center py-8">Responsive Feed UI</h1>
      <div className="container mx-auto px-4">
        <p className="text-center mb-8">
          This feed will include a video banner, masonry image grid, Fibonacci ads, and pagination.
        </p>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading...</p>
          </div>
        ) : (
          <div className="text-center">
            <p>Content will be loaded here</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Feed;
