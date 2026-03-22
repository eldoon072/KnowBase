import type { KnowledgeGroup, KnowledgeType } from "../types/knowledge";

export const KNOWLEDGE_STORAGE_KEY = "knowbase.items.v2";
export const DEFAULT_DOMAIN = "通用";
export const DEFAULT_FOLDER = "Inbox";

export const knowledgeTypeOrder: KnowledgeType[] = ["article", "video", "podcast", "image", "text"];

export const knowledgeTypeMeta: Record<
  KnowledgeType,
  {
    title: string;
    quote: string;
  }
> = {
  article: {
    title: "文章流",
    quote: "用结构化阅读，把思考留下来。",
  },
  video: {
    title: "视频流",
    quote: "把稍纵即逝的灵感，沉淀成可复用知识。",
  },
  podcast: {
    title: "播客流",
    quote: "把声音变成观点，把观点变成体系。",
  },
  image: {
    title: "图像流",
    quote: "视觉是记忆最短路径。",
  },
  text: {
    title: "文本流",
    quote: "快速捕获，慢速理解。",
  },
};

export const createEmptyKnowledgeGroup = (): KnowledgeGroup => ({
  article: [],
  video: [],
  image: [],
  podcast: [],
  text: [],
});

export const categoryByType: Record<KnowledgeType, string> = {
  article: "文章",
  video: "视频",
  podcast: "播客",
  image: "图像",
  text: "笔记",
};
