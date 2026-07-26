import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router'
import App from './App.tsx'
import { ThemeProvider } from './context/ThemeContext.tsx' ; 
import { OrgProvider } from './context/orgContext.tsx' ;
import { AuthProvider } from './context/authContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <OrgProvider>
            <App />
          </OrgProvider>
        </AuthProvider>
  
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
