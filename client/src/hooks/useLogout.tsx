import { axiosPrivate } from '../api/axios';
import useAuth from './useAuth';

const useLogout = () => {
  const { setAuth } = useAuth();

  const logout = async () => {
    setAuth({
      company_name: '',
      company_id: null,
      email: '',
      user_id: null,
      token: '',
    });
    try {
      await axiosPrivate.post('/users/auth/logout');
    } catch (err) {
      console.error(err);
    }
  };

  return logout;
};

export default useLogout;
