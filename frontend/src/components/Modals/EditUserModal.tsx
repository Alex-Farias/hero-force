import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Save, User as UserIcon, Mail, Shield, Activity } from 'lucide-react';
import { type User } from '../../mocks/factory';

const userSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  role: z.enum(['Admin', 'User', 'Guest']),
  status: z.enum(['Active', 'Inactive']),
});

export type UserFormData = z.infer<typeof userSchema>;

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UserFormData) => void;
  user: User | null;
}

export function EditUserModal({ isOpen, onClose, onSave, user }: EditUserModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'User',
      status: 'Active',
    },
  });

  useEffect(() => {
    if(user) {
      reset({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      });
    }
  }, [user, reset]);

  if(!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1a1d24] border border-secondary/20 rounded-xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-secondary/20">
          <h2 className="text-xl font-bold text-main flex items-center gap-2">
            <EditIcon className="text-primary" />
            Editar Usuário
          </h2>
          <button onClick={onClose} className="text-muted hover:text-main transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSave)} className="p-6 space-y-6 overflow-y-auto">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted flex items-center gap-2">
              <UserIcon size={16} /> Nome Completo
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted flex items-center gap-2">
                <Shield size={16} /> Nível de Acesso
              </label>
              <select
                {...register('role')}
                className="w-full bg-secondary/10 border border-secondary/20 rounded-lg px-4 py-2.5 text-main focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary appearance-none cursor-pointer"
              >
                <option value="Admin">Admin</option>
                <option value="User">User</option>
                <option value="Guest">Guest</option>
              </select>
              {errors.role && (
                <span className="text-xs text-negative">{errors.role.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted flex items-center gap-2">
                <Activity size={16} /> Status
              </label>
              <select
                {...register('status')}
                className="w-full bg-secondary/10 border border-secondary/20 rounded-lg px-4 py-2.5 text-main focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary appearance-none cursor-pointer"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              {errors.status && (
                <span className="text-xs text-negative">{errors.status.message}</span>
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
            onClick={handleSubmit(onSave)}
            disabled={isSubmitting}
            className="px-6 py-2 rounded-lg bg-positive text-white font-medium shadow-lg shadow-positive/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={18} />
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
}

function EditIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
    </svg>
  );
}
