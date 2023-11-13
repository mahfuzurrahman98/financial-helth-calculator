import Navbar from '../../components/Navbar';
import useAuth from '../../hooks/useAuth';

const Me = () => {
  const { auth } = useAuth();
  return (
    <div>
      <Navbar />
      <h1>My Profile</h1>
      <div className="flex flex-col">
        <p>Name: {auth.company_name} </p>
        <p>Email: {auth.email}</p>
        <p>Token: {auth.token}</p>
      </div>
    </div>
  );
};

export default Me;
