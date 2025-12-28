import { LayoutDashboard, Settings, Users } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import clsx from 'clsx';

interface SidebarProps {
  isOpen: boolean;
}

export function Sidebar({ isOpen }: SidebarProps) {
  const location = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.email?.includes('admin') || true;

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    ...(isAdmin ? [{ icon: Users, label: 'Usuários', path: '/users' }] : []),
    { icon: Settings, label: 'Configurações', path: '/settings' },
  ];

  return (
    <aside 
      className={clsx(
        "bg-primary border-r border-secondary/20 transition-all duration-300 ease-in-out flex flex-col",
        isOpen ? "w-64" : "w-0 md:w-20 overflow-hidden"
      )}
    >
      <nav className="flex-1 py-6 px-3 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
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