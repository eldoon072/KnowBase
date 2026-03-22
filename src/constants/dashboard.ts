import type { LucideIcon } from "lucide-react";
import {
  BookOpenText,
  Camera,
  Clapperboard,
  FileStack,
  FolderKanban,
  LibraryBig,
  Mic2,
  UserRound,
} from "lucide-react";

export interface NavigationCardItem {
  zh: string;
  en: string;
  icon: LucideIcon;
}

export interface ToolCardItem {
  name: string;
  url: string;
}

export const navigationCardItems: NavigationCardItem[] = [
  { zh: "图书馆", en: "Library", icon: LibraryBig },
  { zh: "视频", en: "Video", icon: Clapperboard },
  { zh: "播客", en: "Podcast", icon: Mic2 },
  { zh: "碎片", en: "Clips", icon: FileStack },
  { zh: "人物", en: "People", icon: UserRound },
  { zh: "笔记", en: "Notes", icon: BookOpenText },
  { zh: "领域", en: "Area", icon: Camera },
  { zh: "文件夹", en: "Folder", icon: FolderKanban },
];

export const toolCardItems: ToolCardItem[] = [
  { name: "ChatGPT", url: "https://chatgpt.com/" },
  { name: "Gemini", url: "https://gemini.google.com/" },
  { name: "GitHub", url: "https://github.com/" },
  { name: "Reddit", url: "https://www.reddit.com/" },
  { name: "豆瓣", url: "https://www.douban.com/" },
  { name: "Pinterest", url: "https://www.pinterest.com/" },
  { name: "Notion", url: "https://www.notion.so/" },
  { name: "Behance", url: "https://www.behance.net/" },
  { name: "Lovart", url: "https://www.lovart.ai/" },
];

export const latestTabs = [
  { id: "all", label: "NOTES" },
  { id: "clips", label: "CLIPS" },
  { id: "media", label: "MEDIA" },
] as const;
