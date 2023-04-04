import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Register from './pages/register'
import Login from './pages/login'
import ErrorPage from './pages/error'
import SingleProductPage from './pages/product'
import Products from './pages/products'
import Dashboard from './pages/dashbord'
import './index.css'
import Published from './pages/published'
import Create from './pages/create'
import { CookiesProvider } from 'react-cookie'
import Home from './pages/home'
import Pending from './pages/pending'
import Edit from './pages/edit'


const root = createRoot(document.getElementById('root'))
const router = createBrowserRouter([
    { path: "/", element: <Home />, errorElement: <ErrorPage /> },
    { path: "/dashboard", element: <Dashboard />, errorElement: <ErrorPage /> },
    { path: "/login", element: <Login />, errorElement: <ErrorPage /> },
    { path: "/register", element: <Register />, errorElement: <ErrorPage /> },
    { path: "/products", element: <Products />, errorElement: <ErrorPage /> },
    { path: "/dashboard/edit/:id", element: <Edit />, errorElement: <ErrorPage /> },
    { path: "/products/:id", element: <SingleProductPage />, errorElement: <ErrorPage /> },
    { path: "/dashboard/create", element: <Create />, errorElement: <ErrorPage /> },
    { path: "/dashboard/published", element: <Published />, errorElement: <ErrorPage /> },
    { path: "/dashboard/pending", element: <Pending />, errorElement: <ErrorPage /> },

])


root.render(
    < React.StrictMode >
        <CookiesProvider>
            <RouterProvider router={router} />
        </CookiesProvider>
    </React.StrictMode >
)