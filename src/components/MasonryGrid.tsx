import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

interface MasonryGridProps {
  children: ReactNode[];
  columnGap?: string;
  rowGap?: string;
}

const MasonryGrid = ({ children, columnGap = 'gap-x-4', rowGap = 'gap-y-4' }: MasonryGridProps) => {
  const [columns, setColumns] = useState(1);

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setColumns(1);
      } else if (width < 768) {
        setColumns(2);
      } else if (width < 1024) {
        setColumns(3);
      } else {
        setColumns(4);
      }
    };

    updateColumns();

    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  // Distribute children across columns
  // Time complexity: O(n) where n is the number of children
  // Space complexity: O(n) for the columnsArray
  const columnsArray: ReactNode[][] = Array.from({ length: columns }, () => []);

  // Place each child in the column with the least height
  // This is a greedy approach to balance column heights
  children.forEach((child, index) => {
    // Simple round-robin distribution for initial placement
    const columnIndex = index % columns;
    columnsArray[columnIndex].push(
      <div key={index} className="w-full mb-4">
        {child}
      </div>
    );
  });

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ${columnGap} ${rowGap}`}
    >
      {columnsArray.map((column, index) => (
        <div key={index} className="flex flex-col">
          {column}
        </div>
      ))}
    </div>
  );
};

export default MasonryGrid;
