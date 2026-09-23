import { createBrowserRouter, Navigate } from 'react-router-dom'
import LocaleRedirect from '@/app/LocaleRedirect'
import RootLayout from '@/app/RootLayout'
import HomePage from '@/app/pages/HomePage'
import ErrorPage from '@/app/pages/ErrorPage'
import NotFoundPage from '@/app/pages/NotFoundPage'
import ProjectsPage from '@/app/pages/ProjectsPage'
import ProjectDetailPage from '@/app/pages/ProjectDetailPage'
import BlogComingSoonPage from '@/app/pages/BlogComingSoonPage'
import AdminLayout from '@/components/admin/AdminLayout'
import AdminLoginPage from '@/app/pages/AdminLoginPage'
import AdminAddBlogPage from '@/app/pages/AdminAddBlogPage'
import AdminPostsPage from '@/app/pages/AdminPostsPage'

// The unprefixed entry redirects first; every content route then lives under a locale layout.
const router = createBrowserRouter(
  [
    {
      path: '/',
      children: [
        { index: true, element: <LocaleRedirect /> },
        {
          path: ':locale',
          element: <RootLayout />,
          children: [
            { index: true, element: <HomePage /> },
            { path: 'blog', element: <BlogComingSoonPage /> },
            { path: 'blog/:slug', element: <BlogComingSoonPage /> },
            { path: 'projects', element: <ProjectsPage /> },
            { path: 'projects/:slug', element: <ProjectDetailPage /> },
            { path: '*', element: <NotFoundPage /> },
          ],
        },
        {
          path: 'admin',
          element: <AdminLayout />,
          errorElement: <ErrorPage />,
          children: [
            { index: true, element: <Navigate to="add-blog" replace /> },
            { path: 'login', element: <AdminLoginPage /> },
            { path: 'add-blog', element: <AdminAddBlogPage /> },
            { path: 'posts', element: <AdminPostsPage /> },
          ],
        },
        { path: '*', element: <Navigate to="/" replace /> },
      ],
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
    },
  },
)

export default router
