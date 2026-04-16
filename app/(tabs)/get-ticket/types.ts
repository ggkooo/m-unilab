import type { MaterialIcons } from '@expo/vector-icons';

export type FeedbackType = 'success' | 'error' | null;

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
  serviceType: string;
  location: string;
};

export type CreateTicketResponse = {
  printStatus?: string;
};
