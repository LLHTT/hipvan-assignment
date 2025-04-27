import { useState } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc: string;
}

const ImageWithFallback = ({ src, alt, fallbackSrc, ...props }: ImageWithFallbackProps) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setImgSrc(fallbackSrc);
      setHasError(true);
    }
  };

  return <img src={imgSrc} alt={alt} onError={handleError} {...props} />;
};

export default ImageWithFallback;
