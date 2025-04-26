import injectAdsWithFibonacci from '../utils/feedUtils';
import type { AdItem, FeedItem, ImageItem } from '../utils/feedUtils';
import { fetchMultipleUnsplashImages } from '../utils/unsplashService';

/**
 * Loads image data from current.json
 *
 * @returns Promise containing array of image items
 */
const loadImages = async (): Promise<ImageItem[]> => {
  try {
    const response = await fetch('/src/data/current.json');
    if (!response.ok) {
      throw new Error('Failed to load images');
    }
    const data = await response.json();
    return data.images;
  } catch (error) {
    console.error('Error loading images:', error);
    return [];
  }
};

/**
 * Loads advertisement data from advertisement.json
 *
 * @returns Promise containing array of ad items
 *
 * Performance optimizations:
 * - Parallel processing: Maps through ads while keeping original order
 * - Consistent image parameters: Uses same orientation/query for visual consistency
 */
const loadAds = async (): Promise<AdItem[]> => {
  try {
    const response = await fetch('/src/data/advertisement.json');
    if (!response.ok) {
      throw new Error('Failed to load advertisements');
    }
    const ads = await response.json();

    const adCount = ads.length;
    const imageData = await fetchMultipleUnsplashImages(adCount, 'furniture,interior,home');

    return ads.map((ad: AdItem, index: number) => ({
      ...ad,
      imageSrc: imageData[index].url,
      imageAlt: imageData[index].alt,
    }));
  } catch (error) {
    console.error('Error loading advertisements:', error);
    return [];
  }
};

/**
 * Loads and merges feed data (images and ads)
 *
 * @returns Promise containing merged feed items with ads inserted at Fibonacci positions
 *
 * Performance optimizations:
 * - Parallel data loading: Uses Promise.all to fetch images and ads concurrently
 * - Efficient merging: Leverages the Fibonacci algorithm for deterministic ad placement
 * - Single render cycle: Returns complete feed data to minimize UI updates
 *
 * Time Complexity: O(n) where n is the number of feed items
 * Space Complexity: O(n) for the final feed array
 */
const loadFeedData = async (): Promise<FeedItem[]> => {
  try {
    const [images, ads] = await Promise.all([loadImages(), loadAds()]);
    return injectAdsWithFibonacci(images, ads) as FeedItem[];
  } catch (error) {
    console.error('Error loading feed data:', error);
    return [];
  }
};

export { loadFeedData, loadImages, loadAds };
