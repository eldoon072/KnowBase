import { navigationCardItems } from "../../constants/dashboard";

export const NavigationCardPanel = () => {
  return (
    <section className="rounded-xl border border-zinc-800 bg-[#242424] p-4">
      <h3 className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-zinc-200">导航 | Navigation</h3>
      <div className="grid gap-0.5 md:grid-cols-2">
        {navigationCardItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={`${item.zh}-${item.en}`}
              className="flex items-center justify-between border-b border-zinc-700/60 px-2 py-2.5 text-xs"
            >
              <div className="inline-flex items-center gap-2 text-zinc-300">
                <Icon size={14} className="text-zinc-500" />
                <span>{item.zh}</span>
              </div>
              <span className="text-zinc-500">{item.en}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
