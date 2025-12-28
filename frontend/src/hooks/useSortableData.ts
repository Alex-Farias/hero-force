import { useState, useMemo } from 'react';

export type SortConfig<T> = {
  key: keyof T;
  direction: 'asc' | 'desc' | null;
};

export const useSortableData = <T>(items: T[], config: SortConfig<T> | null = null) => {
  const [sortConfig, setSortConfig] = useState<SortConfig<T> | null>(config);

  const sortedItems = useMemo(() => {
    const sortableItems = [...items];
    
    if(sortConfig !== null && sortConfig.direction !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if(aValue < bValue) { return sortConfig.direction === 'asc' ? -1 : 1 }
        if(aValue > bValue) { return sortConfig.direction === 'asc' ? 1 : -1 }
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfig]);

  const requestSort = (key: keyof T) => {
    let direction: 'asc' | 'desc' | null = 'asc';
    if(sortConfig && sortConfig.key === key) {
      if(sortConfig.direction === 'asc') {
        direction = 'desc';
      } else if(sortConfig.direction === 'desc') {
        direction = null;
      }
    }
    setSortConfig(direction ? { key, direction } : null);
  };

  return { items: sortedItems, requestSort, sortConfig };
};
