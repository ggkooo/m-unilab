import * as SecureStore from 'expo-secure-store';

import { PIN_KEY } from '../constants';

export async function getStoredPin() {
  return SecureStore.getItemAsync(PIN_KEY);
}

export async function savePin(pin: string) {
  await SecureStore.setItemAsync(PIN_KEY, pin);
}