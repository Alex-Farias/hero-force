import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Folder, FileText, Activity, AlertCircle, User as UserIcon } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { UsersService } from '../../services/users.service';
import type { User } from '../../types/auth';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateProjectFormData) => Promise<void>;
}

const projectSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  description: z.string().min(3, 'Descrição deve ter pelo menos 3 caracteres'),
  status: z.enum(['pending', 'in_progress', 'completed']),
  goals: z.string().optional(),
  user: z.string().optional(),
});
export type CreateProjectFormData = z.infer<typeof projectSchema>;

export function CreateProjectModal({ isOpen, onClose, onSave }: CreateProjectModalProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [users, setUsers] = useState<User[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'pending',
      goals: '',
      user: '',
    },
  });

  useEffect(() => {
    if (isOpen && isAdmin) {
      UsersService.getAll().then(setUsers).catch(console.error);
    }
  }, [isOpen, isAdmin]);

  const handleFormSubmit = async (data: CreateProjectFormData) => {
    const payload = {
      ...data,
      user: data.user ? Number(data.user) : undefined,
    };
    await onSave(payload as any);
    reset();
  };

  if(!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1a1d24] border border-secondary/20 rounded-xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-secondary/20">
          <h2 className="text-xl font-bold text-main flex items-center gap-2">
            <Folder className="text-primary" />
            Novo Projeto
          </h2>
          <button onClick={onClose} className="text-muted hover:text-main transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6 overflow-y-auto">
          <div className={`grid grid-cols-1 ${isAdmin ? 'md:grid-cols-4' : 'md:grid-cols-3'} gap-4`}>
            <div className={`${isAdmin ? 'md:col-span-2' : 'md:col-span-2'} space-y-2`}>
              <label className="text-sm font-medium text-muted flex items-center gap-2">
                <Folder size={16} /> Nome do Projeto
              </label>
              <input
                {...register('name')}
                className={`w-full bg-secondary/10 border rounded-lg px-4 py-2.5 text-main focus:outline-none focus:ring-2 transition-all ${
                  errors.name 
                    ? 'border-negative focus:ring-negative/50' 
                    : 'border-secondary/20 focus:ring-primary/50 focus:border-primary'
                }`}
                placeholder="Ex: Iniciativa Vingadores"
              />
              {errors.name && (
                <span className="text-xs text-negative">{errors.name.message}</span>
              )}
            </div>

            {isAdmin && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted flex items-center gap-2">
                  <UserIcon size={16} /> Herói (Responsável)
                </label>
                <select
                  {...register('user')}
                  className="w-full bg-secondary/10 border border-secondary/20 rounded-lg px-4 py-2.5 text-main focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary appearance-none cursor-pointer"
                >
                  <option value="">Selecione um herói...</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted flex items-center gap-2">
                <Activity size={16} /> Status Inicial
              </label>
              <select
                {...register('status')}
                className="w-full bg-secondary/10 border border-secondary/20 rounded-lg px-4 py-2.5 text-main focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary appearance-none cursor-pointer"
              >
                <option value="pending">Pendente</option>
                <option value="in_progress">Em Andamento</option>
                <option value="completed">Concluído</option>
              </select>
              {errors.status && (
                <span className="text-xs text-negative">{errors.status.message}</span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted flex items-center gap-2">
              <FileText size={16} /> Descrição
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className={`w-full bg-secondary/10 border rounded-lg px-4 py-2.5 text-main focus:outline-none focus:ring-2 transition-all resize-none ${
                errors.description 
                  ? 'border-negative focus:ring-negative/50' 
                  : 'border-secondary/20 focus:ring-primary/50 focus:border-primary'
              }`}
              placeholder="Descreva o objetivo do projeto..."
            />
            {errors.description && (
              <span className="text-xs text-negative">{errors.description.message}</span>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted flex items-center gap-2">
              <AlertCircle size={16} /> Metas
            </label>
            <textarea
              {...register('goals')}
              rows={3}
              className={`w-full bg-secondary/10 border rounded-lg px-4 py-2.5 text-main focus:outline-none focus:ring-2 transition-all resize-none ${
                errors.goals 
                  ? 'border-negative focus:ring-negative/50' 
                  : 'border-secondary/20 focus:ring-primary/50 focus:border-primary'
              }`}
              placeholder="Metas do projeto..."
            />
            {errors.goals && (
              <span className="text-xs text-negative">{errors.goals.message}</span>
            )}
          </div>

          <div className="pt-4 border-t border-secondary/20 flex justify-end gap-3">
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
              className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Criando...
                </>
              ) : (
                'Criar Projeto'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
