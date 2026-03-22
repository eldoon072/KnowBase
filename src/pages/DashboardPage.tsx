import { useMemo, useState } from "react";
import { FlowSection, type FlowGroup } from "../components/dashboard/FlowSection";
import { HeroHeader } from "../components/dashboard/HeroHeader";
import { LatestCollectionPanel } from "../components/dashboard/LatestCollectionPanel";
import { NavigationCardPanel } from "../components/dashboard/NavigationCardPanel";
import { ToolCardPanel } from "../components/dashboard/ToolCardPanel";
import { useKnowledge } from "../features/knowledge/KnowledgeContext";
import type { KnowledgeItem } from "../types/knowledge";

const matchesQuery = (item: KnowledgeItem, query: string): boolean => {
  if (!query) {
    return true;
  }

  const lower = query.trim().toLowerCase();
  if (!lower) {
    return true;
  }

  return [item.title, item.summary, item.content, ...item.tags, item.domain, item.category, item.folder]
    .filter(Boolean)
    .some((field) => field!.toLowerCase().includes(lower));
};

const toTopGroups = (items: KnowledgeItem[], values: string[], idPrefix: string): FlowGroup[] => {
  const groups: FlowGroup[] = [{ id: `${idPrefix}-all`, label: "全部", items: items.slice(0, 12) }];

  for (const value of values.slice(0, 6)) {
    groups.push({
      id: `${idPrefix}-${value}`,
      label: value,
      items: items.filter((item) => {
        if (idPrefix === "tag") {
          return item.tags.includes(value);
        }
        if (idPrefix === "domain") {
          return (item.domain ?? "通用") === value;
        }
        if (idPrefix === "category") {
          return (item.category ?? "笔记") === value;
        }
        return (item.folder ?? "Inbox") === value;
      }),
    });
  }

  return groups;
};

export const DashboardPage = () => {
  const { items } = useKnowledge();
  const [query, setQuery] = useState("");

  const filteredItems = useMemo(() => {
    return items.filter((item) => matchesQuery(item, query));
  }, [items, query]);

  const topTags = useMemo(() => {
    const counts = new Map<string, number>();
    filteredItems.forEach((item) => {
      item.tags.forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1));
    });
    return [...counts.entries()]
      .sort((left, right) => right[1] - left[1])
      .map(([tag]) => tag);
  }, [filteredItems]);

  const domains = useMemo(() => {
    return [...new Set(filteredItems.map((item) => item.domain ?? "通用"))];
  }, [filteredItems]);

  const categories = useMemo(() => {
    return [...new Set(filteredItems.map((item) => item.category ?? "笔记"))];
  }, [filteredItems]);

  const folders = useMemo(() => {
    return [...new Set(filteredItems.map((item) => item.folder ?? "Inbox"))];
  }, [filteredItems]);

  const tagGroups = useMemo(() => toTopGroups(filteredItems, topTags, "tag"), [filteredItems, topTags]);
  const domainGroups = useMemo(() => toTopGroups(filteredItems, domains, "domain"), [domains, filteredItems]);
  const categoryGroups = useMemo(
    () => toTopGroups(filteredItems, categories, "category"),
    [categories, filteredItems],
  );
  const folderGroups = useMemo(() => toTopGroups(filteredItems, folders, "folder"), [filteredItems, folders]);

  return (
    <div className="space-y-5">
      <HeroHeader query={query} onQueryChange={setQuery} />

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,1fr)] xl:items-start">
        <div className="min-w-0 space-y-4">
          <NavigationCardPanel />
          <ToolCardPanel />
        </div>
        <div className="min-w-0 xl:h-[370px]">
          <LatestCollectionPanel items={filteredItems} />
        </div>
      </section>

      <section className="space-y-4">
        <FlowSection title="标签" description="按照常用标签快速筛选知识条目。" groups={tagGroups} />
        <FlowSection title="领域" description="通过知识领域组织内容视角。" groups={domainGroups} />
        <FlowSection title="类别" description="按内容类型管理文章、视频、播客等。" groups={categoryGroups} />
        <FlowSection title="文件夹" description="用文件夹归档并沉淀可复用材料。" groups={folderGroups} />
      </section>
    </div>
  );
};
