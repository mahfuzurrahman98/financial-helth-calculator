import { useState } from 'react';
import RootLayout from './RootLayout';

import { Toaster, toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import axios from '../api/axios';

const Register = () => {
  const [formData, setFormData] = useState({
    company_name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      formData.company_name.trim() === '' ||
      formData.email.trim() === '' ||
      formData.password.trim() === ''
    ) {
      return setError('Please fill in all fields');
    }

    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/users/auth/register', formData);
      const data = await response.data;
      setLoading(false);
      toast.success(data.detail);
    } catch (error: any) {
      setLoading(false);
      
      if (error.response.status == 422) {
        if (typeof error.response.data.detail === 'string') {
          setError(error.response.data.detail);
        } else {
          // if the detail is an object, then we need to get the first key-value pair
          const key = Object.keys(error.response.data.detail)[0];
          setError(error.response.data.detail[key]);
        }
      } else {
        setError(error.response.data.detail);
      }
    }
  };

  return (
    <RootLayout>
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: '',
          duration: 5000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
          },
        }}
      />
      
      <div className="flex items-center justify-center mt-8 lg:mt-24">
        <div className="bg-white p-6 md:px-8 py-6 rounded shadow-md w-96">
          <h1 className="text-2xl font-semibold mb-6">Register</h1>

          {error && (
            <div className="bg-red-500 text-white px-3 py-1 rounded-md mb-4">
              {error}

              <button
                className="float-right focus:outline-none"
                onClick={() => setError('')}
              >
                <span className="font-semibold">&times;</span>
              </button>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <div className="mb-4">
                <label
                  htmlFor="company_name"
                  className="block text-md font-medium"
                >
                  Company
                </label>
                <input
                  type="text"
                  name="company_name"
                  id="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  className="mt-1 px-2 py-1 w-full border rounded-md focus:outline-green-800"
                  placeholder="Enter your company name"
                  autoComplete="company_name"
                  required
                />
              </div>
              <label htmlFor="email" className="block text-md font-medium">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 px-2 py-1 w-full border rounded-md focus:outline-green-800"
                placeholder="Enter your email"
                autoComplete="email"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-md font-medium">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 px-2 py-1 w-full border rounded-md focus:outline-green-800"
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </div>
            <button
              type="submit"
              className={`bg-green-700 text-white px-3 py-1 rounded-md text-md hover:bg-green-600 focus:outline-none focus:shadow-outline-green active:bg-green-800 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Register'}
            </button>
          </form>

          <div className="mt-4">
            <p>
              Already have an account?{' '}
              <Link
                to="/login"
                className="underline text-green-700 font-semibold"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </RootLayout>
  );
};

export default Register;
