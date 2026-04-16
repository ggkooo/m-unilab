import * as NavigationBar from 'expo-navigation-bar';
import { startLockTask, stopLockTask } from 'lock-task';
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
    type PropsWithChildren,
} from 'react';
import { AppState, BackHandler, Platform } from 'react-native';

type KioskContextValue = {
  isLocked: boolean;
  exitMode: boolean;
  lock: () => void;
  lockForExit: () => void;
  unlock: () => void;
  onPinCreated: () => void;
  exitApp: () => void;
};

const KioskContext = createContext<KioskContextValue>({
  isLocked: true,
  exitMode: false,
  lock: () => {},
  lockForExit: () => {},
  unlock: () => {},
  onPinCreated: () => {},
  exitApp: () => {},
});

export function KioskProvider({ children }: PropsWithChildren) {
  const [isLocked, setIsLocked] = useState(true);
  const [exitMode, setExitMode] = useState(false);
  const appStateRef = useRef(AppState.currentState);

  const hideNavigationBar = useCallback(() => {
    if (Platform.OS !== 'android') {
      return;
    }

    NavigationBar.setVisibilityAsync('hidden').catch(() => {});
  }, []);

  const enableLockTask = useCallback(() => {
    if (Platform.OS !== 'android') {
      return;
    }

    startLockTask();
  }, []);

  // Esconde a barra de navegação (Android) ao iniciar
  useEffect(() => {
    hideNavigationBar();
    enableLockTask();
  }, [enableLockTask, hideNavigationBar]);

  // Reesconde a barra de navegação quando a tela é desbloqueada (pode ter voltado a aparecer)
  useEffect(() => {
    hideNavigationBar();
  }, [hideNavigationBar, isLocked]);

  // Retrava o app quando ele volta do background
  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState) => {
      const prevState = appStateRef.current;
      appStateRef.current = nextState;

      if (prevState === 'background' && nextState === 'active') {
        setIsLocked(true);
        setExitMode(false);
        hideNavigationBar();
      }
    });
    return () => sub.remove();
  }, [hideNavigationBar]);

  const lock = useCallback(() => {
    setIsLocked(true);
    setExitMode(false);
  }, []);

  const lockForExit = useCallback(() => {
    setIsLocked(true);
    setExitMode(true);
  }, []);

  // Bloqueia o botão físico "voltar" enquanto estiver travado.
  // Quando desbloqueado, intercepta o voltar e pede a senha de saída.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isLocked) return true; // bloqueado: ignora
      lockForExit();             // desbloqueado: pede PIN para sair
      return true;
    });
    return () => sub.remove();
  }, [isLocked, lockForExit]);

  const unlock = useCallback(() => {
    setIsLocked(false);
    setExitMode(false);
  }, []);

  const onPinCreated = useCallback(() => {
    setIsLocked(false);
    setExitMode(false);
    enableLockTask();
  }, [enableLockTask]);

  const exitApp = useCallback(() => {
    stopLockTask();
    BackHandler.exitApp();
  }, []);

  return (
    <KioskContext.Provider value={{ isLocked, exitMode, lock, lockForExit, unlock, onPinCreated, exitApp }}>
      {children}
    </KioskContext.Provider>
  );
}

export function useKiosk() {
  return useContext(KioskContext);
}
