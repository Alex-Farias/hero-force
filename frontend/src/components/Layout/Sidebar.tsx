import { LayoutDashboard, Settings, Users, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Role } from '../../types/auth';
import clsx from 'clsx';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.role === Role.ADMIN;

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    ...(isAdmin ? [{ icon: Users, label: 'Heróis', path: '/users' }] : []),
    { icon: Settings, label: 'Configurações', path: '/settings' },
  ];

  return (
    <aside 
      className={clsx(
        "bg-primary border-r border-secondary/20 transition-all duration-300 ease-in-out flex flex-col h-full",
        "absolute md:relative z-50",
        isOpen 
          ? "w-full md:w-64" 
          : "w-0 border-r-0 md:border-r md:w-20 overflow-hidden"
      )}
    >
      <div className="md:hidden flex justify-end p-4">
        <button onClick={onClose} className="text-muted hover:text-main p-2">
          <X size={24} />
        </button>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => {
                if (window.innerWidth < 768) {
                  onClose();
                }
              }}
              className={clsx(
                "flex items-center gap-3 px-3 py-3 rounded-lg transition-colors group",
                isActive 
                  ? "bg-aux text-gray-900 shadow-lg shadow-aux/20" 
                  : "text-muted hover:bg-secondary/30 hover:text-main"
              )}
              title={!isOpen ? item.label : undefined}
            >
              <item.icon size={20} className={clsx(!isOpen && "mx-auto")} />
              <span className={clsx("font-medium whitespace-nowrap", !isOpen && "hidden md:hidden")}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}