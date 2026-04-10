import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import type { UserData } from '../../App';
import type { CartItem } from '../UserDashboard';
import { ArrowLeft, Star, ShoppingCart, ShieldCheck, Truck, Package } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { getTranslation, type Language } from '../../utils/translations';

// Tipe data produk yang diterima dari HomePage
export type Product = {
  id: string;
  name: string;
  creator: string;
  price: number;
  rating: number;
  image: string;
  category: string;
  description?: string;
};

type ProductDetailPageProps = {
  product: Product;
  userData: UserData;
  onBack: () => void;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  isGuest?: boolean;
  onNavigateToAuth?: () => void;
};

export function ProductDetailPage({ product, userData, onBack, addToCart, isGuest, onNavigateToAuth }: ProductDetailPageProps) {
  const t = getTranslation((userData.language as Language) || 'id');
  
  const themeColors: Record<string, { primary: string; light: string; secondary: string }> = {
    green: { primary: '#16a34a', light: '#22c55e', secondary: '#4ade80' },
    orange: { primary: '#ea580c', light: '#f97316', secondary: '#fb923c' },
    blue: { primary: '#2563eb', light: '#3b82f6', secondary: '#60a5fa' },
    purple: { primary: '#9333ea', light: '#a855f7', secondary: '#c084fc' },
    pink: { primary: '#db2777', light: '#ec4899', secondary: '#f472b6' },
  };
  
  const currentTheme = themeColors[userData.themeColor || 'green'] || themeColors.green;

  const handleAddToCart = () => {
    if (isGuest && onNavigateToAuth) {
      toast('Silakan masuk/daftar untuk berbelanja', { icon: '🔒' });
      onNavigateToAuth();
      return;
    }
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      creator: product.creator,
      image: product.image,
    });
    toast.success(`${product.name} ditambahkan ke keranjang! 🛒`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-green-50 to-orange-50 pb-12">
      <div className="container mx-auto px-4 py-6">
        
        {/* Tombol Kembali */}
        <button 
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Kembali
        </button>

        <Card className="rounded-3xl shadow-xl border-0 overflow-hidden bg-white/80 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            
            {/* Bagian Gambar Kiri */}
            <div className="relative h-72 md:h-full min-h-[400px] bg-gray-100">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover absolute inset-0"
              />
              <Badge className="absolute top-4 left-4 bg-white/90 text-gray-800 border-0 shadow-sm backdrop-blur">
                {product.category}
              </Badge>
            </div>

            {/* Bagian Info Kanan */}
            <CardContent className="p-8 md:p-12 flex flex-col justify-center">
              <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium text-gray-700">{product.rating}</span>
                <span>•</span>
                <span>Terjual 150+</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 leading-tight">
                {product.name}
              </h1>
              <p className="text-gray-500 mb-6 text-lg">Karya oleh <span className="font-semibold text-gray-700">{product.creator}</span></p>
              
              <div className="text-3xl font-bold mb-8" style={{ color: currentTheme.primary }}>
                Rp {product.price.toLocaleString('id-ID')}
              </div>

              <div className="space-y-4 mb-8">
                <h3 className="font-semibold text-gray-800 text-lg">Deskripsi Karya</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description || "Sebuah karya inovatif anak bangsa yang dibuat dengan penuh ketelitian dan nilai estetika tinggi. Didesain untuk memberikan manfaat maksimal dengan tetap mempertahankan unsur budaya lokal."}
                </p>
              </div>

              {/* Info Tambahan */}
              <div className="grid grid-cols-2 gap-4 mb-8 p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                  <span>Kualitas Terjamin</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Package className="w-5 h-5 text-orange-500" />
                  <span>Stok Tersedia</span>
                </div>
              </div>

              <Button 
                onClick={handleAddToCart}
                size="lg"
                className="w-full rounded-2xl text-white text-lg py-6 shadow-lg hover:shadow-xl transition-all"
                style={{
                  backgroundImage: `linear-gradient(to right, ${currentTheme.light}, ${currentTheme.secondary})`
                }}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Tambah ke Keranjang
              </Button>
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
}