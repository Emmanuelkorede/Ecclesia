import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router'
import App from './App.tsx'
import { ThemeProvider } from './context/ThemeContext.tsx' ; 
import { OrgProvider } from './context/orgContext.tsx' ;
import { AuthProvider } from './context/authContext.tsx'
import { ProfileProvider } from './context/ProfileContext.tsx'
import { OneSignalProvider } from './context/oneSignalProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ProfileProvider>
            <OrgProvider>
              <OneSignalProvider> 
                <App />
              </OneSignalProvider>
            </OrgProvider>
          </ProfileProvider>
        </AuthProvider>
  
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
