import { useEffect, useRef, useState } from 'react';

interface VideoBannerProps {
  videoUrl: string;
  className?: string;
}

const VideoBanner = ({ videoUrl, className = '' }: VideoBannerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const previousVisibilityRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Set up IntersectionObserver to detect when video is in view
  useEffect(() => {
    const options = {
      root: null, // viewport
      rootMargin: '0px',
      threshold: 0.1, // 10% of the element must be visible
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      const newVisibility = entry.isIntersecting;

      // If video is transitioning from visible to not visible,
      // reset the userPaused flag so it will autoplay next time
      if (previousVisibilityRef.current && !newVisibility) {
        setUserPaused(false);
      }

      // Update visibility state and reference
      setIsVisible(newVisibility);
      previousVisibilityRef.current = newVisibility;
    };

    if (videoRef.current) {
      observerRef.current = new IntersectionObserver(handleIntersection, options);
      observerRef.current.observe(videoRef.current);
    }

    // Cleanup observer on unmount
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Control video playback based on visibility and user interaction
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handlePlay = () => {
      setUserPaused(false);
    };

    const handlePause = () => {
      if (isVisible) {
        setUserPaused(true);
      }
    };

    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);

    // Autoplay when visible (unless user explicitly paused)
    if (isVisible && !userPaused) {
      const playPromise = videoElement.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay prevented by browser
        });
      }
    } else if (!isVisible && !videoElement.paused) {
      videoElement.pause();
    }

    return () => {
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
    };
  }, [isVisible, userPaused]);

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        className="w-full h-auto object-cover"
        muted
        playsInline
        loop
        preload="metadata"
        controls
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoBanner;
