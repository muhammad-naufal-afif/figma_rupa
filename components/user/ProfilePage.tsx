import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import type { UserData } from '../../App';
import { User, Mail, Phone, MapPin, Calendar, Palette, Camera, Upload } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { getTranslation, type Language } from '../../utils/translations';

type ProfilePageProps = {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
};

export function ProfilePage({ userData, updateUserData }: ProfilePageProps) {
  const t = getTranslation((userData.language as Language) || 'id');
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: userData.fullName || '',
    phoneNumber: userData.phoneNumber || '',
    address: userData.address || '',
    gender: userData.gender || '',
    age: userData.age || '',
  });
  const [profilePhotoUrl, setProfilePhotoUrl] = useState('');
  const [headerImageUrl, setHeaderImageUrl] = useState('');
  const profileInputRef = useRef<HTMLInputElement>(null);
  const headerInputRef = useRef<HTMLInputElement>(null);

  const isProfileComplete = userData.fullName && userData.phoneNumber && userData.address && userData.gender && userData.age;

  const handleSave = () => {
    updateUserData(formData);
    setIsEditing(false);
    toast.success(t.profileUpdated);
  };

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t.fileTooLarge);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        updateUserData({ profilePicture: result });
        toast.success(t.profilePhotoUpdated);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHeaderImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t.fileTooLarge);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        updateUserData({ headerImage: result });
        toast.success(t.headerUpdated);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfilePhotoUrlSubmit = () => {
    if (profilePhotoUrl.trim()) {
      updateUserData({ profilePicture: profilePhotoUrl });
      setProfilePhotoUrl('');
      toast.success(t.profilePhotoUpdated);
    }
  };

  const handleHeaderImageUrlSubmit = () => {
    if (headerImageUrl.trim()) {
      updateUserData({ headerImage: headerImageUrl });
      setHeaderImageUrl('');
      toast.success(t.headerUpdated);
    }
  };

  const themeColors = [
    { 
      name: 'Hijau', 
      value: 'green', 
      gradient: 'from-green-400 to-green-600',
      cssVars: {
        primary: '#16a34a', // green-600
        primaryLight: '#22c55e', // green-500
        secondary: '#4ade80', // green-400
        accent: '#86efac' // green-300
      }
    },
    { 
      name: 'Oranye', 
      value: 'orange', 
      gradient: 'from-orange-400 to-orange-600',
      cssVars: {
        primary: '#ea580c', // orange-600
        primaryLight: '#f97316', // orange-500
        secondary: '#fb923c', // orange-400
        accent: '#fdba74' // orange-300
      }
    },
    { 
      name: 'Biru', 
      value: 'blue', 
      gradient: 'from-blue-400 to-blue-600',
      cssVars: {
        primary: '#2563eb', // blue-600
        primaryLight: '#3b82f6', // blue-500
        secondary: '#60a5fa', // blue-400
        accent: '#93c5fd' // blue-300
      }
    },
    { 
      name: 'Ungu', 
      value: 'purple', 
      gradient: 'from-purple-400 to-purple-600',
      cssVars: {
        primary: '#9333ea', // purple-600
        primaryLight: '#a855f7', // purple-500
        secondary: '#c084fc', // purple-400
        accent: '#d8b4fe' // purple-300
      }
    },
    { 
      name: 'Merah Muda', 
      value: 'pink', 
      gradient: 'from-pink-400 to-pink-600',
      cssVars: {
        primary: '#db2777', // pink-600
        primaryLight: '#ec4899', // pink-500
        secondary: '#f472b6', // pink-400
        accent: '#f9a8d4' // pink-300
      }
    },
  ];

  const applyThemeColors = (color: string) => {
    const theme = themeColors.find(c => c.value === color);
    if (theme) {
      const root = document.documentElement;
      root.style.setProperty('--theme-primary', theme.cssVars.primary);
      root.style.setProperty('--theme-primary-light', theme.cssVars.primaryLight);
      root.style.setProperty('--theme-secondary', theme.cssVars.secondary);
      root.style.setProperty('--theme-accent', theme.cssVars.accent);
      root.setAttribute('data-theme', color);
    }
  };

  // Apply theme on mount and when userData.themeColor changes
  useEffect(() => {
    if (userData.themeColor) {
      applyThemeColors(userData.themeColor);
    }
  }, [userData.themeColor]);

  const handleThemeChange = (color: string) => {
    updateUserData({ themeColor: color });
    applyThemeColors(color);
    toast.success(`${t.themeChanged} ${themeColors.find(c => c.value === color)?.name}! 🎨`);
  };

  const currentTheme = themeColors.find(c => c.value === userData.themeColor) || themeColors[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-green-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Header */}
          <Card className="rounded-2xl shadow-lg border-0 overflow-hidden">
            <div className="relative group">
              {userData.headerImage ? (
                <div 
                  className="h-32 bg-cover bg-center"
                  style={{ backgroundImage: `url(${userData.headerImage})` }}
                ></div>
              ) : (
                <div 
                  className="h-32 bg-gradient-to-r"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${currentTheme.cssVars.primaryLight}, ${currentTheme.cssVars.secondary})`
                  }}
                ></div>
              )}
              
              {/* Header Image Upload Button */}
              <Dialog>
                <DialogTrigger asChild>
                  <button 
                    className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-700 rounded-full p-2 shadow-lg transition-all opacity-0 group-hover:opacity-100"
                    title={t.changeHeader}
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                </DialogTrigger>
                <DialogContent className="rounded-2xl">
                  <DialogHeader>
                    <DialogTitle>{t.changeHeader}</DialogTitle>
                    <DialogDescription>
                      {t.uploadDesc}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label>{t.uploadImage}</Label>
                      <div className="mt-2">
                        <input
                          ref={headerInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleHeaderImageChange}
                          className="hidden"
                        />
                        <Button
                          onClick={() => headerInputRef.current?.click()}
                          variant="outline"
                          className="w-full rounded-xl"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {t.chooseImage}
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">{t.maxFileSize}</p>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-500">{t.or}</span>
                      </div>
                    </div>

                    <div>
                      <Label>{t.imageUrl}</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          placeholder="https://example.com/image.jpg"
                          value={headerImageUrl}
                          onChange={(e) => setHeaderImageUrl(e.target.value)}
                          className="rounded-xl"
                        />
                        <Button
                          onClick={handleHeaderImageUrlSubmit}
                          className="rounded-xl text-white"
                          style={{ backgroundColor: currentTheme.cssVars.primary }}
                        >
                          {t.use}
                        </Button>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <CardContent className="relative pt-16 pb-8">
              <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                <div className="relative group">
                  <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
                    {userData.profilePicture ? (
                      <AvatarImage src={userData.profilePicture} alt={userData.username} />
                    ) : (
                      <AvatarFallback 
                        className="text-white text-3xl"
                        style={{
                          backgroundImage: `linear-gradient(to bottom right, ${currentTheme.cssVars.secondary}, ${currentTheme.cssVars.primary})`
                        }}
                      >
                        {userData.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  
                  {/* Profile Photo Upload Button */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <button 
                        className="absolute bottom-0 right-0 bg-white hover:bg-gray-50 text-gray-700 rounded-full p-2 shadow-lg border-2 border-white transition-all"
                        title={t.changeProfilePhoto}
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="rounded-2xl">
                      <DialogHeader>
                        <DialogTitle>{t.changeProfilePhoto}</DialogTitle>
                        <DialogDescription>
                          {t.uploadDesc}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div>
                          <Label>{t.uploadImage}</Label>
                          <div className="mt-2">
                            <input
                              ref={profileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleProfilePhotoChange}
                              className="hidden"
                            />
                            <Button
                              onClick={() => profileInputRef.current?.click()}
                              variant="outline"
                              className="w-full rounded-xl"
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              {t.chooseImage}
                            </Button>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">{t.maxFileSize}</p>
                        </div>
                        
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-gray-500">{t.or}</span>
                          </div>
                        </div>

                        <div>
                          <Label>{t.imageUrl}</Label>
                          <div className="flex gap-2 mt-2">
                            <Input
                              placeholder="https://example.com/avatar.jpg"
                              value={profilePhotoUrl}
                              onChange={(e) => setProfilePhotoUrl(e.target.value)}
                              className="rounded-xl"
                            />
                            <Button
                              onClick={handleProfilePhotoUrlSubmit}
                              className="rounded-xl text-white"
                              style={{ backgroundColor: currentTheme.cssVars.primary }}
                            >
                              {t.use}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              
              <div className="text-center mt-4">
                <h2 className="text-2xl text-gray-800">{userData.fullName || userData.username}</h2>
                <p className="text-gray-600">@{userData.username}</p>
                <p className="text-sm text-gray-500 mt-1">{userData.email}</p>
              </div>

              {!isProfileComplete && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-center">
                  <p className="text-yellow-800 text-sm">
                    ⚠️ {t.completeProfile}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Profile Information */}
          <Card className="rounded-2xl shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-green-800">{t.profileInfo}</CardTitle>
              <Button
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className="rounded-xl text-white"
                style={{
                  backgroundImage: `linear-gradient(to right, ${currentTheme.cssVars.primaryLight}, ${currentTheme.cssVars.secondary})`
                }}
              >
                {isEditing ? t.save : t.editProfile}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-700 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Username
                  </Label>
                  <Input
                    value={userData.username}
                    disabled
                    className="rounded-xl bg-gray-100"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <Input
                    value={userData.email}
                    disabled
                    className="rounded-xl bg-gray-100"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Nama Lengkap
                  </Label>
                  <Input
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Masukkan nama lengkap"
                    className={`rounded-xl ${isEditing ? 'border-green-300' : 'bg-gray-100'}`}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Nomor Telepon
                  </Label>
                  <Input
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    disabled={!isEditing}
                    placeholder="08xxxxxxxxxx"
                    className={`rounded-xl ${isEditing ? 'border-green-300' : 'bg-gray-100'}`}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Jenis Kelamin
                  </Label>
                  {isEditing ? (
                    <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Pilih jenis kelamin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                        <SelectItem value="Perempuan">Perempuan</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      value={formData.gender}
                      disabled
                      placeholder="Pilih jenis kelamin"
                      className="rounded-xl bg-gray-100"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Usia
                  </Label>
                  <Input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Masukkan usia"
                    className={`rounded-xl ${isEditing ? 'border-green-300' : 'bg-gray-100'}`}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="text-gray-700 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Alamat
                  </Label>
                  <Input
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Masukkan alamat lengkap"
                    className={`rounded-xl ${isEditing ? 'border-green-300' : 'bg-gray-100'}`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Theme Customization */}
          <Card className="rounded-2xl shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center gap-2">
                <Palette className="w-5 h-5" />
                {t.themeCustomization}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{t.chooseTheme}</p>
              <div className="grid grid-cols-5 gap-4">
                {themeColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => handleThemeChange(color.value)}
                    className={`h-20 rounded-xl bg-gradient-to-br ${color.gradient} hover:scale-105 transition-transform shadow-lg ${
                      userData.themeColor === color.value ? 'ring-4 ring-offset-2 ring-green-500' : ''
                    }`}
                    title={color.name}
                  >
                    <span className="sr-only">{color.name}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
