import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import type { UserData } from '../../App';
import type { CartItem } from '../UserDashboard';
import { Star, TrendingUp, MapPin, Package, Award, ShoppingBag, Plus } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { getTranslation, type Language } from '../../utils/translations';
import type { Product } from './ProductDetailPage'; // Import tipe data

type HomePageProps = {
  userData: UserData;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  onProductClick: (product: Product) => void; // <-- Tambahan baru untuk klik produk
  navigateToUpload: () => void;
  navigateToOrders: () => void;
  isGuest?: boolean;
};

export function HomePage({ userData, addToCart, onProductClick, navigateToUpload, navigateToOrders, isGuest }: HomePageProps) {
  const t = getTranslation((userData.language as Language) || 'id');
  
  const themeColors: Record<string, { primary: string; light: string; secondary: string }> = {
    green: { primary: '#16a34a', light: '#22c55e', secondary: '#4ade80' },
    orange: { primary: '#ea580c', light: '#f97316', secondary: '#fb923c' },
    blue: { primary: '#2563eb', light: '#3b82f6', secondary: '#60a5fa' },
    purple: { primary: '#9333ea', light: '#a855f7', secondary: '#c084fc' },
    pink: { primary: '#db2777', light: '#ec4899', secondary: '#f472b6' },
  };
  
  const currentTheme = themeColors[userData.themeColor || 'green'] || themeColors.green;
  
  const featuredWorks: Product[] = [
    {
      id: '1',
      name: 'Tas Ramah Lingkungan dari Sampah Plastik',
      creator: 'Budi Santoso',
      price: 125000,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1750472598714-eb232f8de4bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbmRvbmVzaWFuJTIwY3JhZnRzJTIwcmVjeWNsZWQlMjBwcm9kdWN0c3xlbnwxfHx8fDE3NjE3MTMwMTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Daur Ulang',
      description: 'Tas belanja yang sangat kuat dan modis ini dianyam secara manual menggunakan limbah plastik daur ulang yang sudah disterilkan. Selain menampung banyak barang, membeli tas ini berarti Anda berkontribusi mengurangi sampah plastik di lautan Indonesia.',
    },
    {
      id: '2',
      name: 'Lampu Tenaga Surya Portable',
      creator: 'Siti Rahayu',
      price: 250000,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1661458178984-c614e6f2c5fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMGlubm92YXRpb24lMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc2MTcxMzAyMHww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Energi',
      description: 'Lampu lipat serbaguna yang dilengkapi panel surya mini. Sangat cocok untuk anak sekolah di daerah terpencil atau digunakan saat berkemah. Dapat menyala hingga 12 jam dengan sekali pengisian daya matahari secara penuh.',
    },
    {
      id: '3',
      name: 'Kerajinan Anyaman Tradisional Modern',
      creator: 'Ahmad Fauzi',
      price: 180000,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1570823179175-556823eb806b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMGNyYWZ0JTIwYXJ0d29ya3xlbnwxfHx8fDE3NjE3MTMwMjB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Kerajinan',
      description: 'Sebuah mahakarya yang memadukan teknik anyaman rotan tradisional dengan bentuk geometris modern minimalis. Sangat cantik digunakan sebagai vas kering, tempat penyimpanan, atau sekadar dekorasi sudut ruangan.',
    },
    {
      id: '4',
      name: 'Produk Organik Ramah Kulit',
      creator: 'Dewi Lestari',
      price: 95000,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1652607779025-55e89f9fcfe0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY28lMjBmcmllbmRseSUyMGhhbmRtYWRlJTIwc3VzdGFpbmFibGV8ZW58MXx8fHwxNzYxNzEzMDIwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Organik',
      description: 'Sabun dan lulur organik yang terbuat 100% dari bahan-bahan alami Nusantara, tanpa campuran kimia berbahaya. Menggunakan ekstrak bengkoang, kunyit, dan minyak kelapa murni yang aman untuk kulit paling sensitif sekalipun.',
    },
  ];

  const handleAddToCart = (work: Product, e: React.MouseEvent) => {
    e.stopPropagation(); // Mencegah klik masuk ke halaman detail
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
        
        {/* Welcome Banner - Poin Sudah Dihapus */}
        <Card 
          className="rounded-2xl shadow-lg border-0 text-white"
          style={{ backgroundImage: `linear-gradient(to right, ${currentTheme.light}, ${currentTheme.secondary})` }}
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
            </div>
          </CardContent>
        </Card>

        {/* Featured Creations */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl text-gray-800 mb-1">{t.featuredWorks}</h2>
              <p className="text-gray-600">{t.exploreCreations}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredWorks.map((work) => (
              <Card 
                key={work.id} 
                className="rounded-2xl shadow-lg border-0 overflow-hidden hover:shadow-2xl transition-all group cursor-pointer"
                onClick={() => onProductClick(work)} // <-- Klik mengarah ke fungsi detail
              >
                <div className="relative h-48 overflow-hidden">
                  <ImageWithFallback
                    src={work.image}
                    alt={work.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <Badge className="absolute top-3 right-3 bg-green-500/90 backdrop-blur text-white border-0">
                    {work.category}
                  </Badge>
                </div>
                <CardContent className="p-4 bg-white">
                  <h3 className="text-gray-800 mb-1 line-clamp-2 font-medium group-hover:text-green-600 transition-colors">{work.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">oleh {work.creator}</p>
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-700">{work.rating}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg" style={{ color: currentTheme.primary }}>
                      Rp {work.price.toLocaleString('id-ID')}
                    </span>
                    <Button
                      size="sm"
                      onClick={(e) => handleAddToCart(work, e)}
                      className="rounded-lg text-white"
                      style={{ backgroundImage: `linear-gradient(to right, ${currentTheme.light}, ${currentTheme.secondary})` }}
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
                style={{ backgroundImage: `linear-gradient(to bottom right, ${currentTheme.light}, ${currentTheme.primary})` }}
              >
                <Plus className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl text-gray-800 mb-2">{t.motto}</h3>
              <p className="text-gray-600 mb-6">{t.uploadDesc}</p>
              <Button 
                onClick={navigateToUpload}
                className="rounded-xl text-white"
                style={{ backgroundImage: `linear-gradient(to right, ${currentTheme.light}, ${currentTheme.secondary})` }}
              >
                <Plus className="w-4 h-4 mr-2" />
                {t.uploadWork}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Info Grid - Reward Points dan Pesanan disembunyikan untuk tamu */}
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

          {!isGuest && (
            <>
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

              {/* Tempat poin lama yang mungkin ingin kamu hapus, saya biarkan untuk user saja, tapi jika ingin hapus semuanya, silakan hapus Card ini */}
            </>
          )}
        </div>
      </div>
    </div>
  );
}