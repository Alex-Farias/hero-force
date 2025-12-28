import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';

const profileSchema = z.object({
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  const { user } = useAuth();
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    }
  });

  if(!isOpen) return null;

  async function handleUpdateProfile(_data: ProfileFormData) {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Perfil atualizado com sucesso!');
      onClose();
    } catch (error) {
      toast.error('Erro ao atualizar perfil.');
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-secondary w-full max-w-md rounded-xl shadow-2xl border border-secondary/20 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-secondary/20 flex justify-between items-center bg-secondary/50">
          <h2 className="text-xl font-bold text-main">Editar Perfil</h2>
          <button 
            onClick={onClose}
            className="text-muted hover:text-main hover:bg-secondary/50 p-2 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleUpdateProfile)} className="p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-muted mb-1">Nome</label>
            <input
              {...register('name')}
              id="name"
              type="text"
              className="w-full bg-primary border border-secondary/20 rounded-lg px-4 py-2 text-main focus:ring-2 focus:ring-aux focus:outline-none transition-all"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-negative">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-muted mb-1">Email</label>
            <input
              {...register('email')}
              id="email"
              type="email"
              className="w-full bg-primary border border-secondary/20 rounded-lg px-4 py-2 text-main focus:ring-2 focus:ring-aux focus:outline-none transition-all"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-negative">{errors.email.message}</p>
            )}
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-muted hover:text-main hover:bg-secondary/50 rounded-lg transition-colors text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-aux hover:bg-aux/90 text-gray-900 rounded-lg flex items-center gap-2 transition-colors text-sm font-medium disabled:opacity-70 shadow-lg shadow-aux/20"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4" />
                  Salvando...
                </>
              ) : (
                'Salvar Alterações'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}