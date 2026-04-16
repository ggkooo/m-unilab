import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GetTicketFeedback } from '../components/get-ticket-feedback';
import { GetTicketHero } from '../components/get-ticket-hero';
import { ServiceOptionsGrid } from '../components/service-options-grid';
import { SERVICE_OPTIONS } from '../constants';
import { useServiceGridLayout } from '../hooks/use-service-grid-layout';
import { useTicketFeedback } from '../hooks/use-ticket-feedback';
import { useTicketRequest } from '../hooks/use-ticket-request';

export function GetTicketScreen() {
  const { width, height } = useWindowDimensions();
  const { isLandscape, cardWidth } = useServiceGridLayout({ width, height });
  const { feedback, clearFeedback, showFeedback } = useTicketFeedback();
  const { isSubmitting, selectedService, submitTicket } = useTicketRequest({
    onSuccess: (message) => showFeedback(message, 'success'),
    onError: (message) => showFeedback(message, 'error'),
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.backgroundGlowTop} />
      <View style={styles.backgroundGlowBottom} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          isLandscape ? styles.contentLandscape : styles.contentPortrait,
        ]}>
        <View style={styles.headerRow}>
          <GetTicketHero />
        </View>

        {feedback ? (
          <GetTicketFeedback
            message={feedback.message}
            type={feedback.status}
            onDismiss={clearFeedback}
          />
        ) : null}

        <ServiceOptionsGrid
          options={SERVICE_OPTIONS}
          isSubmitting={isSubmitting}
          selectedService={selectedService}
          cardWidth={cardWidth}
          isLandscape={isLandscape}
          onSelectService={submitTicket}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: 1280,
    width: '100%',
    alignSelf: 'center',
  },
  contentLandscape: {
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  contentPortrait: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backgroundGlowTop: {
    position: 'absolute',
    top: -70,
    left: -60,
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: '#dbeafe',
  },
  backgroundGlowBottom: {
    position: 'absolute',
    bottom: -90,
    right: -60,
    width: 250,
    height: 250,
    borderRadius: 999,
    backgroundColor: '#d1fae5',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 14,
  },
});