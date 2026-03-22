import type { LucideIcon } from "lucide-react";
import { BookOpenText, Layers3, Settings2 } from "lucide-react";

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

export const navigationItems: NavItem[] = [
  { label: "信息流", path: "/", icon: Layers3 },
  { label: "全部卡片", path: "/all", icon: BookOpenText },
  { label: "设置", path: "/settings", icon: Settings2 },
];
