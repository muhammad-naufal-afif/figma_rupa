import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Input } from '../ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { 
  Package, 
  Truck, 
  MapPin, 
  Calendar, 
  CreditCard, 
  CheckCircle,
  Clock,
  ExternalLink,
  Star,
  MessageSquare,
  RotateCcw,
  AlertCircle,
  XCircle,
  FileVideo,
  Image as ImageIcon,
  Eye,
  History,
  User,
  Mail,
  Palette,
  Upload,
  X,
  Check,
  ArrowLeft,
  CheckCircle2,
  Download,
  Printer,
  Copy,
  Share2,
  HelpCircle,
  FileText,
  Info,
  ShieldCheck
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { SuccessConfetti } from '../ui/success-confetti';
import type { UserData } from '../../App';
import { getTranslation, type Language } from '../../utils/translations';

type OrderStatus = 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered';

type OrderItem = {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  status: OrderStatus;
};

type Order = {
  orderId: string;
  orderDate: string;
  estimatedDelivery: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentMethod: string;
  trackingNumber: string;
  courierService: string;
  shippingAddress: string;
};

type OrdersPageProps = {
  userData: UserData;
  onNavigateToReturn?: (orderId: string) => void;
};

type ReturnStatus = 'Pending' | 'In Review' | 'Approved' | 'Processing' | 'Completed' | 'Rejected';

type ReturnRecord = {
  returnId: string;
  orderId: string;
  productName: string;
  productImage: string;
  returnReason: string;
  returnType: 'refund' | 'replacement';
  returnStatus: ReturnStatus;
  requestedDate: string;
  completedDate?: string;
  refundAmount?: number;
  videoEvidence: string;
  photoEvidence: string[];
  rejectionReason?: string;
  adminNotes?: string;
  customerName: string;
  customerEmail: string;
  creatorName: string;
};

type UploadedFile = {
  id: string;
  file: File;
  preview: string;
  progress: number;
};

// Mock return history data
const mockReturnHistory: ReturnRecord[] = [
  {
    returnId: 'RET-1703123456-ABC123XYZ',
    orderId: 'ORD-2025-001234',
    productName: 'Eco-Friendly Water Filter',
    productImage: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400',
    returnReason: 'Produk Rusak/Cacat',
    returnType: 'refund',
    returnStatus: 'Completed',
    requestedDate: '2025-11-05',
    completedDate: '2025-11-12',
    refundAmount: 315000,
    videoEvidence: 'unboxing-video-001.mp4',
    photoEvidence: ['photo1.jpg', 'photo2.jpg', 'photo3.jpg'],
    adminNotes: 'Produk dikonfirmasi rusak. Refund telah diproses.',
    customerName: 'Ahmad Fauzi',
    customerEmail: 'ahmad.fauzi@email.com',
    creatorName: 'Siti Nurhaliza',
  },
  {
    returnId: 'RET-1703234567-DEF456UVW',
    orderId: 'ORD-2025-001236',
    productName: 'Biodegradable Shopping Bags',
    productImage: 'https://images.unsplash.com/photo-1591696205602-2f950c417cb9?w=400',
    returnReason: 'Tidak Sesuai Deskripsi',
    returnType: 'replacement',
    returnStatus: 'Processing',
    requestedDate: '2025-11-15',
    videoEvidence: 'unboxing-video-002.mp4',
    photoEvidence: ['photo4.jpg', 'photo5.jpg'],
    adminNotes: 'Sedang menunggu konfirmasi dari kreator untuk pengiriman pengganti.',
    customerName: 'Ahmad Fauzi',
    customerEmail: 'ahmad.fauzi@email.com',
    creatorName: 'Budi Santoso',
  },
  {
    returnId: 'RET-1703345678-GHI789RST',
    orderId: 'ORD-2025-001238',
    productName: 'Recycled Bamboo Utensils',
    productImage: 'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=400',
    returnReason: 'Produk Salah Kirim',
    returnType: 'refund',
    returnStatus: 'Rejected',
    requestedDate: '2025-11-18',
    videoEvidence: 'unboxing-video-003.mp4',
    photoEvidence: ['photo6.jpg'],
    rejectionReason: 'Video bukti tidak menunjukkan proses unboxing yang lengkap dari awal.',
    adminNotes: 'Mohon upload ulang video bukti yang menunjukkan proses unboxing lengkap.',
    customerName: 'Ahmad Fauzi',
    customerEmail: 'ahmad.fauzi@email.com',
    creatorName: 'Dewi Lestari',
  },
  {
    returnId: 'RET-1703456789-JKL012MNO',
    orderId: 'ORD-2025-001240',
    productName: 'Organic Fertilizer Pack',
    productImage: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400',
    returnReason: 'Masalah Kualitas',
    returnType: 'replacement',
    returnStatus: 'In Review',
    requestedDate: '2025-12-01',
    videoEvidence: 'unboxing-video-004.mp4',
    photoEvidence: ['photo7.jpg', 'photo8.jpg', 'photo9.jpg'],
    adminNotes: 'Sedang dalam proses review oleh tim quality control.',
    customerName: 'Ahmad Fauzi',
    customerEmail: 'ahmad.fauzi@email.com',
    creatorName: 'Eko Prasetyo',
  },
];

