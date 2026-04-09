import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Sparkles, Lock, User, Shield, Mail, Phone } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import type { UserData } from '../App';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

type LoginPageProps = {
  onLogin: (userType: 'admin' | 'user', userData: UserData) => void;
  onGoToSignUp: () => void;
};

export function LoginPage({ onLogin, onGoToSignUp }: LoginPageProps) {
  const [adminForm, setAdminForm] = useState({ adminId: '', password: '' });
  const [userForm, setUserForm] = useState({ username: '', password: '' });
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordForm, setForgotPasswordForm] = useState({ email: '', phone: '' });

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!adminForm.adminId || !adminForm.password) {
      toast.error('Mohon lengkapi semua field!');
      return;
    }

    toast.success('Selamat datang kembali, Penjaga RUPA 🌱! Siap memastikan karya anak bangsa terus bersinar hari ini?', {
      duration: 4000,
    });

    setTimeout(() => {
      onLogin('admin', {
        username: adminForm.adminId,
        email: `${adminForm.adminId}@rupa.admin`,
        fullName: 'Admin RUPA',
      });
    }, 1000);
  };

  const handleUserLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userForm.username || !userForm.password) {
      toast.error('Mohon lengkapi semua field!');
      return;
    }

    toast.success(`Selamat datang kembali, ${userForm.username}! Apa yang mau kalian lihat hari ini?`, {
      duration: 4000,
    });

    setTimeout(() => {
      onLogin('user', {
        username: userForm.username,
        email: `${userForm.username}@example.com`,
        fullName: userForm.username,
      });
    }, 1000);
  };

  const handleForgotPassword = () => {
    if (!forgotPasswordForm.email || !forgotPasswordForm.phone) {
      toast.error('Mohon lengkapi email dan nomor telepon!');
      return;
    }

    toast.success('Kode OTP telah dikirim ke email dan nomor telepon Anda!');
    setShowForgotPassword(false);
    setForgotPasswordForm({ email: '', phone: '' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-orange-400 flex items-center justify-center shadow-lg">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-green-800">Selamat Datang di RUPA</CardTitle>
          <CardDescription className="text-orange-700">
            Ruang Unggulan Para Anak Bangsa
          </CardDescription>
          <p className="text-sm text-gray-600">
            Pilih jenis akun untuk masuk
          </p>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="user" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 rounded-xl bg-gray-100">
              <TabsTrigger value="user" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-orange-500 data-[state=active]:text-white">
                <User className="w-4 h-4 mr-2" />
                Member 🧑‍🎨
              </TabsTrigger>
              <TabsTrigger value="admin" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-orange-500 data-[state=active]:text-white">
                <Shield className="w-4 h-4 mr-2" />
                Admin 👩‍💼
              </TabsTrigger>
            </TabsList>

            <TabsContent value="user" className="space-y-4">
              <form onSubmit={handleUserLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="user-username" className="text-gray-700">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="user-username"
                      type="text"
                      placeholder="Masukkan username"
                      className="pl-10 rounded-xl border-gray-200 focus:border-green-400 focus:ring-green-400"
                      value={userForm.username}
                      onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="user-password" className="text-gray-700">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="user-password"
                      type="password"
                      placeholder="Masukkan password"
                      className="pl-10 rounded-xl border-gray-200 focus:border-green-400 focus:ring-green-400"
                      value={userForm.password}
                      onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-orange-600 hover:text-orange-700 hover:underline"
                  >
                    Lupa Password?
                  </button>
                </div>

                <Button 
                  type="submit" 
                  className="w-full rounded-xl bg-gradient-to-r from-green-500 to-orange-500 hover:from-green-600 hover:to-orange-600 text-white shadow-lg"
                >
                  Masuk sebagai Member
                </Button>
              </form>

              <div className="text-center pt-2">
                <p className="text-sm text-gray-600">
                  Belum punya akun?{' '}
                  <button
                    onClick={onGoToSignUp}
                    className="text-green-600 hover:text-green-700 hover:underline"
                  >
                    Daftar sekarang
                  </button>
                </p>
              </div>
            </TabsContent>

            <TabsContent value="admin" className="space-y-4">
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-id" className="text-gray-700">Admin ID</Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="admin-id"
                      type="text"
                      placeholder="Masukkan Admin ID"
                      className="pl-10 rounded-xl border-gray-200 focus:border-green-400 focus:ring-green-400"
                      value={adminForm.adminId}
                      onChange={(e) => setAdminForm({ ...adminForm, adminId: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin-password" className="text-gray-700">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="admin-password"
                      type="password"
                      placeholder="Masukkan password"
                      className="pl-10 rounded-xl border-gray-200 focus:border-green-400 focus:ring-green-400"
                      value={adminForm.password}
                      onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg"
                >
                  Masuk sebagai Admin
                </Button>
              </form>

              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-4">
                <p className="text-sm text-green-800 text-center">
                  🔒 Area khusus untuk administrator RUPA
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-green-800">Lupa Password</DialogTitle>
            <DialogDescription>
              Masukkan email dan nomor telepon untuk menerima kode OTP
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="forgot-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="email@example.com"
                  className="pl-10 rounded-xl"
                  value={forgotPasswordForm.email}
                  onChange={(e) => setForgotPasswordForm({ ...forgotPasswordForm, email: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="forgot-phone">Nomor Telepon</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="forgot-phone"
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  className="pl-10 rounded-xl"
                  value={forgotPasswordForm.phone}
                  onChange={(e) => setForgotPasswordForm({ ...forgotPasswordForm, phone: e.target.value })}
                />
              </div>
            </div>
            <Button 
              onClick={handleForgotPassword}
              className="w-full rounded-xl bg-gradient-to-r from-green-500 to-orange-500 hover:from-green-600 hover:to-orange-600"
            >
              Kirim Kode OTP
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
