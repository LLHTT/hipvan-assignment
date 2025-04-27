import injectAdsWithFibonacci from '../utils/feedUtils';
import type { AdItem, FeedItem, ImageItem } from '../utils/feedUtils';
import type { VideoItem } from '../utils/types';
import { fetchMultipleUnsplashImages } from '../utils/unsplashService';

/**
 * Loads image data and video from current.json
 *
 * @returns Promise containing an object with images array and video object
 */
const loadCurrentData = async (): Promise<{ images: ImageItem[]; video: VideoItem }> => {
  try {
    const response = await fetch('/src/data/current.json');
    if (!response.ok) {
      throw new Error('Failed to load current data');
    }
    const data = await response.json();
    return {
      images: data.images,
      video: data.video,
    };
  } catch (error) {
    console.error('Error loading current data:', error);
    return { images: [], video: null as unknown as VideoItem };
  }
};

/**
 * Loads image data from current.json
 *
 * @returns Promise containing array of image items
 */
const loadImages = async (): Promise<ImageItem[]> => {
  try {
    const data = await loadCurrentData();
    return data.images;
  } catch (error) {
    console.error('Error loading images:', error);
    return [];
  }
};

/**
 * Loads the video from current.json
 *
 * @returns Promise containing the video object
 */
const loadVideo = async (): Promise<VideoItem> => {
  try {
    const data = await loadCurrentData();
    return data.video;
  } catch (error) {
    console.error('Error loading video:', error);
    return null as unknown as VideoItem;
  }
};

/**
 * Loads image data and video from next.json
 *
 * @returns Promise containing an object with images array and video object
 */
const loadNextData = async (): Promise<{ images: ImageItem[]; video: VideoItem }> => {
  try {
    const response = await fetch('/src/data/next.json');
    if (!response.ok) {
      throw new Error('Failed to load next data');
    }
    const data = await response.json();
    return {
      images: data.images,
      video: data.video,
    };
  } catch (error) {
    console.error('Error loading next data:', error);
    return { images: [], video: null as unknown as VideoItem };
  }
};

/**
 * Loads image data and video from prev.json
 *
 * @returns Promise containing an object with images array and video object
 */
const loadPrevData = async (): Promise<{ images: ImageItem[]; video: VideoItem }> => {
  try {
    const response = await fetch('/src/data/prev.json');
    if (!response.ok) {
      throw new Error('Failed to load previous data');
    }
    const data = await response.json();
    return {
      images: data.images,
      video: data.video,
    };
  } catch (error) {
    console.error('Error loading previous data:', error);
    return { images: [], video: null as unknown as VideoItem };
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

/**
 * Loads and merges next feed data (images, video, and ads)
 *
 * @returns Promise containing video and merged feed items from the next dataset
 */
const loadNextFeedData = async (): Promise<{ feedItems: FeedItem[]; video: VideoItem }> => {
  try {
    const [nextData, ads] = await Promise.all([loadNextData(), loadAds()]);
    const { images, video } = nextData;
    const feedItems = injectAdsWithFibonacci(images, ads) as FeedItem[];
    return {
      feedItems,
      video,
    };
  } catch (error) {
    console.error('Error loading next feed data:', error);
    return { feedItems: [], video: null as unknown as VideoItem };
  }
};

/**
 * Loads and merges previous feed data (images, video, and ads)
 *
 * @returns Promise containing video and merged feed items from the previous dataset
 */
const loadPrevFeedData = async (): Promise<{ feedItems: FeedItem[]; video: VideoItem }> => {
  try {
    const [prevData, ads] = await Promise.all([loadPrevData(), loadAds()]);
    const { images, video } = prevData;
    const feedItems = injectAdsWithFibonacci(images, ads) as FeedItem[];
    return {
      feedItems,
      video,
    };
  } catch (error) {
    console.error('Error loading previous feed data:', error);
    return { feedItems: [], video: null as unknown as VideoItem };
  }
};

export { loadFeedData, loadImages, loadAds, loadNextFeedData, loadVideo, loadPrevFeedData };
