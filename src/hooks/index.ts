import { useSyncExternalStore } from 'react';

const windowResizeEventListener = (callback: () => void) => {
  window.addEventListener('resize', callback);
  return () => window.removeEventListener('resize', callback);
};

export const useZoomFactor = () => {
  const isMobile = useIsMobile();
  return useSyncExternalStore(
    windowResizeEventListener,
    () => window.innerWidth / (isMobile ? 376 : 1440),
    () => 1.0
  );
};

export const useIsMobile = () => {
  return useSyncExternalStore(
    windowResizeEventListener,
    () => window.innerWidth < 768,
    () => false
  );
};
