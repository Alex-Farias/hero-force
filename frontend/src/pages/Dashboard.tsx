import { useState, useMemo } from 'react';
import { Folder, Calendar, X, ExternalLink } from 'lucide-react';
import clsx from 'clsx';
import { MockFactory } from '../mocks/factory';

export function Dashboard() {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const projects = useMemo(() => MockFactory.generateProjects(24), []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-main">Dashboard</h1>
        <button className="bg-aux hover:bg-aux/90 text-gray-900 px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-lg shadow-aux/20">
          Novo Projeto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div 
            key={project.id}
            onClick={() => setSelectedProject(project.id)}
            className={clsx(
              "bg-secondary/30 backdrop-blur-sm rounded-xl p-6 border border-secondary/20 cursor-pointer transition-all hover:border-aux/50 hover:shadow-lg hover:shadow-aux/5 group relative",
              selectedProject === project.id && "ring-2 ring-aux"
            )}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-main mb-2">{project.title}</h3>
              <div className="p-2 bg-secondary/50 rounded-lg group-hover:bg-aux/20 group-hover:text-aux transition-colors text-muted">
                <Folder size={24} />
              </div>
            </div>
            
            <p className="text-muted text-sm mb-4 line-clamp-2">{project.description}</p>
            
            <div className="flex items-center justify-between text-xs text-muted mt-auto pt-4 border-t border-secondary/20">
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>{project.date}</span>
              </div>
              <span className={clsx(
                "px-2 py-1 rounded-full font-medium",
                project.status === 'Concluído' ? "bg-positive/10 text-positive" :
                project.status === 'Em Andamento' ? "bg-aux/10 text-aux" :
                "bg-secondary/50 text-muted"
              )}>
                {project.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1a1d24] w-full max-w-2xl rounded-2xl shadow-2xl border border-secondary/20 overflow-hidden animate-in zoom-in-95 duration-200">
            {(() => {
              const project = projects.find(p => p.id === selectedProject);
              if(!project) return null;
              
              return (
                <>
                  <div className="p-6 border-b border-secondary/20 flex justify-between items-center bg-secondary/10">
                    <h2 className="text-2xl font-bold text-main flex items-center gap-3">
                      <Folder className="text-aux" />
                      {project.title}
                    </h2>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedProject(null); }}
                      className="text-muted hover:text-main hover:bg-secondary/20 p-2 rounded-full transition-colors"
                    >
                      <X size={24} />
                    </button>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-secondary/10 p-4 rounded-lg border border-secondary/20">
                        <span className="text-sm text-muted block mb-1">Status</span>
                        <span className="text-main font-medium">{project.status}</span>
                      </div>
                      <div className="bg-secondary/10 p-4 rounded-lg border border-secondary/20">
                        <span className="text-sm text-muted block mb-1">Data de Início</span>
                        <span className="text-main font-medium">{project.date}</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-main mb-2">Descrição</h3>
                      <p className="text-muted leading-relaxed">
                        {project.description}
                        <br /><br />
                        Prioridade: <span className="text-main font-medium">{project.priority}</span>
                        <br />
                        Equipe: <span className="text-main font-medium">{project.teamSize} heróis</span>
                      </p>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <button 
                        onClick={() => setSelectedProject(null)}
                        className="px-4 py-2 text-muted hover:text-main hover:bg-secondary/50 rounded-lg transition-colors"
                      >
                        Fechar
                      </button>
                      <button className="px-4 py-2 bg-aux hover:bg-aux/90 text-gray-900 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-aux/20">
                        <ExternalLink size={18} />
                        Ver Detalhes Completos
                      </button>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}