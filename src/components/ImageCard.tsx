import { useState } from 'react';

interface ImageCardProps {
  src: string;
  alt: string;
  title?: string;
  description?: string;
}

const ImageCard = ({ src, alt, title, description }: ImageCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  return (
    <div className="group rounded-lg overflow-hidden bg-white shadow-md transition-shadow hover:shadow-lg">
      <div className="relative overflow-hidden aspect-auto">
        {/* Show skeleton loader while image is loading */}
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
        )}

        {hasError ? (
          <div className="w-full h-48 flex items-center justify-center bg-gray-100 text-gray-400">
            <span>Image unavailable</span>
          </div>
        ) : (
          <img
            src={src}
            alt={alt}
            className={`w-full h-auto object-cover transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleLoad}
            onError={handleError}
            loading="lazy"
          />
        )}
      </div>

      {(title || description) && (
        <div className="p-4">
          {title && <h3 className="text-lg font-medium text-neutral-900 mb-1">{title}</h3>}
          {description && <p className="text-sm text-neutral-600">{description}</p>}
        </div>
      )}
    </div>
  );
};

export default ImageCard;
