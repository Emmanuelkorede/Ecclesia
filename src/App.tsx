import { Route , Routes } from 'react-router'
import './App.css'
import ProfileCompletionPage from './pages/onboarding/profileCompletionPage' ;
import ChoosePathPage from './pages/onboarding/choosePathPage';
import ChurchRegistrationPage from './pages/onboarding/churhRegsirationPage';
import MemberJoinPage from './pages/onboarding/membersJoinPage';
import AuthPage from './pages/public/authPage';
import ProtectedRoute from './routes/protectedRoute';
import PublicRoute from './routes/publicRoute';
import ProtectedLayout from './components/layout/protectedLayout';
import OnboardingGuard from './routes/onboardingGuard';
import LandingPage from './pages/public/landingPage';
import PricingPage from './pages/public/pricingPage';
import DashboardPage from './pages/admin/dashBoard';
import EventsPage from './pages/admin/eventsPage';
import MembersPage from './pages/admin/membersPage';
import GroupsPage from './pages/admin/groupsPage';
import SettingsPage from './pages/admin/settings';
import AttendanceSessionPage from './pages/admin/attendaceSessionPage';
import AnalyticsPage from './pages/admin/analytics';
import BillingPage from './pages/admin/billingPage';
import PremiumPage from './pages/admin/premuimPage';
import SermonsPage from './pages/admin/sermonsPage';
import AnnouncementsPage from './pages/admin/annoucmentPage';
import MemberDashboardPage from './pages/member/memberDashboard';
import CheckInPage from './pages/member/checkinPage';
import ScheduleSermonsPage from './pages/member/serMonsPage';
import SchedulePage from './pages/admin/schedulePage';
import AnnouncementDetailPage from './pages/member/announcementDetailsPage';

function App() {

  return (
    <>
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={<LandingPage />} />
        <Route path='/pricing' element={<PricingPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        {/* Layer 1: must be logged in to reach anything below this line */}

        <Route element={<OnboardingGuard />}>
          {/* Layer 2: onboarding-stage routing only */}
          <Route path="/complete-profile" element={<ProfileCompletionPage />} />
          <Route path="/choose-path" element={<ChoosePathPage />} />
          <Route path="/register-church" element={<ChurchRegistrationPage />} />
          <Route path="/join-church" element={<MemberJoinPage />} />
        </Route>

        <Route element={<ProtectedLayout />}>
          {/* Layer 3: fully onboarded, dashboard routing */}
          <Route path="/admin/dashboard" element={<DashboardPage />} />
          <Route path='/admin/members' element={<MembersPage />} />
          <Route path='/admin/events' element={<EventsPage />} />
          <Route path='/admin/groups' element={<GroupsPage />} />
          <Route path='/admin/settings' element={<SettingsPage />} />
          <Route path='/admin/attendance' element={<AttendanceSessionPage />} />
          <Route path='/admin/analytics' element={<AnalyticsPage />} />
          <Route path='/admin/billing' element={<BillingPage />} />
          <Route path='/admin/sermons' element={<SermonsPage />} />
          <Route  path='/premium' element={<PremiumPage />} />
          <Route path='/admin/announcements' element={<AnnouncementsPage />} />
          <Route path='/admin/schedule' element={<SchedulePage />} />

          //member 
          <Route path='/member/dashboard' element={<MemberDashboardPage />} />
          <Route path='/member/check-in' element={<CheckInPage />} />
          <Route path='/member/sermons' element={<ScheduleSermonsPage />} />
          <Route path='/member/announcements/:id' element={<AnnouncementDetailPage />} />
        </Route>
      </Route>
    </Routes>
      
    </>
  )
}

export default App
