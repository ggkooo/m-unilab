import { requireNativeModule } from 'expo-modules-core';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let LockTask: any = null;

try {
  LockTask = requireNativeModule('LockTask');
} catch {
  // Módulo não disponível (iOS / web)
}

export function startLockTask(): void {
  LockTask?.start();
}

export function stopLockTask(): void {
  LockTask?.stop();
}
