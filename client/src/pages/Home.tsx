import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import RootLayout from './RootLayout';

const Home = () => {
  const { auth } = useAuth();

  return (
    <RootLayout>
      <div className="container mx-auto mt-10 text-center">
        <h1 className="text-4xl text-green-800 font-bold mb-6">
          Finance Health Calculator
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Welcome to Finance Health Calculator! Easily manage and analyze your
          finances for a healthier financial future.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1: Calculate Finance */}
          <div className="px-4 py-8 border rounded-md shadow-md bg-white">
            <h2 className="text-xl text-green-700 font-semibold mb-4">
              Calculate Finance
            </h2>
            <p className="text-gray-700 mb-4">
              Input your income, expenses, debts, and assets to get a
              comprehensive analysis of your financial health.
            </p>
            <Link
              to={auth.token != '' ? '/finances/calculate' : '/guest'}
              className="bg-green-700 text-white px-3 py-1 rounded-md text-md hover:bg-green-600 focus:outline-none focus:shadow-outline-green active:bg-green-800"
            >
              Get Started &rarr;
            </Link>
          </div>

          {/* Feature 2: Dashboard */}
          <div className="px-4 py-8 border rounded-md shadow-md bg-white">
            <h2 className="text-xl text-green-700 font-semibold mb-4">
              Dashboard
            </h2>
            <p className="text-gray-700 mb-4">
              View your current score, average score, total income, assets,
              total expense, and total debts on the dashboard.
            </p>
            <Link
              to="/dashboard"
              className="bg-green-700 text-white px-3 py-1 rounded-md text-md hover:bg-green-600 focus:outline-none focus:shadow-outline-green active:bg-green-800"
            >
              Explore Dashboard &rarr;
            </Link>
          </div>

          {/* Feature 3: Visualization */}
          <div className="px-4 py-8 border rounded-md shadow-md bg-white">
            <h2 className="text-xl text-green-700 font-semibold mb-4">
              Visualization
            </h2>
            <p className="text-gray-700 mb-4">
              Visualize your financial data with interactive charts and graphs
              for a better understanding of your financial situation.
            </p>
            <Link
              to="/dashboard"
              className="bg-green-700 text-white px-3 py-1 rounded-md text-md hover:bg-green-600 focus:outline-none focus:shadow-outline-green active:bg-green-800"
            >
              View Charts &rarr;
            </Link>
          </div>
        </div>
      </div>
    </RootLayout>
  );
};

export default Home;
