import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { Layout } from '@/components/Layout'
import { ProtectedRoute, AdminRoute } from '@/components/ProtectedRoute'
import HomePage from '@/pages/HomePage'
import SearchPage from '@/pages/SearchPage'
import ArticleDetailPage from '@/pages/ArticleDetailPage'
import LoginPage from '@/pages/LoginPage'
import SignupPage from '@/pages/SignupPage'
import CreateArticlePage from '@/pages/CreateArticlePage'
import EditArticlePage from '@/pages/EditArticlePage'
import AdminPage from '@/pages/AdminPage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="articles/:id" element={<ArticleDetailPage />} />
            <Route
              path="articles/new"
              element={
                <ProtectedRoute>
                  <CreateArticlePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="articles/:id/edit"
              element={
                <ProtectedRoute>
                  <EditArticlePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin"
              element={
                <AdminRoute>
                  <AdminPage />
                </AdminRoute>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
