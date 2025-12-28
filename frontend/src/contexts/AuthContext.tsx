import { createContext, useState, useEffect, useContext } from 'react';
import type { ReactNode } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  signIn: (data: any) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('hero_token');
    const savedUser = localStorage.getItem('hero_user');

    if(token && savedUser) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(JSON.parse(savedUser));
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

      const fakeUser = { id: 1, name: 'Heroi', email }; 
      localStorage.setItem('hero_user', JSON.stringify(fakeUser));
      
      setUser(fakeUser);
      navigate('/dashboard');

    } catch (error) {
      console.error("Erro ao logar", error);
      alert("Erro ao fazer login. Verifique suas credenciais.");
      throw error;
    }
  }

  function signOut() {
    localStorage.removeItem('hero_token');
    localStorage.removeItem('hero_user');
    setUser(null);
    navigate('/login');
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if(!context) { throw new Error('useAuth deve ser usado dentro de um AuthProvider') }
  return context;
}