import { axiosPrivate } from '../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    try {
      const response = await axiosPrivate.post('/users/auth/refreshtoken');
      // console.log(response);
      const data = response.data.data;

      setAuth({
        company_name: data.company.name,
        company_id: data.company.id,
        email: data.user.email,
        user_id: data.user.id,
        token: data.access_token,
      });

      return data.access_token;
    } catch (error) {
      console.log('error from useRefreshToken.tsx', error);
      throw error;
    }
  };

  return refresh;
};

export default useRefreshToken;
