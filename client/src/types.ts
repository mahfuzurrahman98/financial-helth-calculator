export type AuthContextType = {
  auth: {
    token: string;
  };
  setAuth: (auth: { token: string }) => void;
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

export type FinanceType = {
  id: number;
  income: number;
  expense: number;
  debts: number;
  assets: number;
  score: number | null;
};

export type HistoryType = FinanceType & {
  calculated_at: string;
};

export type DashboardDataType = {
  recent_finances: FinanceType[];
  total: number;
  total_income: number;
  total_expense: number;
  last_debts: number;
  last_assets: number;
  current_score: number;
  average_score: number;
};

export type FinaceFormData = {
  income: string;
  expense: string;
  debts: string;
  assets: string;
  score: string;
};

export type statusType = {
  loading: boolean;
  error: null | number;
};
