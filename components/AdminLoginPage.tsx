import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Shield, Lock, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import type { UserData } from '../App';

type AdminLoginPageProps = {
  onLogin: (userType: 'admin', userData: UserData) => void;
  onBackToGuest: () => void;
};

export function AdminLoginPage({ onLogin, onBackToGuest }: AdminLoginPageProps) {
  const [adminForm, setAdminForm] = useState({ adminId: '', password: '' });

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!adminForm.adminId || !adminForm.password) {
      toast.error('Mohon lengkapi semua field!');
      return;
    }

    toast.success('Selamat datang kembali, Penjaga RUPA 🌱! Siap bertugas?', {
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

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-slate-800 text-white">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center shadow-lg border border-slate-600">
              <Shield className="w-8 h-8 text-emerald-400" />
            </div>
          </div>
          <CardTitle className="text-2xl text-emerald-400">Portal Admin RUPA</CardTitle>
          <CardDescription className="text-slate-400">
            Akses terbatas. Hanya untuk staf yang berwenang.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-id" className="text-slate-300">Admin ID</Label>
              <div className="relative">
                <Shield className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
                <Input
                  id="admin-id"
                  type="text"
                  placeholder="Masukkan Admin ID"
                  className="pl-10 rounded-xl bg-slate-900 border-slate-700 text-white focus:border-emerald-400 focus:ring-emerald-400"
                  value={adminForm.adminId}
                  onChange={(e) => setAdminForm({ ...adminForm, adminId: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-password" className="text-slate-300">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="Masukkan password"
                  className="pl-10 rounded-xl bg-slate-900 border-slate-700 text-white focus:border-emerald-400 focus:ring-emerald-400"
                  value={adminForm.password}
                  onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg mt-6"
            >
              Masuk ke Dashboard
            </Button>
          </form>

          <div className="mt-6 text-center">
             <button
                onClick={onBackToGuest}
                className="text-sm text-slate-400 hover:text-white flex items-center justify-center w-full gap-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Beranda Utama
              </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}