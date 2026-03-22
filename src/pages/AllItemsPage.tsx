import { useMemo } from "react";
import { Trash2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { KnowledgeCard } from "../components/knowledge/KnowledgeCard";
import type { ArchiveFilterKind } from "../constants/dashboard";
import { useKnowledge } from "../features/knowledge/KnowledgeContext";
import { formatDateTime } from "../lib/date";
import { knowledgeTypes, type KnowledgeItem } from "../types/knowledge";

interface ResolvedArchiveFilter {
  kind: ArchiveFilterKind;
  value: string;
}

const archiveFilterLabelMap: Record<ArchiveFilterKind, string> = {
  tag: "标签",
  type: "类型",
  domain: "领域",
  category: "类别",
  folder: "文件夹",
};

const isArchiveFilterKind = (value: string | null): value is ArchiveFilterKind =>
  value === "tag" || value === "type" || value === "domain" || value === "category" || value === "folder";

const resolveArchiveFilter = (searchParams: URLSearchParams): ResolvedArchiveFilter | null => {
  const kind = searchParams.get("filter");
  const value = searchParams.get("value")?.trim();

  if (!isArchiveFilterKind(kind) || !value) {
    return null;
  }

  if (kind === "type" && !knowledgeTypes.includes(value as (typeof knowledgeTypes)[number])) {
    return null;
  }

  return { kind, value };
};

const matchesArchiveFilter = (item: KnowledgeItem, filter: ResolvedArchiveFilter): boolean => {
  switch (filter.kind) {
    case "tag":
      return item.tags.some((tag) => tag.toLowerCase() === filter.value.toLowerCase());
    case "type":
      return item.type === filter.value;
    case "domain":
      return (item.domain ?? "通用") === filter.value;
    case "category":
      return (item.category ?? "笔记") === filter.value;
    case "folder":
      return (item.folder ?? "Inbox") === filter.value;
    default:
      return true;
  }
};

export const AllItemsPage = () => {
  const { items, removeItem } = useKnowledge();
  const [searchParams] = useSearchParams();

  const activeFilter = useMemo(() => resolveArchiveFilter(searchParams), [searchParams]);
  const filteredItems = useMemo(
    () => (activeFilter ? items.filter((item) => matchesArchiveFilter(item, activeFilter)) : items),
    [activeFilter, items]
  );
  const filterLabel = activeFilter ? `${archiveFilterLabelMap[activeFilter.kind]}：${activeFilter.value}` : null;

  return (
    <section>
      <header className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="text-xs uppercase tracking-[0.18em] text-yellow-600">全部卡片</h2>
          <p className="mt-1 text-xs text-zinc-500">
            {filterLabel ? `当前筛选 ${filterLabel}，共 ${filteredItems.length} 条。` : `当前共有 ${filteredItems.length} 条知识记录。`}
          </p>
        </div>
        {activeFilter ? (
          <Link
            to="/all"
            className="rounded-md border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-xs text-zinc-300 transition hover:border-zinc-600 hover:text-zinc-100"
          >
            清除筛选
          </Link>
        ) : null}
      </header>

      {filteredItems.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-[#1b1b1b] px-5 py-8 text-center text-sm text-zinc-400">
          {activeFilter ? "当前筛选下暂无结果，可切换其他分类。" : "暂无数据，可在设置页恢复示例数据。"}
        </div>
      ) : (
        <div className="columns-1 gap-4 [column-gap:1rem] md:columns-2 xl:columns-3 2xl:columns-4">
          {filteredItems.map((item) => (
            <div key={item.id} className="mb-4 inline-block w-full break-inside-avoid space-y-2">
              <KnowledgeCard item={item} layout="masonry" />
              <div className="flex items-center justify-between px-1 text-[11px] text-zinc-500">
                <Link to={`/article/${item.id}`} className="hover:text-zinc-300">
                  {formatDateTime(item.updatedAt)}
                </Link>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="inline-flex items-center gap-1 rounded-md border border-zinc-800 px-2 py-1 transition hover:border-zinc-700 hover:text-zinc-300"
                >
                  <Trash2 size={12} />
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
