import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { z } from 'zod';
import { LoginForm } from '@/features/auth/LoginForm';
import { useRegister } from '@/hooks/useRegister';

const emailSchema = z.string().trim().email({ message: 'Неверный формат email' });
const passwordSchema = z.string().min(6, { message: 'Пароль должен быть не менее 6 символов' });

export default function Auth() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { setAuthFromLogin } = useAuth();

  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  const registerMutation = useRegister({
    onSuccess: (data) => {
      setAuthFromLogin(data);
      toast({ title: 'Успешно', description: 'Регистрация завершена. Вы вошли в систему.' });
      navigate('/');
    },
    onError: (error) => {
      toast({ variant: 'destructive', title: 'Ошибка', description: error.message || 'Ошибка регистрации' });
    },
  });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailResult = emailSchema.safeParse(signupEmail);
    if (!emailResult.success) {
      toast({ variant: 'destructive', title: 'Ошибка', description: emailResult.error.errors[0].message });
      return;
    }

    const passwordResult = passwordSchema.safeParse(signupPassword);
    if (!passwordResult.success) {
      toast({ variant: 'destructive', title: 'Ошибка', description: passwordResult.error.errors[0].message });
      return;
    }

    if (!signupName.trim()) {
      toast({ variant: 'destructive', title: 'Ошибка', description: 'Введите имя' });
      return;
    }

    registerMutation.mutate({
      username: signupEmail,
      email: signupEmail,
      password: signupPassword,
      name: signupName,
    });

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">B</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-heading">BUHGALTERIJA</CardTitle>
          <CardDescription>Система управления бухгалтерией</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">

            <TabsContent value="login">
              <LoginForm />
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Имя</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Ваше имя"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    disabled={registerMutation.isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="email@example.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    disabled={registerMutation.isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">{t('password')}</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showSignupPassword ? 'text' : 'password'}
                      placeholder="Минимум 6 символов"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      disabled={registerMutation.isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                    >
                      {showSignupPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={registerMutation.isLoading}>
                  {registerMutation.isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Зарегистрироваться
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}