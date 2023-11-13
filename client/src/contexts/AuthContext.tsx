import { FC, ReactNode, createContext, useState } from 'react';

import { AuthContextType } from '../types';

const initialAuthState = {
  company_name: '',
  company_id: null,
  email: '',
  user_id: null,
  token: '',
};

export const AuthContext = createContext<AuthContextType>({
  auth: initialAuthState,
  setAuth: (newAuthState: {
    company_name: string;
    company_id: number | null;
    email: string;
    user_id: number | null;
    token: string;
  }) => {
    console.log(newAuthState);
  },
});

const AuthContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState(initialAuthState);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContextProvider };
