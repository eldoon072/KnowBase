import { useMemo } from "react";
import { Clock3, Menu, PlusSquare, Settings, Star, Tag } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useKnowledge } from "../../features/knowledge/KnowledgeContext";
import type { TextItem } from "../../types/knowledge";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const Sidebar = ({ collapsed, onToggle }: SidebarProps) => {
  const navigate = useNavigate();
  const { addItem, items } = useKnowledge();

  const recentItems = useMemo(() => {
    return [...items]
      .sort((left, right) => {
        const leftTime = new Date(left.lastViewedAt ?? left.updatedAt).getTime();
        const rightTime = new Date(right.lastViewedAt ?? right.updatedAt).getTime();
        return rightTime - leftTime;
      })
      .slice(0, 5);
  }, [items]);

  const favoriteItems = useMemo(() => {
    return items.filter((item) => item.isFavorite).slice(0, 5);
  }, [items]);

  const commonTags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of items) {
      for (const tag of item.tags) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }

    return [...counts.entries()]
      .sort((left, right) => right[1] - left[1])
      .slice(0, 14)
      .map(([tag]) => tag);
  }, [items]);

  const handleCreatePage = () => {
    const now = new Date().toISOString();
    const id = crypto.randomUUID();

    const draft: TextItem = {
      id,
      type: "text",
      title: "未命名页面",
      summary: "在这里开始记录你的下一条知识。",
      content: "",
      tags: ["草稿"],
      domain: "通用",
      category: "笔记",
      folder: "Inbox",
      createdAt: now,
      updatedAt: now,
      lastViewedAt: now,
    };

    addItem(draft);
    navigate(`/article/${id}`);
  };

  const topButtonClass =
    "inline-flex h-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 transition hover:border-zinc-700 hover:text-zinc-100";

  return (
    <aside
      className={`relative h-full border-r border-zinc-800 bg-[#171717] transition-[width] duration-300 ${
        collapsed ? "w-[84px]" : "w-[186px]"
      }`}
    >
      <div className="flex h-full flex-col">
        <div className={`grid gap-2 border-b border-zinc-800 p-3 ${collapsed ? "grid-cols-1" : "grid-cols-2"}`}>
          <button type="button" onClick={onToggle} className={`${topButtonClass} w-full`} aria-label="菜单">
            <Menu size={16} />
          </button>
          <button
            type="button"
            onClick={handleCreatePage}
            className={`${topButtonClass} ${collapsed ? "w-full" : "w-full gap-2"} text-xs`}
            aria-label="新页面"
          >
            <PlusSquare size={16} />
            {!collapsed ? <span>新页面</span> : null}
          </button>
        </div>

        {!collapsed ? (
          <div className="scrollbar-none flex-1 space-y-5 overflow-y-auto px-3 py-3">
            <section className="space-y-2 rounded-lg border border-zinc-800 bg-[#1d1d1d] p-3">
              <h3 className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">基础导航</h3>
              <div className="space-y-1.5">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `block rounded-md border px-2.5 py-1.5 text-xs transition ${
                      isActive
                        ? "border-zinc-700 bg-zinc-900 text-zinc-100"
                        : "border-transparent text-zinc-400 hover:border-zinc-800 hover:bg-zinc-900 hover:text-zinc-200"
                    }`
                  }
                >
                  首页
                </NavLink>
                <NavLink
                  to="/all"
                  className={({ isActive }) =>
                    `block rounded-md border px-2.5 py-1.5 text-xs transition ${
                      isActive
                        ? "border-zinc-700 bg-zinc-900 text-zinc-100"
                        : "border-transparent text-zinc-400 hover:border-zinc-800 hover:bg-zinc-900 hover:text-zinc-200"
                    }`
                  }
                >
                  存档
                </NavLink>
              </div>
            </section>

            <section className="space-y-2 rounded-lg border border-zinc-800 bg-[#1d1d1d] p-3">
              <h3 className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                <Clock3 size={12} />
                最近查看
              </h3>
              <ul className="space-y-1">
                {recentItems.map((item) => (
                  <li key={`recent-${item.id}`}>
                    <Link
                      to={`/article/${item.id}`}
                      className="line-clamp-1 rounded-md px-1.5 py-1 text-[11px] leading-4 text-zinc-400 transition hover:bg-zinc-900 hover:text-zinc-200"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section className="space-y-2 rounded-lg border border-zinc-800 bg-[#1d1d1d] p-3">
              <h3 className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                <Star size={12} />
                最喜欢
              </h3>
              <ul className="space-y-1">
                {favoriteItems.length === 0 ? (
                  <li className="px-2 py-1 text-xs text-zinc-500">暂无收藏</li>
                ) : (
                  favoriteItems.map((item) => (
                    <li key={`favorite-${item.id}`}>
                      <Link
                        to={`/article/${item.id}`}
                        className="line-clamp-1 rounded-md px-1.5 py-1 text-[11px] leading-4 text-zinc-400 transition hover:bg-zinc-900 hover:text-zinc-200"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            </section>

            <section className="space-y-2 rounded-lg border border-zinc-800 bg-[#1d1d1d] p-3">
              <h3 className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                <Tag size={12} />
                标签网络
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {commonTags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/all?${new URLSearchParams({ filter: "tag", value: tag }).toString()}`}
                    className="rounded-full border border-zinc-700 bg-zinc-900 px-2 py-0.5 text-[10px] uppercase tracking-[0.08em] text-zinc-400 transition hover:border-zinc-600 hover:text-zinc-200"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </section>
          </div>
        ) : (
          <div className="flex-1" />
        )}

        <button
          type="button"
          onClick={() => navigate("/settings")}
          className={`m-3 ${topButtonClass} ${collapsed ? "w-auto" : "w-[calc(100%-24px)] gap-2 text-xs"}`}
          aria-label="设置"
        >
          <Settings size={16} />
          {!collapsed ? <span>设置</span> : null}
        </button>
      </div>
    </aside>
  );
};
