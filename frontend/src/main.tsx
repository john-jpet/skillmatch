import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { inject } from '@vercel/analytics'
import { injectSpeedInsights } from '@vercel/speed-insights'
import './index.css'
import App from './App.tsx'

inject()
injectSpeedInsights()

// Apply saved theme synchronously before first paint to prevent flash
const _savedTheme = localStorage.getItem('sm-theme') || 'dark'
document.documentElement.setAttribute('data-theme', _savedTheme)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
