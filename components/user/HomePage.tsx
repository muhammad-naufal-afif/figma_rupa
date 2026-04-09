import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import type { UserData } from '../../App';
import type { CartItem } from '../UserDashboard';
import { 
  Star, 
  TrendingUp, 
  MapPin, 
  Package, 
  Award, 
  ShoppingBag,
  Plus,
  Heart
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { getTranslation, type Language } from '../../utils/translations';

type HomePageProps = {
  userData: UserData;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  navigateToUpload: () => void;
  navigateToOrders: () => void;
};

export function HomePage({ userData, addToCart, favorites, toggleFavorite, navigateToUpload, navigateToOrders }: HomePageProps) {
  const t = getTranslation((userData.language as Language) || 'id');
  
  const themeColors: Record<string, { primary: string; light: string; secondary: string }> = {
    green: { primary: '#16a34a', light: '#22c55e', secondary: '#4ade80' },
    orange: { primary: '#ea580c', light: '#f97316', secondary: '#fb923c' },
    blue: { primary: '#2563eb', light: '#3b82f6', secondary: '#60a5fa' },
    purple: { primary: '#9333ea', light: '#a855f7', secondary: '#c084fc' },
    pink: { primary: '#db2777', light: '#ec4899', secondary: '#f472b6' },
  };
  
  const currentTheme = themeColors[userData.themeColor || 'green'] || themeColors.green;
  const featuredWorks = [
    {
      id: '1',
      name: 'Tas Ramah Lingkungan dari Sampah Plastik',
      creator: 'Budi Santoso',
      price: 125000,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1750472598714-eb232f8de4bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRvbmVzaWFuJTIwY3JhZnRzJTIwcmVjeWNsZWQlMjBwcm9kdWN0c3xlbnwxfHx8fDE3NjE3MTMwMTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Daur Ulang',
    },
    {
      id: '2',
      name: 'Lampu Tenaga Surya Portable',
      creator: 'Siti Rahayu',
      price: 250000,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1661458178984-c614e6f2c5fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMGlubm92YXRpb24lMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc2MTcxMzAyMHww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Energi',
    },
    {
      id: '3',
      name: 'Kerajinan Anyaman Tradisional Modern',
      creator: 'Ahmad Fauzi',
      price: 180000,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1570823179175-556823eb806b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMGNyYWZ0JTIwYXJ0d29ya3xlbnwxfHx8fDE3NjE3MTMwMjB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Kerajinan',
    },
    {
      id: '4',
      name: 'Produk Organik Ramah Kulit',
      creator: 'Dewi Lestari',
      price: 95000,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1652607779025-55e89f9fcfe0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY28lMjBmcmllbmRseSUyMGhhbmRtYWRlJTIwc3VzdGFpbmFibGV8ZW58MXx8fHwxNzYxNzEzMDIwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Organik',
    },
  ];

  const handleAddToCart = (work: typeof featuredWorks[0]) => {
    addToCart({
      id: work.id,
      name: work.name,
      price: work.price,
      creator: work.creator,
      image: work.image,
    });
    toast.success(`${work.name} ${t.addedToCart}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-green-50 to-orange-50">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Banner */}
        <Card 
          className="rounded-2xl shadow-lg border-0 text-white"
          style={{
            backgroundImage: `linear-gradient(to right, ${currentTheme.light}, ${currentTheme.secondary})`
          }}
        >
          <CardContent className="p-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-3xl mb-2">{t.welcomeBack}, {userData.username}! 👋</h2>
                <p className="text-white/90 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Jakarta, Indonesia
                </p>
              </div>
              <div className="flex gap-3">
                <div className="text-center bg-white/20 backdrop-blur rounded-xl px-4 py-2">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    <span>Points</span>
                  </div>
                  <p className="text-2xl mt-1">850</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Featured Creations of the Week */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl text-gray-800 mb-1">{t.featuredWorks}</h2>
              <p className="text-gray-600">{t.exploreCreations}</p>
            </div>
            <Button 
              className="rounded-xl text-white"
              style={{
                backgroundImage: `linear-gradient(to right, ${currentTheme.light}, ${currentTheme.secondary})`
              }}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              {t.exploreWorks}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredWorks.map((work) => (
              <Card key={work.id} className="rounded-2xl shadow-lg border-0 overflow-hidden hover:shadow-2xl transition-shadow group">
                <div className="relative h-48 overflow-hidden">
                  <ImageWithFallback
                    src={work.image}
                    alt={work.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <Badge className="absolute top-3 right-3 bg-green-500 text-white border-0">
                    {work.category}
                  </Badge>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(work.id);
                      toast.success(
                        favorites.includes(work.id) 
                          ? `${work.name} dihapus dari favorit` 
                          : `${work.name} ditambahkan ke favorit! ❤️`
                      );
                    }}
                    className="absolute top-3 left-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <Heart 
                      className={`w-4 h-4 ${favorites.includes(work.id) ? 'fill-red-500 text-red-500' : 'text-red-500'}`} 
                    />
                  </button>
                </div>
                <CardContent className="p-4">
                  <h3 className="text-gray-800 mb-1 line-clamp-2">{work.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">oleh {work.creator}</p>
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-700">{work.rating}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-green-700">Rp {work.price.toLocaleString('id-ID')}</span>
                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(work)}
                      className="rounded-lg text-white"
                      style={{
                        backgroundImage: `linear-gradient(to right, ${currentTheme.light}, ${currentTheme.secondary})`
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Upload Your Work */}
        <Card className="rounded-2xl shadow-lg border-0 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-8 text-center">
            <div className="max-w-2xl mx-auto">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{
                  backgroundImage: `linear-gradient(to bottom right, ${currentTheme.light}, ${currentTheme.primary})`
                }}
              >
                <Plus className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl text-gray-800 mb-2">{t.motto}</h3>
              <p className="text-gray-600 mb-6">
                {t.uploadDesc}
              </p>
              <Button 
                onClick={navigateToUpload}
                className="rounded-xl text-white"
                style={{
                  backgroundImage: `linear-gradient(to right, ${currentTheme.light}, ${currentTheme.secondary})`
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                {t.uploadWork}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="rounded-2xl shadow-lg border-0 hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-green-800">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Cara Pembelian
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Pilih karya → Tambah ke keranjang → Checkout → Bayar → Selesai!
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-lg border-0 hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-800">
                <Package className="w-5 h-5 mr-2" />
                Pesanan Anda
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Anda memiliki <strong>4 pesanan</strong> aktif
              </p>
              <Button 
                onClick={navigateToOrders}
                variant="link" 
                className="p-0 h-auto text-blue-600 mt-2"
              >
                Lihat Pesanan →
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-lg border-0 hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-purple-800">
                <Award className="w-5 h-5 mr-2" />
                Reward Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Kumpulkan poin dari setiap pembelian untuk mendapat diskon!
              </p>
              <p className="text-purple-700 mt-2">Total: 850 poin</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
