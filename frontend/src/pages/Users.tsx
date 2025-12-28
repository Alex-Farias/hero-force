import { useState, useEffect } from 'react';
import { Search, Filter, Trash2, Edit, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { toast } from 'sonner';
import { MockFactory, type User } from '../mocks/factory';
import { useSortableData } from '../hooks/useSortableData';
import { ConfirmationModal } from '../components/Modals/ConfirmationModal';
import { EditUserModal, type UserFormData } from '../components/Modals/EditUserModal';

export function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const { items: sortedUsers, requestSort, sortConfig } = useSortableData(users);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const mockUsers = MockFactory.generateUsers(12);
      setUsers(mockUsers);
    } catch (error) {
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  }

  const filteredUsers = sortedUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSort = (key: keyof User) => {
    requestSort(key);
  };

  const confirmDelete = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if(userToDelete) {
      setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
      toast.success(`Usuário ${userToDelete.name} removido com sucesso!`);
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  const openEditModal = (user: User) => {
    setUserToEdit(user);
    setIsEditModalOpen(true);
  };

  const handleSaveUser = (data: UserFormData) => {
    if(userToEdit) {
      setUsers(prev => prev.map(u => 
        u.id === userToEdit.id ? { ...u, ...data } : u
      ));
      toast.success(`Usuário ${data.name} atualizado com sucesso!`);
      setIsEditModalOpen(false);
      setUserToEdit(null);
    }
  };

  const getSortIcon = (key: keyof User) => {
    if(!sortConfig || sortConfig.key !== key) { return <ArrowUpDown size={14} className="text-muted/50" /> }
    return sortConfig.direction === 'asc' ? <ArrowUp size={14} className="text-primary" /> : <ArrowDown size={14} className="text-primary" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-main">Usuários</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted h-4 w-4" />
            <input 
              type="text" 
              placeholder="Buscar usuários..." 
              className="w-full sm:w-64 bg-secondary/30 border border-secondary/20 rounded-lg pl-10 pr-4 py-2 text-sm text-main placeholder-muted focus:ring-2 focus:ring-aux focus:outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-2 bg-secondary/30 border border-secondary/20 rounded-lg text-muted hover:text-main hover:bg-secondary/50 transition-colors">
            <Filter size={20} />
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
                    Nome {getSortIcon('name')}
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
                  className="px-6 py-4 cursor-pointer hover:bg-secondary/40 transition-colors group select-none"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-2">
                    Status {getSortIcon('status')}
                  </div>
                </th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary/10">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted animate-pulse">
                    Carregando dados simulados...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted">
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-secondary/20 transition-colors group">
                    <td className="px-6 py-4 font-medium text-main flex items-center gap-3">
                      <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full ring-2 ring-secondary/30" />
                      {user.name}
                    </td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                        user.role === 'Admin' 
                          ? 'bg-aux/10 text-aux border-aux/20' 
                          : 'bg-secondary/40 text-muted border-secondary/20'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                        user.status === 'Active' 
                          ? 'bg-positive/10 text-positive border-positive/20' 
                          : 'bg-negative/10 text-negative border-negative/20'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                        <button 
                          onClick={() => openEditModal(user)}
                          className="p-2 rounded-lg hover:bg-aux/10 hover:text-aux transition-colors" 
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => confirmDelete(user)}
                          className="p-2 rounded-lg hover:bg-negative/10 hover:text-negative transition-colors" 
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
    </div>
  );
}