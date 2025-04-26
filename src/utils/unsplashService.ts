/**
 * Service for fetching images from Unsplash API
 */

interface UnsplashImageResponse {
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string | null;
  description: string | null;
}

/**
 * Fetch multiple random images from Unsplash API
 * @param {number} count - Number of images to fetch
 * @param {string} query - Optional search query term
 * @param {string} orientation - Optional orientation (landscape, portrait, squarish)
 * @returns {Promise<Array<{url: string, alt: string}>>} Array of objects containing image URLs and alt text
 */
export const fetchMultipleUnsplashImages = async (
  count = 1,
  query = 'furniture,interior',
  orientation = 'landscape'
): Promise<Array<{ url: string; alt: string }>> => {
  try {
    const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

    if (!accessKey) {
      return Array(count).fill({
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
        alt: 'Fallback image from Unsplash',
      });
    }

    let apiUrl = `https://api.unsplash.com/photos/random?client_id=${accessKey}&count=${count}`;

    if (query) {
      apiUrl += `&query=${encodeURIComponent(query)}`;
    }

    if (orientation) {
      apiUrl += `&orientation=${orientation}`;
    }

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const data = (await response.json()) as UnsplashImageResponse[];

    return data.map((item: UnsplashImageResponse) => ({
      url: item.urls.regular,
      alt: item.alt_description || item.description || 'Image from Unsplash',
    }));
  } catch (error) {
    console.error('Error fetching multiple images from Unsplash API:', error);
    return Array(count).fill({
      url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
      alt: 'Fallback image from Unsplash',
    });
  }
};
