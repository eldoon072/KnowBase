import { RotateCcw, Trash2 } from "lucide-react";
import { useKnowledge } from "../features/knowledge/KnowledgeContext";

export const SettingsPage = () => {
  const { clearAll, resetToSeed } = useKnowledge();

  return (
    <section className="max-w-2xl space-y-4">
      <header>
        <h2 className="text-xs uppercase tracking-[0.18em] text-yellow-600">存储设置</h2>
        <p className="mt-1 text-xs text-zinc-500">
          KnowBase 当前使用浏览器 <code className="rounded bg-zinc-900 px-1 py-0.5">localStorage</code> 持久化数据。
        </p>
      </header>

      <div className="rounded-xl border border-zinc-800 bg-[#1e1e1e] p-4">
        <h3 className="text-sm text-zinc-200">数据维护</h3>
        <p className="mt-2 text-xs leading-relaxed text-zinc-400">
          清空会移除所有知识卡片；重置会写回系统默认的示例数据。
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={resetToSeed}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 transition hover:border-zinc-600 hover:bg-zinc-800"
          >
            <RotateCcw size={14} />
            重置示例数据
          </button>

          <button
            type="button"
            onClick={clearAll}
            className="inline-flex items-center gap-2 rounded-lg border border-red-900/70 bg-red-950/60 px-3 py-2 text-xs text-red-200 transition hover:border-red-800 hover:bg-red-950"
          >
            <Trash2 size={14} />
            清空所有数据
          </button>
        </div>
      </div>
    </section>
  );
};
