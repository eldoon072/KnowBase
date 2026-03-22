import { Link } from "react-router-dom";
import { navigationCardItems } from "../../constants/dashboard";

export const NavigationCardPanel = () => {
  const createArchiveHref = (item: (typeof navigationCardItems)[number]): string => {
    if (!item.archiveFilter) {
      return "/all";
    }

    const params = new URLSearchParams({
      filter: item.archiveFilter.kind,
      value: item.archiveFilter.value,
    });

    return `/all?${params.toString()}`;
  };

  return (
    <section className="rounded-xl border border-zinc-800 bg-[#242424] p-4">
      <h3 className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-zinc-200">导航 | Navigation</h3>
      <div className="overflow-y-auto">
        <div className="grid gap-0.5 md:grid-cols-2">
          {navigationCardItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={`${item.zh}-${item.en}`}
                to={createArchiveHref(item)}
                className="flex items-center justify-between border-b border-zinc-700/60 px-2 py-2.5 text-xs transition hover:bg-zinc-900/40"
              >
                <div className="inline-flex items-center gap-2 text-zinc-300">
                  <Icon size={14} className="text-zinc-500" />
                  <span>{item.zh}</span>
                </div>
                <span className="text-zinc-500">{item.en}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
