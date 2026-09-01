import { useNavigate, useLocation } from 'react-router';
import { useActiveOrg } from '../../hooks/useActiveOrg';
import { useAuth } from '../../hooks/useAuth';

import { Logo } from '../../components/ui/Logo';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import { BrandLoader } from '../../components/ui/BrandLoader';
import { Building2, UserPlus, ArrowRight, Compass } from 'lucide-react';

export default function ChoosePathPage() {
  const { loading } = useActiveOrg();
  const { initialized } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If reached via /add-church (existing member adding another church),
  // route onward under /add-church/... so the destination pages know
  // NOT to run first-time-onboarding redirect logic.
  const isAddingChurch = location.pathname === '/add-church';
  const createPath = isAddingChurch ? '/add-church/create' : '/register-church';
  const joinPath = isAddingChurch ? '/add-church/join' : '/join-church';

  if (!initialized || loading) {
    return <BrandLoader fullScreen message="Loading options..." />;
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-app text-main transition-colors duration-200 relative">
      
      <header className="w-full flex items-center justify-between p-4 sm:p-6 max-w-6xl mx-auto z-10">
        <Logo className="h-8 w-auto text-brand-600 dark:text-brand-500" />
        <ThemeToggle />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 max-w-4xl mx-auto w-full my-auto">
        
        <div className="text-center mb-8 sm:mb-10 max-w-lg">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-soft text-brand-600 text-xs font-semibold mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>{isAddingChurch ? 'Add a Church' : 'Getting Started'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-main mb-2">
            {isAddingChurch ? 'Add another church' : 'What would you like to do today?'}
          </h1>
          <p className="text-xs sm:text-sm text-muted leading-relaxed">
            {isAddingChurch
              ? 'Create a new church or join one with a code — your existing churches stay exactly where they are.'
              : "You're not part of a church workspace yet. Choose an option below to set up your account."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full max-w-3xl">
          
          <button
            type="button"
            onClick={() => navigate(createPath)}
            className="group text-left bg-surface border border-subtle hover:border-brand-500/50 rounded-2xl p-6 sm:p-8 shadow-xs hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden active:scale-[0.99]"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-xl group-hover:scale-110 transition-transform duration-200">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="w-8 h-8 rounded-full bg-app flex items-center justify-center text-muted group-hover:text-brand-600 group-hover:bg-brand-500/10 transition-colors">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            <div>
              <h2 className="text-base sm:text-lg font-bold text-main mb-1.5 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                Create a Church
              </h2>
              <p className="text-xs text-muted leading-relaxed">
                For Senior Pastors & Church Admins — register your church workspace and set up your leadership team.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => navigate(joinPath)}
            className="group text-left bg-surface border border-subtle hover:border-brand-500/50 rounded-2xl p-6 sm:p-8 shadow-xs hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden active:scale-[0.99]"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-xl group-hover:scale-110 transition-transform duration-200">
                <UserPlus className="w-6 h-6" />
              </div>
              <div className="w-8 h-8 rounded-full bg-app flex items-center justify-center text-muted group-hover:text-brand-600 group-hover:bg-brand-500/10 transition-colors">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            <div>
              <h2 className="text-base sm:text-lg font-bold text-main mb-1.5 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                Join a Church
              </h2>
              <p className="text-xs text-muted leading-relaxed">
                For Members & Sub-Admins — enter your church code to request access or join an existing ministry.
              </p>
            </div>
          </button>

        </div>
      </main>

    </div>
  );
}