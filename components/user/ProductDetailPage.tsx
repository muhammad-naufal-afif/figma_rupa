import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import type { UserData } from '../../App';
import type { CartItem } from '../UserDashboard';
import { 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  MoreVertical, 
  Flag, 
  ArrowLeft,
  ShoppingCart,
  ShieldAlert,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { getTranslation, type Language } from '../../utils/translations';

type ProductDetailPageProps = {
  product: any;
  onBack: () => void;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  userData: UserData;
  isGuest?: boolean;
};

export function ProductDetailPage({ product, onBack, addToCart, userData, isGuest }: ProductDetailPageProps) {
  const t = getTranslation((userData.language as Language) || 'id');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  
  // State untuk form laporan
  const [reportCategory, setReportCategory] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tema warna dari userData
  const themeColors: Record<string, { primary: string; light: string; secondary: string }> = {
    green: { primary: '#16a34a', light: '#22c55e', secondary: '#4ade80' },
    orange: { primary: '#ea580c', light: '#f97316', secondary: '#fb923c' },
    blue: { primary: '#2563eb', light: '#3b82f6', secondary: '#60a5fa' },
    purple: { primary: '#9333ea', light: '#a855f7', secondary: '#c084fc' },
    pink: { primary: '#db2777', light: '#ec4899', secondary: '#f472b6' },
  };
  const currentTheme = themeColors[userData.themeColor || 'green'] || themeColors.green;

  // Slider Maksimal 10 Foto
  const productImages = [
    product.image,
    'https://images.unsplash.com/photo-1750472598714-eb232f8de4bd?q=80&w=1080',
    'https://images.unsplash.com/photo-1661458178984-c614e6f2c5fd?q=80&w=1080',
    'https://images.unsplash.com/photo-1570823179175-556823eb806b?q=80&w=1080',
    'https://images.unsplash.com/photo-1652607779025-55e89f9fcfe0?q=80&w=1080',
    product.image, product.image, product.image, product.image, product.image
  ].slice(0, 10);

  const nextImage = () => setCurrentImageIndex((prev) => (prev === productImages.length - 1 ? 0 : prev + 1));
  const prevImage = () => setCurrentImageIndex((prev) => (prev === 0 ? productImages.length - 1 : prev - 1));

  const handleSendReport = () => {
    if (!reportCategory || !reportDescription) {
      toast.error('Harap lengkapi kategori dan deskripsi laporan');
      return;
    }

    setIsSubmitting(true);
    
    // Logika pengiriman (Simulasi)
    console.log(`Melaporkan Produk ID: ${product.id}`);
    console.log(`Kategori: ${reportCategory}, Detail: ${reportDescription}`);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsReportModalOpen(false);
      setReportCategory('');
      setReportDescription('');
      toast.success('Laporan berhasil dikirim. Terima kasih atas masukan Anda.', {
        icon: <ShieldAlert className="w-5 h-5 text-red-500" />
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-green-50 to-orange-50 pb-12">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={onBack} className="mb-6 hover:bg-white/50 rounded-xl">
          <ArrowLeft className="w-5 h-5 mr-2" />
          {t.back || 'Kembali'}
        </Button>

        <Card className="rounded-3xl shadow-xl border-0 overflow-hidden bg-white">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              
              {/* Bagian Kiri: Slider Foto */}
              <div className="relative bg-gray-100 group aspect-square">
                <ImageWithFallback
                  src={productImages[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-500"
                />
                
                {productImages.length > 1 && (
                  <>
                    <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronLeft className="w-6 h-6 text-gray-800" />
                    </button>
                    <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="w-6 h-6 text-gray-800" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 px-3 py-1.5 bg-black/20 backdrop-blur-sm rounded-full">
                      {productImages.map((_, idx) => (
                        <div key={idx} className={`h-1.5 rounded-full transition-all ${currentImageIndex === idx ? 'bg-white w-4' : 'bg-white/50 w-1.5'}`} />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Bagian Kanan: Detail & Menu */}
              <div className="p-8 md:p-12 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <Badge className="bg-green-100 text-green-800 border-0 mb-3 px-3 py-1 rounded-full">
                      {product.category}
                    </Badge>
                    <h1 className="text-3xl font-bold text-gray-800 leading-tight mb-2">{product.name}</h1>
                    <p className="text-gray-500 text-lg">oleh <span className="font-semibold text-gray-800">{product.creator}</span></p>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100">
                        <MoreVertical className="w-6 h-6 text-gray-600" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl shadow-lg border-gray-100 p-1">
                      <DropdownMenuItem 
                        onClick={() => setIsReportModalOpen(true)}
                        className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer gap-2 py-2 rounded-lg"
                      >
                        <Flag className="w-4 h-4" />
                        Laporkan Produk
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Rating dan Penjualan */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1.5" />
                    <span className="font-bold text-yellow-700">{product.rating || '4.8'}</span>
                  </div>
                  <span className="text-gray-300">•</span>
                  <div className="flex items-center">
                    <span className="text-gray-800 font-semibold mr-1">{product.sold || '150'}</span>
                    <span className="text-gray-500">Terjual</span>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-gray-800 font-semibold mb-2">Deskripsi Produk</h3>
                  <p className="text-gray-600 leading-relaxed line-clamp-6">
                    {product.description || 'Karya seni unik yang dibuat dengan tangan menggunakan teknik tradisional yang dikombinasikan dengan desain modern.'}
                  </p>
                </div>

                <div className="mt-auto pt-6 border-t">
                  <div className="flex items-end justify-between mb-6">
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Harga</p>
                      <span className="text-4xl font-bold text-green-700">Rp {product.price.toLocaleString('id-ID')}</span>
                    </div>
                  </div>

                  <Button 
                    onClick={() => {
                      addToCart({ id: product.id, name: product.name, price: product.price, creator: product.creator, image: product.image });
                      toast.success(`${product.name} ${t.addedToCart}`);
                    }}
                    className="w-full rounded-2xl h-14 text-lg text-white shadow-lg"
                    style={{ backgroundImage: `linear-gradient(to right, ${currentTheme.light}, ${currentTheme.secondary})` }}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {t.addToCart || 'Tambah ke Keranjang'}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* MODAL PELAPORAN */}
      <Dialog open={isReportModalOpen} onOpenChange={setIsReportModalOpen}>
        <DialogContent className="sm:max-w-[450px] rounded-3xl p-6 overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold text-gray-800">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Laporkan Produk
            </DialogTitle>
            <DialogDescription className="text-gray-500 pt-1">
              Bantu kami menjaga kualitas komunitas RUPA.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 ml-1">
                Kategori Pelanggaran
              </Label>
              <Select value={reportCategory} onValueChange={setReportCategory}>
                <SelectTrigger className="w-full h-12 rounded-xl border-gray-200 focus:ring-2 focus:ring-green-500/20 bg-gray-50/50">
                  <SelectValue placeholder="Pilih alasan laporan" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                  <SelectItem value="fraud">Penipuan / Barang Palsu</SelectItem>
                  <SelectItem value="inappropriate">Konten Tidak Pantas</SelectItem>
                  <SelectItem value="copyright">Pelanggaran Hak Cipta</SelectItem>
                  <SelectItem value="harassment">Pelecehan / Ujaran Kebencian</SelectItem>
                  <SelectItem value="other">Lainnya</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 ml-1">
                Detail Laporan
              </Label>
              <Textarea
                placeholder="Jelaskan alasan Anda melaporkan produk ini secara detail..."
                className="min-h-[120px] rounded-xl border-gray-200 focus:ring-2 focus:ring-green-500/20 bg-gray-50/50 resize-none p-4"
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
              />
              <div className="flex justify-between px-1">
                <span className="text-[10px] text-gray-400 uppercase font-medium tracking-wider">
                  Produk ID: {product.id}
                </span>
                <span className="text-[10px] text-gray-400 font-medium">
                  {reportDescription.length} karakter
                </span>
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-row gap-3 mt-2">
            <Button 
              variant="outline" 
              onClick={() => setIsReportModalOpen(false)}
              className="flex-1 rounded-xl h-11 border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              Batal
            </Button>
            <Button 
              onClick={handleSendReport}
              disabled={isSubmitting}
              className="flex-1 rounded-xl h-11 bg-gradient-to-r from-red-500 to-orange-500 text-white hover:opacity-90 border-0"
            >
              {isSubmitting ? 'Mengirim...' : 'Kirim Laporan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}