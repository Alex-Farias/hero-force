import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '../services/api';

const registerSchema = z.object({
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function Register() {
  const navigate = useNavigate();
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  async function handleRegister(data: RegisterFormData) {
    try {
      await api.post('/auth/register', data);
      toast.success('Cadastro realizado com sucesso!');
      navigate('/login');
    } catch (error) {
      toast.error('Erro ao criar conta. Tente novamente.');
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary px-4 transition-colors duration-300">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white dark:bg-[#1a1d24] p-8 shadow-2xl border border-secondary/20">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            Crie sua conta 🚀
          </h2>
          <p className="mt-2 text-sm text-muted">
            Junte-se ao Hero Force hoje mesmo
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(handleRegister)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="sr-only">Nome</label>
              <input
                {...register('name')}
                id="name"
                type="text"
                autoComplete="name"
                className="relative block w-full rounded-lg border border-secondary/20 bg-secondary/10 py-3 px-4 text-main placeholder-muted focus:border-aux focus:ring-2 focus:ring-aux focus:outline-none transition-all sm:text-sm"
                placeholder="Nome completo"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-negative">{errors.name.message}</p>
              )}
            </div>

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
                autoComplete="new-password"
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
                Cadastrando...
              </>
            ) : (
              'Cadastrar'
            )}
          </button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-400">
            Já tem uma conta?{' '}
            <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}