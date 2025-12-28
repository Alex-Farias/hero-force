import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function Login() {
  const { signIn } = useAuth();
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function handleLogin(data: LoginFormData) {
    try {
      await signIn(data);
      toast.success('Login realizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao fazer login. Verifique suas credenciais.');
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary px-4 transition-colors duration-300">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white dark:bg-[#1a1d24] p-8 shadow-2xl border border-secondary/20">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            Hero Force
          </h2>
          <p className="mt-2 text-sm text-muted">
            Faça login para acessar o painel
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(handleLogin)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                {...register('email')}
                id="email"
                type="email"
                autoComplete="email"
                className="relative block w-full rounded-lg border border-secondary/20 bg-secondary/10 py-3 px-4 text-main placeholder-muted focus:border-aux focus:ring-2 focus:ring-aux focus:outline-none transition-all sm:text-sm"
                placeholder="Endereço de email"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-negative">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="sr-only">Senha</label>
              <input
                {...register('password')}
                id="password"
                type="password"
                autoComplete="current-password"
                className="relative block w-full rounded-lg border border-secondary/20 bg-secondary/10 py-3 px-4 text-main placeholder-muted focus:border-aux focus:ring-2 focus:ring-aux focus:outline-none transition-all sm:text-sm"
                placeholder="Senha"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-negative">{errors.password.message}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="group relative flex w-full justify-center items-center gap-2 rounded-lg bg-aux py-3 px-4 text-sm font-medium text-gray-900 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-aux focus:ring-offset-2 focus:ring-offset-primary disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-lg shadow-aux/20"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin h-4 w-4" />
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        <div className="text-center">
          <p className="text-sm text-muted">
            Não tem uma conta?{' '}
            <Link to="/register" className="font-medium text-aux hover:text-aux/80 transition-colors">
              Registre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}