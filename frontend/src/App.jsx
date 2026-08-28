import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Toaster } from "react-hot-toast";

import EditBlogPage from "./pages/EditBlogPage";

import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/AppLayout";

import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";

import LibraryPage from "./pages/LibraryPage";
import ProfilePage from "./pages/ProfilePage";
import WritePage from "./pages/WritePage";

import BlogPage from "./pages/BlogPage";

import SearchPage from "./pages/SearchPage";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />
      <AuthProvider>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/blogs/:id" element={<BlogPage />} />
              <Route path="/library" element={<LibraryPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/write" element={<WritePage />} />
              <Route path="/blogs/:id/edit" element={<EditBlogPage />} />
              <Route path="/search" element={<SearchPage />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
