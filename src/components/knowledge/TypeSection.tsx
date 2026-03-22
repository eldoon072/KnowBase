import type { KnowledgeItem } from "../../types/knowledge";
import { KnowledgeCard } from "./KnowledgeCard";

interface TypeSectionProps {
  title: string;
  quote: string;
  items: KnowledgeItem[];
}

export const TypeSection = ({ title, quote, items }: TypeSectionProps) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3">
      <header className="space-y-1">
        <h2 className="text-xs font-medium uppercase tracking-[0.16em] text-yellow-600">{title}</h2>
        <p className="text-xs italic text-zinc-500">{quote}</p>
      </header>

      <div className="scrollbar-none flex flex-row gap-6 overflow-x-auto pb-4 w-full">
        {items.map((item) => (
          <KnowledgeCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
};
