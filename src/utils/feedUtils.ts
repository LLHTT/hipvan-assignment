export interface ImageItem {
  id: number;
  src: string;
  alt: string;
  title?: string;
  description?: string;
  type?: 'image';
}

export interface AdItem {
  id: number;
  title: string;
  description: string;
  cta: string;
  url: string;
  type?: 'ad';
  imageSrc?: string;
  imageAlt?: string;
}

export interface FeedItem {
  id: number;
  type: 'image' | 'ad';
  content: ImageItem | AdItem;
}

// Generate Fibonacci indices up to a limit
// Time Complexity: O(log(limit)) - Fibonacci numbers grow exponentially
// Space Complexity: O(log(limit))
function getFibonacciIndices(limit: number) {
  const fib = [1, 2];
  while (true) {
    const next = fib[fib.length - 1] + fib[fib.length - 2];
    if (next >= limit) break;
    fib.push(next);
  }
  return fib;
}

// Group consecutive indices
// Time Complexity: O(n) where n is the length of indices
// Space Complexity: O(n)
function groupSequentialIndices(indices: number[]) {
  const groups = [];
  let group = [indices[0]];

  for (let i = 1; i < indices.length; i++) {
    if (indices[i] === indices[i - 1] + 1) {
      group.push(indices[i]);
    } else {
      groups.push(group);
      group = [indices[i]];
    }
  }
  groups.push(group);
  return groups;
}

// Main utility: inject ads based on Fibonacci logic
// Time Complexity: O(n) where n is the number of images
// Space Complexity: O(n + m) where n is images.length and m is ads.length
export default function injectAdsWithFibonacci(images: ImageItem[], ads: AdItem[]) {
  const fibIndices = getFibonacciIndices(images.length);
  const groups = groupSequentialIndices(fibIndices);
  const result = [];
  let adIndex = 0;

  const adInjectionMap = new Map();
  groups.forEach(group => {
    adInjectionMap.set(group[0], group.length); // Inject `group.length` ads before this index
  });

  for (let i = 0; i < images.length; i++) {
    if (adInjectionMap.has(i)) {
      const count = adInjectionMap.get(i);
      for (let j = 0; j < count && adIndex < ads.length; j++) {
        result.push({ type: 'ad', content: ads[adIndex++] });
      }
    }
    result.push({ type: 'image', content: images[i] });
  }

  return result;
}
