import { useState, useEffect } from 'react';
import { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for stored auth
    const storedUser = localStorage.getItem('finance_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const user = {
      id: '1',
      email,
      name: email.split('@')[0],
      avatar: `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2`
    };
    setUser(user);
    localStorage.setItem('finance_user', JSON.stringify(user));
    return user;
  };

  const register = async (email: string, password: string, name: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const user = {
      id: '1',
      email,
      name,
      avatar: `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2`
    };
    setUser(user);
    localStorage.setItem('finance_user', JSON.stringify(user));
    return user;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('finance_user');
  };

  return { user, loading, login, register, logout };
};