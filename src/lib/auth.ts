// Simple localStorage-based authentication
export interface User {
  email: string;
  name: string;
}

const AUTH_KEY = 'booking_user';

export const authService = {
  login: (email: string, password: string): User | null => {
    // Simple validation - in production, this would call your server
    if (email && password.length >= 6) {
      const user: User = { 
        email, 
        name: email.split('@')[0] 
      };
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      return user;
    }
    return null;
  },

  signup: (email: string, password: string, name: string): User | null => {
    // Simple validation - in production, this would call your server
    if (email && password.length >= 6 && name) {
      const user: User = { email, name };
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      return user;
    }
    return null;
  },

  logout: () => {
    localStorage.removeItem(AUTH_KEY);
  },

  getCurrentUser: (): User | null => {
    const userData = localStorage.getItem(AUTH_KEY);
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch {
        return null;
      }
    }
    return null;
  },
};
