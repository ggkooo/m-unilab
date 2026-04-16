import * as SecureStore from 'expo-secure-store';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, BackHandler, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const PIN_KEY = 'kiosk_pin';
const PIN_LENGTH = 4;

type Step = 'loading' | 'setup-enter' | 'setup-confirm' | 'unlock' | 'exit';

interface Props {
  visible: boolean;
  exitMode: boolean;
  onUnlocked: () => void;
  onExited: () => void;
  onPinCreated: () => void;
}

export function LockOverlay({ visible, exitMode, onUnlocked, onExited, onPinCreated }: Props) {
  const [step, setStep] = useState<Step>('loading');
  const [pin, setPin] = useState('');
  const [firstPin, setFirstPin] = useState('');
  const [error, setError] = useState('');

  // Garante que o botão voltar não funcione mesmo sem o contexto
  useEffect(() => {
    if (!visible) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => sub.remove();
  }, [visible]);

  // Determina o step inicial a partir do PIN armazenado
  useEffect(() => {
    if (!visible) return;
    let isMounted = true;

    setStep('loading');
    setPin('');
    setError('');
    setFirstPin('');

    const timeoutId = setTimeout(() => {
      if (!isMounted) return;
      setError('Nao foi possivel carregar o PIN salvo. Configure novamente.');
      setStep('setup-enter');
    }, 4000);

    SecureStore.getItemAsync(PIN_KEY)
      .then((stored) => {
        if (!isMounted) return;
        clearTimeout(timeoutId);
        setStep(stored ? (exitMode ? 'exit' : 'unlock') : 'setup-enter');
      })
      .catch(() => {
        if (!isMounted) return;
        clearTimeout(timeoutId);
        setError('Nao foi possivel carregar o PIN salvo. Configure novamente.');
        setStep('setup-enter');
      });

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [visible, exitMode]);

  const handleDigit = useCallback(
    async (digit: string) => {
      if (pin.length >= PIN_LENGTH) return;
      const newPin = pin + digit;
      setPin(newPin);
      setError('');

      if (newPin.length < PIN_LENGTH) return;

      if (step === 'setup-enter') {
        setFirstPin(newPin);
        setPin('');
        setStep('setup-confirm');
        return;
      }

      if (step === 'setup-confirm') {
        if (newPin === firstPin) {
          await SecureStore.setItemAsync(PIN_KEY, newPin);
          setPin('');
          setFirstPin('');
          onPinCreated();
        } else {
          setError('Os PINs não coincidem. Tente novamente.');
          setPin('');
          setFirstPin('');
          setStep('setup-enter');
        }
        return;
      }

      if (step === 'unlock' || step === 'exit') {
        const stored = await SecureStore.getItemAsync(PIN_KEY);
        if (newPin === stored) {
          setPin('');
          if (step === 'exit') {
            onExited();
          } else {
            onUnlocked();
          }
        } else {
          setError('PIN incorreto. Tente novamente.');
          setPin('');
        }
      }
    },
    [pin, step, firstPin, onUnlocked, onExited, onPinCreated],
  );

  const handleDelete = useCallback(() => {
    setPin((prev) => prev.slice(0, -1));
    setError('');
  }, []);

  if (!visible) return null;

  const titles: Record<Step, string> = {
    loading: 'Carregando...',
    'setup-enter': 'Crie um PIN de acesso',
    'setup-confirm': 'Confirme o PIN',
    unlock: 'Digite o PIN para continuar',
    exit: 'Digite o PIN para sair do app',
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* Glows decorativos iguais à tela principal */}
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <View style={styles.card}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.appName}>UNILAB</Text>
          <Text style={styles.title}>
            {step === 'loading' ? 'Carregando...' : titles[step]}
          </Text>
        </View>

        {step === 'loading' ? (
          <ActivityIndicator size="large" color="#3b82f6" />
        ) : (
          <>
            {/* Indicadores de dígitos */}
            <View style={styles.dotsContainer}>
              {Array.from({ length: PIN_LENGTH }).map((_, i) => (
                <View
                  key={i}
                  style={[styles.dot, i < pin.length ? styles.dotFilled : styles.dotEmpty]}
                />
              ))}
            </View>

            {error ? (
              <Text style={styles.error}>{error}</Text>
            ) : (
              <View style={styles.errorPlaceholder} />
            )}

            {/* Teclado numérico */}
            <View style={styles.keypad}>
              {(['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'] as const).map(
                (key, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.key, key === '' && styles.keyHidden]}
                    onPress={() => {
                      if (key === '⌫') handleDelete();
                      else if (key !== '') handleDigit(key);
                    }}
                    disabled={key === ''}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.keyText}>{key}</Text>
                  </TouchableOpacity>
                ),
              )}
            </View>

            {step === 'exit' && (
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => { setStep('unlock'); setPin(''); setError(''); }}
              >
                <Text style={styles.secondaryButtonText}>Cancelar</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  glowTop: {
    position: 'absolute',
    top: -70,
    left: -60,
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: '#dbeafe',
  },
  glowBottom: {
    position: 'absolute',
    bottom: -90,
    right: -60,
    width: 250,
    height: 250,
    borderRadius: 999,
    backgroundColor: '#d1fae5',
  },
  card: {
    backgroundColor: '#ffffffef',
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    paddingHorizontal: 36,
    paddingVertical: 32,
    alignItems: 'center',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 12,
    minWidth: 340,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  appName: {
    color: '#3b82f6',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 4,
    marginBottom: 10,
  },
  title: {
    color: '#0f172a',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 16,
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  dotEmpty: {
    borderWidth: 2,
    borderColor: '#cbd5e1',
    backgroundColor: 'transparent',
  },
  dotFilled: {
    backgroundColor: '#3b82f6',
  },
  error: {
    color: '#ef4444',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 20,
    textAlign: 'center',
  },
  errorPlaceholder: {
    height: 13,
    marginBottom: 20,
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 264,
    gap: 12,
    justifyContent: 'center',
  },
  key: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyHidden: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  keyText: {
    color: '#0f172a',
    fontSize: 24,
    fontWeight: '500',
  },
  secondaryButton: {
    marginTop: 28,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  secondaryButtonText: {
    color: '#64748b',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
