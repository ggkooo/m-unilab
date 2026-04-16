import type { MaterialIcons } from '@expo/vector-icons';

export type FeedbackStatus = 'success' | 'error';

export type FeedbackType = FeedbackStatus | null;

export type TicketFeedback = {
  message: string;
  status: FeedbackStatus;
} | null;

export type ServiceVariant = 'primary' | 'success' | 'warning';

export type ServiceOption = {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  subtitle: string;
  variant: ServiceVariant;
  fullWidth?: boolean;
  badges?: string[];
};

export type CreateTicketPayload = {
  service_type: string;
  location: string;
};

export type CreateTicketResponse = {
  printStatus?: string;
};

export type TicketRequestState = {
  isSubmitting: boolean;
  selectedService: string | null;
};