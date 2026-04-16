import { useCallback, useState } from 'react';

import { createTicket } from '../services/ticket-service';

type UseTicketRequestParams = {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
};

export function useTicketRequest({ onSuccess, onError }: UseTicketRequestParams) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const submitTicket = useCallback(
    async (serviceType: string) => {
      if (isSubmitting) {
        return;
      }

      setIsSubmitting(true);
      setSelectedService(serviceType);

      try {
        const result = await createTicket({ service_type: serviceType });
        const isBackgroundPrint = result.printStatus?.toLowerCase() === 'enviando';

        onSuccess(
          isBackgroundPrint
            ? `Solicitacao recebida: ${serviceType}. Impressao em envio.`
            : `Solicitacao enviada: ${serviceType}.`,
        );
      } catch (error) {
        onError(error instanceof Error ? error.message : 'Falha de comunicacao com a API.');
      } finally {
        setIsSubmitting(false);
        setSelectedService(null);
      }
    },
    [isSubmitting, onError, onSuccess],
  );

  return {
    isSubmitting,
    selectedService,
    submitTicket,
  };
}