import { useState } from 'react';
import Speedometer from 'react-d3-speedometer';
import { toast, Toaster } from 'react-hot-toast';
import Navbar from '../../components/Navbar';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

const Create = () => {
  // State to store form values
  const [formData, setFormData] = useState({
    income: '',
    expense: '',
    debts: '',
    assets: '',
    score: '',
  });
  const [loading, setLoading] = useState<boolean>(false);

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
    <div>
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
      <Navbar />

      <div className="container mx-auto mt-8 px-4 lg:grid lg:grid-cols-2">
        <div className="">
          <h1 className="text-2xl font-semibold mb-4">
            Calculate Finance Health
          </h1>

          <form onSubmit={handleSubmit} className="max-w-md">
            <div className="mb-4">
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

            <div className="mb-4">
              <label htmlFor="expense" className="block text-md font-medium">
                expense
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

            <div className="mb-4">
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

            <div className="mb-4">
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
          </form>
        </div>

        <div className="mt-5">
          {formData.score != '' ? (
            <>
              <h1 className="text-2xl font-semibold mb-4">Your Score</h1>
              <Speedometer
                value={parseFloat(formData.score)} // Change the value based on your score
                minValue={0}
                maxValue={100}
                segments={5}
                segmentColors={[
                  '#00ff00',
                  '#ffff00',
                  '#0000ff',
                  '#ff8000',
                  '#ff0000',
                ]}
                customSegmentStops={[0, 20, 50, 80, 90, 100]}
              />

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
    </div>
  );
};

export default Create;
