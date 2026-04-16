import { StyleSheet, Text, View } from 'react-native';

import type { FeedbackType } from '../types';

type GetTicketFeedbackProps = {
  message: string;
  type: Exclude<FeedbackType, null>;
};

export function GetTicketFeedback({ message, type }: GetTicketFeedbackProps) {
  const isSuccess = type === 'success';

  return (
    <View style={[styles.container, isSuccess ? styles.successContainer : styles.errorContainer]}>
      <Text style={[styles.text, isSuccess ? styles.successText : styles.errorText]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 14,
  },
  successContainer: {
    borderColor: '#86efac',
    backgroundColor: '#f0fdf4',
  },
  errorContainer: {
    borderColor: '#fca5a5',
    backgroundColor: '#fef2f2',
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
  },
  successText: {
    color: '#166534',
  },
  errorText: {
    color: '#991b1b',
  },
});
