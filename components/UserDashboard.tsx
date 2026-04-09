import { useState, useEffect, useMemo } from 'react';
import type { UserData } from '../App';
import { HomePage } from './user/HomePage';
import { SearchPage } from './user/SearchPage';
import { ProfilePage } from './user/ProfilePage';
import { CartPage } from './user/CartPage';
import { DonationPage } from './user/DonationPage';
import { LicensePage } from './user/LicensePage';
import { UploadPage } from './user/UploadPage';
import { SettingsPage } from './user/SettingsPage';
import { OrdersPage } from './user/OrdersPage';
import { ReturnPage } from './user/ReturnPage';
import { OnboardingTutorial } from './user/OnboardingTutorial';
import { Button } from './ui/button';
import { 
  Home, Search, User, ShoppingCart, Heart, FileText, Upload, Settings, Sparkles, Package
} from 'lucide-react';
import { getTranslation, type Language } from '../utils/translations';
import { toast } from 'sonner@2.0.3'; // <-- Tambahkan import toast

// Tambahkan prop isGuest dan onNavigateToAuth
type UserDashboardProps = {
  onLogout: () => void;
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  isGuest?: boolean;
  onNavigateToAuth?: () => void;
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  creator: string;
  image: string;
};

export function UserDashboard({ onLogout, userData, updateUserData, isGuest, onNavigateToAuth }: UserDashboardProps) {
  const [activePage, setActivePage] = useState<string>('home');
  // Matikan onboarding jika masuk sebagai tamu
  const [showOnboarding, setShowOnboarding] = useState(!userData.hasSeenTutorial && !isGuest);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  const themeColors = useMemo(() => ({
    green: { primary: '#16a34a', light: '#22c55e', secondary: '#4ade80' },
    orange: { primary: '#ea580c', light: '#f97316', secondary: '#fb923c' },
    blue: { primary: '#2563eb', light: '#3b82f6', secondary: '#60a5fa' },
    purple: { primary: '#9333ea', light: '#a855f7', secondary: '#c084fc' },
    pink: { primary: '#db2777', light: '#ec4899', secondary: '#f472b6' },
  }), []);

  const currentTheme = themeColors[userData.themeColor as keyof typeof themeColors] || themeColors.green;

  // Cegah interaksi tamu pada fitur yang butuh akun
  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    if (isGuest && onNavigateToAuth) {
      toast('Silakan masuk/daftar untuk berbelanja', { icon: '🔒' });
      onNavigateToAuth();
      return;
    }
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateCartItemQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems(prev => prev.filter(item => item.id !== id));
    } else {
      setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
    }
  };

  const clearCart = () => setCartItems([]);

  const toggleFavorite = (productId: string) => {
    if (isGuest && onNavigateToAuth) {
      toast('Silakan masuk/daftar untuk memfavoritkan karya', { icon: '🔒' });
      onNavigateToAuth();
      return;
    }
    setFavorites(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    updateUserData({ hasSeenTutorial: true });
  };

  const t = getTranslation((userData.language as Language) || 'id');

  const allNavItems = [
    { id: 'home', label: t.home, icon: Home },
    { id: 'search', label: t.search, icon: Search },
    { id: 'profile', label: isGuest ? 'Masuk / Daftar' : t.profile, icon: User }, // Label diubah untuk tamu
    { id: 'orders', label: t.orders, icon: Package },
    { id: 'cart', label: t.cart, icon: ShoppingCart },
    { id: 'donation', label: t.donation, icon: Heart },
    { id: 'license', label: t.license, icon: FileText },
    { id: 'upload', label: t.upload, icon: Upload },
    { id: 'settings', label: t.settings, icon: Settings },
  ];

  // Filter: Jika guest (tamu), HANYA tampilkan home, search, dan profile
  const navItems = isGuest 
    ? allNavItems.filter(item => ['home', 'search', 'profile'].includes(item.id))
    : allNavItems;

  const handleMenuClick = (id: string) => {
    if (isGuest && id === 'profile' && onNavigateToAuth) {
      onNavigateToAuth(); // Arahkan ke halaman login jika menu profil ditekan
    } else {
      setActivePage(id);
    }
  };

  return (
    <div className="min-h-screen">
      {showOnboarding ? (
        <OnboardingTutorial username={userData.username} onComplete={handleOnboardingComplete} />
      ) : (
        <>
          <div className="text-white shadow-lg sticky top-0 z-50" style={{ backgroundImage: `linear-gradient(to right, ${currentTheme.light}, ${currentTheme.secondary})` }}>
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h1 className="text-xl">RUPA</h1>
                    <p className="text-xs text-white/80">Karya Anak Bangsa</p>
                  </div>
                </div>

                <div className="hidden md:flex items-center gap-2 overflow-x-auto">
                  {navItems.map(item => {
                    const Icon = item.icon;
                    return (
                      <Button
                        key={item.id}
                        onClick={() => handleMenuClick(item.id)}
                        variant={activePage === item.id && !isGuest ? 'secondary' : 'ghost'}
                        size="sm"
                        className={`rounded-xl ${activePage === item.id && (!isGuest || item.id !== 'profile') ? 'bg-white hover:bg-white/90' : 'text-white hover:bg-white/20'}`}
                        style={activePage === item.id && (!isGuest || item.id !== 'profile') ? { color: currentTheme.primary } : {}}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {item.label}
                        {item.id === 'cart' && cartItems.length > 0 && (
                          <span className="ml-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                            {cartItems.length}
                          </span>
                        )}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div className="flex md:hidden overflow-x-auto pb-2 gap-2">
                {navItems.map(item => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      onClick={() => handleMenuClick(item.id)}
                      variant={activePage === item.id && !isGuest ? 'secondary' : 'ghost'}
                      size="sm"
                      className={`rounded-xl flex-shrink-0 ${activePage === item.id && (!isGuest || item.id !== 'profile') ? 'bg-white' : 'text-white hover:bg-white/20'}`}
                      style={activePage === item.id && (!isGuest || item.id !== 'profile') ? { color: currentTheme.primary } : {}}
                    >
                      <Icon className="w-4 h-4 mr-1" />
                      {item.label}
                      {item.id === 'cart' && cartItems.length > 0 && (
                        <span className="ml-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                          {cartItems.length}
                        </span>
                      )}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="min-h-screen">
            {activePage === 'home' && (
              <HomePage 
                userData={userData} 
                addToCart={addToCart} 
                favorites={favorites} 
                toggleFavorite={toggleFavorite} 
                navigateToUpload={() => {
                  if (isGuest && onNavigateToAuth) onNavigateToAuth();
                  else setActivePage('upload');
                }} 
                navigateToOrders={() => {
                  if (isGuest && onNavigateToAuth) onNavigateToAuth();
                  else setActivePage('orders');
                }} 
                isGuest={isGuest} // <-- Tambahkan baris ini
              />
            )}
            {activePage === 'search' && <SearchPage addToCart={addToCart} favorites={favorites} toggleFavorite={toggleFavorite} userData={userData} />}
            {activePage === 'profile' && !isGuest && <ProfilePage userData={userData} updateUserData={updateUserData} />}
            {activePage === 'orders' && <OrdersPage userData={userData} onNavigateToReturn={() => setActivePage('return')} />}
            {activePage === 'cart' && <CartPage cartItems={cartItems} updateQuantity={updateCartItemQuantity} clearCart={clearCart} onNavigateToSearch={() => setActivePage('search')} userData={userData} />}
            {activePage === 'donation' && <DonationPage userData={userData} />}
            {activePage === 'license' && <LicensePage userData={userData} />}
            {activePage === 'upload' && <UploadPage userData={userData} />}
            {activePage === 'settings' && <SettingsPage userData={userData} updateUserData={updateUserData} onLogout={onLogout} />}
            {activePage === 'return' && <ReturnPage userData={userData} />}
          </div>
        </>
      )}
    </div>
  );
}