// Mock orders data
const mockOrders: Order[] = [
  {
    orderId: 'ORD-2025-001234',
    orderDate: '2025-10-25',
    estimatedDelivery: '2025-10-30',
    items: [
      {
        id: '1',
        productId: 'prod1',
        productName: 'Eco-Friendly Water Filter',
        productImage: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400',
        quantity: 2,
        price: 150000,
        status: 'Delivered',
      },
    ],
    subtotal: 300000,
    shippingFee: 15000,
    total: 315000,
    paymentMethod: 'GoPay',
    trackingNumber: 'JNE123456789ID',
    courierService: 'JNE',
    shippingAddress: 'Jl. Sudirman No. 123, Jakarta Pusat',
  },
  {
    orderId: 'ORD-2025-001235',
    orderDate: '2025-10-27',
    estimatedDelivery: '2025-11-01',
    items: [
      {
        id: '2',
        productId: 'prod2',
        productName: 'Solar Panel Kit',
        productImage: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400',
        quantity: 1,
        price: 500000,
        status: 'Out for Delivery',
      },
      {
        id: '3',
        productId: 'prod3',
        productName: 'Organic Fertilizer Pack',
        productImage: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400',
        quantity: 3,
        price: 75000,
        status: 'Out for Delivery',
      },
    ],
    subtotal: 725000,
    shippingFee: 20000,
    total: 745000,
    paymentMethod: 'OVO',
    trackingNumber: 'SICEPAT987654321',
    courierService: 'SiCepat',
    shippingAddress: 'Jl. Sudirman No. 123, Jakarta Pusat',
  },
  {
    orderId: 'ORD-2025-001236',
    orderDate: '2025-10-28',
    estimatedDelivery: '2025-11-02',
    items: [
      {
        id: '4',
        productId: 'prod4',
        productName: 'Biodegradable Shopping Bags',
        productImage: 'https://images.unsplash.com/photo-1591696205602-2f950c417cb9?w=400',
        quantity: 5,
        price: 25000,
        status: 'Shipped',
      },
    ],
    subtotal: 125000,
    shippingFee: 10000,
    total: 135000,
    paymentMethod: 'Dana',
    trackingNumber: 'GRAB789012345',
    courierService: 'Grab Express',
    shippingAddress: 'Jl. Sudirman No. 123, Jakarta Pusat',
  },
  {
    orderId: 'ORD-2025-001237',
    orderDate: '2025-10-29',
    estimatedDelivery: '2025-11-03',
    items: [
      {
        id: '5',
        productId: 'prod5',
        productName: 'Recycled Paper Notebook',
        productImage: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400',
        quantity: 10,
        price: 35000,
        status: 'Processing',
      },
    ],
    subtotal: 350000,
    shippingFee: 12000,
    total: 362000,
    paymentMethod: 'BCA Virtual Account',
    trackingNumber: '-',
    courierService: 'J&T Express',
    shippingAddress: 'Jl. Sudirman No. 123, Jakarta Pusat',
  },
];

