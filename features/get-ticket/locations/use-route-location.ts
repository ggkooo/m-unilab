import { useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';

import { normalizeLocation } from './index';

export function useRouteLocation() {
  const { location } = useLocalSearchParams<{ location?: string | string[] }>();

  return useMemo(() => normalizeLocation(location), [location]);
}
