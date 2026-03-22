import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { latestTabs } from "../../constants/dashboard";
import type { KnowledgeItem } from "../../types/knowledge";

interface LatestCollectionPanelProps {
  items: KnowledgeItem[];
}

const isClipType = (item: KnowledgeItem): boolean => item.type === "text";
const isMediaType = (item: KnowledgeItem): boolean =>
  item.type === "video" || item.type === "image" || item.type === "podcast";

const tagToneClasses = [
  "bg-yellow-900/70 text-yellow-100 border-yellow-700/60",
  "bg-blue-900/70 text-blue-100 border-blue-700/60",
  "bg-emerald-900/70 text-emerald-100 border-emerald-700/60",
  "bg-rose-900/70 text-rose-100 border-rose-700/60",
  "bg-violet-900/70 text-violet-100 border-violet-700/60",
  "bg-amber-900/70 text-amber-100 border-amber-700/60",
];

const getTagToneClass = (tag: string): string => {
  if (!tag) {
    return "bg-zinc-800 text-zinc-200 border-zinc-700";
  }

  const hash = [...tag].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return tagToneClasses[hash % tagToneClasses.length];
};

export const LatestCollectionPanel = ({ items }: LatestCollectionPanelProps) => {
  const [activeTab, setActiveTab] = useState<(typeof latestTabs)[number]["id"]>("all");

  const latestItems = useMemo(() => {
    const sorted = [...items].sort((left, right) => {
      return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
    });

    if (activeTab === "clips") {
      return sorted.filter(isClipType).slice(0, 10);
    }

    if (activeTab === "media") {
      return sorted.filter(isMediaType).slice(0, 10);
    }

    return sorted.slice(0, 10);
  }, [activeTab, items]);

  return (
    <section className="w-full overflow-hidden rounded-xl border border-zinc-800 bg-[#171717] p-4">
      <header>
        <h3 className="text-lg tracking-[0.34em] text-yellow-600">RELATIVE|最新</h3>
        <div className="mt-3 flex gap-2">
          {latestTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.15em] transition ${
                activeTab === tab.id
                  ? "border-zinc-600 bg-zinc-800 text-zinc-100"
                  : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <ul className="mt-3">
        {latestItems.map((item) => (
          <li key={item.id} className="border-b border-zinc-800/70 last:border-b-0">
            <Link
              to={`/article/${item.id}`}
              className="group flex items-center justify-between gap-2 py-1.5 text-[11px] leading-tight"
            >
              <span className="flex min-w-0 items-center gap-2">
                <span className="mt-0.5 size-1.5 shrink-0 rounded-[2px] bg-zinc-400/80" />
                <span className="line-clamp-1 text-zinc-300 transition group-hover:text-zinc-100">{item.title}</span>
              </span>
              <span
                className={`shrink-0 rounded-sm border px-1.5 py-0.5 text-[10px] ${getTagToneClass(
                  item.tags[0] ?? "",
                )}`}
              >
                {item.tags[0] ?? "未标记"}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};
