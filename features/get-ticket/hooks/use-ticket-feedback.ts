import { useCallback, useEffect, useState } from 'react';

import type { FeedbackStatus, TicketFeedback } from '../domain/types';

export function useTicketFeedback() {
  const [feedback, setFeedback] = useState<TicketFeedback>(null);

  useEffect(() => {
    if (feedback?.status !== 'success') {
      return;
    }

    const timeoutId = setTimeout(() => {
      setFeedback(null);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [feedback]);

  const showFeedback = useCallback((message: string, status: FeedbackStatus) => {
    setFeedback({ message, status });
  }, []);

  const clearFeedback = useCallback(() => {
    setFeedback(null);
  }, []);

  return {
    feedback,
    showFeedback,
    clearFeedback,
  };
}