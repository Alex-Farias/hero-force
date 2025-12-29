import { useState, useEffect } from 'react';
import { Search, Trash2, Edit, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { toast } from 'sonner';
import { type User } from '../mocks/factory';
import { UsersService } from '../services/users.service';
import { useSortableData } from '../hooks/useSortableData';
import { ConfirmationModal } from '../components/Modals/ConfirmationModal';
import { EditUserModal, type UserFormData } from '../components/Modals/EditUserModal';
import { CreateUserModal, type CreateUserFormData } from '../components/Modals/CreateUserModal';

export function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { items: sortedUsers, requestSort, sortConfig } = useSortableData(users);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const data = await UsersService.getAll();
      setUsers(data as unknown as User[]);
    } catch (error) {
      toast.error('Erro ao carregar usuários', {
        style: { borderColor: '#DB504A', color: '#DB504A' }
      });
    } finally {
      setLoading(false);
    }
  }

  const filteredUsers = sortedUsers.filter(user => {
    const lowerTerm = searchTerm.toLowerCase();
    const roleLabel = user.role === 'admin' ? 'administrador' : 'herói';
    const createdAt = new Date(user.createdAt).toLocaleDateString('pt-BR');
    const updatedAt = new Date(user.updatedAt).toLocaleDateString('pt-BR');

    return (
      user.name.toLowerCase().includes(lowerTerm) ||
      user.email.toLowerCase().includes(lowerTerm) ||
      (user.persona?.toLowerCase().includes(lowerTerm)) ||
      roleLabel.includes(lowerTerm) ||
      createdAt.includes(lowerTerm) ||
      updatedAt.includes(lowerTerm)
    );
  });

  const handleSort = (key: keyof User) => {
    requestSort(key);
  };

  const handleCreateUser = async (data: CreateUserFormData) => {
    try {
      await UsersService.create(data);
      await fetchUsers();
      toast.success(`Usuário ${data.name} criado com sucesso!`, {
        style: { borderColor: '#49DCB1', color: '#49DCB1' }
      });
      setIsCreateModalOpen(false);
    } catch (error: any) {
      if (error.response?.status === 409) {
        toast.error('Conflito: Email já está em uso.', {
           style: { borderColor: '#DB504A', color: '#DB504A' }
        });
      } else {
        toast.error('Erro ao criar usuário.', { style: { borderColor: '#DB504A', color: '#DB504A' } });
      }
    }
  };

  const confirmDelete = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if(userToDelete) {
      try {
        await UsersService.delete(userToDelete.id);
        setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
        toast.success(`Usuário ${userToDelete.name} removido com sucesso!`, {
          style: { borderColor: '#49DCB1', color: '#49DCB1' }
        });
      } catch (error) {
        toast.error('Erro ao remover usuário', {
          style: { borderColor: '#DB504A', color: '#DB504A' }
        });
      } finally {
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
      }
    }
  };

  const openEditModal = (user: User) => {
    setUserToEdit(user);
    setIsEditModalOpen(true);
  };

  const handleSaveUser = async (data: UserFormData) => {
    if(userToEdit) {
      try {
        const { isActive: _isActive, ...payload } = data;
        await UsersService.update(userToEdit.id, payload);
        await fetchUsers();
        toast.success(`Usuário ${data.name} atualizado com sucesso!`, {
          style: { borderColor: '#49DCB1', color: '#49DCB1' }
        });
        setIsEditModalOpen(false);
        setUserToEdit(null);
      } catch (error: any) {
        if (error.response?.status === 409) {
          toast.error('Conflito: Email já está em uso.', {
             style: { borderColor: '#DB504A', color: '#DB504A' }
          });
        } else if (error.response?.status === 404) {
          toast.error('Usuário não encontrado.', {
             style: { borderColor: '#DB504A', color: '#DB504A' }
          });
        } else {
          toast.error('Erro ao atualizar usuário.', {
             style: { borderColor: '#DB504A', color: '#DB504A' }
          });
        }
      }
    }
  };

  const getSortIcon = (key: keyof User) => {
    if(!sortConfig || sortConfig.key !== key) { return <ArrowUpDown size={14} className="text-muted/50" /> }
    return sortConfig.direction === 'asc' ? <ArrowUp size={14} className="text-primary" /> : <ArrowDown size={14} className="text-primary" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-main">Heróis</h1>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted h-4 w-4" />
            <input 
              type="text" 
              placeholder="Buscar heróis..." 
              className="w-full bg-secondary/10 border border-secondary/20 rounded-lg pl-10 pr-4 py-2 text-sm text-main focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-aux hover:bg-aux/90 text-gray-900 px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-lg shadow-aux/20 whitespace-nowrap"
          >
            Novo Herói
          </button>
        </div>
      </div>

      <div className="bg-secondary/10 rounded-xl border border-secondary/20 overflow-hidden backdrop-blur-sm shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-muted">
            <thead className="bg-secondary/30 text-main uppercase text-xs font-medium">
              <tr>
                <th 
                  className="px-6 py-4 cursor-pointer hover:bg-secondary/40 transition-colors group select-none"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-2">
                    Herói {getSortIcon('name')}
                  </div>
                </th>
                <th 
                  className="px-6 py-4 cursor-pointer hover:bg-secondary/40 transition-colors group select-none hidden md:table-cell"
                  onClick={() => handleSort('persona')}
                >
                  <div className="flex items-center gap-2">
                    Persona {getSortIcon('persona')}
                  </div>
                </th>
                <th 
                  className="px-6 py-4 cursor-pointer hover:bg-secondary/40 transition-colors group select-none"
                  onClick={() => handleSort('email')}
                >
                  <div className="flex items-center gap-2">
                    Email {getSortIcon('email')}
                  </div>
                </th>
                <th 
                  className="px-6 py-4 cursor-pointer hover:bg-secondary/40 transition-colors group select-none"
                  onClick={() => handleSort('role')}
                >
                  <div className="flex items-center gap-2">
                    Função {getSortIcon('role')}
                  </div>
                </th>
                <th 
                  className="px-6 py-4 cursor-pointer hover:bg-secondary/40 transition-colors group select-none hidden lg:table-cell"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center gap-2">
                    Criado em {getSortIcon('createdAt')}
                  </div>
                </th>
                <th 
                  className="px-6 py-4 cursor-pointer hover:bg-secondary/40 transition-colors group select-none hidden lg:table-cell"
                  onClick={() => handleSort('updatedAt')}
                >
                  <div className="flex items-center gap-2">
                    Atualizado em {getSortIcon('updatedAt')}
                  </div>
                </th>
                <th 
                  className="px-6 py-4 cursor-pointer hover:bg-secondary/40 transition-colors group select-none"
                  onClick={() => handleSort('isActive')}
                >
                  <div className="flex items-center gap-2">
                    Ativo {getSortIcon('isActive')}
                  </div>
                </th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary/10">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-muted animate-pulse">
                    Carregando dados simulados...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-muted">
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-secondary/20 transition-colors group">
                    <td className="px-6 py-4 font-medium text-main">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell text-muted">
                      {user.persona || '-'}
                    </td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                        user.role === 'admin' 
                          ? 'bg-aux/10 text-aux border-aux/20' 
                          : 'bg-secondary/40 text-muted border-secondary/20'
                      }`}>
                        {user.role === 'admin' ? 'Admin' : 'Hero'}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      {new Date(user.updatedAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                        user.isActive 
                          ? 'bg-positive/10 text-positive border-positive/20' 
                          : 'bg-negative/10 text-negative border-negative/20'
                      }`}>
                        {user.isActive ? 'Sim' : 'Não'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right w-24">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                        <button 
                          onClick={() => openEditModal(user)}
                          className="p-2 rounded-lg hover:bg-aux/10 hover:text-aux transition-colors flex-shrink-0" 
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => confirmDelete(user)}
                          className="p-2 rounded-lg hover:bg-negative/10 hover:text-negative transition-colors flex-shrink-0" 
                          title="Excluir"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Excluir Usuário"
        description={`Tem certeza que deseja remover o usuário "${userToDelete?.name}"? Esta ação não pode ser desfeita e removerá todo o acesso do usuário ao sistema.`}
        confirmText="Sim, excluir"
        cancelText="Cancelar"
        variant="danger"
      />

      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveUser}
        user={userToEdit}
      />

      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateUser}
      />
    </div>
  );
}