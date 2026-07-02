/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { HomePage } from "./pages/HomePage";
import { AdminLayout } from "./pages/admin/AdminLayout";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminArticles } from "./pages/admin/AdminArticles";
import { EditorPage } from "./pages/admin/EditorPage";
import { AdminUsers } from "./pages/admin/AdminUsers";
import { AdminSettings } from "./pages/admin/AdminSettings";
import { ArticlePage } from "./pages/ArticlePage";
import { ProfilePage } from "./pages/ProfilePage";
import { SignupPage } from "./pages/SignupPage";
import { AdminLogin } from "./pages/admin/AdminLogin";
import { AdminGuard } from "./components/AdminGuard";

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:categorySlug" element={<HomePage />} />
          <Route path="/topic/:topicSlug" element={<HomePage />} />
          <Route path="/featured/:featuredSlug" element={<HomePage />} />
          <Route path="/article/:slug" element={<ArticlePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {/* Admin Authentication Gate */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Protected Admin Routes */}
          <Route element={<AdminGuard />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="articles" element={<AdminArticles />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="editor" element={<EditorPage />} />
              <Route path="editor/:id" element={<EditorPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}
