import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { IS_DEMO_MODE } from '../lib/demoConfig';
import { DemoModeModal } from '../components/DemoModeModal';

interface DemoModeContextType {
  isDemoMode: boolean;
  isModalOpen: boolean;
  openDemoModal: (triggerElement?: HTMLElement | null) => void;
  closeDemoModal: () => void;
  /**
   * Helper to intercept customer-facing transactional actions.
   * In demo mode, prevents the original action/form submission and triggers the demo modal.
   * Returns true if action was intercepted, or false if not in demo mode.
   */
  interceptAction: (e?: React.SyntheticEvent) => boolean;
}

const DemoModeContext = createContext<DemoModeContextType | undefined>(undefined);

export const DemoModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const triggerElementRef = useRef<HTMLElement | null>(null);

  const openDemoModal = useCallback((triggerElement?: HTMLElement | null) => {
    triggerElementRef.current = triggerElement || (document.activeElement as HTMLElement | null);
    setIsModalOpen(true);
  }, []);

  const closeDemoModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const interceptAction = useCallback(
    (e?: React.SyntheticEvent): boolean => {
      if (IS_DEMO_MODE) {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        const activeElem = (e?.currentTarget as HTMLElement) || (document.activeElement as HTMLElement | null);
        openDemoModal(activeElem);
        return true;
      }
      return false;
    },
    [openDemoModal]
  );

  return (
    <DemoModeContext.Provider
      value={{
        isDemoMode: IS_DEMO_MODE,
        isModalOpen,
        openDemoModal,
        closeDemoModal,
        interceptAction,
      }}
    >
      {children}
      <DemoModeModal
        isOpen={isModalOpen}
        onClose={closeDemoModal}
        triggerElement={triggerElementRef.current}
      />
    </DemoModeContext.Provider>
  );
};

export const useDemoMode = (): DemoModeContextType => {
  const context = useContext(DemoModeContext);
  if (!context) {
    throw new Error('useDemoMode must be used within a DemoModeProvider');
  }
  return context;
};
