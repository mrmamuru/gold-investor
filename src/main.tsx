import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import AdminApp from './AdminApp.tsx'
import DemoAdmin from './DemoAdmin.tsx'

const RootApp = window.location.pathname.startsWith('/admin/demo') ? DemoAdmin : window.location.pathname.startsWith('/admin') ? AdminApp : App

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootApp />
  </StrictMode>,
)
