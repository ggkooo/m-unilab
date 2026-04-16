import { useCallback, useEffect, useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';

import { useKiosk } from '@/context/kiosk';
import { GetTicketFeedback } from './get-ticket/components/get-ticket-feedback';
import { GetTicketHero } from './get-ticket/components/get-ticket-hero';
import { ServiceOptionsGrid } from './get-ticket/components/service-options-grid';
import { SERVICE_OPTIONS } from './get-ticket/constants';
import { DEFAULT_CAMPUS_LOCATION } from './get-ticket/locations';
import { useRouteLocation } from './get-ticket/locations/use-route-location';
import { createTicket } from './get-ticket/services/ticket-service';
import type { FeedbackType } from './get-ticket/types';

export default function GetTicketScreen() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  useKiosk();
  const routeLocation = useRouteLocation();

  const activeLocation = routeLocation ?? DEFAULT_CAMPUS_LOCATION;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<FeedbackType>(null);

  useEffect(() => {
    if (feedbackType !== 'success' || !feedback) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setFeedback(null);
      setFeedbackType(null);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [feedback, feedbackType]);

  const cardWidth = useMemo(() => {
    if (isLandscape) {
      return (width - 96) / 3;
    }
    return width - 48;
  }, [isLandscape, width]);

  const handleCreateTicket = useCallback(async (serviceType: string) => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setSelectedService(serviceType);
    setFeedback(null);
    setFeedbackType(null);

    try {
      const result = await createTicket({ serviceType, location: activeLocation });
      const isBackgroundPrint = result.printStatus?.toLowerCase() === 'enviando';

      setFeedback(
        isBackgroundPrint
          ? `Solicitacao recebida: ${serviceType}. Impressao em envio.`
          : `Solicitacao enviada: ${serviceType}.`,
      );
      setFeedbackType('success');
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : 'Falha de comunicacao com a API.');
      setFeedbackType('error');
    } finally {
      setIsSubmitting(false);
      setSelectedService(null);
    }
  }, [activeLocation, isSubmitting]);

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

        {!!feedback && !!feedbackType && <GetTicketFeedback message={feedback} type={feedbackType} />}

        <ServiceOptionsGrid
          options={SERVICE_OPTIONS}
          isSubmitting={isSubmitting}
          selectedService={selectedService}
          cardWidth={cardWidth}
          isLandscape={isLandscape}
          onSelectService={handleCreateTicket}
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
