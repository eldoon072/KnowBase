import { useEffect, useMemo, useState } from "react";
import {
  BookOpenText,
  Clapperboard,
  FolderKanban,
  Headphones,
  Image as ImageIcon,
  Layers3,
  Plus,
  Tag,
  Text,
  type LucideIcon,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useKnowledge } from "../../features/knowledge/KnowledgeContext";
import type { KnowledgeItem, TextItem } from "../../types/knowledge";

export interface FlowGroup {
  id: string;
  label: string;
  items: KnowledgeItem[];
}

interface FlowSectionProps {
  title: string;
  description: string;
  groups: FlowGroup[];
}

const sectionPrefixMap: Record<string, string> = {
  标签: "TAG",
  领域: "DOMAIN",
  类别: "TYPE",
  文件夹: "FOLDER",
};

const typeMeta: Record<KnowledgeItem["type"], { label: string; icon: LucideIcon }> = {
  article: { label: "Article", icon: BookOpenText },
  video: { label: "Video", icon: Clapperboard },
  image: { label: "Image", icon: ImageIcon },
  podcast: { label: "Podcast", icon: Headphones },
  text: { label: "Note", icon: Text },
};

const pickGroupIcon = (label: string): LucideIcon => {
  const lower = label.toLowerCase();
  if (lower.includes("视频") || lower.includes("video")) return Clapperboard;
  if (lower.includes("播客") || lower.includes("podcast")) return Headphones;
  if (lower.includes("文件夹") || lower.includes("folder")) return FolderKanban;
  if (lower.includes("标签") || lower.includes("tag")) return Tag;
  return Layers3;
};

export const FlowSection = ({ title, description, groups }: FlowSectionProps) => {
  const navigate = useNavigate();
  const { addItem } = useKnowledge();
  const [activeGroupId, setActiveGroupId] = useState(groups[0]?.id ?? "");

  useEffect(() => {
    if (groups.length === 0) {
      setActiveGroupId("");
      return;
    }

    const stillExists = groups.some((group) => group.id === activeGroupId);
    if (!stillExists) {
      setActiveGroupId(groups[0].id);
    }
  }, [activeGroupId, groups]);

  const activeItems = useMemo(() => {
    const group = groups.find((item) => item.id === activeGroupId);
    return group?.items ?? [];
  }, [activeGroupId, groups]);

  if (groups.length === 0) {
    return null;
  }

  const sectionPrefix = sectionPrefixMap[title] ?? "SECTION";

  const handleCreatePage = () => {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const draft: TextItem = {
      id,
      type: "text",
      title: "未命名页面",
      summary: "在这里开始记录你的下一条知识。",
      content: "",
      tags: ["草稿"],
      domain: "通用",
      category: "笔记",
      folder: "Inbox",
      createdAt: now,
      updatedAt: now,
      lastViewedAt: now,
    };

    addItem(draft);
    navigate(`/article/${id}`);
  };

  return (
    <section className="space-y-3 rounded-xl border border-zinc-900 bg-[#131313] px-4 py-4">
      <header className="space-y-2">
        <h2 className="text-sm font-medium uppercase tracking-[0.34em] text-yellow-600">{`${sectionPrefix}|${title}`}</h2>
        <div className="flex items-center gap-3">
          <span className="h-4 w-px bg-zinc-600" />
          <p className="text-xs italic text-zinc-400">{description}</p>
        </div>
      </header>

      <div className="flex flex-wrap gap-1.5">
        {groups.map((group) => (
          <button
            key={group.id}
            type="button"
            onClick={() => setActiveGroupId(group.id)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] transition ${
              group.id === activeGroupId
                ? "border-zinc-600 bg-zinc-800 text-zinc-100"
                : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
            }`}
          >
            {(() => {
              const Icon = pickGroupIcon(group.label);
              return <Icon size={12} />;
            })()}
            {group.label}
          </button>
        ))}
      </div>

      {activeItems.length === 0 ? (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-5 text-xs text-zinc-500">
          当前标签页暂无内容。
        </div>
      ) : (
        <div className="flex flex-row gap-3 overflow-x-auto pb-2 w-full">
          {activeItems.map((item) => (
            <Link
              key={item.id}
              to={`/article/${item.id}`}
              className="group flex h-[164px] w-[188px] flex-none flex-col overflow-hidden rounded-xl border border-zinc-800 bg-[#1a1a1a] transition hover:border-zinc-700"
            >
              {item.thumbnailUrl ? (
                <img src={item.thumbnailUrl} alt={item.title} className="h-20 w-full object-cover" />
              ) : (
                <div className="flex h-20 items-center justify-center border-b border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-800">
                  {(() => {
                    const Icon = typeMeta[item.type].icon;
                    return <Icon size={16} className="text-zinc-500" />;
                  })()}
                </div>
              )}

              <div className="flex flex-1 flex-col p-2.5">
                <p className="line-clamp-3 text-xs leading-[1.45] text-zinc-100">{item.title}</p>
                <p className="mt-auto inline-flex items-center gap-1 pt-2 text-[10px] text-zinc-500">
                  {(() => {
                    const Icon = typeMeta[item.type].icon;
                    return <Icon size={11} />;
                  })()}
                  {typeMeta[item.type].label}
                </p>
              </div>
            </Link>
          ))}

          <button
            type="button"
            onClick={handleCreatePage}
            className="flex h-[164px] w-[188px] flex-none items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-[#171717] text-xs text-zinc-500 transition hover:border-zinc-700 hover:text-zinc-300"
          >
            <span className="inline-flex items-center gap-1.5">
              <Plus size={12} />
              New page
            </span>
          </button>
        </div>
      )}
    </section>
  );
};
