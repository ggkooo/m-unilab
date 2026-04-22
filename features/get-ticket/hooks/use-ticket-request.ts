import { useCallback, useState } from 'react';

import { createTicket } from '../services/ticket-service';

const REQUEST_COOLDOWN_MS = 3000;
const locationCooldownUntil = new Map<string, number>();

function normalizeLocationKey(location: string) {
  return location.trim().toLowerCase();
}

type UseTicketRequestParams = {
  location: string;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
};

export function useTicketRequest({ location, onSuccess, onError }: UseTicketRequestParams) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const submitTicket = useCallback(
    async (serviceType: string) => {
      const locationKey = normalizeLocationKey(location);
      const cooldownUntil = locationCooldownUntil.get(locationKey) ?? 0;
      const now = Date.now();

      if (cooldownUntil > now) {
        const remainingSeconds = Math.ceil((cooldownUntil - now) / 1000);
        onError(`Aguarde ${remainingSeconds}s para retirar uma nova senha nesta localizacao.`);
        return;
      }

      if (isSubmitting) {
        return;
      }

      setIsSubmitting(true);
      setSelectedService(serviceType);

      try {
        const result = await createTicket({ service_type: serviceType, location });
        const isBackgroundPrint = result.printStatus?.toLowerCase() === 'enviando';

        onSuccess(
          isBackgroundPrint
            ? `Solicitacao recebida: ${serviceType}. Impressao em envio.`
            : `Solicitacao enviada: ${serviceType}.`,
        );
        locationCooldownUntil.set(locationKey, Date.now() + REQUEST_COOLDOWN_MS);
      } catch (error) {
        onError(error instanceof Error ? error.message : 'Falha de comunicacao com a API.');
      } finally {
        setIsSubmitting(false);
        setSelectedService(null);
      }
    },
    [isSubmitting, location, onError, onSuccess],
  );

  return {
    isSubmitting,
    selectedService,
    submitTicket,
  };
}