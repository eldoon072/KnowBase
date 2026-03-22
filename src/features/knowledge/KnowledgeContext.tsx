import { createContext, useContext, type ReactNode } from "react";
import { useKnowledgeItems } from "../../hooks/useKnowledgeItems";
import type { KnowledgeGroup, KnowledgeItem } from "../../types/knowledge";

interface KnowledgeContextValue {
  items: KnowledgeItem[];
  groupedItems: KnowledgeGroup;
  addItem: (item: KnowledgeItem) => void;
  updateItem: (item: KnowledgeItem) => void;
  removeItem: (id: string) => void;
  markViewed: (id: string) => void;
  clearAll: () => void;
  resetToSeed: () => void;
}

const KnowledgeContext = createContext<KnowledgeContextValue | undefined>(undefined);

export const KnowledgeProvider = ({ children }: { children: ReactNode }) => {
  const value = useKnowledgeItems();
  return <KnowledgeContext.Provider value={value}>{children}</KnowledgeContext.Provider>;
};

export const useKnowledge = (): KnowledgeContextValue => {
  const context = useContext(KnowledgeContext);
  if (!context) {
    throw new Error("useKnowledge must be used within KnowledgeProvider.");
  }

  return context;
};
