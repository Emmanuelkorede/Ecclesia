import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router'
import App from './App.tsx'
import { ThemeProvider } from './components/ui/ThemeContext.tsx' ; 
import { OrgProvider } from './context/orgContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        
        <OrgProvider>
          <App />
        </OrgProvider>
        
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
