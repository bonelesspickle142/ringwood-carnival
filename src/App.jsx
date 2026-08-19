import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import Layout from './components/Layout.jsx';
import CookieBanner from './components/CookieBanner';
import Home from './pages/Home';
import WhatsAppSubscribe from './pages/WhatsAppSubscribe';
import Schedule from './pages/Schedule.jsx';
import Donate from './pages/Donate';
import Gallery from './pages/Gallery';
import Team from './pages/Team';
import Settings from './pages/Settings';
import Info from './pages/Info';
import Staff from './pages/Staff';
import MarshalArea from './pages/MarshalArea';
import Vote from './pages/Vote';
import MapView from './pages/MapView';
import Privacy from './pages/Privacy';

// Sync Tailwind dark class with system color scheme
if (typeof window !== "undefined") {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const apply = (e) => document.documentElement.classList.toggle("dark", e.matches);
  apply(mq);
  mq.addEventListener("change", apply);
}

const PUBLIC_ROUTES = ['/whatsapp'];

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();
  const location = useLocation();

  // Public routes bypass auth entirely
  if (PUBLIC_ROUTES.includes(location.pathname)) {
    return (
      <Routes>
        <Route path="/whatsapp" element={<WhatsAppSubscribe />} />
      </Routes>
    );
  }

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/team" element={<Team />} />
        <Route path="/info" element={<Info />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/committee" element={<Staff />} />
        <Route path="/staff" element={<MarshalArea />} />
        <Route path="/vote" element={<Vote />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
        <CookieBanner />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App