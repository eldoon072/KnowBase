import { KNOWLEDGE_STORAGE_KEY } from "../constants/knowledge";
import type { KnowledgeItem, KnowledgeType } from "../types/knowledge";

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isKnowledgeType = (value: unknown): value is KnowledgeType =>
  value === "article" ||
  value === "video" ||
  value === "image" ||
  value === "podcast" ||
  value === "text";

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");

const isKnowledgeItem = (value: unknown): value is KnowledgeItem => {
  if (!isObject(value)) {
    return false;
  }

  const candidate = value as Partial<KnowledgeItem>;
  return (
    typeof candidate.id === "string" &&
    isKnowledgeType(candidate.type) &&
    typeof candidate.title === "string" &&
    typeof candidate.summary === "string" &&
    typeof candidate.createdAt === "string" &&
    typeof candidate.updatedAt === "string" &&
    isStringArray(candidate.tags)
  );
};

export const loadKnowledgeItems = (): KnowledgeItem[] => {
  const raw = localStorage.getItem(KNOWLEDGE_STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isKnowledgeItem);
  } catch {
    return [];
  }
};

export const saveKnowledgeItems = (items: KnowledgeItem[]): void => {
  localStorage.setItem(KNOWLEDGE_STORAGE_KEY, JSON.stringify(items));
};

export const clearKnowledgeItems = (): void => {
  localStorage.removeItem(KNOWLEDGE_STORAGE_KEY);
};
