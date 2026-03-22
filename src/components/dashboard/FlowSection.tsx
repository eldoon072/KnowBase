import { useEffect, useMemo, useState } from "react";
import { KnowledgeCard } from "../knowledge/KnowledgeCard";
import type { KnowledgeItem } from "../../types/knowledge";

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

export const FlowSection = ({ title, description, groups }: FlowSectionProps) => {
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

  return (
    <section className="space-y-3 rounded-xl border border-zinc-800 bg-[#161616] p-4">
      <header className="space-y-1">
        <h2 className="text-xs font-medium uppercase tracking-[0.16em] text-yellow-600">{title}</h2>
        <p className="text-xs italic text-zinc-500">{description}</p>
      </header>

      <div className="scrollbar-none flex flex-row gap-2 overflow-x-auto pb-2 w-full">
        {groups.map((group) => (
          <button
            key={group.id}
            type="button"
            onClick={() => setActiveGroupId(group.id)}
            className={`flex-none rounded-full border px-3 py-1 text-[11px] transition ${
              group.id === activeGroupId
                ? "border-zinc-600 bg-zinc-800 text-zinc-100"
                : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
            }`}
          >
            {group.label}
          </button>
        ))}
      </div>

      {activeItems.length === 0 ? (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-5 text-xs text-zinc-500">
          当前标签页暂无内容。
        </div>
      ) : (
        <div className="scrollbar-none flex flex-row gap-6 overflow-x-auto pb-4 w-full">
          {activeItems.map((item) => (
            <KnowledgeCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
};
