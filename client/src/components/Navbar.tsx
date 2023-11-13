import { FC } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/money.png';
import useAuth from '../hooks/useAuth';
import useLogout from '../hooks/useLogout';

const Navbar: FC = () => {
  const { auth } = useAuth();
  const logout = useLogout();

  return (
    <div className="bg-white shadow px-3 lg:px-0">
      <nav className="w-full flex justify-between items-center mx-auto h-14 max-w-6xl">
        <div className="flex items-center">
          <Link to="/" className="flex items-center py-2 rounded-full">
            <div>
              <img src={Logo} className="w-12" alt="" />
            </div>
            <div className="text-2xl font-extrabold text-green-800 leading-none ml-2">
              Finance Helth
            </div>
          </Link>
        </div>

        {auth.token != '' ? (
          <div className="flex justify-end items-center">
            <div className="flex items-center">
              <button
                onClick={() => logout()}
                className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-end items-center">
            <div className="flex items-center">
              <Link
                to="/login"
                className="bg-green-700 text-white px-3 py-1 rounded-md hover:bg-green-600"
              >
                Login
              </Link>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
