'use client';

import React, { createContext, useContext, useState } from 'react';

export type Role = 'User' | 'Admin' | 'Super Admin';

interface AuthContextType {
  role: Role | null;
  setRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextType>({
  role: null,
  setRole: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRole] = useState<Role | null>(null);
  return (
    <AuthContext.Provider value={{ role, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
