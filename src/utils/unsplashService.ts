import { FALLBACK_IMAGE_URL } from './constants';

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
 * @returns {Promise<Array<{url: string, alt: string}>>} Array of objects containing image URLs and alt text
 *
 * Time Complexity: O(1) for API call + O(n) for processing results where n is count
 * Space Complexity: O(n) where n is the number of images
 */
export const fetchMultipleUnsplashImages = async (
  count = 1,
  query = 'furniture,interior'
): Promise<Array<{ url: string; alt: string }>> => {
  try {
    const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

    if (!accessKey) {
      return Array(count).fill({
        url: FALLBACK_IMAGE_URL,
        alt: 'Fallback image from Unsplash',
      });
    }

    const orientations = ['landscape', 'portrait', 'squarish'];
    const randomOrientation = orientations[Math.floor(Math.random() * orientations.length)];

    let apiUrl = `https://api.unsplash.com/photos/random?client_id=${accessKey}&count=${count}`;

    if (query) {
      apiUrl += `&query=${encodeURIComponent(query)}`;
    }

    apiUrl += `&orientation=${randomOrientation}`;

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
      url: FALLBACK_IMAGE_URL,
      alt: 'Fallback image from Unsplash',
    });
  }
};
