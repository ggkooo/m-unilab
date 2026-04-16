import { useMemo } from 'react';

type UseServiceGridLayoutParams = {
  width: number;
  height: number;
};

export function useServiceGridLayout({ width, height }: UseServiceGridLayoutParams) {
  const isLandscape = width > height;

  const cardWidth = useMemo(() => {
    if (isLandscape) {
      return (width - 96) / 3;
    }

    return width - 48;
  }, [isLandscape, width]);

  return {
    isLandscape,
    cardWidth,
  };
}