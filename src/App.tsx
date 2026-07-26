import { Route , Routes } from 'react-router'
import './App.css'
import ProfileCompletionPage from './pages/onboarding/profileCompletionPage' ;
import ChoosePathPage from './pages/onboarding/choosePathPage';
import ChurchRegistrationPage from './pages/onboarding/churhRegsirationPage';
import MemberJoinPage from './pages/onboarding/membersJoinPage';
import AuthPage from './pages/public/authPage';
import ProtectedRoute from './routes/protectedRoute';
import PublicRoute from './routes/publicRoute';

function App() {

  return (
    <>
    <Routes>
      <Route element={<PublicRoute />} >
                  <Route path='/auth' element={<AuthPage />} />

      </Route>
      
      <Route element={<ProtectedRoute />} >
            <Route path='/PLACEHOLDER_DASHBOARD' element={<div>Dashboard</div>} />
            <Route path='/complete-profile' element={<ProfileCompletionPage />} />
        <Route path='/choose-path' element={<ChoosePathPage />} />
        <Route path='/register-church' element={<ChurchRegistrationPage />} />
        <Route path='/join-church' element={<MemberJoinPage />} />
      </Route>
    </Routes>
      
    </>
  )
}

export default App