export function OrdersPage({ userData, onNavigateToReturn }: OrdersPageProps) {
  const t = getTranslation((userData.language as Language) || 'id');
  const [activeTab, setActiveTab] = useState('orders');
  const [reviews, setReviews] = useState<Record<string, { rating: number; comment: string }>>({});
  const [currentReview, setCurrentReview] = useState({ rating: 5, comment: '' });
  const [selectedEvidence, setSelectedEvidence] = useState<ReturnRecord | null>(null);
  const [showEvidenceDialog, setShowEvidenceDialog] = useState(false);
  
  // Return submission form states
  const [showReturnForm, setShowReturnForm] = useState(false);
  const [selectedOrderForReturn, setSelectedOrderForReturn] = useState<Order | null>(null);
  const [selectedItemForReturn, setSelectedItemForReturn] = useState<OrderItem | null>(null);
  const [returnQuantity, setReturnQuantity] = useState(1);
  const [returnReason, setReturnReason] = useState('');
  const [returnType, setReturnType] = useState<'refund' | 'replacement'>('refund');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [customerDescription, setCustomerDescription] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [generatedReturnId, setGeneratedReturnId] = useState('');
  const [submittedReturn, setSubmittedReturn] = useState<ReturnRecord | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Out for Delivery':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getReturnStatusColor = (status: ReturnStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'In Review':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Processing':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getReturnStatusIcon = (status: ReturnStatus) => {
    switch (status) {
      case 'Pending':
        return <Clock className="w-4 h-4" />;
      case 'In Review':
        return <Eye className="w-4 h-4" />;
      case 'Approved':
      case 'Completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'Processing':
        return <Package className="w-4 h-4" />;
      case 'Rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusProgress = (status: OrderStatus) => {
    switch (status) {
      case 'Processing':
        return 25;
      case 'Shipped':
        return 50;
      case 'Out for Delivery':
        return 75;
      case 'Delivered':
        return 100;
      default:
        return 0;
    }
  };

  const handleTrackPackage = (order: Order) => {
    const currentLang = (userData.language as Language) || 'id';
    const trackMessage = currentLang === 'id' ? 'Membuka detail pelacakan paket...' :
                         currentLang === 'en' ? 'Opening package tracking details...' :
                         currentLang === 'zh' ? '正在打开包裹跟踪详情...' :
                         currentLang === 'ja' ? '荷物追跡の詳細を開いています...' :
                         '패키지 추적 세부정보를 여는 중...';
    const trackingLabel = currentLang === 'id' ? 'Nomor resi:' :
                          currentLang === 'en' ? 'Tracking number:' :
                          currentLang === 'zh' ? '追踪号码：' :
                          currentLang === 'ja' ? '追跡番号：' :
                          '추적 번호：';
    toast.success(trackMessage, {
      description: `${trackingLabel} ${order.trackingNumber}`,
    });
  };

  const handleSubmitReview = (itemId: string) => {
    setReviews({
      ...reviews,
      [itemId]: currentReview,
    });
    toast.success(t.reviewSubmitted);
    setCurrentReview({ rating: 5, comment: '' });
  };

  const handleViewEvidence = (returnRecord: ReturnRecord) => {
    setSelectedEvidence(returnRecord);
    setShowEvidenceDialog(true);
  };

  const handleStartReturn = (order: Order, item: OrderItem) => {
    setSelectedOrderForReturn(order);
    setSelectedItemForReturn(item);
    setReturnQuantity(1);
    setReturnReason('');
    setReturnType('refund');
    setAdditionalNotes('');
    setCustomerDescription('');
    setUploadedFiles([]);
    setShowReturnForm(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (uploadedFiles.length + files.length > 5) {
      toast.error(t.atLeast1File);
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newFile: UploadedFile = {
          id: Math.random().toString(36).substr(2, 9),
          file: file,
          preview: reader.result as string,
          progress: 0
        };
        
        setUploadedFiles(prev => [...prev, newFile]);
        
        // Simulate upload progress
        const interval = setInterval(() => {
          setUploadedFiles(prev => 
            prev.map(f => 
              f.id === newFile.id && f.progress < 100
                ? { ...f, progress: Math.min(f.progress + 20, 100) }
                : f
            )
          );
        }, 200);
        
        setTimeout(() => {
          clearInterval(interval);
          toast.success(t.fileUploaded);
        }, 1000);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleCopyReturnId = (returnId: string) => {
    navigator.clipboard.writeText(returnId);
    toast.success(t.returnIdCopied);
  };

  const handlePrintReceipt = (returnId: string) => {
    // Simulate print functionality
    toast.success(`${t.printReceipt}: ${returnId}`);
  };

  const handleDownloadReceipt = (returnId: string) => {
    // Simulate download functionality
    toast.success(`${t.downloadReturnReceipt}: ${returnId}`);
  };

  const handleSubmitReturn = () => {
    // Validation
    if (!selectedItemForReturn || !returnReason || !customerDescription.trim()) {
      toast.error(t.allFieldsRequired);
      return;
    }
    
    if (uploadedFiles.length === 0) {
      toast.error(t.atLeast1File);
      return;
    }

    // Generate return ID
    const returnId = `RET-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    setGeneratedReturnId(returnId);
    
    // Create return record
    const newReturn: ReturnRecord = {
      returnId,
      orderId: selectedOrderForReturn!.orderId,
      productName: selectedItemForReturn.productName,
      productImage: selectedItemForReturn.productImage,
      returnReason,
      returnType,
      returnStatus: 'Pending',
      requestedDate: new Date().toISOString().split('T')[0],
      videoEvidence: uploadedFiles.find(f => f.file.type.startsWith('video')) ? 'unboxing-video.mp4' : '',
      photoEvidence: uploadedFiles.filter(f => f.file.type.startsWith('image')).map((_, i) => `photo${i + 1}.jpg`),
      adminNotes: 'Menunggu verifikasi dari tim RUPA.',
      customerName: userData.fullName || userData.username,
      customerEmail: userData.email,
      creatorName: 'Kreator Indonesia',
    };
    
    setSubmittedReturn(newReturn);
    setShowSuccessDialog(true);
    setShowReturnForm(false);
    toast.success(t.returnSubmitted);
  };

  const isReturnFormValid = () => {
    return (
      selectedItemForReturn &&
      returnReason &&
      customerDescription.trim() &&
      uploadedFiles.length > 0 &&
      uploadedFiles.every(f => f.progress === 100)
    );
  };

  const currentTheme = userData.themeColor 
    ? {
        green: { primary: '#16a34a', light: '#22c55e', secondary: '#4ade80' },
        orange: { primary: '#ea580c', light: '#f97316', secondary: '#fb923c' },
        blue: { primary: '#2563eb', light: '#3b82f6', secondary: '#60a5fa' },
        purple: { primary: '#9333ea', light: '#a855f7', secondary: '#c084fc' },
        pink: { primary: '#ec4899', light: '#f472b6', secondary: '#f9a8d4' },
      }[userData.themeColor]
    : { primary: '#16a34a', light: '#22c55e', secondary: '#4ade80' };

  // Return Submission Form (Full Screen)
  if (showReturnForm && selectedOrderForReturn && selectedItemForReturn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <div className="max-w-4xl mx-auto p-6">
          {/* Header with Back Button */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => setShowReturnForm(false)}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t.back}
            </Button>
            <h1 className="text-4xl text-gray-800 mb-2">{t.returnSubmissionForm}</h1>
            <p className="text-gray-600">{t.motto}</p>
          </div>

          <Card className="rounded-2xl shadow-lg border-0">
            <CardHeader 
              className="text-white"
              style={{
                backgroundImage: `linear-gradient(to right, ${currentTheme.primary}, ${currentTheme.light})`
              }}
            >
              <CardTitle className="text-white">{t.submitNewReturn}</CardTitle>
              <CardDescription className="text-white/90">
                {t.orderId}: {selectedOrderForReturn.orderId}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Selected Product Display */}
              <div className="bg-blue-50 rounded-xl p-4">
                <Label className="mb-3 block">{t.selectProductToReturn}</Label>
                <div className="flex gap-4 items-start">
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                    <ImageWithFallback
                      src={selectedItemForReturn.productImage}
                      alt={selectedItemForReturn.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-800 mb-1">{selectedItemForReturn.productName}</h3>
                    <p className="text-sm text-gray-600">
                      Rp {selectedItemForReturn.price.toLocaleString('id-ID')} × {selectedItemForReturn.quantity}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Quantity Selection */}
              <div className="space-y-2">
                <Label>{t.quantityToReturn} *</Label>
                <Select value={returnQuantity.toString()} onValueChange={(v) => setReturnQuantity(parseInt(v))}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: selectedItemForReturn.quantity }, (_, i) => i + 1).map(num => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} item(s)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Return Reason */}
              <div className="space-y-2">
                <Label>{t.returnReason} *</Label>
                <Select value={returnReason} onValueChange={setReturnReason}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder={t.selectReason} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="damaged">{t.damagedProduct}</SelectItem>
                    <SelectItem value="wrong">{t.wrongItem}</SelectItem>
                    <SelectItem value="not-described">{t.notAsDescribed}</SelectItem>
                    <SelectItem value="quality">{t.qualityIssue}</SelectItem>
                    <SelectItem value="incomplete">{t.incompleteOrder}</SelectItem>
                    <SelectItem value="other">{t.otherReason}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Return Type */}
              <div className="space-y-2">
                <Label>{t.solutionPreference} *</Label>
                <Select value={returnType} onValueChange={(v: 'refund' | 'replacement') => setReturnType(v)}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="refund">{t.refund}</SelectItem>
                    <SelectItem value="replacement">{t.replacement}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Evidence Upload */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  {t.uploadEvidence} *
                </Label>
                <p className="text-sm text-gray-600">{t.uploadEvidenceDesc}</p>
                
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                  style={{ borderColor: currentTheme.light }}
                >
                  <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-600 mb-1">{t.dragDropFiles}</p>
                  <p className="text-xs text-gray-500">
                    {uploadedFiles.length}/5 {t.uploadEvidence}
                  </p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {/* Uploaded Files Preview */}
                {uploadedFiles.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {uploadedFiles.map((file) => (
                      <div key={file.id} className="relative group">
                        <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                          {file.file.type.startsWith('image') ? (
                            <img
                              src={file.preview}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FileVideo className="w-12 h-12 text-gray-400" />
                            </div>
                          )}
                          
                          {/* Upload Progress */}
                          {file.progress < 100 && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <div className="text-white text-center">
                                <Clock className="w-6 h-6 mx-auto mb-2 animate-spin" />
                                <p className="text-sm">{file.progress}%</p>
                              </div>
                            </div>
                          )}
                          
                          {/* Success Check */}
                          {file.progress === 100 && (
                            <div className="absolute top-2 right-2">
                              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveFile(file.id)}
                          className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                        
                        <p className="text-xs text-gray-500 mt-1 truncate">{file.file.name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Separator />

              {/* Order Information (Auto-filled) */}
              <div className="space-y-3">
                <Label>{t.orderInformation}</Label>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t.orderId}:</span>
                    <span className="text-gray-800">{selectedOrderForReturn.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t.orderDate}:</span>
                    <span className="text-gray-800">
                      {new Date(selectedOrderForReturn.orderDate).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t.paymentMethod}:</span>
                    <span className="text-gray-800">{selectedOrderForReturn.paymentMethod}</span>
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div className="space-y-2">
                <Label>{t.additionalNotes}</Label>
                <Textarea
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder={t.additionalNotesPlaceholder}
                  className="rounded-xl min-h-24"
                />
              </div>

              {/* Customer Description */}
              <div className="space-y-2">
                <Label>{t.customerDescription} *</Label>
                <Textarea
                  value={customerDescription}
                  onChange={(e) => setCustomerDescription(e.target.value)}
                  placeholder={t.customerDescriptionPlaceholder}
                  className="rounded-xl min-h-32"
                />
                <p className="text-xs text-gray-500">
                  {customerDescription.length}/500
                </p>
              </div>

              <Separator />

              {/* Help Section */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
                <h4 className="text-gray-800 mb-3 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-purple-600" />
                  {t.needHelp}
                </h4>
                <div className="space-y-2 text-sm text-gray-700">
                  <details className="cursor-pointer">
                    <summary className="font-medium text-gray-800 hover:text-purple-600">
                      Berapa lama proses retur?
                    </summary>
                    <p className="mt-2 pl-4 text-gray-600">
                      Proses review 1-3 hari kerja, total proses retur sekitar 7-14 hari kerja tergantung jenis retur.
                    </p>
                  </details>
                  <details className="cursor-pointer">
                    <summary className="font-medium text-gray-800 hover:text-purple-600">
                      Format video apa yang diterima?
                    </summary>
                    <p className="mt-2 pl-4 text-gray-600">
                      Semua format video umum (MP4, MOV, AVI) dengan ukuran maksimal 100MB.
                    </p>
                  </details>
                  <details className="cursor-pointer">
                    <summary className="font-medium text-gray-800 hover:text-purple-600">
                      Bagaimana cara melacak status retur?
                    </summary>
                    <p className="mt-2 pl-4 text-gray-600">
                      Setelah submit, Anda bisa melihat status di tab "Return History" dan akan menerima notifikasi email.
                    </p>
                  </details>
                </div>
              </div>

              <Separator />

              {/* Submit Button */}
              <Button
                onClick={handleSubmitReturn}
                disabled={!isReturnFormValid()}
                className="w-full rounded-xl text-white py-6"
                style={{ 
                  backgroundColor: isReturnFormValid() ? currentTheme.primary : '#d1d5db',
                  cursor: isReturnFormValid() ? 'pointer' : 'not-allowed'
                }}
                size="lg"
              >
                <Upload className="w-5 h-5 mr-2" />
                {t.submitReturn}
              </Button>

              {!isReturnFormValid() && (
                <p className="text-sm text-center text-gray-500">
                  {uploadedFiles.length === 0 ? t.atLeast1File : t.allFieldsRequired}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl text-gray-800 mb-2">{t.myOrders}</h1>
          <p className="text-gray-600">
            {t.ordersDesc}
          </p>
        </div>

        {/* Tabs for Orders, Return History, and Submit Return */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 rounded-xl">
            <TabsTrigger value="orders" className="rounded-xl">
              <Package className="w-4 h-4 mr-2" />
              {t.myOrders}
            </TabsTrigger>
            <TabsTrigger value="returns" className="rounded-xl">
              <History className="w-4 h-4 mr-2" />
              {t.returnHistory}
            </TabsTrigger>
            <TabsTrigger value="submit" className="rounded-xl">
              <RotateCcw className="w-4 h-4 mr-2" />
              {t.submitNewReturn}
            </TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            {mockOrders.map((order) => (
              <Card key={order.orderId} className="rounded-2xl shadow-lg border-0 overflow-hidden">
                <CardHeader 
                  className="text-white"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${currentTheme.primary}, ${currentTheme.light})`
                  }}
                >
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <CardTitle className="text-white">Order #{order.orderId}</CardTitle>
                      <CardDescription className="text-white/90 flex items-center gap-2 mt-1">
                        <Calendar className="w-4 h-4" />
                        Dipesan pada: {new Date(order.orderDate).toLocaleDateString('id-ID', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </CardDescription>
                    </div>
                    <Badge className="bg-white/20 text-white border-white/30">
                      {order.items.length} Item
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  {/* Order Items */}
                  <div className="space-y-4 mb-6">
                    {order.items.map((item) => (
                      <div key={item.id}>
                        <div className="flex gap-4 items-start">
                          <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                            <ImageWithFallback
                              src={item.productImage}
                              alt={item.productName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <div>
                                <h3 className="text-gray-800 mb-1">{item.productName}</h3>
                                <p className="text-sm text-gray-600">
                                  Qty: {item.quantity} × Rp {item.price.toLocaleString('id-ID')}
                                </p>
                              </div>
                              <Badge className={`${getStatusColor(item.status)} border`}>
                                {item.status === 'Processing' && 'Diproses'}
                                {item.status === 'Shipped' && 'Dikirim'}
                                {item.status === 'Out for Delivery' && 'Dalam Pengiriman'}
                                {item.status === 'Delivered' && 'Terkirim'}
                              </Badge>
                            </div>

                            {/* Tracking Progress */}
                            <div className="mt-3">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Package className="w-4 h-4" />
                                  <span>Status Pengiriman</span>
                                </div>
                                <span className="text-sm text-gray-500">
                                  {getStatusProgress(item.status)}%
                                </span>
                              </div>
                              <Progress value={getStatusProgress(item.status)} className="h-2" />
                              
                              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                                <span className={getStatusProgress(item.status) >= 25 ? 'text-green-600' : ''}>Dipesan</span>
                                <span className={getStatusProgress(item.status) >= 50 ? 'text-green-600' : ''}>Dikirim</span>
                                <span className={getStatusProgress(item.status) >= 75 ? 'text-green-600' : ''}>Dalam Perjalanan</span>
                                <span className={getStatusProgress(item.status) >= 100 ? 'text-green-600' : ''}>Sampai</span>
                              </div>
                            </div>

                            {/* Review Section - Show if Delivered */}
                            {item.status === 'Delivered' && !reviews[item.id] && (
                              <div className="flex gap-2 mt-4">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="rounded-xl border-2 flex-1"
                                      style={{ borderColor: currentTheme.primary, color: currentTheme.primary }}
                                    >
                                      <Star className="w-4 h-4 mr-2" />
                                      Tulis Ulasan
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="rounded-2xl">
                                    <DialogHeader>
                                      <DialogTitle>Beri Ulasan untuk {item.productName}</DialogTitle>
                                      <DialogDescription>
                                        Bagikan pengalaman Anda untuk membantu inovator muda Indonesia
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 mt-4">
                                      <div>
                                        <Label>Rating</Label>
                                        <div className="flex gap-2 mt-2">
                                          {[1, 2, 3, 4, 5].map((rating) => (
                                            <button
                                              key={rating}
                                              onClick={() => setCurrentReview({ ...currentReview, rating })}
                                              className="transition-transform hover:scale-110"
                                            >
                                              <Star
                                                className={`w-8 h-8 ${
                                                  rating <= currentReview.rating
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'text-gray-300'
                                                }`}
                                              />
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                      <div>
                                        <Label>Komentar</Label>
                                        <Textarea
                                          placeholder="Bagikan pengalaman Anda dengan produk ini..."
                                          value={currentReview.comment}
                                          onChange={(e) => setCurrentReview({ ...currentReview, comment: e.target.value })}
                                          className="mt-2 rounded-xl"
                                          rows={4}
                                        />
                                      </div>
                                      <Button
                                        onClick={() => handleSubmitReview(item.id)}
                                        className="w-full rounded-xl text-white"
                                        style={{ backgroundColor: currentTheme.primary }}
                                      >
                                        <MessageSquare className="w-4 h-4 mr-2" />
                                        Kirim Ulasan
                                      </Button>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                                
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleStartReturn(order, item)}
                                  className="rounded-xl border-2 flex-1 border-red-300 text-red-600 hover:bg-red-50"
                                >
                                  <RotateCcw className="w-4 h-4 mr-2" />
                                  {t.returnItem}
                                </Button>
                              </div>
                            )}

                            {/* Show Review if Submitted */}
                            {reviews[item.id] && (
                              <div className="mt-4 p-3 bg-green-50 rounded-xl border border-green-200">
                                <div className="flex items-center gap-2 mb-2">
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                  <span className="text-sm text-green-800">Ulasan Terkirim</span>
                                </div>
                                <div className="flex gap-1 mb-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`w-4 h-4 ${
                                        star <= reviews[item.id].rating
                                          ? 'fill-yellow-400 text-yellow-400'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                {reviews[item.id].comment && (
                                  <p className="text-sm text-gray-700 mt-2">{reviews[item.id].comment}</p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <Separator className="mt-4" />
                      </div>
                    ))}
                  </div>

                  {/* Shipping Information */}
                  <div className="bg-blue-50 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-3 mb-4">
                      <Truck className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="text-gray-800 mb-2">Informasi Pengiriman</h4>
                        <div className="space-y-1 text-sm text-gray-700">
                          <p><span className="text-gray-600">Kurir:</span> {order.courierService}</p>
                          <p><span className="text-gray-600">No. Resi:</span> {order.trackingNumber}</p>
                          <p className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 mt-0.5 text-gray-600" />
                            <span>{order.shippingAddress}</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-600" />
                            <span>
                              Estimasi Tiba: {new Date(order.estimatedDelivery).toLocaleDateString('id-ID', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    {order.trackingNumber !== '-' && (
                      <Button
                        onClick={() => handleTrackPackage(order)}
                        variant="outline"
                        className="w-full rounded-xl border-blue-300 text-blue-700 hover:bg-blue-100"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Lacak Paket
                      </Button>
                    )}
                  </div>

                  {/* Payment Summary */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-gray-800 mb-3 flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Ringkasan Pembayaran
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-gray-700">
                        <span>Subtotal</span>
                        <span>Rp {order.subtotal.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between text-gray-700">
                        <span>Ongkos Kirim</span>
                        <span>Rp {order.shippingFee.toLocaleString('id-ID')}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-gray-800">
                        <span>Total</span>
                        <span>Rp {order.total.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between text-gray-600 text-xs pt-2">
                        <span>Metode Pembayaran</span>
                        <span className="text-gray-800">{order.paymentMethod}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Empty State for Orders */}
            {mockOrders.length === 0 && (
              <Card className="rounded-2xl shadow-lg border-0 text-center p-12">
                <div className="max-w-md mx-auto">
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{
                      backgroundImage: `linear-gradient(to bottom right, ${currentTheme.light}, ${currentTheme.primary})`
                    }}
                  >
                    <Package className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl text-gray-800 mb-2">Belum Ada Pesanan</h3>
                  <p className="text-gray-600 mb-6">
                    Mulai dukung inovator muda Indonesia dengan berbelanja karya mereka
                  </p>
                  <Button 
                    className="rounded-xl text-white"
                    style={{ backgroundColor: currentTheme.primary }}
                  >
                    Jelajahi Karya
                  </Button>
                </div>
              </Card>
            )}
          </TabsContent>

          {/* Return History Tab */}
          <TabsContent value="returns" className="space-y-6">
            {/* Info Alert */}
            <Alert className="border-2 rounded-2xl" style={{ borderColor: currentTheme.light }}>
              <AlertCircle className="h-5 w-5" style={{ color: currentTheme.primary }} />
              <AlertDescription className="ml-2">
                <p className="text-sm text-gray-700">{t.accessibleByAll}</p>
              </AlertDescription>
            </Alert>

            {/* Add submitted return to history if exists */}
            {submittedReturn && (
              <Card className="rounded-2xl shadow-xl border-0 overflow-hidden border-4 border-green-400 relative">
                {/* Animated "NEW" Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-green-500 text-white border-0 px-3 py-1 animate-pulse shadow-lg">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    BARU DIAJUKAN
                  </Badge>
                </div>

                <CardHeader 
                  className="text-white"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${currentTheme.primary}, ${currentTheme.light})`
                  }}
                >
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <CardTitle className="text-white flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5" />
                        {t.returnId}: {submittedReturn.returnId}
                      </CardTitle>
                      <CardDescription className="text-white/90 flex items-center gap-2 mt-1">
                        <Calendar className="w-4 h-4" />
                        {t.requestedOn}: {new Date(submittedReturn.requestedDate).toLocaleDateString('id-ID', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </CardDescription>
                    </div>
                    <Badge className={`${getReturnStatusColor(submittedReturn.returnStatus)} border flex items-center gap-1`}>
                      {getReturnStatusIcon(submittedReturn.returnStatus)}
                      {t.statusPending}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  {/* Return Timeline */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-gray-800 flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        {t.returnTrackingTimeline}
                      </h4>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        {t.estimatedCompletion}: 7-10 {t.days}
                      </Badge>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2 text-sm">
                        <span className="text-gray-600">{t.currentStatus}: {t.statusPending}</span>
                        <span className="text-gray-600">20%</span>
                      </div>
                      <Progress value={20} className="h-3" />
                    </div>

                    <div className="relative">
                      {/* Timeline Line */}
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
                      
                      {/* Timeline Steps */}
                      <div className="space-y-6">
                        {/* Step 1: Submitted */}
                        <div className="relative flex items-start gap-4 pl-10">
                          <div 
                            className="absolute left-0 w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: currentTheme.primary }}
                          >
                            <CheckCircle className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h5 className="text-gray-800">{t.returnSubmittedStep}</h5>
                            <p className="text-sm text-gray-600">
                              {new Date(submittedReturn.requestedDate).toLocaleDateString('id-ID')}
                            </p>
                          </div>
                        </div>
                        
                        {/* Step 2: Under Review */}
                        <div className="relative flex items-start gap-4 pl-10">
                          <div 
                            className="absolute left-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-200"
                          >
                            <Eye className="w-5 h-5 text-gray-500" />
                          </div>
                          <div>
                            <h5 className="text-gray-600">{t.underReview}</h5>
                            <p className="text-sm text-gray-500">1-3 {t.days}</p>
                          </div>
                        </div>
                        
                        {/* Step 3: Approved/Rejected */}
                        <div className="relative flex items-start gap-4 pl-10">
                          <div 
                            className="absolute left-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-200"
                          >
                            <CheckCircle className="w-5 h-5 text-gray-500" />
                          </div>
                          <div>
                            <h5 className="text-gray-600">{t.approvedRejected}</h5>
                            <p className="text-sm text-gray-500">3-5 {t.days}</p>
                          </div>
                        </div>
                        
                        {/* Step 4: Processing */}
                        <div className="relative flex items-start gap-4 pl-10">
                          <div 
                            className="absolute left-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-200"
                          >
                            <Package className="w-5 h-5 text-gray-500" />
                          </div>
                          <div>
                            <h5 className="text-gray-600">{t.statusProcessing}</h5>
                            <p className="text-sm text-gray-500">5-7 {t.days}</p>
                          </div>
                        </div>
                        
                        {/* Step 5: Completed */}
                        <div className="relative flex items-start gap-4 pl-10">
                          <div 
                            className="absolute left-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-200"
                          >
                            <CheckCircle2 className="w-5 h-5 text-gray-500" />
                          </div>
                          <div>
                            <h5 className="text-gray-600">{t.statusCompleted}</h5>
                            <p className="text-sm text-gray-500">7-10 {t.days}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* What Happens Next */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6">
                    <h4 className="text-gray-800 mb-3 flex items-center gap-2">
                      <Info className="w-5 h-5 text-blue-600" />
                      Apa yang Terjadi Selanjutnya?
                    </h4>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                        <p>Tim RUPA akan meninjau bukti yang Anda upload dalam 1-3 hari kerja</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                        <p>Anda akan menerima notifikasi email saat status retur berubah</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                        <p>Jika disetujui, {submittedReturn.returnType === 'refund' ? 'refund akan diproses ke metode pembayaran Anda' : 'produk pengganti akan segera dikirim'}</p>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* Product Info */}
                  <div className="flex gap-4 items-start mb-6">
                    <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                      <ImageWithFallback
                        src={submittedReturn.productImage}
                        alt={submittedReturn.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-gray-800 mb-1">{submittedReturn.productName}</h3>
                      <p className="text-sm text-gray-600 mb-2">{t.orderId}: {submittedReturn.orderId}</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="rounded-lg">
                          {t.returnReason}: {submittedReturn.returnReason}
                        </Badge>
                        <Badge 
                          className="rounded-lg" 
                          style={{ 
                            backgroundColor: submittedReturn.returnType === 'refund' ? '#dcfce7' : '#dbeafe',
                            color: submittedReturn.returnType === 'refund' ? '#166534' : '#1e40af'
                          }}
                        >
                          {t.returnType}: {submittedReturn.returnType === 'refund' ? t.refund : t.replacement}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Admin Notes */}
                  {submittedReturn.adminNotes && (
                    <div className="bg-amber-50 rounded-xl p-4 mb-4">
                      <h4 className="text-gray-800 mb-2 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-amber-600" />
                        {t.adminNotes}
                      </h4>
                      <p className="text-sm text-gray-700">{submittedReturn.adminNotes}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={() => handleCopyReturnId(submittedReturn.returnId)}
                      variant="outline"
                      className="rounded-xl"
                      style={{ borderColor: currentTheme.primary, color: currentTheme.primary }}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      {t.copyReturnId}
                    </Button>
                    <Button
                      onClick={() => handleDownloadReceipt(submittedReturn.returnId)}
                      variant="outline"
                      className="rounded-xl"
                      style={{ borderColor: currentTheme.primary, color: currentTheme.primary }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {t.downloadReturnReceipt}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {mockReturnHistory.map((returnRecord) => (
              <Card key={returnRecord.returnId} className="rounded-2xl shadow-lg border-0 overflow-hidden">
                <CardHeader 
                  className="text-white"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${currentTheme.primary}, ${currentTheme.light})`
                  }}
                >
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <CardTitle className="text-white">{t.returnId}: {returnRecord.returnId}</CardTitle>
                      <CardDescription className="text-white/90 flex items-center gap-2 mt-1">
                        <Calendar className="w-4 h-4" />
                        {t.requestedOn}: {new Date(returnRecord.requestedDate).toLocaleDateString('id-ID', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </CardDescription>
                    </div>
                    <Badge className={`${getReturnStatusColor(returnRecord.returnStatus)} border flex items-center gap-1`}>
                      {getReturnStatusIcon(returnRecord.returnStatus)}
                      {returnRecord.returnStatus === 'Pending' && t.statusPending}
                      {returnRecord.returnStatus === 'In Review' && t.statusInReview}
                      {returnRecord.returnStatus === 'Approved' && t.statusApproved}
                      {returnRecord.returnStatus === 'Processing' && t.statusProcessing}
                      {returnRecord.returnStatus === 'Completed' && t.statusCompleted}
                      {returnRecord.returnStatus === 'Rejected' && t.statusRejected}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  {/* Product Info */}
                  <div className="flex gap-4 items-start mb-6">
                    <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                      <ImageWithFallback
                        src={returnRecord.productImage}
                        alt={returnRecord.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-gray-800 mb-1">{returnRecord.productName}</h3>
                      <p className="text-sm text-gray-600 mb-2">{t.orderId}: {returnRecord.orderId}</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="rounded-lg">
                          {t.returnReason}: {returnRecord.returnReason}
                        </Badge>
                        <Badge 
                          className="rounded-lg" 
                          style={{ 
                            backgroundColor: returnRecord.returnType === 'refund' ? '#dcfce7' : '#dbeafe',
                            color: returnRecord.returnType === 'refund' ? '#166534' : '#1e40af'
                          }}
                        >
                          {t.returnType}: {returnRecord.returnType === 'refund' ? t.refund : t.replacement}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* Return Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Customer Details */}
                    <div className="bg-blue-50 rounded-xl p-4">
                      <h4 className="text-gray-800 mb-3 flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-600" />
                        {t.customerDetails}
                      </h4>
                      <div className="space-y-2 text-sm text-gray-700">
                        <p className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          {returnRecord.customerName}
                        </p>
                        <p className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          {returnRecord.customerEmail}
                        </p>
                      </div>
                    </div>

                    {/* Creator Details */}
                    <div className="bg-purple-50 rounded-xl p-4">
                      <h4 className="text-gray-800 mb-3 flex items-center gap-2">
                        <Palette className="w-5 h-5 text-purple-600" />
                        {t.creatorDetails}
                      </h4>
                      <div className="space-y-2 text-sm text-gray-700">
                        <p className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          {returnRecord.creatorName}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Evidence & Status */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-gray-800 flex items-center gap-2">
                        <FileVideo className="w-5 h-5" />
                        {t.supportingEvidence}
                      </h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewEvidence(returnRecord)}
                        className="rounded-xl border-2"
                        style={{ borderColor: currentTheme.primary, color: currentTheme.primary }}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        {t.viewEvidence}
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 mb-1">{t.unboxingEvidenceVideo}:</p>
                        <p className="text-gray-800 flex items-center gap-2">
                          <FileVideo className="w-4 h-4" />
                          {returnRecord.videoEvidence}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">{t.additionalPhotosEvidence}:</p>
                        <p className="text-gray-800 flex items-center gap-2">
                          <ImageIcon className="w-4 h-4" />
                          {returnRecord.photoEvidence.length} foto
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Admin Notes & Additional Info */}
                  {returnRecord.adminNotes && (
                    <div className="bg-amber-50 rounded-xl p-4 mb-4">
                      <h4 className="text-gray-800 mb-2 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-amber-600" />
                        {t.adminNotes}
                      </h4>
                      <p className="text-sm text-gray-700">{returnRecord.adminNotes}</p>
                    </div>
                  )}

                  {/* Rejection Reason */}
                  {returnRecord.returnStatus === 'Rejected' && returnRecord.rejectionReason && (
                    <div className="bg-red-50 rounded-xl p-4 mb-4 border-2 border-red-200">
                      <h4 className="text-red-800 mb-2 flex items-center gap-2">
                        <XCircle className="w-5 h-5" />
                        {t.rejectionReason}
                      </h4>
                      <p className="text-sm text-red-700">{returnRecord.rejectionReason}</p>
                    </div>
                  )}

                  {/* Refund Amount & Completion */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {returnRecord.refundAmount && (
                      <div className="bg-green-50 rounded-xl p-4">
                        <p className="text-sm text-gray-600 mb-1">{t.refundAmount}:</p>
                        <p className="text-2xl text-green-700">
                          Rp {returnRecord.refundAmount.toLocaleString('id-ID')}
                        </p>
                      </div>
                    )}
                    {returnRecord.completedDate && (
                      <div className="bg-blue-50 rounded-xl p-4">
                        <p className="text-sm text-gray-600 mb-1">{t.completedOn}:</p>
                        <p className="text-gray-800 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          {new Date(returnRecord.completedDate).toLocaleDateString('id-ID', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Empty State for Return History */}
            {mockReturnHistory.length === 0 && !submittedReturn && (
              <Card className="rounded-2xl shadow-lg border-0 text-center p-12">
                <div className="max-w-md mx-auto">
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{
                      backgroundImage: `linear-gradient(to bottom right, ${currentTheme.light}, ${currentTheme.primary})`
                    }}
                  >
                    <History className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl text-gray-800 mb-2">{t.returnHistoryEmpty}</h3>
                  <p className="text-gray-600">
                    {t.returnHistoryEmptyDesc}
                  </p>
                </div>
              </Card>
            )}
          </TabsContent>

          {/* Submit Return Tab */}
          <TabsContent value="submit">
            <Card className="rounded-2xl shadow-lg border-0">
              <CardHeader 
                className="text-white"
                style={{
                  backgroundImage: `linear-gradient(to right, ${currentTheme.primary}, ${currentTheme.light})`
                }}
              >
                <CardTitle className="text-white">{t.submitNewReturn}</CardTitle>
                <CardDescription className="text-white/90">
                  {t.selectProductToReturn}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6">
                {/* Return Guidelines Section */}
                <div className="mb-8">
                  <Alert className="border-2 rounded-2xl mb-6" style={{ borderColor: currentTheme.light }}>
                    <ShieldCheck className="h-5 w-5" style={{ color: currentTheme.primary }} />
                    <AlertDescription className="ml-2">
                      <h3 className="text-lg text-gray-800 mb-2">{t.returnGuidelines}</h3>
                      <p className="text-sm text-gray-600">{t.returnGuidelinesDesc}</p>
                    </AlertDescription>
                  </Alert>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* Return Policy */}
                    <Card className="rounded-2xl border-2" style={{ borderColor: currentTheme.light }}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="w-5 h-5" style={{ color: currentTheme.primary }} />
                          {t.returnPolicy}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          <li className="flex items-start gap-2 text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: currentTheme.primary }} />
                            <span>{t.returnPolicyPoint1}</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: currentTheme.primary }} />
                            <span>{t.returnPolicyPoint2}</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: currentTheme.primary }} />
                            <span>{t.returnPolicyPoint3}</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: currentTheme.primary }} />
                            <span>{t.returnPolicyPoint4}</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: currentTheme.primary }} />
                            <span>{t.returnPolicyPoint5}</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    {/* What You Need */}
                    <Card className="rounded-2xl border-2" style={{ borderColor: currentTheme.light }}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Upload className="w-5 h-5" style={{ color: currentTheme.primary }} />
                          {t.whatYouNeed}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3 mb-4">
                          <li className="flex items-start gap-2 text-sm text-gray-700">
                            <FileVideo className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                            <span>{t.whatYouNeedPoint1}</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm text-gray-700">
                            <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0 text-purple-600" />
                            <span>{t.whatYouNeedPoint2}</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm text-gray-700">
                            <Package className="w-4 h-4 mt-0.5 flex-shrink-0 text-orange-600" />
                            <span>{t.whatYouNeedPoint3}</span>
                          </li>
                        </ul>
                        <div className="bg-amber-50 rounded-xl p-3 border border-amber-200">
                          <div className="flex items-start gap-2">
                            <Clock className="w-4 h-4 mt-0.5 text-amber-600" />
                            <div>
                              <p className="text-xs text-amber-800 mb-1">{t.processingTime}</p>
                              <p className="text-xs text-amber-700">{t.processingTimeDesc}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Separator className="mb-6" />

                  <h3 className="text-xl text-gray-800 mb-4">{t.selectProductToReturn}</h3>
                </div>

                <div className="grid gap-4">
                  {mockOrders.flatMap(order => 
                    order.items
                      .filter(item => item.status === 'Delivered')
                      .map(item => (
                        <div 
                          key={item.id}
                          className="flex gap-4 items-center p-4 border-2 rounded-xl hover:bg-gray-50 transition-colors"
                          style={{ borderColor: currentTheme.light }}
                        >
                          <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                            <ImageWithFallback
                              src={item.productImage}
                              alt={item.productName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-gray-800 mb-1">{item.productName}</h3>
                            <p className="text-sm text-gray-600">
                              Order #{order.orderId}
                            </p>
                            <p className="text-sm text-gray-600">
                              Qty: {item.quantity} × Rp {item.price.toLocaleString('id-ID')}
                            </p>
                          </div>
                          <Button
                            onClick={() => handleStartReturn(order, item)}
                            className="rounded-xl text-white"
                            style={{ backgroundColor: currentTheme.primary }}
                          >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            {t.returnItem}
                          </Button>
                        </div>
                      ))
                  )}
                </div>

                {mockOrders.flatMap(o => o.items.filter(i => i.status === 'Delivered')).length === 0 && (
                  <div className="text-center py-12">
                    <div 
                      className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                      style={{
                        backgroundImage: `linear-gradient(to bottom right, ${currentTheme.light}, ${currentTheme.primary})`
                      }}
                    >
                      <Package className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl text-gray-800 mb-2">Tidak Ada Produk yang Dapat Diretur</h3>
                    <p className="text-gray-600">
                      Hanya produk yang telah terkirim yang dapat diretur
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Success Dialog */}
        <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          {showSuccessDialog && <SuccessConfetti />}
          <DialogContent className="rounded-2xl max-w-2xl">
            <div className="text-center py-6">
              {/* Success Icon */}
              <div 
                className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{
                  backgroundImage: `linear-gradient(to bottom right, ${currentTheme.light}, ${currentTheme.primary})`
                }}
              >
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>

              {/* Success Title */}
              <h2 className="text-3xl text-gray-800 mb-2">{t.returnSubmittedSuccess}</h2>
              <p className="text-gray-600 mb-6">{t.returnSubmittedSuccessDesc}</p>

              {/* Return ID Display */}
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 mb-6 border-2 border-orange-200">
                <p className="text-sm text-gray-600 mb-2">{t.yourReturnId}</p>
                <div className="flex items-center justify-center gap-3">
                  <code className="text-xl text-gray-800 font-mono bg-white px-4 py-2 rounded-lg">
                    {generatedReturnId}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyReturnId(generatedReturnId)}
                    className="rounded-lg"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-blue-50 rounded-xl p-6 mb-6 text-left">
                <h3 className="text-gray-800 mb-3 flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-600" />
                  {t.nextSteps}
                </h3>
                <p className="text-sm text-gray-700 mb-4">{t.nextStepsDesc}</p>
                
                {/* Timeline Preview */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700">{t.returnSubmittedStep}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-gray-500" />
                    </div>
                    <span className="text-gray-500">{t.underReview} (1-3 {t.days})</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-gray-500" />
                    </div>
                    <span className="text-gray-500">{t.statusProcessing} (5-7 {t.days})</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <Button
                  onClick={() => handleDownloadReceipt(generatedReturnId)}
                  variant="outline"
                  className="rounded-xl"
                  style={{ borderColor: currentTheme.primary, color: currentTheme.primary }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {t.downloadReturnReceipt}
                </Button>
                <Button
                  onClick={() => handlePrintReceipt(generatedReturnId)}
                  variant="outline"
                  className="rounded-xl"
                  style={{ borderColor: currentTheme.primary, color: currentTheme.primary }}
                >
                  <Printer className="w-4 h-4 mr-2" />
                  {t.printReceipt}
                </Button>
              </div>

              <Button
                onClick={() => {
                  setShowSuccessDialog(false);
                  setActiveTab('returns');
                }}
                className="w-full rounded-xl text-white"
                style={{ backgroundColor: currentTheme.primary }}
              >
                {t.viewReturnStatus}
              </Button>

              {/* Help Section */}
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-gray-600 mb-2">{t.needHelp}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-700"
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  {t.contactSupport}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Evidence Dialog */}
        <Dialog open={showEvidenceDialog} onOpenChange={setShowEvidenceDialog}>
          <DialogContent className="rounded-2xl max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t.evidenceDetails}</DialogTitle>
              <DialogDescription>
                {t.returnId}: {selectedEvidence?.returnId}
              </DialogDescription>
            </DialogHeader>
            
            {selectedEvidence && (
              <div className="space-y-4 mt-4">
                {/* Video Evidence */}
                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <FileVideo className="w-4 h-4" />
                    {t.unboxingEvidenceVideo}
                  </Label>
                  <div className="bg-gray-100 rounded-xl p-8 text-center">
                    <FileVideo className="w-16 h-16 mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-700 mb-2">{selectedEvidence.videoEvidence}</p>
                    <p className="text-sm text-gray-500">Video tidak dapat diputar dalam demo ini</p>
                  </div>
                </div>

                <Separator />

                {/* Photo Evidence */}
                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <ImageIcon className="w-4 h-4" />
                    {t.additionalPhotosEvidence} ({selectedEvidence.photoEvidence.length})
                  </Label>
                  <div className="grid grid-cols-3 gap-3">
                    {selectedEvidence.photoEvidence.map((photo, index) => (
                      <div key={index} className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center">
                        <div className="text-center">
                          <ImageIcon className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-xs text-gray-500">{photo}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => setShowEvidenceDialog(false)}
                  className="w-full rounded-xl text-white mt-4"
                  style={{ backgroundColor: currentTheme.primary }}
                >
                  {t.close}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
