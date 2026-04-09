import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import type { UserData } from '../../App';
import { Settings, Mail, User, Lock, Globe, Shield, LogOut, AlertTriangle, FileText, Upload } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Checkbox } from '../ui/checkbox';
import { Textarea } from '../ui/textarea';
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
  DialogFooter,
} from '../ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { getTranslation, languageNames, type Language } from '../../utils/translations';

type SettingsPageProps = {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  onLogout: () => void;
};

export function SettingsPage({ userData, updateUserData, onLogout }: SettingsPageProps) {
  const [email, setEmail] = useState(userData.email);
  const [username, setUsername] = useState(userData.username);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showUsernameDialog, setShowUsernameDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // User Report Form States
  const [reportTitle, setReportTitle] = useState('');
  const [contentType, setContentType] = useState('');
  const [contentUrl, setContentUrl] = useState('');
  const [reportCategories, setReportCategories] = useState({
    copyright: false,
    inappropriate: false,
    hateSpeech: false,
    violence: false,
    misinformation: false,
    spam: false,
    other: false,
  });
  const [otherCategory, setOtherCategory] = useState('');
  const [reasonForReport, setReasonForReport] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [signature, setSignature] = useState('');

  // Get current language from userData, default to 'id'
  const currentLang = (userData.language as Language) || 'id';
  const t = getTranslation(currentLang);

  const handleEmailChange = () => {
    if (!passwordConfirm) {
      toast.error(t.enterPasswordToConfirm);
      return;
    }

    updateUserData({ email });
    toast.success(t.emailUpdated);
    setShowEmailDialog(false);
    setPasswordConfirm('');
  };

  const handleUsernameChange = () => {
    if (!passwordConfirm) {
      toast.error(t.enterPasswordToConfirm);
      return;
    }

    updateUserData({ username });
    toast.success(t.usernameUpdated);
    setShowUsernameDialog(false);
    setPasswordConfirm('');
  };

  const handlePasswordChange = () => {
    if (!newPassword || !confirmNewPassword) {
      toast.error(t.fillAllFields);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error(t.passwordNotMatch);
      return;
    }

    if (newPassword.length < 6) {
      toast.error(t.passwordMinLength);
      return;
    }

    toast.success(t.passwordChanged);
    setShowPasswordDialog(false);
    setNewPassword('');
    setConfirmNewPassword('');
  };

  const handleLanguageChange = (value: string) => {
    updateUserData({ language: value });
    const newLang = value as Language;
    const newTranslations = getTranslation(newLang);
    toast.success(`${newTranslations.languageChanged} ${languageNames[newLang]}! 🌍`);
  };

  const handleReportSubmit = () => {
    // Validation
    if (!reportTitle || !contentType || !contentUrl || !reasonForReport || !signature) {
      toast.error(t.fillReportFields);
      return;
    }

    // Check if at least one category is selected
    const hasCategory = Object.values(reportCategories).some(val => val === true);
    if (!hasCategory) {
      toast.error(t.selectAtLeastOneCategory);
      return;
    }

    // If "other" is checked, make sure they filled in the description
    if (reportCategories.other && !otherCategory) {
      toast.error(t.fillReportFields);
      return;
    }

    // Submit report (in real app, this would send to backend)
    toast.success(t.reportSubmitted);

    // Reset form
    setReportTitle('');
    setContentType('');
    setContentUrl('');
    setReportCategories({
      copyright: false,
      inappropriate: false,
      hateSpeech: false,
      violence: false,
      misinformation: false,
      spam: false,
      other: false,
    });
    setOtherCategory('');
    setReasonForReport('');
    setEvidenceUrl('');
    setSignature('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-green-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-xl">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl text-gray-800">{t.settings}</h1>
              <p className="text-gray-600">{t.settingsDesc}</p>
            </div>
          </div>

          {/* Account Settings */}
          <Card className="rounded-2xl shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center gap-2">
                <User className="w-5 h-5" />
                {t.accountInfo}
              </CardTitle>
              <CardDescription>
                {t.accountInfoDesc}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-700 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {t.email}
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-xl border-gray-200 focus:border-green-400 focus:ring-green-400"
                  />
                  <Button
                    onClick={() => setShowEmailDialog(true)}
                    disabled={email === userData.email}
                    className="rounded-xl bg-gradient-to-r from-green-500 to-orange-500 hover:from-green-600 hover:to-orange-600"
                  >
                    {t.change}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {t.username}
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="rounded-xl border-gray-200 focus:border-green-400 focus:ring-green-400"
                  />
                  <Button
                    onClick={() => setShowUsernameDialog(true)}
                    disabled={username === userData.username}
                    className="rounded-xl bg-gradient-to-r from-green-500 to-orange-500 hover:from-green-600 hover:to-orange-600"
                  >
                    {t.change}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Language Settings */}
          <Card className="rounded-2xl shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                {t.language}
              </CardTitle>
              <CardDescription>
                {t.languageDesc}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={currentLang} onValueChange={handleLanguageChange}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Pilih bahasa / Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="id">🇮🇩 Bahasa Indonesia</SelectItem>
                  <SelectItem value="en">🇺🇸 English</SelectItem>
                  <SelectItem value="zh">🇨🇳 中文 (Chinese)</SelectItem>
                  <SelectItem value="ja">🇯🇵 日本語 (Japanese)</SelectItem>
                  <SelectItem value="ko">🇰🇷 한국어 (Korean)</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="rounded-2xl shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                {t.security}
              </CardTitle>
              <CardDescription>
                {t.securityDesc}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => setShowPasswordDialog(true)}
                variant="outline"
                className="w-full rounded-xl border-gray-300 hover:bg-green-50"
              >
                <Lock className="w-4 h-4 mr-2" />
                {t.changePassword}
              </Button>
              <Button
                onClick={() => setShowLogoutDialog(true)}
                variant="outline"
                className="w-full rounded-xl border-red-300 text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                {t.logout}
              </Button>
            </CardContent>
          </Card>

          {/* User Report */}
          <Card className="rounded-2xl shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                {t.userReport}
              </CardTitle>
              <CardDescription>
                {t.userReportDesc}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Report Information */}
              <div className="space-y-4">
                <h3 className="text-lg text-gray-800 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {t.reportInformation}
                </h3>
                
                <div className="space-y-2">
                  <Label className="text-gray-700">{t.reportTitle}</Label>
                  <Input
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    placeholder={t.reportTitlePlaceholder}
                    className="rounded-xl border-gray-200 focus:border-green-400 focus:ring-green-400"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700">{t.dateOfSubmission}</Label>
                    <Input
                      type="date"
                      value={new Date().toISOString().split('T')[0]}
                      disabled
                      className="rounded-xl border-gray-200 bg-gray-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700">{t.reportedBy}</Label>
                    <Input
                      value={userData.username}
                      disabled
                      className="rounded-xl border-gray-200 bg-gray-50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700">{t.contentType}</Label>
                  <Select value={contentType} onValueChange={setContentType}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder={t.selectContentType} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">{t.text}</SelectItem>
                      <SelectItem value="image">{t.image}</SelectItem>
                      <SelectItem value="video">{t.video}</SelectItem>
                      <SelectItem value="other">{t.other}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700">{t.contentUrl}</Label>
                  <Input
                    value={contentUrl}
                    onChange={(e) => setContentUrl(e.target.value)}
                    placeholder={t.contentUrlPlaceholder}
                    className="rounded-xl border-gray-200 focus:border-green-400 focus:ring-green-400"
                  />
                </div>
              </div>

              {/* Report Categories */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg text-gray-800 mb-1">{t.reportCategories}</h3>
                  <p className="text-sm text-gray-600">{t.reportCategoriesDesc}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="copyright"
                      checked={reportCategories.copyright}
                      onCheckedChange={(checked) => 
                        setReportCategories({ ...reportCategories, copyright: checked as boolean })
                      }
                    />
                    <label htmlFor="copyright" className="text-sm text-gray-700 cursor-pointer">
                      {t.copyrightInfringement}
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="inappropriate"
                      checked={reportCategories.inappropriate}
                      onCheckedChange={(checked) => 
                        setReportCategories({ ...reportCategories, inappropriate: checked as boolean })
                      }
                    />
                    <label htmlFor="inappropriate" className="text-sm text-gray-700 cursor-pointer">
                      {t.inappropriateContent}
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hateSpeech"
                      checked={reportCategories.hateSpeech}
                      onCheckedChange={(checked) => 
                        setReportCategories({ ...reportCategories, hateSpeech: checked as boolean })
                      }
                    />
                    <label htmlFor="hateSpeech" className="text-sm text-gray-700 cursor-pointer">
                      {t.hateSpeech}
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="violence"
                      checked={reportCategories.violence}
                      onCheckedChange={(checked) => 
                        setReportCategories({ ...reportCategories, violence: checked as boolean })
                      }
                    />
                    <label htmlFor="violence" className="text-sm text-gray-700 cursor-pointer">
                      {t.violence}
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="misinformation"
                      checked={reportCategories.misinformation}
                      onCheckedChange={(checked) => 
                        setReportCategories({ ...reportCategories, misinformation: checked as boolean })
                      }
                    />
                    <label htmlFor="misinformation" className="text-sm text-gray-700 cursor-pointer">
                      {t.misinformation}
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="spam"
                      checked={reportCategories.spam}
                      onCheckedChange={(checked) => 
                        setReportCategories({ ...reportCategories, spam: checked as boolean })
                      }
                    />
                    <label htmlFor="spam" className="text-sm text-gray-700 cursor-pointer">
                      {t.spam}
                    </label>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="other"
                        checked={reportCategories.other}
                        onCheckedChange={(checked) => 
                          setReportCategories({ ...reportCategories, other: checked as boolean })
                        }
                      />
                      <label htmlFor="other" className="text-sm text-gray-700 cursor-pointer">
                        {t.otherCategory}
                      </label>
                    </div>
                    {reportCategories.other && (
                      <Input
                        value={otherCategory}
                        onChange={(e) => setOtherCategory(e.target.value)}
                        placeholder={t.otherCategoryPlaceholder}
                        className="rounded-xl border-gray-200 focus:border-green-400 focus:ring-green-400 ml-6"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Reason for Report */}
              <div className="space-y-2">
                <Label className="text-gray-700">{t.reasonForReport}</Label>
                <Textarea
                  value={reasonForReport}
                  onChange={(e) => setReasonForReport(e.target.value)}
                  placeholder={t.reasonPlaceholder}
                  className="rounded-xl border-gray-200 focus:border-green-400 focus:ring-green-400 min-h-[120px]"
                />
              </div>

              {/* Supporting Evidence */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg text-gray-800 mb-1">{t.supportingEvidence}</h3>
                  <p className="text-sm text-gray-600">{t.supportingEvidenceDesc}</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700">{t.addUrlLink}</Label>
                  <Input
                    value={evidenceUrl}
                    onChange={(e) => setEvidenceUrl(e.target.value)}
                    placeholder={t.urlLinkPlaceholder}
                    className="rounded-xl border-gray-200 focus:border-green-400 focus:ring-green-400"
                  />
                </div>
              </div>

              {/* Reporter's Declaration */}
              <div className="space-y-3 bg-amber-50 p-4 rounded-xl border border-amber-200">
                <h3 className="text-lg text-gray-800">{t.reporterDeclaration}</h3>
                <p className="text-sm text-gray-700">
                  {t.declarationText}
                </p>
                <div className="space-y-2">
                  <Label className="text-gray-700">{t.signature}</Label>
                  <Input
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    placeholder={t.signaturePlaceholder}
                    className="rounded-xl border-gray-200 focus:border-green-400 focus:ring-green-400 bg-white"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleReportSubmit}
                className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                {t.submitReport}
              </Button>
            </CardContent>
          </Card>

          {/* About RUPA */}
          <Card className="rounded-2xl shadow-lg border-0 bg-gradient-to-r from-green-500 to-orange-500 text-white">
            <CardContent className="p-8">
              <h3 className="text-2xl mb-3">{t.aboutRupa}</h3>
              <p className="text-white/90 mb-4">
                {t.aboutRupaDesc}
              </p>
              <div className="text-sm text-white/80">
                <p>{t.version}: 1.0.0</p>
                <p>© 2025 RUPA. All rights reserved.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Email Change Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>{t.confirmEmailChange}</DialogTitle>
            <DialogDescription>
              {t.confirmEmailChangeDesc}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>{t.newEmail}</Label>
              <Input value={email} disabled className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>{t.password}</Label>
              <Input
                type="password"
                placeholder={t.enterPassword}
                className="rounded-xl"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowEmailDialog(false);
                setPasswordConfirm('');
              }}
              className="rounded-xl"
            >
              {t.cancel}
            </Button>
            <Button
              onClick={handleEmailChange}
              className="rounded-xl bg-gradient-to-r from-green-500 to-orange-500 hover:from-green-600 hover:to-orange-600"
            >
              {t.confirm}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Username Change Dialog */}
      <Dialog open={showUsernameDialog} onOpenChange={setShowUsernameDialog}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>{t.confirmUsernameChange}</DialogTitle>
            <DialogDescription>
              {t.confirmUsernameChangeDesc}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>{t.newUsername}</Label>
              <Input value={username} disabled className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>{t.password}</Label>
              <Input
                type="password"
                placeholder={t.enterPassword}
                className="rounded-xl"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowUsernameDialog(false);
                setPasswordConfirm('');
              }}
              className="rounded-xl"
            >
              {t.cancel}
            </Button>
            <Button
              onClick={handleUsernameChange}
              className="rounded-xl bg-gradient-to-r from-green-500 to-orange-500 hover:from-green-600 hover:to-orange-600"
            >
              {t.confirm}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password Change Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>{t.changePasswordTitle}</DialogTitle>
            <DialogDescription>
              {t.changePasswordDesc}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>{t.newPassword}</Label>
              <Input
                type="password"
                placeholder={t.enterNewPassword}
                className="rounded-xl"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t.confirmPassword}</Label>
              <Input
                type="password"
                placeholder={t.confirmPasswordPlaceholder}
                className="rounded-xl"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowPasswordDialog(false);
                setNewPassword('');
                setConfirmNewPassword('');
              }}
              className="rounded-xl"
            >
              {t.cancel}
            </Button>
            <Button
              onClick={handlePasswordChange}
              className="rounded-xl bg-gradient-to-r from-green-500 to-orange-500 hover:from-green-600 hover:to-orange-600"
            >
              {t.changePassword}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>{t.confirmLogout}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.confirmLogoutDesc}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">{t.cancel}</AlertDialogCancel>
            <AlertDialogAction
              onClick={onLogout}
              className="rounded-xl bg-red-500 hover:bg-red-600"
            >
              {t.yesLogout}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
