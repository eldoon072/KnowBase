import { Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { KnowledgeCard } from "../components/knowledge/KnowledgeCard";
import { useKnowledge } from "../features/knowledge/KnowledgeContext";
import { formatDateTime } from "../lib/date";

export const AllItemsPage = () => {
  const { items, removeItem } = useKnowledge();

  return (
    <section>
      <header className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="text-xs uppercase tracking-[0.18em] text-yellow-600">全部卡片</h2>
          <p className="mt-1 text-xs text-zinc-500">当前共有 {items.length} 条知识记录。</p>
        </div>
      </header>

      {items.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-[#1b1b1b] px-5 py-8 text-center text-sm text-zinc-400">
          暂无数据，可在设置页恢复示例数据。
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="space-y-2">
              <KnowledgeCard item={item} />
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
