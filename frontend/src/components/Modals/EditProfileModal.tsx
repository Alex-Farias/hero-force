import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Loader2, Save, User as UserIcon, Mail, Lock, Shield, Building, Calendar, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';

const profileSchema = z.object({
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  const { user, signOut } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors, isSubmitting } 
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    }
  });

  useEffect(() => {
    if (user && isOpen) {
      reset({
        name: user.name,
        email: user.email,
        password: '',
      });
      setShowLogoutDialog(false);
    }
  }, [user, isOpen, reset]);

  if(!isOpen || !user) return null;

  async function handleUpdateProfile(data: ProfileFormData) {
    if (!user) return;

    try {
      const payload = { ...data };

      if (!payload.password) {
        delete payload.password;
      } else if (payload.password.length < 6) {
        toast.error('A senha deve ter pelo menos 6 caracteres', {
            style: { borderColor: '#DB504A', color: '#DB504A' }
        });
        return;
      }
      
      setShowLogoutDialog(true);
    } catch (error: any) {
      if (error.response?.status === 409) {
        toast.error('Este email já está em uso.', {
            style: { borderColor: '#DB504A', color: '#DB504A' }
        });
      } else if (error.response?.status === 403 || error.response?.status === 401) {
        toast.error('Sessão expirada ou sem permissão. Faça login novamente.', {
            style: { borderColor: '#DB504A', color: '#DB504A' }
        });
      } else {
        toast.error('Erro ao atualizar perfil. Tente novamente.', {
            style: { borderColor: '#DB504A', color: '#DB504A' }
        });
      }
    }
  }

  if (showLogoutDialog) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white dark:bg-[#1a1d24] border border-secondary/20 rounded-xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 p-6 text-center">
          <div className="mx-auto w-12 h-12 bg-positive/10 rounded-full flex items-center justify-center mb-4 text-positive">
            <Save size={24} />
          </div>
          <h2 className="text-xl font-bold text-main mb-2">Perfil Atualizado!</h2>
          <p className="text-muted mb-6">
            Suas informações foram salvas com sucesso. Para garantir a segurança e aplicar todas as alterações, é necessário fazer login novamente.
          </p>
          <button
            onClick={() => {
              localStorage.clear();
              onClose();
              signOut();
            }}
            className="w-full py-2.5 rounded-lg bg-primary text-white font-medium shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <LogOut size={18} />
            Continuar para Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1a1d24] border border-secondary/20 rounded-xl w-full max-w-4xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-secondary/20 flex justify-between items-center">
          <h2 className="text-xl font-bold text-main flex items-center gap-2">
            <UserIcon className="text-primary" size={24} />
            Editar Perfil
          </h2>
          <button 
            onClick={onClose}
            className="text-muted hover:text-main hover:bg-secondary/10 p-2 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form 
          onSubmit={handleSubmit(handleUpdateProfile, (errors) => {
            toast.error("Por favor, verifique os campos inválidos no formulário.", {
                style: { borderColor: '#DB504A', color: '#DB504A' }
            });
            console.error("Validation errors:", errors);
          })} 
          className="p-6 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted flex items-center gap-2">
                <UserIcon size={16} /> Nome
              </label>
              <input
                {...register('name')}
                className={`w-full bg-secondary/10 border rounded-lg px-4 py-2.5 text-main focus:outline-none focus:ring-2 transition-all ${
                  errors.name 
                    ? 'border-negative focus:ring-negative/50' 
                    : 'border-secondary/20 focus:ring-primary/50 focus:border-primary'
                }`}
                placeholder="Seu nome"
              />
              {errors.name && (
                <p className="text-xs text-negative">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted flex items-center gap-2">
                <Shield size={16} /> Função (Role)
              </label>
              <input
                value={user.role === 'admin' ? 'Administrador' : 'Herói'}
                disabled
                className="w-full bg-secondary/5 border border-secondary/20 rounded-lg px-4 py-2.5 text-muted cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted flex items-center gap-2">
                <Mail size={16} /> Email
              </label>
              <input
                {...register('email')}
                className={`w-full bg-secondary/10 border rounded-lg px-4 py-2.5 text-main focus:outline-none focus:ring-2 transition-all ${
                  errors.email 
                    ? 'border-negative focus:ring-negative/50' 
                    : 'border-secondary/20 focus:ring-primary/50 focus:border-primary'
                }`}
                placeholder="seu@email.com"
              />
              {errors.email && (
                <p className="text-xs text-negative">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted flex items-center gap-2">
                <Lock size={16} /> Nova Senha (Opcional)
              </label>
              <input
                type="password"
                {...register('password')}
                className={`w-full bg-secondary/10 border rounded-lg px-4 py-2.5 text-main focus:outline-none focus:ring-2 transition-all ${
                  errors.password 
                    ? 'border-negative focus:ring-negative/50' 
                    : 'border-secondary/20 focus:ring-primary/50 focus:border-primary'
                }`}
                placeholder="Deixe em branco para manter a atual"
              />
              {errors.password && (
                <p className="text-xs text-negative">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-muted flex items-center gap-2">
                <Building size={16} /> Departamento / Persona
              </label>
              <input
                value={user.persona || 'Não atribuído'}
                disabled
                className="w-full bg-secondary/5 border border-secondary/20 rounded-lg px-4 py-2.5 text-muted cursor-not-allowed"
              />
            </div>
          </div>

          <div className="px-6 py-4 -mx-6 bg-secondary/5 border-t border-secondary/20 grid grid-cols-2 gap-4 text-xs text-muted mt-6">
            <div className="flex items-center gap-2">
              <Calendar size={14} />
              <span>Criado em: {new Date(user.createdAt).toLocaleDateString('pt-BR')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} />
              <span>Atualizado em: {new Date(user.updatedAt).toLocaleDateString('pt-BR')}</span>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-secondary/20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-secondary/20 text-muted hover:bg-secondary/10 hover:text-main transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 rounded-lg bg-positive text-white font-medium shadow-lg shadow-positive/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}