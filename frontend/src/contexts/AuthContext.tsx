import { createContext, useState, useEffect, useContext } from 'react';
import type { ReactNode } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Role } from '../types/auth';
import type { User } from '../types/auth';
import { decodeToken } from '../utils/auth';
import { UsersService } from '../services/users.service';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  signIn: (data: any) => Promise<void>;
  signOut: () => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  function updateUser(data: Partial<User>) {
    setUser((prev) => prev ? { ...prev, ...data } : null);
  }

  useEffect(() => {
    const token = localStorage.getItem('hero_token');
    
    if(token) {
      const decoded = decodeToken(token);
      if (decoded) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        UsersService.getById(decoded.sub)
          .then(userData => setUser(userData))
          .catch(() => {
            const userFromToken: User = {
              id: decoded.sub,
              email: decoded.email,
              name: 'User', 
              role: decoded.role as Role,
              persona: 'Unknown',
              persona_id: 0,
              createdAt: new Date(),
              updatedAt: new Date(),
              isActive: true
            };
            setUser(userFromToken);
          });
      } else {
        signOut();
      }
    }
  }, []);

  async function signIn({ email, password }: any) {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });
      const { access_token } = response.data;

      localStorage.setItem('hero_token', access_token);
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      const decoded = decodeToken(access_token);
      
      if (decoded) {
        try {
          const userData = await UsersService.getById(decoded.sub);
          setUser(userData);
        } catch (error) {
          const userFromToken: User = {
            id: decoded.sub,
            email: decoded.email,
            name: 'User', 
            role: decoded.role as Role,
            persona: 'Unknown',
            persona_id: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            isActive: true
          };
          setUser(userFromToken);
        }
        navigate('/dashboard');
      } else {
        throw new Error('Invalid token');
      }

    } catch (error) {
      console.error("Erro ao logar", error);
      alert("Erro ao fazer login. Verifique suas credenciais.");
      throw error;
    }
  }

  function signOut() {
    localStorage.removeItem('hero_token');
    setUser(null);
    navigate('/login');
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, signIn, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if(!context) { throw new Error('useAuth deve ser usado dentro de um AuthProvider') }
  return context;
}