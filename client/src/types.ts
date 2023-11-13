export type AuthContextType = {
  auth: {
    company_name: string;
    company_id: number | null;
    email: string;
    user_id: number | null;
    token: string;
  };
  setAuth: (auth: {
    company_name: string;
    company_id: number | null;
    email: string;
    user_id: number | null;
    token: string;
  }) => void;
};

export type RouteType = {
  path: string;
  element: () => JSX.Element;
  _protected: number; // {-1: public, 0: shouldBeLoggedOut, 1: shouldBeLoggedIn}
};

export type errorType = {
  code: number;
  message: string;
  description: string;
};
