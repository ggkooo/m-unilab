import { MaterialIcons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import type { ServiceOption } from '../types';

type ServiceOptionCardProps = {
  option: ServiceOption;
  width: number | `${number}%`;
  isLandscape: boolean;
  isSubmitting: boolean;
  isLoading: boolean;
  onSelect: (serviceType: string) => void;
};

function getVariantColors(variant: ServiceOption['variant']) {
  if (variant === 'warning') {
    return {
      border: '#f59e0b',
      iconBg: '#fffbeb',
      iconColor: '#b45309',
    };
  }

  if (variant === 'success') {
    return {
      border: '#10b981',
      iconBg: '#ecfdf5',
      iconColor: '#047857',
    };
  }

  return {
    border: '#3b82f6',
    iconBg: '#eff6ff',
    iconColor: '#1d4ed8',
  };
}

export function ServiceOptionCard({
  option,
  width,
  isLandscape,
  isSubmitting,
  isLoading,
  onSelect,
}: ServiceOptionCardProps) {
  const colors = getVariantColors(option.variant);

  return (
    <Pressable
      onPress={() => onSelect(option.title)}
      disabled={isSubmitting}
      style={[
        styles.card,
        { borderColor: colors.border, width },
        option.fullWidth && isLandscape ? styles.cardFullLandscape : null,
        isSubmitting ? styles.cardDisabled : null,
      ]}>
      <View style={styles.cardTop}>
        <View style={[styles.iconWrap, { backgroundColor: colors.iconBg }]}>
          <MaterialIcons name={option.icon} size={26} color={colors.iconColor} />
        </View>
      </View>

      <Text style={styles.cardTitle}>{option.title}</Text>
      <Text style={styles.cardSubtitle}>
        {isLoading ? 'Enviando solicitacao...' : option.subtitle}
      </Text>

      {!!option.badges?.length && (
        <View style={styles.badgesRow}>
          {option.badges.map((badge) => (
            <View key={`${option.title}-${badge}`} style={styles.badge}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          ))}
        </View>
      )}

      {isLoading && <ActivityIndicator style={styles.loader} color={colors.iconColor} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffffef',
    borderRadius: 20,
    borderWidth: 2,
    padding: 16,
    minHeight: 210,
  },
  cardFullLandscape: {
    width: '100%',
  },
  cardDisabled: {
    opacity: 0.75,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: '#475569',
  },
  badgesRow: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#f1f5f9',
  },
  badgeText: {
    color: '#334155',
    fontSize: 12,
    fontWeight: '600',
  },
  loader: {
    marginTop: 12,
    alignSelf: 'flex-start',
  },
});
