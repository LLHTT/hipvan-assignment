import type { FeedItem as FeedItemType, AdItem, ImageItem } from '../utils/feedUtils';
import ImageCard from './ImageCard';
import AdCard from './AdCard';

interface FeedItemProps {
  item: FeedItemType;
}

const FeedItem = ({ item }: FeedItemProps) => {
  if (item.type === 'ad') {
    return <AdCard ad={item.content as AdItem} />;
  }

  return <ImageCard image={item.content as ImageItem} />;
};

export default FeedItem;
