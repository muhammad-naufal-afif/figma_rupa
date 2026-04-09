import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  LayoutDashboard, 
  Users, 
  TrendingUp, 
  Flag, 
  Settings, 
  LogOut,
  Activity,
  DollarSign,
  ShoppingCart,
  AlertCircle,
  CheckCircle,
  Server,
  Database,
  Megaphone,
  Shield,
  FileText,
  CheckCircle2,
  Play
} from 'lucide-react';
import type { UserData } from '../App';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Alert, AlertDescription } from './ui/alert';
import { toast } from 'sonner@2.0.3';

type AdminDashboardProps = {
  onLogout: () => void;
  adminData: UserData;
};

export function AdminDashboard({ onLogout, adminData }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data
  const systemStats = {
    uptime: '99.8%',
    activeUsers: 1247,
    totalDonations: 'Rp 125,450,000',
    totalTransactions: 3842,
    pendingReports: 12,
    serverHealth: 98,
  };

  const recentReports = [
    { id: 1, type: 'Konten Tidak Pantas', creator: 'user_123', status: 'Pending', date: '29 Okt 2025' },
    { id: 2, type: 'Spam', creator: 'user_456', status: 'Resolved', date: '28 Okt 2025' },
    { id: 3, type: 'Harga Tidak Sesuai', creator: 'user_789', status: 'Pending', date: '28 Okt 2025' },
  ];

  const topCreators = [
    { name: 'Budi Santoso', works: 45, revenue: 'Rp 12,500,000' },
    { name: 'Siti Rahayu', works: 38, revenue: 'Rp 9,800,000' },
    { name: 'Ahmad Fauzi', works: 32, revenue: 'Rp 8,200,000' },
  ];

  const [licenseApplications, setLicenseApplications] = useState([
    { 
      id: 1, 
      applicant: 'PT Inovasi Hijau', 
      productName: 'Tas Ramah Lingkungan dari Sampah Plastik',
      licenseType: 'Commercial License',
      submittedDate: '25 Okt 2025',
      status: 'Pending'
    },
    { 
      id: 2, 
      applicant: 'CV Teknologi Nusantara', 
      productName: 'Lampu Tenaga Surya Portable',
      licenseType: 'Educational License',
      submittedDate: '23 Okt 2025',
      status: 'Processing'
    },
    { 
      id: 3, 
      applicant: 'Yayasan Lingkungan Bersih', 
      productName: 'Pupuk Organik dari Kompos',
      licenseType: 'Non-Profit License',
      submittedDate: '20 Okt 2025',
      status: 'Completed'
    },
    { 
      id: 4, 
      applicant: 'Koperasi Kreasi Anak Bangsa', 
      productName: 'Kerajinan Anyaman Tradisional Modern',
      licenseType: 'Commercial License',
      submittedDate: '18 Okt 2025',
      status: 'Processing'
    },
    { 
      id: 5, 
      applicant: 'Startup Eco Indonesia', 
      productName: 'Botol Minum Eco-Friendly',
      licenseType: 'Commercial License',
      submittedDate: '15 Okt 2025',
      status: 'Pending'
    },
  ]);

  const handleMarkAsCompleted = (id: number) => {
    const application = licenseApplications.find(app => app.id === id);
    setLicenseApplications(prev => 
      prev.map(app => 
        app.id === id ? { ...app, status: 'Completed' } : app
      )
    );
    toast.success(`Pengajuan lisensi untuk "${application?.productName}" telah diselesaikan! ✅`);
  };

  const handleProcessApplication = (id: number) => {
    const application = licenseApplications.find(app => app.id === id);
    setLicenseApplications(prev => 
      prev.map(app => 
        app.id === id && app.status === 'Pending' ? { ...app, status: 'Processing' } : app
      )
    );
    toast.info(`Mulai memproses pengajuan lisensi untuk "${application?.productName}" 🔄`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl">Admin Dashboard RUPA</h1>
                <p className="text-green-100 text-sm">Penjaga Karya Anak Bangsa 🌱</p>
              </div>
            </div>
            <Button 
              onClick={onLogout}
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 rounded-xl"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Keluar
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-6 gap-2 mb-8 bg-white rounded-xl p-2 shadow-md">
            <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-orange-500 data-[state=active]:text-white">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-orange-500 data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-2" />
              Pengguna
            </TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-orange-500 data-[state=active]:text-white">
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="licenses" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-orange-500 data-[state=active]:text-white">
              <FileText className="w-4 h-4 mr-2" />
              Lisensi
            </TabsTrigger>
            <TabsTrigger value="reports" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-orange-500 data-[state=active]:text-white">
              <Flag className="w-4 h-4 mr-2" />
              Laporan
            </TabsTrigger>
            <TabsTrigger value="system" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-orange-500 data-[state=active]:text-white">
              <Settings className="w-4 h-4 mr-2" />
              System
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Alert className="bg-green-50 border-green-200 rounded-xl">
              <AlertCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Selamat datang, {adminData.username}! Sistem RUPA beroperasi normal. Semua karya anak bangsa terlindungi dengan baik. 🇮🇩
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="rounded-2xl shadow-lg border-0 bg-gradient-to-br from-blue-50 to-blue-100">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center text-blue-700">
                    <Users className="w-4 h-4 mr-2" />
                    Pengguna Aktif
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl text-blue-900">{systemStats.activeUsers}</div>
                  <p className="text-xs text-blue-600 mt-1">+12% dari bulan lalu</p>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center text-green-700">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Total Donasi
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl text-green-900">{systemStats.totalDonations}</div>
                  <p className="text-xs text-green-600 mt-1">+18% dari bulan lalu</p>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-lg border-0 bg-gradient-to-br from-orange-50 to-orange-100">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center text-orange-700">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Total Transaksi
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl text-orange-900">{systemStats.totalTransactions}</div>
                  <p className="text-xs text-orange-600 mt-1">+8% dari bulan lalu</p>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-lg border-0 bg-gradient-to-br from-purple-50 to-purple-100">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center text-purple-700">
                    <Activity className="w-4 h-4 mr-2" />
                    Server Uptime
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl text-purple-900">{systemStats.uptime}</div>
                  <p className="text-xs text-purple-600 mt-1">Sangat stabil</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="rounded-2xl shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-green-800">Kreator Teratas Bulan Ini</CardTitle>
                  <CardDescription>Berdasarkan revenue dan jumlah karya</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topCreators.map((creator, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-orange-50 rounded-xl">
                        <div>
                          <p className="text-gray-900">{creator.name}</p>
                          <p className="text-sm text-gray-600">{creator.works} karya</p>
                        </div>
                        <div className="text-right">
                          <p className="text-green-700">{creator.revenue}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-green-800">Kesehatan Server</CardTitle>
                  <CardDescription>Monitoring infrastruktur RUPA</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-700">CPU Usage</span>
                      <span className="text-sm text-green-700">45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-700">Memory</span>
                      <span className="text-sm text-green-700">62%</span>
                    </div>
                    <Progress value={62} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-700">Database</span>
                      <span className="text-sm text-green-700">38%</span>
                    </div>
                    <Progress value={38} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-700">API Response Time</span>
                      <span className="text-sm text-green-700">142ms</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="rounded-2xl shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-green-800">Manajemen Pengguna & Kreator</CardTitle>
                <CardDescription>Kelola, verifikasi, atau suspend akun pengguna</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-orange-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-orange-400 flex items-center justify-center text-white">
                        BS
                      </div>
                      <div>
                        <p className="text-gray-900">Budi Santoso</p>
                        <p className="text-sm text-gray-600">Kreator Aktif • 45 karya</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Verified</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-orange-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white">
                        SR
                      </div>
                      <div>
                        <p className="text-gray-900">Siti Rahayu</p>
                        <p className="text-sm text-gray-600">Kreator Aktif • 38 karya</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Verified</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-orange-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center text-white">
                        AF
                      </div>
                      <div>
                        <p className="text-gray-900">Ahmad Fauzi</p>
                        <p className="text-sm text-gray-600">Member Baru • 2 karya</p>
                      </div>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="rounded-2xl shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-green-800">Analitik Donasi & Transaksi</CardTitle>
                <CardDescription>Visualisasi performa platform RUPA</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                    <div className="text-sm text-green-700 mb-2">Total Donasi Hari Ini</div>
                    <div className="text-2xl text-green-900">Rp 4,250,000</div>
                    <div className="text-xs text-green-600 mt-1">↑ 15% dari kemarin</div>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                    <div className="text-sm text-orange-700 mb-2">Transaksi Hari Ini</div>
                    <div className="text-2xl text-orange-900">127</div>
                    <div className="text-xs text-orange-600 mt-1">↑ 8% dari kemarin</div>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-sm text-blue-700 mb-2">Lisensi Diajukan</div>
                    <div className="text-2xl text-blue-900">18</div>
                    <div className="text-xs text-blue-600 mt-1">↑ 22% dari kemarin</div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                  <h3 className="text-purple-900 mb-4">Kategori Karya Terpopuler</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-purple-700">Daur Ulang Plastik</span>
                        <span className="text-sm text-purple-900">42%</span>
                      </div>
                      <Progress value={42} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-purple-700">Produk Ramah Lingkungan</span>
                        <span className="text-sm text-purple-900">28%</span>
                      </div>
                      <Progress value={28} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-purple-700">Inovasi Energi</span>
                        <span className="text-sm text-purple-900">18%</span>
                      </div>
                      <Progress value={18} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-purple-700">Teknologi Pertanian</span>
                        <span className="text-sm text-purple-900">12%</span>
                      </div>
                      <Progress value={12} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* License Applications Tab */}
          <TabsContent value="licenses" className="space-y-6">
            <Alert className="bg-blue-50 border-blue-200 rounded-xl">
              <FileText className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                Kelola semua pengajuan lisensi untuk karya anak bangsa. Pastikan setiap proses lisensi berjalan lancar dan transparan. 📄
              </AlertDescription>
            </Alert>

            <Card className="rounded-2xl shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-green-800">License Application Reports</CardTitle>
                <CardDescription>Daftar lengkap pengajuan lisensi dari berbagai organisasi dan perusahaan</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pemohon</TableHead>
                      <TableHead>Nama Produk</TableHead>
                      <TableHead>License Type</TableHead>
                      <TableHead>Tanggal Pengajuan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {licenseApplications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">{app.applicant}</TableCell>
                        <TableCell>{app.productName}</TableCell>
                        <TableCell>
                          <Badge 
                            className={
                              app.licenseType === 'Commercial License' 
                                ? 'bg-purple-100 text-purple-800' 
                                : app.licenseType === 'Educational License'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                            }
                          >
                            {app.licenseType}
                          </Badge>
                        </TableCell>
                        <TableCell>{app.submittedDate}</TableCell>
                        <TableCell>
                          {app.status === 'Pending' && (
                            <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                          )}
                          {app.status === 'Processing' && (
                            <Badge className="bg-blue-100 text-blue-800">Processing</Badge>
                          )}
                          {app.status === 'Completed' && (
                            <Badge className="bg-green-100 text-green-800">Completed</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {app.status !== 'Completed' && (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="rounded-lg hover:bg-blue-50"
                                  onClick={() => handleProcessApplication(app.id)}
                                  disabled={app.status === 'Processing'}
                                >
                                  <Play className="w-3 h-3 mr-1" />
                                  Process
                                </Button>
                                <Button 
                                  size="sm" 
                                  className="rounded-lg bg-green-500 hover:bg-green-600"
                                  onClick={() => handleMarkAsCompleted(app.id)}
                                >
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Mark as Completed
                                </Button>
                              </>
                            )}
                            {app.status === 'Completed' && (
                              <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Selesai
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="rounded-2xl shadow-lg border-0 bg-gradient-to-br from-yellow-50 to-yellow-100">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center text-yellow-700">
                    <FileText className="w-4 h-4 mr-2" />
                    Pending Applications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl text-yellow-900">
                    {licenseApplications.filter(app => app.status === 'Pending').length}
                  </div>
                  <p className="text-xs text-yellow-600 mt-1">Memerlukan tinjauan</p>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-lg border-0 bg-gradient-to-br from-blue-50 to-blue-100">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center text-blue-700">
                    <Play className="w-4 h-4 mr-2" />
                    Processing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl text-blue-900">
                    {licenseApplications.filter(app => app.status === 'Processing').length}
                  </div>
                  <p className="text-xs text-blue-600 mt-1">Sedang diproses</p>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center text-green-700">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Completed
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl text-green-900">
                    {licenseApplications.filter(app => app.status === 'Completed').length}
                  </div>
                  <p className="text-xs text-green-600 mt-1">Sudah selesai</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card className="rounded-2xl shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-green-800">Konten Dilaporkan</CardTitle>
                <CardDescription>Kelola laporan dari pengguna</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Jenis Laporan</TableHead>
                      <TableHead>Kreator</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>{report.type}</TableCell>
                        <TableCell>{report.creator}</TableCell>
                        <TableCell>{report.date}</TableCell>
                        <TableCell>
                          {report.status === 'Pending' ? (
                            <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                          ) : (
                            <Badge className="bg-green-100 text-green-800">Resolved</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline" className="rounded-lg">
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="rounded-2xl shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-green-800 flex items-center">
                    <Server className="w-5 h-5 mr-2" />
                    Backup & Security
                  </CardTitle>
                  <CardDescription>Pengaturan keamanan sistem</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full rounded-xl bg-green-500 hover:bg-green-600">
                    <Database className="w-4 h-4 mr-2" />
                    Backup Database Sekarang
                  </Button>
                  <Button variant="outline" className="w-full rounded-xl">
                    View Security Logs
                  </Button>
                  <Button variant="outline" className="w-full rounded-xl">
                    API Key Management
                  </Button>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-green-800 flex items-center">
                    <Megaphone className="w-5 h-5 mr-2" />
                    Pengumuman Platform
                  </CardTitle>
                  <CardDescription>Kirim pesan ke semua pengguna</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                    <Megaphone className="w-4 h-4 mr-2" />
                    Buat Pengumuman Baru
                  </Button>
                  <Button variant="outline" className="w-full rounded-xl">
                    Lihat Riwayat Pengumuman
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="rounded-2xl shadow-lg border-0 bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
              <CardHeader>
                <CardTitle className="text-red-800">Mode Maintenance</CardTitle>
                <CardDescription className="text-red-700">
                  Aktifkan mode maintenance untuk melakukan pembaruan sistem
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" className="rounded-xl">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Enable Maintenance Mode
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
