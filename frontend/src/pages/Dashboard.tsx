import { useState, useEffect, useMemo } from 'react';
import { Folder, Calendar, Search } from 'lucide-react';
import clsx from 'clsx';
import { type Project } from '../mocks/factory';
import { ProjectsService } from '../services/projects.service';
import { ProjectDetailsModal, type ProjectFormData } from '../components/Modals/ProjectDetailsModal';
import { CreateProjectModal, type CreateProjectFormData } from '../components/Modals/CreateProjectModal';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendente',
  in_progress: 'Em Andamento',
  completed: 'Concluído',
};

export function Dashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const data = await ProjectsService.getAll();
      setProjects(data);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao carregar projetos');
    }
  }

  const filteredProjects = useMemo(() => {
    if (!searchTerm) return projects;

    const lowerTerm = searchTerm.toLowerCase();

    return projects.filter((project) => {
      const statusLabel = STATUS_LABELS[project.status] || '';
      const dateString = new Date(project.createdAt).toLocaleDateString();

      return (
        project.name.toLowerCase().includes(lowerTerm) ||
        project.user?.name.toLowerCase().includes(lowerTerm) ||
        project.description.toLowerCase().includes(lowerTerm) ||
        (project.goals && project.goals.toLowerCase().includes(lowerTerm)) ||
        statusLabel.toLowerCase().includes(lowerTerm) ||
        dateString.includes(lowerTerm)
      );
    });
  }, [projects, searchTerm]);

  const handleCreateProject = async (data: CreateProjectFormData) => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return;
    }
    try {
      await ProjectsService.create(data as any); 
      await fetchProjects();
      toast.success(`Projeto ${data.name} criado com sucesso!`, {
        style: { borderColor: '#49DCB1', color: '#49DCB1' }
      });
      setIsCreateModalOpen(false);
    } catch (error: any) {
      toast.error('Erro ao criar projeto.', { style: { borderColor: '#DB504A', color: '#DB504A' } });
    }
  };

  const handleUpdateProject = async (data: ProjectFormData) => {
    if (selectedProject) {
      try {
        const payload = {
          ...data,
          user: data.user ? Number(data.user) : undefined
        };
        const updatedProject = await ProjectsService.update(selectedProject.id, payload as any);
        setSelectedProject(updatedProject);
        await fetchProjects();
        toast.success(`Projeto ${data.name} atualizado com sucesso!`, {
          style: { borderColor: '#49DCB1', color: '#49DCB1' }
        });
      } catch (error: any) {
        if (error.response?.status === 409) {
           toast.error('Conflito ao atualizar projeto.', { style: { borderColor: '#DB504A', color: '#DB504A' } });
        } else {
           toast.error('Erro ao atualizar projeto.', { style: { borderColor: '#DB504A', color: '#DB504A' } });
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-main">Dashboard</h1>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input
              type="text"
              placeholder="Buscar projetos..."
              className="w-full bg-secondary/10 border border-secondary/20 rounded-lg pl-10 pr-4 py-2 text-sm text-main focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-aux hover:bg-aux/90 text-gray-900 px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-lg shadow-aux/20 whitespace-nowrap"
          >
            Novo Projeto
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div 
            key={project.id}
            onClick={() => setSelectedProject(project)}
            className={clsx(
              "bg-secondary/30 backdrop-blur-sm rounded-xl p-6 border border-secondary/20 cursor-pointer transition-all hover:border-aux/50 hover:shadow-lg hover:shadow-aux/5 group relative",
              selectedProject?.id === project.id && "ring-2 ring-aux"
            )}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-main mb-2">{project.name}</h3>
              <div className="p-2 bg-secondary/50 rounded-lg group-hover:bg-aux/20 group-hover:text-aux transition-colors text-muted">
                <Folder size={24} />
              </div>
            </div>
            
            <p className="text-muted text-sm mb-4 line-clamp-2 break-words">{project.description}</p>
            
            <div className="flex items-center justify-between text-xs text-muted mt-auto pt-4 border-t border-secondary/20">
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>{new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
              <span className={clsx(
                "px-2 py-1 rounded-full font-medium",
                project.status === 'completed' ? "bg-positive/10 text-positive" :
                project.status === 'in_progress' ? "bg-aux/10 text-aux" :
                "bg-secondary/50 text-muted"
              )}>
                {project.status === 'completed' ? 'Concluído' : 
                 project.status === 'in_progress' ? 'Em Andamento' : 
                 'Pendente'}
              </span>
            </div>
          </div>
        ))}
      </div>

      <ProjectDetailsModal
        isOpen={!!selectedProject}
        onClose={() => {
          setSelectedProject(null);
          fetchProjects();
        }}
        onSave={handleUpdateProject}
        project={selectedProject}
      />

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          fetchProjects();
        }}
        onSave={handleCreateProject}
      />
    </div>
  );
}