import { useMemo, useState } from "react";
import { categoryByType, createEmptyKnowledgeGroup, DEFAULT_DOMAIN, DEFAULT_FOLDER } from "../constants/knowledge";
import { seedKnowledgeItems } from "../data/seedKnowledge";
import { clearKnowledgeItems, loadKnowledgeItems, saveKnowledgeItems } from "../lib/storage";
import type { KnowledgeGroup, KnowledgeItem } from "../types/knowledge";

const sortByNewest = (items: KnowledgeItem[]): KnowledgeItem[] =>
  [...items].sort((left, right) => {
    return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
  });

const normalizeItem = (item: KnowledgeItem): KnowledgeItem => {
  const base = {
    ...item,
    domain: item.domain ?? DEFAULT_DOMAIN,
    category: item.category ?? categoryByType[item.type],
    folder: item.folder ?? DEFAULT_FOLDER,
    tags: [...new Set(item.tags)],
  };

  if (base.type === "text") {
    return {
      ...base,
      content: base.content ?? base.summary,
    };
  }

  return base;
};

const groupByType = (items: KnowledgeItem[]): KnowledgeGroup => {
  const grouped = createEmptyKnowledgeGroup();

  for (const item of items) {
    grouped[item.type].push(item);
  }

  return grouped;
};

const isLegacySeedSnapshot = (items: KnowledgeItem[]): boolean => {
  const hasNewSeedId = items.some((item) => item.id.startsWith("kb-"));
  const hasLegacySeedId = items.some((item) => item.id.startsWith("k-"));
  return hasLegacySeedId && !hasNewSeedId;
};

const initialItems = (): KnowledgeItem[] => {
  const normalizedSeed = seedKnowledgeItems.map(normalizeItem);
  const stored = loadKnowledgeItems().map(normalizeItem);
  if (stored.length > 0) {
    // Migrate legacy sample dataset (k-*) to the latest rebuilt seed (kb-*).
    if (isLegacySeedSnapshot(stored)) {
      saveKnowledgeItems(normalizedSeed);
      return sortByNewest(normalizedSeed);
    }
    return sortByNewest(stored);
  }

  saveKnowledgeItems(normalizedSeed);
  return sortByNewest(normalizedSeed);
};

export const useKnowledgeItems = () => {
  const [items, setItems] = useState<KnowledgeItem[]>(initialItems);

  const groupedItems = useMemo(() => groupByType(items), [items]);

  const upsertItems = (nextItems: KnowledgeItem[]): void => {
    const normalized = sortByNewest(nextItems.map(normalizeItem));
    setItems(normalized);
    saveKnowledgeItems(normalized);
  };

  const addItem = (item: KnowledgeItem): void => {
    upsertItems([item, ...items]);
  };

  const removeItem = (id: string): void => {
    upsertItems(items.filter((item) => item.id !== id));
  };

  const clearAll = (): void => {
    clearKnowledgeItems();
    setItems([]);
  };

  const resetToSeed = (): void => {
    upsertItems(seedKnowledgeItems);
  };

  const updateItem = (nextItem: KnowledgeItem): void => {
    const hasMatch = items.some((item) => item.id === nextItem.id);
    if (!hasMatch) {
      return;
    }

    const normalized = normalizeItem(nextItem);
    upsertItems(items.map((item) => (item.id === normalized.id ? normalized : item)));
  };

  const markViewed = (id: string): void => {
    const viewedAt = new Date().toISOString();
    const nextItems = items.map((item) => (item.id === id ? { ...item, lastViewedAt: viewedAt } : item));
    setItems(nextItems);
    saveKnowledgeItems(nextItems);
  };

  return {
    items,
    groupedItems,
    addItem,
    updateItem,
    removeItem,
    markViewed,
    clearAll,
    resetToSeed,
  };
};
