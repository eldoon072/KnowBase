import { FileText, Image as ImageIcon, Link2, Podcast, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";
import type { KnowledgeItem } from "../../types/knowledge";

interface KnowledgeCardProps {
  item: KnowledgeItem;
}

const typeMeta: Record<
  KnowledgeItem["type"],
  {
    label: string;
    icon: typeof FileText;
  }
> = {
  article: { label: "Article", icon: FileText },
  video: { label: "Video", icon: PlayCircle },
  image: { label: "Image", icon: ImageIcon },
  podcast: { label: "Podcast", icon: Podcast },
  text: { label: "Text", icon: FileText },
};

const renderSubMeta = (item: KnowledgeItem): string | undefined => {
  if (item.type === "article" && item.readingMinutes) {
    return `${item.readingMinutes} min read`;
  }
  if (item.type === "video" && item.duration) {
    return `${item.platform ?? "Video"} · ${item.duration}`;
  }
  if (item.type === "podcast" && item.duration) {
    return `${item.showName ?? "Podcast"} · ${item.duration}`;
  }
  if (item.type === "image" && item.width && item.height) {
    return `${item.width} × ${item.height}`;
  }
  if (item.type === "text") {
    return "Quick note";
  }
  return undefined;
};

export const KnowledgeCard = ({ item }: KnowledgeCardProps) => {
  const Icon = typeMeta[item.type].icon;
  const subMeta = renderSubMeta(item);

  return (
    <article className="group flex flex-none w-72 flex-col overflow-hidden rounded-xl border border-zinc-800 bg-[#1e1e1e] transition hover:border-zinc-700 hover:bg-[#232323]">
      {item.type === "image" && item.thumbnailUrl ? (
        <img src={item.thumbnailUrl} alt={item.altText ?? item.title} className="h-36 w-full object-cover" />
      ) : (
        <div className="flex h-28 items-center justify-between border-b border-zinc-800 bg-gradient-to-br from-zinc-900 to-[#222222] px-4">
          <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">{typeMeta[item.type].label}</span>
          <Icon size={16} className="text-zinc-500" />
        </div>
      )}

      <div className="flex flex-1 flex-col p-4">
        <Link to={`/article/${item.id}`} className="line-clamp-2 text-sm font-medium text-zinc-100 hover:text-zinc-50">
          {item.title}
        </Link>
        <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-zinc-400">{item.summary}</p>

        {subMeta ? <p className="mt-3 text-[11px] text-zinc-500">{subMeta}</p> : null}

        <div className="mt-3 flex flex-wrap gap-1.5">
          {item.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-zinc-700 bg-zinc-900 px-2 py-0.5 text-[10px] uppercase tracking-[0.08em] text-zinc-400"
            >
              {tag}
            </span>
          ))}
        </div>

        {item.sourceUrl ? (
          <a
            href={item.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-[11px] text-zinc-300 transition hover:text-zinc-100"
          >
            <Link2 size={12} />
            Open Source
          </a>
        ) : null}
      </div>
    </article>
  );
};
