import { useState } from 'react';
import { SignUpPage } from './components/SignUpPage';
import { LoginPage } from './components/LoginPage';
import { AdminDashboard } from './components/AdminDashboard';
import { UserDashboard } from './components/UserDashboard';
// Catatan: AdminLoginPage kita nonaktifkan dulu karena kita fokus ke Pelanggan/User
// import { AdminLoginPage } from './components/AdminLoginPage'; 
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
  // 1. Memulai aplikasi langsung di mode 'guest' (Tamu)
  const [currentPage, setCurrentPage] = useState<'login' | 'signup' | 'admin' | 'user' | 'guest'>('guest');
  
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    userType: null,
    userData: null,
  });

  // 2. Data dummy untuk tamu
  const guestData: UserData = {
    username: 'Tamu',
    email: '',
    hasSeenTutorial: true, 
    themeColor: 'green',
    language: 'id',
  };

  const handleSignUp = (data: UserData) => {
    setAuthState({
      isAuthenticated: true,
      userType: 'user',
      userData: { ...data, hasSeenTutorial: false },
    });
    // Berhasil daftar -> Langsung masuk ke dashboard user
    setCurrentPage('user');
  };

  const handleLogin = (userType: 'admin' | 'user', userData: UserData) => {
    setAuthState({
      isAuthenticated: true,
      userType,
      userData: { ...userData, hasSeenTutorial: true },
    });
    // Berhasil login -> Langsung masuk ke dashboard user/admin
    setCurrentPage(userType);
  };

  const handleLogout = () => {
    setAuthState({
      isAuthenticated: false,
      userType: null,
      userData: null,
    });
    // Logout -> Kembali menjadi Tamu
    setCurrentPage('guest');
  };

  const updateUserData = (newData: Partial<UserData>) => {
    setAuthState(prev => ({
      ...prev,
      userData: prev.userData ? { ...prev.userData, ...newData } : null,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-green-50 to-orange-50">
      
      {/* --- HALAMAN 1: MODE TAMU --- */}
      {currentPage === 'guest' && (
        <UserDashboard 
          onLogout={handleLogout}
          userData={guestData}
          updateUserData={() => {}}
          isGuest={true}
          onNavigateToAuth={() => setCurrentPage('login')}
        />
      )}

      {/* --- HALAMAN 2: DAFTAR --- */}
      {currentPage === 'signup' && (
        <SignUpPage 
          onSignUp={handleSignUp}
          onBackToLogin={() => setCurrentPage('login')}
        />
      )}
      
      {/* --- HALAMAN 3: LOGIN PELANGGAN --- */}
      {currentPage === 'login' && (
        <LoginPage 
          onLogin={handleLogin}
          onGoToSignUp={() => setCurrentPage('signup')}
          onBackToGuest={() => setCurrentPage('guest')} // <-- Menghubungkan tombol kembali
        />
      )}
      
      {/* --- HALAMAN 4: DASHBOARD ADMIN --- */}
      {currentPage === 'admin' && authState.userData && (
        <AdminDashboard 
          onLogout={handleLogout}
          adminData={authState.userData}
        />
      )}
      
      {/* --- HALAMAN 5: DASHBOARD USER (PELANGGAN) --- */}
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