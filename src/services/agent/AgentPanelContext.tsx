import { ReactNode, createContext, useContext, useState } from 'react';

interface AgentPanelContextType {
  isOpen: boolean;
  togglePanel: () => void;
  panelWidth: number;
  setPanelWidth: (width: number) => void;
}

const AgentPanelContext = createContext<AgentPanelContextType | undefined>(
  undefined,
);

export function AgentPanelProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  const [panelWidth, setPanelWidth] = useState(350);

  const togglePanel = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <AgentPanelContext.Provider
      value={{ isOpen, togglePanel, panelWidth, setPanelWidth }}
    >
      {children}
    </AgentPanelContext.Provider>
  );
}

export function useAgentPanel() {
  const context = useContext(AgentPanelContext);
  if (!context) {
    throw new Error('useAgentPanel must be used within AgentPanelProvider');
  }
  return context;
}
