import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { KnowledgeProvider } from "./features/knowledge/KnowledgeContext";
import { AllItemsPage } from "./pages/AllItemsPage";
import { ArticlePage } from "./pages/ArticlePage";
import { DashboardPage } from "./pages/DashboardPage";
import { SettingsPage } from "./pages/SettingsPage";

const App = () => {
  return (
    <KnowledgeProvider>
      <AppShell>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/all" element={<AllItemsPage />} />
          <Route path="/article/:itemId" element={<ArticlePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </KnowledgeProvider>
  );
};

export default App;
