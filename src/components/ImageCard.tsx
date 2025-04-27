import type { ImageItem } from '../utils/feedUtils';
import ImageWithFallback from './ImageWithFallback';
import { FALLBACK_IMAGE_URL } from '../utils/constants';

interface ImageCardProps {
  image: ImageItem;
}

const ImageCard = ({ image }: ImageCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="h-48 w-full overflow-hidden">
        <ImageWithFallback
          src={image.src}
          alt={image.alt}
          fallbackSrc={FALLBACK_IMAGE_URL}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      <div className="p-4">
        {image.title && <h3 className="text-lg font-bold text-gray-800 mb-2">{image.title}</h3>}

        {image.description && <p className="text-gray-600 text-sm">{image.description}</p>}
      </div>
    </div>
  );
};

export default ImageCard;
