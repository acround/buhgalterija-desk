import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '@/hooks/useLogin';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { z } from 'zod';

const usernameSchema = z.string().trim().min(1, { message: 'Введите email или логин' });
const passwordSchema = z.string().min(6, { message: 'Пароль должен быть не менее 6 символов' });

export function LoginForm() {
    const { t } = useLanguage();
    const { toast } = useToast();
    const navigate = useNavigate();
    const { setAuthFromLogin } = useAuth();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const login = useLogin({
        onSuccess: (data) => {
            setAuthFromLogin(data);
            toast({ title: 'Успешно', description: 'Вы вошли в систему' });
            navigate('/');
        },
        onError: (error) => {
            toast({ variant: 'destructive', title: 'Ошибка', description: error.message || 'Ошибка входа' });
        },
    });

    const onSubmit = (event: FormEvent) => {
        event.preventDefault();

        const usernameResult = usernameSchema.safeParse(username);
        if (!usernameResult.success) {
            toast({ variant: 'destructive', title: 'Ошибка', description: usernameResult.error.errors[0].message });
            return;
        }

        const passwordResult = passwordSchema.safeParse(password);
        if (!passwordResult.success) {
            toast({ variant: 'destructive', title: 'Ошибка', description: passwordResult.error.errors[0].message });
            return;
        }

        login.mutate({ username, password });
    };

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="login-username">Email или логин</Label>
                <Input
                    id="login-username"
                    type="text"
                    placeholder="email@example.com"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={login.isPending}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="login-password">{t('password')}</Label>
                <div className="relative">
                    <Input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={login.isPending}
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                </div>
            </div>
            <Button type="submit" className="w-full" disabled={login.isPending}>
                {login.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('login')}
            </Button>
        </form>
    );
}