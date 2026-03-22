import { Diamond } from "lucide-react";
import { toolCardItems } from "../../constants/dashboard";

export const ToolCardPanel = () => {
  return (
    <section className="rounded-xl border border-zinc-800 bg-[#242424] p-4">
      <h3 className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-zinc-200">工具 | Tool</h3>

      <div className="flex flex-row gap-6 overflow-x-auto pb-4 w-full">
        {toolCardItems.map((tool) => (
          <a
            key={tool.name}
            href={tool.url}
            target="_blank"
            rel="noreferrer"
            className="flex-none w-56 rounded-lg border border-zinc-700 bg-zinc-900/50 px-3 py-3 text-xs text-zinc-300 transition hover:border-zinc-500 hover:text-zinc-100"
          >
            <span className="inline-flex items-center gap-1.5">
              <Diamond size={12} className="text-zinc-500" />
              {tool.name}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
};
