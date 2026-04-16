import { StyleSheet, View } from 'react-native';

import type { ServiceOption } from '../types';
import { ServiceOptionCard } from './service-option-card';

type ServiceOptionsGridProps = {
  options: ServiceOption[];
  isSubmitting: boolean;
  selectedService: string | null;
  cardWidth: number;
  isLandscape: boolean;
  onSelectService: (serviceType: string) => void;
};

export function ServiceOptionsGrid({
  options,
  isSubmitting,
  selectedService,
  cardWidth,
  isLandscape,
  onSelectService,
}: ServiceOptionsGridProps) {
  return (
    <View style={[styles.grid, isLandscape ? styles.gridLandscape : styles.gridPortrait]}>
      {options.map((option) => (
        <ServiceOptionCard
          key={option.title}
          option={option}
          width={cardWidth}
          isLandscape={isLandscape}
          isSubmitting={isSubmitting}
          isLoading={isSubmitting && selectedService === option.title}
          onSelect={onSelectService}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    width: '100%',
    gap: 12,
  },
  gridLandscape: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridPortrait: {
    flexDirection: 'column',
  },
});
