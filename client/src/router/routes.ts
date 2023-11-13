import Guest from '../pages/Guest';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Create from '../pages/finances/Create';
import Dashboard from '../pages/finances/Dashboard';
import History from '../pages/finances/History';
import Show from '../pages/finances/show';
import Me from '../pages/profile/Me';


import { RouteType } from '../types';

const routes: RouteType[] = [
  { path: '/', element: Home, _protected: -1 },
  { path: '/guest', element: Guest, _protected: 0 },

  { path: '/login', element: Login, _protected: 0 },
  { path: '/register', element: Register, _protected: 0 },  
  { path: '/me', element: Me, _protected: 1 },

  { path: '/dashboard', element: Dashboard, _protected: 1 },
  { path: '/finances/calcuate', element: Create, _protected: 1 },
  { path: '/finances/:id', element: Show, _protected: 1 },  
  { path: '/finances/history', element: History, _protected: 1 },
];

export default routes;
