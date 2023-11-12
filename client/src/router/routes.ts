import Home from '../pages/Home';
import Register from '../pages/Register';
import Signin from '../pages/Signin';
import Me from '../pages/profile/Me';


import { RouteType } from '../types';

/*
GET: /login
GET: /register

GET: /dashboard

GET: /finances/create
GET: /finances/history
GET: /finances/history/:id
*/

const routes: RouteType[] = [
  { path: '/', element: Home, _protected: -1 },
  { path: '/login', element: Signin, _protected: 0 },
  { path: '/register', element: Register, _protected: 0 },
  { path: '/auth/callback', element: LoginCallback, _protected: 0 },
  { path: '/me', element: Me, _protected: 1 },

  // { path: '/dashboard', element: Dashboard, _protected: 1 },
  // { path: '/finances/create', element: CreateFinance, _protected: 1 },
  // { path: '/finances/history', element: HistoryFinance, _protected: 1 },
  // { path: '/finances/:id', element: HistoryFinance, _protected: 1 },
  
];

export default routes;
