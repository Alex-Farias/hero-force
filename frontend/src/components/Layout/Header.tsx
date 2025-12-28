import { Menu, User, LogOut, UserCircle } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { EditProfileModal } from '../Modals/EditProfileModal';

interface HeaderProps {
  toggleSidebar: () => void;
}

export function Header({ toggleSidebar }: HeaderProps) {
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  return (
    <>
      <header className="bg-secondary border-b border-secondary/20 h-16 flex items-center justify-between px-4 shadow-md z-20 relative transition-colors duration-300">
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-secondary/50 text-muted hover:text-main transition-colors"
          >
            <Menu size={32} />
          </button>
        </div>
        
        <div className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-aux to-secondary bg-clip-text text-transparent filter brightness-125">
                Hero Force
            </span>
        </div>

        <div className="relative">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-3 hover:bg-secondary/50 p-2 rounded-full transition-colors"
          >
            <div className="text-right hidden md:block">
              <p className="text-sm font-medium text-main">{user?.name}</p>
              <p className="text-xs text-muted">{user?.email}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-aux flex items-center justify-center text-gray-900 border-2 border-secondary/30">
              <User size={20} />
            </div>
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1a1d24] rounded-md shadow-lg py-1 border border-secondary/20 ring-1 ring-black ring-opacity-5">
              <div className="px-4 py-2 border-b border-secondary/20 md:hidden">
                <p className="text-sm text-main">{user?.name}</p>
                <p className="text-xs text-muted">{user?.email}</p>
              </div>
              
              <button 
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsEditProfileOpen(true);
                }}
                className="flex w-full items-center px-4 py-2 text-sm text-main hover:bg-secondary/10 transition-colors"
              >
                <UserCircle className="mr-3 h-4 w-4" />
                Editar Perfil
              </button>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  signOut();
                }}
                className="flex w-full items-center px-4 py-2 text-sm text-negative hover:bg-secondary/10 transition-colors"
              >
                <LogOut className="mr-3 h-4 w-4" />
                Sair
              </button>
            </div>
          )}
        </div>
      </header>

      <EditProfileModal 
        isOpen={isEditProfileOpen} 
        onClose={() => setIsEditProfileOpen(false)} 
      />
    </>
  );
}