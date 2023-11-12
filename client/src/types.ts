
export type AuthContextType = {
  auth: {
    name: string;
    email: string;
    picture: string;
    token: string;
  };
  setAuth: (auth: {
    name: string;
    email: string;
    picture: string;
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

