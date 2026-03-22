import { Search } from "lucide-react";

interface HeroHeaderProps {
  query: string;
  onQueryChange: (value: string) => void;
}

export const HeroHeader = ({ query, onQueryChange }: HeroHeaderProps) => {
  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#181818]">
      <div className="relative h-40 w-full overflow-hidden border-b border-zinc-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(245,158,11,0.15),transparent_45%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.18),transparent_40%),linear-gradient(120deg,#191919,#101010)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(39,39,42,0.24)_1px,transparent_1px),linear-gradient(to_bottom,rgba(39,39,42,0.24)_1px,transparent_1px)] bg-[size:36px_36px]" />
      </div>

      <div className="flex flex-col gap-4 px-5 py-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">Personal Knowledge Space</p>
          <h1 className="mt-2 text-xl font-medium tracking-wide text-zinc-100">KnowBase</h1>
        </div>

        <label className="flex w-full items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 lg:w-80">
          <Search size={15} className="text-zinc-500" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="全局搜索标题、摘要、标签..."
            className="w-full border-none bg-transparent text-sm text-zinc-200 outline-none placeholder:text-zinc-500"
          />
        </label>
      </div>
    </section>
  );
};
