import { useState } from 'react';
import { SignUpPage } from './components/SignUpPage';
import { LoginPage } from './components/LoginPage';
import { AdminDashboard } from './components/AdminDashboard';
import { UserDashboard } from './components/UserDashboard';
import { Toaster } from './components/ui/sonner';

export type UserData = {
  username: string;
  email: string;
  fullName?: string;
  phoneNumber?: string;
  address?: string;
  gender?: string;
  age?: string;
  profilePicture?: string;
  headerImage?: string;
  themeColor?: string;
  language?: string;
  hasSeenTutorial?: boolean;
};

export type AuthState = {
  isAuthenticated: boolean;
  userType: 'admin' | 'user' | null;
  userData: UserData | null;
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<'login' | 'signup' | 'admin' | 'user'>('login');
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    userType: null,
    userData: null,
  });

  const handleSignUp = (data: UserData) => {
    // Mark as new user who hasn't seen tutorial yet
    setAuthState({
      isAuthenticated: true,
      userType: 'user',
      userData: { ...data, hasSeenTutorial: false },
    });
    setCurrentPage('user');
  };

  const handleLogin = (userType: 'admin' | 'user', userData: UserData) => {
    // For login, mark tutorial as already seen (returning user)
    setAuthState({
      isAuthenticated: true,
      userType,
      userData: { ...userData, hasSeenTutorial: true },
    });
    setCurrentPage(userType);
  };

  const handleLogout = () => {
    setAuthState({
      isAuthenticated: false,
      userType: null,
      userData: null,
    });
    setCurrentPage('login');
  };

  const updateUserData = (newData: Partial<UserData>) => {
    setAuthState(prev => ({
      ...prev,
      userData: prev.userData ? { ...prev.userData, ...newData } : null,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-green-50 to-orange-50">
      {currentPage === 'signup' && (
        <SignUpPage 
          onSignUp={handleSignUp}
          onBackToLogin={() => setCurrentPage('login')}
        />
      )}
      
      {currentPage === 'login' && (
        <LoginPage 
          onLogin={handleLogin}
          onGoToSignUp={() => setCurrentPage('signup')}
        />
      )}
      
      {currentPage === 'admin' && authState.userData && (
        <AdminDashboard 
          onLogout={handleLogout}
          adminData={authState.userData}
        />
      )}
      
      {currentPage === 'user' && authState.userData && (
        <UserDashboard 
          onLogout={handleLogout}
          userData={authState.userData}
          updateUserData={updateUserData}
        />
      )}
      
      <Toaster />
    </div>
  );
}
