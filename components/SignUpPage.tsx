import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Sparkles, Mail, Lock, User, Chrome, Send } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import type { UserData } from '../App';

type SignUpPageProps = {
  onSignUp: (data: UserData) => void;
  onBackToLogin: () => void;
};

export function SignUpPage({ onSignUp, onBackToLogin }: SignUpPageProps) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Password tidak cocok!');
      return;
    }

    if (!formData.username || !formData.email || !formData.password) {
      toast.error('Mohon lengkapi semua field!');
      return;
    }

    toast.success('Selamat bergabung, Karya anak bangsa merupakan harta suatu negara! 🇮🇩', {
      duration: 5000,
    });

    setTimeout(() => {
      onSignUp({
        username: formData.username,
        email: formData.email,
      });
    }, 1500);
  };

  const handleSocialSignUp = (provider: string) => {
    toast.success(`Mendaftar dengan ${provider}...`);
    setTimeout(() => {
      onSignUp({
        username: `user_${provider.toLowerCase()}`,
        email: `user@${provider.toLowerCase()}.com`,
      });
    }, 1000);
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
          <CardTitle className="text-green-800">Bergabung dengan RUPA</CardTitle>
          <CardDescription className="text-orange-700">
            Ruang Unggulan Para Anak Bangsa
          </CardDescription>
          <p className="text-sm text-gray-600">
            Platform untuk karya inovasi sosial & lingkungan anak Indonesia
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-700">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Masukkan username"
                  className="pl-10 rounded-xl border-gray-200 focus:border-green-400 focus:ring-green-400"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  className="pl-10 rounded-xl border-gray-200 focus:border-green-400 focus:ring-green-400"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Masukkan password"
                  className="pl-10 rounded-xl border-gray-200 focus:border-green-400 focus:ring-green-400"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-700">Konfirmasi Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Konfirmasi password"
                  className="pl-10 rounded-xl border-gray-200 focus:border-green-400 focus:ring-green-400"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full rounded-xl bg-gradient-to-r from-green-500 to-orange-500 hover:from-green-600 hover:to-orange-600 text-white shadow-lg"
            >
              Daftar Sekarang
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Atau daftar dengan</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl border-gray-300 hover:bg-green-50"
              onClick={() => handleSocialSignUp('Google')}
            >
              <Chrome className="mr-2 h-4 w-4" />
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              className="rounded-xl border-gray-300 hover:bg-green-50"
              onClick={() => handleSocialSignUp('Yahoo')}
            >
              <Send className="mr-2 h-4 w-4" />
              Yahoo
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Sudah punya akun?{' '}
              <button
                onClick={onBackToLogin}
                className="text-green-600 hover:text-green-700 hover:underline"
              >
                Masuk di sini
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
