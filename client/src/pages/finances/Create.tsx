import { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import ComponentLoader from '../../components/ComponentLoader';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { FinaceFormData, statusType } from '../../types';
import RootLayout from '../RootLayout';

const Create = () => {
  // State to store form values
  const [formData, setFormData] = useState<FinaceFormData>({
    income: '',
    expense: '',
    debts: '',
    assets: '',
    score: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<statusType>({
    loading: false,
    error: null,
  });

  const axiosPrivate = useAxiosPrivate();

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (formData.income == '') {
      toast.error('income is empty');
    } else if (formData.expense === '') {
      toast.error('expense is empty');
    } else if (formData.debts === '') {
      toast.error('debts is empty');
    } else if (formData.assets === '') {
      toast.error('assets is empty');
    }

    try {
      const response = await axiosPrivate.post('/finances', formData);
      const data = await response.data;
      const respData = data.data;
      // set the score to formData
      setFormData({
        ...formData,
        score: respData.finance.score.toString(),
      });

      setLoading(false);
    } catch (err: any) {
      setLoading(false);
    }
  };

  // Function to handle changes in form inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <ComponentLoader
      status={status}
      component={
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

          <div className="container mx-auto mt-8 px-4 lg:grid lg:grid-cols-2">
            <div className="">
              <h1 className="text-2xl font-semibold mb-4">
                Calculate Finance Health
              </h1>

              <form onSubmit={handleSubmit} className="max-w-md shadow p-4">
                <div className="mb-3">
                  <label htmlFor="income" className="block text-md font-medium">
                    Income
                  </label>
                  <input
                    type="number"
                    name="income"
                    id="income"
                    value={formData.income}
                    onChange={handleChange}
                    className={`mt-1 px-2 py-1 w-full border rounded-md focus:outline-green-800 ${
                      formData.score == '' ? '' : 'bg-gray-200'
                    }`}
                    placeholder="Enter your income"
                    required
                    readOnly={formData.score != ''}
                  />
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="expense"
                    className="block text-md font-medium"
                  >
                    Expense
                  </label>
                  <input
                    type="number"
                    name="expense"
                    id="expense"
                    value={formData.expense}
                    onChange={handleChange}
                    className={`mt-1 px-2 py-1 w-full border rounded-md focus:outline-green-800 ${
                      formData.score == '' ? '' : 'bg-gray-200'
                    }`}
                    placeholder="Enter your expense"
                    required
                    readOnly={formData.score != ''}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="debts" className="block text-md font-medium">
                    Debts
                  </label>
                  <input
                    type="number"
                    name="debts"
                    id="debts"
                    value={formData.debts}
                    onChange={handleChange}
                    className={`mt-1 px-2 py-1 w-full border rounded-md focus:outline-green-800 ${
                      formData.score == '' ? '' : 'bg-gray-200'
                    }`}
                    placeholder="Enter your debts"
                    required
                    readOnly={formData.score != ''}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="assets" className="block text-md font-medium">
                    Assets
                  </label>
                  <input
                    type="number"
                    name="assets"
                    id="assets"
                    value={formData.assets}
                    onChange={handleChange}
                    className={`mt-1 px-2 py-1 w-full border rounded-md focus:outline-green-800 ${
                      formData.score == '' ? '' : 'bg-gray-200'
                    }`}
                    placeholder="Enter your assets"
                    required
                    readOnly={formData.score != ''}
                  />
                </div>
               
                <button
                  type="submit"
                  className={`bg-green-700 text-white px-3 py-1 rounded-md text-md hover:bg-green-600 focus:outline-none focus:shadow-outline-green active:bg-green-800 ${
                    loading || formData.score != ''
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                  disabled={loading || formData.score != ''}
                >
                  {loading ? 'Calculating...' : 'Calculate'}
                </button>

                <div className="mb-2 flex justify-end">
                  <Link
                    to="/dashboard"
                    className="underline text-green-700"
                  >
                    Back to Dashboard
                  </Link>
                </div>
              </form>
            </div>

            <div className="mt-5">
              {formData.score != '' ? (
                <>
                  <h1 className="text-2xl font-semibold mb-4">Your Score</h1>
                  
                  <div>
                    <p className="text-2xl font-semibold mt-4">
                      Your Finance Health Score is {formData.score}%
                    </p>
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        </RootLayout>
      }
    />
  );
};

export default Create;
