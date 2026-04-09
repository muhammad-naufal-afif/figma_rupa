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
  Home, 
  Search, 
  User, 
  ShoppingCart, 
  Heart, 
  FileText, 
  Upload, 
  Settings,
  Sparkles,
  Package
} from 'lucide-react';
import { getTranslation, type Language } from '../utils/translations';

type UserDashboardProps = {
  onLogout: () => void;
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  creator: string;
  image: string;
};

export function UserDashboard({ onLogout, userData, updateUserData }: UserDashboardProps) {
  const [activePage, setActivePage] = useState<string>('home');
  // Only show onboarding for new users who haven't seen the tutorial
  const [showOnboarding, setShowOnboarding] = useState(!userData.hasSeenTutorial);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Theme colors configuration
  const themeColors = useMemo(() => ({
    green: { primary: '#16a34a', light: '#22c55e', secondary: '#4ade80' },
    orange: { primary: '#ea580c', light: '#f97316', secondary: '#fb923c' },
    blue: { primary: '#2563eb', light: '#3b82f6', secondary: '#60a5fa' },
    purple: { primary: '#9333ea', light: '#a855f7', secondary: '#c084fc' },
    pink: { primary: '#db2777', light: '#ec4899', secondary: '#f472b6' },
  }), []);

  const currentTheme = themeColors[userData.themeColor as keyof typeof themeColors] || themeColors.green;

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateCartItemQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems(prev => prev.filter(item => item.id !== id));
    } else {
      setCartItems(prev => prev.map(item => 
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      }
      return [...prev, productId];
    });
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    // Mark tutorial as seen so it won't show again
    updateUserData({ hasSeenTutorial: true });
  };

  // Get translations based on user's language preference
  const t = getTranslation((userData.language as Language) || 'id');

  const navItems = [
    { id: 'home', label: t.home, icon: Home },
    { id: 'search', label: t.search, icon: Search },
    { id: 'profile', label: t.profile, icon: User },
    { id: 'orders', label: t.orders, icon: Package },
    { id: 'cart', label: t.cart, icon: ShoppingCart },
    { id: 'donation', label: t.donation, icon: Heart },
    { id: 'license', label: t.license, icon: FileText },
    { id: 'upload', label: t.upload, icon: Upload },
    { id: 'settings', label: t.settings, icon: Settings },
  ];

  return (
    <div className="min-h-screen">
      {showOnboarding ? (
        <OnboardingTutorial 
          username={userData.username} 
          onComplete={handleOnboardingComplete}
        />
      ) : (
        <>
          {/* Top Navigation Bar */}
          <div 
            className="text-white shadow-lg sticky top-0 z-50"
            style={{
              backgroundImage: `linear-gradient(to right, ${currentTheme.light}, ${currentTheme.secondary})`
            }}
          >
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
                        onClick={() => setActivePage(item.id)}
                        variant={activePage === item.id ? 'secondary' : 'ghost'}
                        size="sm"
                        className={`rounded-xl ${
                          activePage === item.id 
                            ? 'bg-white hover:bg-white/90' 
                            : 'text-white hover:bg-white/20'
                        }`}
                        style={activePage === item.id ? { color: currentTheme.primary } : {}}
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

              {/* Mobile Navigation */}
              <div className="flex md:hidden overflow-x-auto pb-2 gap-2">
                {navItems.map(item => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      onClick={() => setActivePage(item.id)}
                      variant={activePage === item.id ? 'secondary' : 'ghost'}
                      size="sm"
                      className={`rounded-xl flex-shrink-0 ${
                        activePage === item.id 
                          ? 'bg-white' 
                          : 'text-white hover:bg-white/20'
                      }`}
                      style={activePage === item.id ? { color: currentTheme.primary } : {}}
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

          {/* Page Content */}
          <div className="min-h-screen">
            {activePage === 'home' && <HomePage userData={userData} addToCart={addToCart} favorites={favorites} toggleFavorite={toggleFavorite} navigateToUpload={() => setActivePage('upload')} navigateToOrders={() => setActivePage('orders')} />}
            {activePage === 'search' && <SearchPage addToCart={addToCart} favorites={favorites} toggleFavorite={toggleFavorite} userData={userData} />}
            {activePage === 'profile' && <ProfilePage userData={userData} updateUserData={updateUserData} />}
            {activePage === 'orders' && <OrdersPage userData={userData} onNavigateToReturn={(orderId) => setActivePage('return')} />}
            {activePage === 'cart' && (
              <CartPage 
                cartItems={cartItems} 
                updateQuantity={updateCartItemQuantity}
                clearCart={clearCart}
                onNavigateToSearch={() => setActivePage('search')}
                userData={userData}
              />
            )}
            {activePage === 'donation' && <DonationPage userData={userData} />}
            {activePage === 'license' && <LicensePage userData={userData} />}
            {activePage === 'upload' && <UploadPage userData={userData} />}
            {activePage === 'settings' && (
              <SettingsPage 
                userData={userData} 
                updateUserData={updateUserData}
                onLogout={onLogout}
              />
            )}
            {activePage === 'return' && <ReturnPage userData={userData} />}
          </div>
        </>
      )}
    </div>
  );
}