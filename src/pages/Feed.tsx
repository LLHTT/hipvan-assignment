import { useState, useEffect } from 'react';
import VideoBanner from '../components/VideoBanner';
import MasonryGrid from '../components/MasonryGrid';
import ImageCard from '../components/ImageCard';
import imageData from '../data/imageData';

const Feed = () => {
  const [loading, setLoading] = useState(true);
  const videoUrl = 'https://videos.pexels.com/video-files/852421/852421-hd_1920_1080_30fps.mp4';

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const gridItems = imageData.map(image => (
    <ImageCard
      key={`image-${image.id}`}
      src={image.src}
      alt={image.alt}
      title={image.title}
      description={image.description}
    />
  ));

  return (
    <main className="min-h-screen bg-neutral-50">
      <VideoBanner videoUrl={videoUrl} />

      <h1 className="text-3xl font-bold text-center text-neutral-900 py-8">Responsive Feed UI</h1>
      <div className="container mx-auto px-4 pb-16">
        <p className="text-center text-neutral-800 mb-8">
          A responsive masonry grid layout for displaying content.
        </p>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading...</p>
          </div>
        ) : (
          <MasonryGrid>{gridItems}</MasonryGrid>
        )}
      </div>
    </main>
  );
};

export default Feed;
