import { useCallback, useEffect, useState } from 'react';
import { BackHandler } from 'react-native';

import { PIN_LENGTH, type LockStep } from '../constants';
import { getStoredPin, savePin } from '../services/pin-storage';

type UseLockOverlayParams = {
  visible: boolean;
  exitMode: boolean;
  onUnlocked: () => void;
  onExited: () => void;
  onPinCreated: () => void;
};

export function useLockOverlay({
  visible,
  exitMode,
  onUnlocked,
  onExited,
  onPinCreated,
}: UseLockOverlayParams) {
  const [step, setStep] = useState<LockStep>('loading');
  const [pin, setPin] = useState('');
  const [firstPin, setFirstPin] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!visible) {
      return;
    }

    const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => sub.remove();
  }, [visible]);

  useEffect(() => {
    if (!visible) {
      return;
    }

    let isMounted = true;

    setStep('loading');
    setPin('');
    setError('');
    setFirstPin('');

    const timeoutId = setTimeout(() => {
      if (!isMounted) {
        return;
      }

      setError('Nao foi possivel carregar o PIN salvo. Configure novamente.');
      setStep('setup-enter');
    }, 4000);

    getStoredPin()
      .then((storedPin) => {
        if (!isMounted) {
          return;
        }

        clearTimeout(timeoutId);
        setStep(storedPin ? (exitMode ? 'exit' : 'unlock') : 'setup-enter');
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        clearTimeout(timeoutId);
        setError('Nao foi possivel carregar o PIN salvo. Configure novamente.');
        setStep('setup-enter');
      });

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [visible, exitMode]);

  const handleDelete = useCallback(() => {
    setPin((currentPin) => currentPin.slice(0, -1));
    setError('');
  }, []);

  const handleDigit = useCallback(
    async (digit: string) => {
      if (pin.length >= PIN_LENGTH) {
        return;
      }

      const nextPin = `${pin}${digit}`;
      setPin(nextPin);
      setError('');

      if (nextPin.length < PIN_LENGTH) {
        return;
      }

      if (step === 'setup-enter') {
        setFirstPin(nextPin);
        setPin('');
        setStep('setup-confirm');
        return;
      }

      if (step === 'setup-confirm') {
        if (nextPin === firstPin) {
          await savePin(nextPin);
          setPin('');
          setFirstPin('');
          onPinCreated();
          return;
        }

        setError('Os PINs nao coincidem. Tente novamente.');
        setPin('');
        setFirstPin('');
        setStep('setup-enter');
        return;
      }

      const storedPin = await getStoredPin();

      if (nextPin === storedPin) {
        setPin('');

        if (step === 'exit') {
          onExited();
        } else {
          onUnlocked();
        }

        return;
      }

      setError('PIN incorreto. Tente novamente.');
      setPin('');
    },
    [firstPin, onExited, onPinCreated, onUnlocked, pin, step],
  );

  const cancelExit = useCallback(() => {
    setStep('unlock');
    setPin('');
    setError('');
  }, []);

  return {
    error,
    pin,
    step,
    handleDelete,
    handleDigit,
    cancelExit,
    pinLength: PIN_LENGTH,
  };
}