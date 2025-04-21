import { useState } from 'react';
import VideoBanner from '../components/VideoBanner';

const Feed = () => {
  const [loading] = useState(false);

  const videoUrl = 'https://videos.pexels.com/video-files/852421/852421-hd_1920_1080_30fps.mp4';

  return (
    <main className="min-h-screen bg-neutral-50">
      <VideoBanner videoUrl={videoUrl} />

      <h1 className="text-3xl font-bold text-center py-8">Responsive Feed UI</h1>
      <div className="container h-[10000px] mx-auto px-4">
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
