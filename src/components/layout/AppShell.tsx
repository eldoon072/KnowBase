import { useState, type ReactNode } from "react";
import { Sidebar } from "./Sidebar";

export const AppShell = ({ children }: { children: ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((prev) => !prev)} />
      <main className="scrollbar-none min-w-0 flex-1 overflow-y-auto bg-zinc-950 px-5 py-5 lg:px-7 lg:py-6">
        {children}
      </main>
    </div>
  );
};
