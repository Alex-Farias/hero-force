import { useTheme } from '../contexts/ThemeContext';
import { Moon, Sun, Monitor } from 'lucide-react';
import clsx from 'clsx';

export function Settings() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-main">Configurações</h1>
        <p className="text-muted mt-2">Gerencie suas preferências de visualização e conta.</p>
      </div>

      <div className="bg-secondary/10 rounded-xl p-6 border border-secondary/20">
        <h2 className="text-xl font-semibold text-main mb-4">Aparência</h2>
        <div className="space-y-4">
          <p className="text-sm text-muted">Escolha o tema da interface</p>
          
          <div className="grid grid-cols-3 gap-4 max-w-md">
            <button
              onClick={() => setTheme('light')}
              className={clsx(
                "flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all",
                theme === 'light' 
                  ? "border-aux bg-aux/10 text-aux" 
                  : "border-transparent bg-secondary/20 text-muted hover:bg-secondary/30"
              )}
            >
              <Sun size={24} className="mb-2" />
              <span className="text-sm font-medium">Claro</span>
            </button>

            <button
              onClick={() => setTheme('dark')}
              className={clsx(
                "flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all",
                theme === 'dark' 
                  ? "border-aux bg-aux/10 text-aux" 
                  : "border-transparent bg-secondary/20 text-muted hover:bg-secondary/30"
              )}
            >
              <Moon size={24} className="mb-2" />
              <span className="text-sm font-medium">Escuro</span>
            </button>

            <button
              onClick={() => setTheme('system')}
              className={clsx(
                "flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all",
                theme === 'system' 
                  ? "border-aux bg-aux/10 text-aux" 
                  : "border-transparent bg-secondary/20 text-muted hover:bg-secondary/30"
              )}
            >
              <Monitor size={24} className="mb-2" />
              <span className="text-sm font-medium">Sistema</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
