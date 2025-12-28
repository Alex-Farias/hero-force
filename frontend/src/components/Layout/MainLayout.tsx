import { useState } from 'react';
import type { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex flex-col h-screen bg-primary text-main overflow-hidden transition-colors duration-300">
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className="flex flex-1 overflow-hidden relative">
            <Sidebar isOpen={isSidebarOpen} />
            <main className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-thin scrollbar-thumb-secondary scrollbar-track-transparent">
                <div className="mx-auto max-w-7xl animate-in fade-in duration-500">
                  {children}
                </div>
            </main>
        </div>
    </div>
  );
}