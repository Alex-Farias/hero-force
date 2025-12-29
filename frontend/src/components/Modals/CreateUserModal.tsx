import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Save, User as UserIcon, Mail, Shield, Lock, UserPlus, Building } from 'lucide-react';
import { Loader2 } from 'lucide-react';

const createUserSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  role: z.enum(['admin', 'hero']),
  persona: z.string().optional(),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateUserFormData) => Promise<void>;
}

export function CreateUserModal({ isOpen, onClose, onSave }: CreateUserModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'hero',
      persona: '',
    },
  });

  const handleFormSubmit = async (data: CreateUserFormData) => {
    await onSave(data);
    reset();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1a1d24] border border-secondary/20 rounded-xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-secondary/20">
          <h2 className="text-xl font-bold text-main flex items-center gap-2">
            <UserPlus className="text-primary" />
            Novo Herói
          </h2>
          <button onClick={onClose} className="text-muted hover:text-main transition-colors p-2 rounded-lg hover:bg-secondary/10">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-muted flex items-center gap-2">
                <UserIcon size={16} /> Nome do Herói
              </label>
              <input
                {...register('name')}
                className={`w-full bg-secondary/10 border rounded-lg px-4 py-2.5 text-main focus:outline-none focus:ring-2 transition-all ${
                  errors.name 
                    ? 'border-negative focus:ring-negative/50' 
                    : 'border-secondary/20 focus:ring-primary/50 focus:border-primary'
                }`}
                placeholder="Ex: Tony Stark"
              />
              {errors.name && (
                <span className="text-xs text-negative">{errors.name.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted flex items-center gap-2">
                <Shield size={16} /> Nível de Acesso
              </label>
              <select
                {...register('role')}
                className="w-full bg-secondary/10 border border-secondary/20 rounded-lg px-4 py-2.5 text-main focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary appearance-none cursor-pointer"
              >
                <option value="admin">Admin</option>
                <option value="hero">Hero</option>
              </select>
              {errors.role && (
                <span className="text-xs text-negative">{errors.role.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted flex items-center gap-2">
                <Mail size={16} /> Email Corporativo
              </label>
              <input
                {...register('email')}
                className={`w-full bg-secondary/10 border rounded-lg px-4 py-2.5 text-main focus:outline-none focus:ring-2 transition-all ${
                  errors.email 
                    ? 'border-negative focus:ring-negative/50' 
                    : 'border-secondary/20 focus:ring-primary/50 focus:border-primary'
                }`}
                placeholder="Ex: tony@stark.com"
              />
              {errors.email && (
                <span className="text-xs text-negative">{errors.email.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted flex items-center gap-2">
                <Building size={16} /> Persona
              </label>
              <input
                {...register('persona')}
                className="w-full bg-secondary/10 border border-secondary/20 rounded-lg px-4 py-2.5 text-main focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                placeholder="Ex: Homem de Ferro"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted flex items-center gap-2">
                <Lock size={16} /> Senha
              </label>
              <input
                type="password"
                {...register('password')}
                className={`w-full bg-secondary/10 border rounded-lg px-4 py-2.5 text-main focus:outline-none focus:ring-2 transition-all ${
                  errors.password 
                    ? 'border-negative focus:ring-negative/50' 
                    : 'border-secondary/20 focus:ring-primary/50 focus:border-primary'
                }`}
                placeholder="••••••••"
              />
              {errors.password && (
                <span className="text-xs text-negative">{errors.password.message}</span>
              )}
            </div>


          </div>
        </form>

        <div className="p-6 border-t border-secondary/20 flex justify-end gap-3 bg-secondary/5 rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-secondary/20 text-muted hover:bg-secondary/10 hover:text-main transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit(handleFormSubmit)}
            disabled={isSubmitting}
            className="px-6 py-2 rounded-lg bg-positive text-white font-medium shadow-lg shadow-positive/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Criar Usuário
          </button>
        </div>
      </div>
    </div>
  );
}
