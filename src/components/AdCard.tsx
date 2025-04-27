import type { AdItem } from '../utils/feedUtils';
import ImageWithFallback from './ImageWithFallback';
import { FALLBACK_IMAGE_URL } from '../utils/constants';

interface AdCardProps {
  ad: AdItem;
}

const AdCard = ({ ad }: AdCardProps) => {
  const imageSource = ad.imageSrc || FALLBACK_IMAGE_URL;
  const altText = ad.imageAlt || ad.title || 'Advertisement';

  return (
    <div className="relative bg-white rounded-lg shadow-md overflow-hidden border-2 border-yellow-300">
      {/* Sponsored tag */}
      <div className="absolute top-2 right-2 bg-yellow-400 text-xs px-2 py-1 rounded-full text-gray-800 font-semibold">
        Sponsored
      </div>

      {/* Image from Unsplash */}
      <div className="h-48 w-full overflow-hidden">
        <ImageWithFallback
          src={imageSource}
          alt={altText}
          fallbackSrc={FALLBACK_IMAGE_URL}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2">{ad.title}</h3>
        <p className="text-gray-600 text-sm mb-4">{ad.description}</p>

        {/* CTA Button */}
        <a
          href={ad.url}
          className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
        >
          {ad.cta}
        </a>
      </div>
    </div>
  );
};

export default AdCard;
