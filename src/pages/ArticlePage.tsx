import { Check, ChevronDown, Image as ImageIcon, Save, SquarePen, Star, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useKnowledge } from "../features/knowledge/KnowledgeContext";
import type { KnowledgeItem } from "../types/knowledge";

const toUniqueSorted = (values: string[]): string[] => [...new Set(values)].sort((left, right) => left.localeCompare(right));

const buildSuggestions = (items: KnowledgeItem[]) => {
  const tags = toUniqueSorted(items.flatMap((item) => item.tags));
  const domains = toUniqueSorted(items.map((item) => item.domain ?? "通用"));
  const categories = toUniqueSorted(items.map((item) => item.category ?? "笔记"));
  const folders = toUniqueSorted(items.map((item) => item.folder ?? "Inbox"));

  return { tags, domains, categories, folders };
};

const useOutsideClose = <T extends HTMLElement>(ref: RefObject<T | null>, onClose: () => void, active: boolean) => {
  useEffect(() => {
    if (!active) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!ref.current) {
        return;
      }
      if (!ref.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [active, onClose, ref]);
};

interface DarkDropdownProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

const DarkDropdown = ({ label, value, options, onChange }: DarkDropdownProps) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  useOutsideClose(wrapperRef, () => setOpen(false), open);

  const normalizedOptions = useMemo(() => {
    const merged = [...options];
    if (value && !merged.includes(value)) {
      merged.unshift(value);
    }
    return toUniqueSorted(merged);
  }, [options, value]);

  return (
    <div ref={wrapperRef} className="relative space-y-2 text-xs text-zinc-500">
      <span>{label}</span>

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-xl border border-zinc-700 bg-[#1e1e1f] px-3 py-2.5 text-left text-base text-zinc-100 transition hover:border-zinc-600"
      >
        <span className="truncate">{value}</span>
        <ChevronDown size={16} className={`text-zinc-400 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open ? (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 shadow-[0_10px_24px_rgba(0,0,0,0.45)]">
          <ul className="max-h-56 overflow-y-auto py-2">
            {normalizedOptions.map((option) => (
              <li key={`${label}-${option}`}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-between px-5 py-3 text-left text-base text-zinc-100 transition hover:bg-zinc-800/70"
                >
                  <span>{option}</span>
                  {option === value ? <Check size={18} className="text-yellow-500" /> : null}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export const ArticlePage = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();
  const { items, markViewed, updateItem } = useKnowledge();
  const viewedRef = useRef(false);
  const [draft, setDraft] = useState<KnowledgeItem | null>(null);
  const [newTag, setNewTag] = useState("");

  const item = useMemo(() => items.find((entry) => entry.id === itemId), [itemId, items]);
  const suggestions = useMemo(() => buildSuggestions(items), [items]);

  useEffect(() => {
    if (!item) {
      return;
    }

    setDraft(item);
  }, [item]);

  useEffect(() => {
    if (!item || viewedRef.current) {
      return;
    }

    markViewed(item.id);
    viewedRef.current = true;
  }, [item, markViewed]);

  if (!itemId || !item || !draft) {
    return (
      <section className="rounded-xl border border-zinc-800 bg-[#181818] p-6 text-sm text-zinc-400">
        页面不存在或已被删除。<Link to="/" className="ml-1 text-zinc-200 underline">返回首页</Link>
      </section>
    );
  }

  const addTag = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed || draft.tags.includes(trimmed)) {
      return;
    }

    setDraft({ ...draft, tags: [...draft.tags, trimmed] });
    setNewTag("");
  };

  const removeTag = (value: string) => {
    setDraft({ ...draft, tags: draft.tags.filter((tag) => tag !== value) });
  };

  const toggleFavorite = () => {
    setDraft({ ...draft, isFavorite: !draft.isFavorite });
  };

  const handleSave = () => {
    const now = new Date().toISOString();
    const normalizedBase = {
      ...draft,
      title: draft.title.trim() || "未命名页面",
      summary: draft.summary.trim() || "暂无摘要",
      domain: draft.domain?.trim() || "通用",
      category: draft.category?.trim() || "笔记",
      folder: draft.folder?.trim() || "Inbox",
      tags: draft.tags.length > 0 ? draft.tags : ["未分类"],
      updatedAt: now,
    };

    const nextItem: KnowledgeItem =
      normalizedBase.type === "text"
        ? { ...normalizedBase, content: normalizedBase.content ?? normalizedBase.summary }
        : normalizedBase;

    updateItem(nextItem);
    navigate("/");
  };

  return (
    <section className="mx-auto max-w-5xl space-y-4">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1 rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1 text-xs text-zinc-300 transition hover:border-zinc-700 hover:text-zinc-100"
      >
        返回
      </button>

      <div className="overflow-hidden rounded-xl border border-zinc-800 bg-[#191919]">
        {draft.thumbnailUrl ? (
          <img src={draft.thumbnailUrl} alt={draft.title} className="h-52 w-full object-cover" />
        ) : (
          <div className="flex h-52 items-center justify-center bg-[radial-gradient(circle_at_30%_30%,rgba(245,158,11,0.14),transparent_46%),linear-gradient(120deg,#1e1e1e,#151515)]">
            <ImageIcon size={32} className="text-zinc-600" />
          </div>
        )}
      </div>

      <div className="rounded-xl border border-zinc-800 bg-[#1a1a1a] p-4">
        <div className="flex items-start justify-between gap-4">
          <input
            value={draft.title}
            onChange={(event) => setDraft({ ...draft, title: event.target.value })}
            className="w-full border-none bg-transparent text-2xl font-medium text-zinc-100 outline-none"
          />
          <button
            type="button"
            onClick={toggleFavorite}
            className={`rounded-md border p-2 transition ${
              draft.isFavorite
                ? "border-yellow-700 bg-yellow-700/20 text-yellow-500"
                : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
            }`}
            aria-label="收藏"
          >
            <Star size={18} />
          </button>
        </div>

        <textarea
          value={draft.summary}
          onChange={(event) => setDraft({ ...draft, summary: event.target.value })}
          rows={2}
          className="mt-3 w-full resize-none rounded-lg border border-zinc-800 bg-[#1e1e1f] px-3 py-2 text-sm text-zinc-300 outline-none"
          placeholder="摘要"
        />
      </div>

      <div className="rounded-xl border border-zinc-800 bg-[#1a1a1a] p-4">
        <div className="space-y-3">
          <div>
            <p className="text-xs text-zinc-500">标签</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {draft.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-900 px-2 py-0.5 text-[11px] text-zinc-300"
                >
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="text-zinc-500 hover:text-zinc-200">
                    <X size={11} />
                  </button>
                </span>
              ))}
            </div>

            <div className="mt-2 flex gap-2">
              <input
                value={newTag}
                onChange={(event) => setNewTag(event.target.value)}
                placeholder="添加标签"
                className="w-40 rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-zinc-200 outline-none"
              />
              <button
                type="button"
                onClick={() => addTag(newTag)}
                className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-zinc-300 transition hover:border-zinc-600 hover:text-zinc-100"
              >
                添加
              </button>
            </div>

            <div className="mt-2 flex flex-wrap gap-1.5">
              {suggestions.tags.slice(0, 10).map((tag) => (
                <button
                  key={`option-${tag}`}
                  type="button"
                  onClick={() => addTag(tag)}
                  className="rounded-full border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-[10px] text-zinc-500 transition hover:border-zinc-700 hover:text-zinc-300"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <DarkDropdown
              label="领域"
              value={draft.domain ?? "通用"}
              options={suggestions.domains}
              onChange={(domain) => setDraft({ ...draft, domain })}
            />
            <DarkDropdown
              label="类别"
              value={draft.category ?? "笔记"}
              options={suggestions.categories}
              onChange={(category) => setDraft({ ...draft, category })}
            />
            <DarkDropdown
              label="文件夹"
              value={draft.folder ?? "Inbox"}
              options={suggestions.folders}
              onChange={(folder) => setDraft({ ...draft, folder })}
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-[#1a1a1a] p-4">
        <h2 className="inline-flex items-center text-yellow-600" aria-label="编辑">
          <SquarePen size={24} />
        </h2>
        <textarea
          value={draft.content ?? ""}
          onChange={(event) => setDraft({ ...draft, content: event.target.value })}
          rows={14}
          className="mt-3 w-full rounded-lg border border-zinc-800 bg-[#1e1e1f] px-3 py-2 text-sm leading-relaxed text-zinc-300 outline-none"
          placeholder="开始编辑正文内容..."
        />
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-200 transition hover:border-zinc-600 hover:bg-zinc-800"
          >
            <Save size={15} />
            保存
          </button>
        </div>
      </div>
    </section>
  );
};
