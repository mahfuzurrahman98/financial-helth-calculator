import { useEffect, useState } from 'react';
import Chart from 'react-google-charts';
import { Link } from 'react-router-dom';
import ComponentLoader from '../../components/ComponentLoader';
import {
  categorizeHealthScore,
  categorizeHealthScoreColor,
} from '../../helpers';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { DashboardDataType, FinanceType, statusType } from '../../types';
import RootLayout from '../RootLayout';

const ScatterChart = ({ scatterChartData }: { scatterChartData: [] }) => {
  console.log(scatterChartData);
  return (
    <Chart
      width={'100%'}
      height={'400px'}
      chartType="ScatterChart"
      loader={<div>Loading Scater Chart...</div>}
      data={scatterChartData}
      // add border to the chart
      options={{
        title: 'Score-Month Chart',
        hAxis: { title: 'Month', minValue: 0, maxValue: 12 },
        vAxis: { title: 'Score', minValue: 0, maxValue: 1 },
        trendlines: {
          0: {
            type: 'exponential',
            color: 'green',
          },
        },
      }}
    />
  );
};

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardDataType>({
    recent_finances: [],
    total_finances_count: 0,
    total_income: 0,
    total_expense: 0,
    last_debts: 0,
    last_assets: 0,
    current_score: 0,
    average_score: 0,
  });
  const [userData, setUserData] = useState<any>({});
  const [status, setStatus] = useState<statusType>({
    loading: true,
    error: null,
  });

  const [lineChartData, setLineChartData] = useState<any>([]);
  const [scatterChartData, setScatterChartData] = useState<any>([]);

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'June',
    'July',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const axiosPrivate = useAxiosPrivate();

  const getDashboardData = async () => {
    try {
      const response = await axiosPrivate.get('/finances/dashboard');
      const data = response.data;
      const respData = data.data;

      // console.log(respData);

      if (respData.total_finances_count > 0) {
        setDashboardData({
          recent_finances: respData.recent_finances,
          total_finances_count: respData.total_finances_count,
          total_income: respData.total_income,
          total_expense: respData.total_expense,
          last_debts: respData.last_debts,
          last_assets: respData.last_assets,
          current_score: respData.current_score,
          average_score: respData.average_score,
        });

        let currentMonth = new Date().getMonth() + 1;

        let _lineChartData: any = [];
        let _scatterChartData: any = [];

        respData.recent_finances.forEach((finance: FinanceType) => {
          let _month = currentMonth;
          currentMonth -= 1;

          if (currentMonth < 1) {
            currentMonth = 12;
          }

          _lineChartData.push([
            months[_month - 1],
            finance.income,
            finance.expense,
          ]);

          _scatterChartData.push([months[_month - 1], finance.score]);
        });

        _lineChartData.push(['Month', 'Income($)', 'Expenses($)']);
        _scatterChartData.push(['Month', 'Score']);

        _lineChartData.reverse();
        _scatterChartData.reverse();

        setLineChartData(_lineChartData);
        setScatterChartData(_scatterChartData);
      }
      setStatus({
        loading: false,
        error: null,
      });
    } catch (error) {}
  };

  const getUserData = async () => {
    try {
      const response = await axiosPrivate.get('/users/profile');
      const data = response.data;
      const respData = data.data;
      console.log(respData);
      setUserData({
        email: respData.user.email,
        company: respData.company.name,
      });
    } catch (error) {}
  };

  let currentMonthNumber = new Date().getMonth() + 1;
  const getMonthName = (key: number) => {
    const monthIndex = ((currentMonthNumber - key + 11) % 12) + 1;
    return months[monthIndex - 1];
  };

  useEffect(() => {
    // run and self-invoking async function
    (async () => {
      await getDashboardData();
      await getUserData();

      setStatus({
        loading: false,
        error: null,
      });
    })();
  }, []);

  return (
    <ComponentLoader
      status={status}
      component={
        <RootLayout>
          <h1 className="text-3xl font-bold mt-2 md:mt-4">Dashboard</h1>
          <h2 className="text-2xl font-semibold">
            Welcome, {userData.company}
          </h2>

          {dashboardData.total_finances_count > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Tile 1: Your current score */}
                <div
                  className={`${
                    dashboardData.current_score < 25
                      ? categorizeHealthScoreColor(dashboardData.current_score)
                      : 'bg-green-50'
                  } p-6 rounded-md shadow-md`}
                >
                  <h2 className="text-xl font-semibold mb-4">
                    Your Current Score
                  </h2>
                  <p
                    className={`text-2xl ${
                      dashboardData.current_score < 10
                        ? 'text-white'
                        : 'text-green-800'
                    }`}
                  >
                    {dashboardData.current_score.toFixed(2)} (
                    {categorizeHealthScore(dashboardData.current_score)})
                  </p>
                </div>

                {/* Tile 2: Your average score */}
                <div
                  className={`${
                    dashboardData.current_score < 25
                      ? categorizeHealthScoreColor(dashboardData.current_score)
                      : 'bg-green-50'
                  } p-6 rounded-md shadow-md`}
                >
                  <h2 className="text-xl font-semibold mb-4">
                    Your Average Score
                  </h2>
                  <p
                    className={`text-2xl ${
                      dashboardData.average_score < 10
                        ? 'text-white'
                        : 'text-green-800'
                    }`}
                  >
                    {dashboardData.average_score.toFixed(2)} (
                    {categorizeHealthScore(dashboardData.average_score)})
                  </p>
                </div>

                {/* Tile 3: Your total income */}
                <div className="bg-green-50 p-6 rounded-md shadow-md">
                  <h2 className="text-xl font-semibold mb-4">
                    Your Total Income
                  </h2>
                  <p className="text-2xl text-green-800">
                    ${dashboardData.total_income.toFixed(2)}
                  </p>
                </div>

                {/* Tile 4: Your assets */}
                <div className="bg-green-50 p-6 rounded-md shadow-md">
                  <h2 className="text-xl font-semibold mb-4">Your Assets</h2>
                  <p className="text-2xl text-green-800">
                    ${dashboardData.last_assets.toFixed(2)}
                  </p>
                </div>

                {/* Tile 5: Your total expense */}
                <div className="bg-green-50 p-6 rounded-md shadow-md">
                  <h2 className="text-xl font-semibold mb-4">
                    Your Total Expense
                  </h2>
                  <p className="text-2xl text-green-800">
                    ${dashboardData.total_expense.toFixed(2)}
                  </p>
                </div>

                {/* Tile 6: Total debts */}
                <div className="bg-green-50 p-6 rounded-md shadow-md">
                  <h2 className="text-xl font-semibold mb-4">Total Debts</h2>
                  <p className="text-2xl text-green-800">
                    ${dashboardData.last_debts.toFixed(2)}
                  </p>
                </div>
              </div>
              {lineChartData.length > 0 ? (
                <>
                  <Chart
                    chartType="LineChart"
                    loader={<div>Loaidng Income-Expense Chart...</div>}
                    width="100%"
                    height="400px"
                    data={lineChartData}
                    options={{
                      title: 'Income-Expense Chart',
                      curveType: 'function',
                      legend: { position: 'bottom' },
                    }}
                  />

                  <ScatterChart scatterChartData={scatterChartData} />
                </>
              ) : (
                <></>
              )}

              {dashboardData.current_score < 25 ? (
                <div className="mt-8">
                  <h3 className="text-2xl font-semibold mb-4 border-b-2 border-b-gray-600">
                    Suggestions
                  </h3>
                  <ul className="list-disc list-inside">
                    <li className="mb-2">
                      Your current score is below 25, so you should try to
                      increase your income and decrease your expenses.
                    </li>
                    <li className="mb-2">
                      You should try to increase your assets and decrease your
                      debts.
                    </li>
                    <li className="mb-2">
                      You should try to increase your score by increasing your
                      income and assets and decreasing your expenses and debts.
                    </li>
                  </ul>
                </div>
              ) : (
                <></>
              )}

              <div className="mt-8">
                <div className="mb-5">
                  <Link
                    to="/finances/calculate"
                    className="float-right bg-green-700 text-white px-3 py-1 rounded-md text-md inline-block"
                  >
                    <span
                      className="font-bold mr-1"
                      dangerouslySetInnerHTML={{ __html: '&plus;' }}
                    />
                    Calculate New Finance
                  </Link>
                </div>

                <h2 className="text-2xl font-semibold mb-4 border-b-2 border-b-gray-600">
                  Recent Finances
                </h2>

                <table className="w-full table-auto bg-green-50">
                  <thead>
                    <tr>
                      <th className="text-left border border-gray-400 p-2">
                        Month
                      </th>
                      <th className="text-left border border-gray-400 p-2">
                        Income
                      </th>
                      <th className="text-left border border-gray-400 p-2">
                        Expense
                      </th>
                      <th className="text-left border border-gray-400 p-2">
                        Debts
                      </th>
                      <th className="text-left border border-gray-400 p-2">
                        Assets
                      </th>
                      <th className="text-left border border-gray-400 p-2">
                        Score
                      </th>
                      <th className="text-left border border-gray-400 p-2">
                        Verdict
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.recent_finances.map(
                      (finance: FinanceType, key: number) => (
                        <tr key={key}>
                          <td className="border border-gray-400 px-2 py-2">
                            {getMonthName(key)}
                          </td>
                          <td className="border border-gray-400 px-2 py-2">
                            ${finance.income.toFixed(2)}
                          </td>
                          <td className="border border-gray-400 px-2 py-2">
                            ${finance.expense.toFixed(2)}
                          </td>
                          <td className="border border-gray-400 px-2 py-2">
                            ${finance.debts.toFixed(2)}
                          </td>
                          <td className="border border-gray-400 px-2 py-2">
                            ${finance.assets.toFixed(2)}
                          </td>
                          <td className="border border-gray-400 px-2 py-2">
                            {finance.score?.toFixed(2)}
                          </td>
                          <td className="border border-gray-400 px-2 py-2">
                            <span
                              className={`inline-block px-2 py-1 rounded-md text-sm text-white font-semibold ${
                                finance.score == null
                                  ? 'bg-gray-400 text-gray-800'
                                  : categorizeHealthScoreColor(finance.score)
                              }`}
                            >
                              {categorizeHealthScore(
                                finance.score ? finance.score : 0
                              )}
                            </span>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>

                <div className="mt-4">
                  <Link
                    to="/finances/history"
                    className="underline text-green-800 font-semibold"
                  >
                    View All History
                  </Link>
                </div>

                <div className="mt-4 bg-yellow-300 px-3 py-1 rounded-md">
                  <p className="text-red-900">
                    <span className="text-balck font-bold mr-1">N.B:</span>
                    We are using the latest 6 records as last 6 months data, if
                    you calculate new finance then it will be treated as the
                    latest month data.
                  </p>
                </div>
              </div>
            </>
          ) : (
            // show a message that no finance data found, so calculate new finance, show the button link

            <div className="mt-8">
              <p className="text-xl">
                You have not calculated any finance yet. Click the button below to calculate your current finance health.
              </p>
              <div className="mt-4">
                <Link
                  to="/finances/calculate"
                  className="bg-green-700 text-white px-3 py-1 rounded-md text-md inline-block"
                >
                  <span
                    className="font-bold mr-1"
                    dangerouslySetInnerHTML={{ __html: '&plus;' }}
                  />
                  Calculate New Finance
                </Link>
              </div>
            </div>
          )}
        </RootLayout>
      }
    />
  );
};

export default Dashboard;
