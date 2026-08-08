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

// Deployed both standalone (root) and proxied under johnjpet.dev/skillmatch/ --
// detect which one we're in so routes resolve against the right prefix.
const basename = window.location.pathname.startsWith('/skillmatch') ? '/skillmatch' : '/'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
